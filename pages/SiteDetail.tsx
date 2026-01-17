import React, { useEffect, useState, useMemo } from 'react';
import { getSupabase } from '../services/supabaseClient';
import { Site, AnalyticsEvent, ErrorMetadata, HeuristicSolution } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Activity, AlertCircle, Smartphone, Globe, Copy, CheckCircle, 
  Clock, Users, Layers, Monitor, Chrome, MapPin, 
  ArrowUpRight, Download, Terminal, Shield, Zap
} from '../components/Icons';

interface SiteDetailProps {
  siteId: string;
  onBack: () => void;
}

const TABS = ['Overview', 'Diagnostics', 'Live Feed', 'Geography'];

const SiteDetail: React.FC<SiteDetailProps> = ({ siteId, onBack }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [site, setSite] = useState<Site | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [copied, setCopied] = useState(false);
  
  const supabase = getSupabase();

  useEffect(() => {
    if (!supabase) return;

    const fetchData = async () => {
      const { data: siteData } = await supabase.from('sites').select('*').eq('id', siteId).single();
      // Fetch specifically with order to get latest first
      const { data: eventsData } = await supabase.from('events').select('*').eq('site_id', siteId).order('created_at', { ascending: true });
      
      if (siteData) setSite(siteData as Site);
      if (eventsData) setEvents(eventsData as AnalyticsEvent[]);
    };

    fetchData();

    const subscription = supabase
      .channel(`site:${siteId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'events', filter: `site_id=eq.${siteId}` }, (payload) => {
        setEvents(prev => [...prev, payload.new as AnalyticsEvent]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [supabase, siteId]);

  // --- HEURISTIC ENGINE (No AI) ---
  const getSolution = (msg: string = ''): HeuristicSolution => {
    const m = msg.toLowerCase();
    if (m.includes('fetch') || m.includes('network') || m.includes('cors')) {
      return {
        title: "Network / CORS Error",
        description: "The browser blocked a request. This usually happens when your API doesn't have the correct 'Access-Control-Allow-Origin' headers.",
        severity: 'medium',
        code_fix: "res.setHeader('Access-Control-Allow-Origin', '*');"
      };
    }
    if (m.includes('undefined') || m.includes('null')) {
      return {
        title: "Null Pointer Exception",
        description: "You are trying to access a property of an object that doesn't exist yet.",
        severity: 'critical',
        code_fix: "if (data && data.property) { ... } // Use Optional Chaining (?.)"
      };
    }
    if (m.includes('404')) {
      return {
        title: "Resource Not Found",
        description: "A requested file or API endpoint could not be found.",
        severity: 'low',
        code_fix: "// Check your file paths in the 'public' folder or API routes."
      };
    }
    if (m.includes('react') && m.includes('minified')) {
      return {
        title: "Minified React Error",
        description: "A generic production error. Check the render() method of your components.",
        severity: 'critical'
      };
    }
    return {
      title: "Runtime Exception",
      description: "An unexpected error occurred during execution. Check the stack trace.",
      severity: 'medium'
    };
  };

  const stats = useMemo(() => {
    const pageviews = events.filter(e => e.type === 'pageview');
    const errors = events.filter(e => e.type === 'error' || e.type === 'network_fail');
    const clicks = events.filter(e => e.type === 'click');
    
    // Derived Metrics
    const totalViews = pageviews.length;
    const errorCount = errors.length;
    const uniqueSessions = new Set(pageviews.map(e => e.session_id)).size;
    
    // Performance
    const loadTimes = pageviews.filter(e => e.load_time_ms).map(e => e.load_time_ms || 0);
    const avgLoadTime = loadTimes.length ? (loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length).toFixed(0) : '0';

    // Chart Data (Last 7 Days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const trafficData = last7Days.map(date => ({
      date: date.slice(5),
      visits: pageviews.filter(e => e.created_at.startsWith(date)).length,
      errors: errors.filter(e => e.created_at.startsWith(date)).length,
    }));

    // Top Countries
    const countryCounts: Record<string, number> = {};
    pageviews.forEach(e => { const c = e.country || 'Unknown'; countryCounts[c] = (countryCounts[c] || 0) + 1; });
    const countryData = Object.entries(countryCounts)
      .map(([name, count]) => ({ name, count, percentage: (count/totalViews)*100 }))
      .sort((a, b) => b.count - a.count);

    return { totalViews, errorCount, uniqueSessions, avgLoadTime, trafficData, countryData, errors, clicks };
  }, [events]);

  const copyId = () => {
    navigator.clipboard.writeText(siteId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + "Type,Path,Message,Country,Time\n" + events.map(e => {
        let msg = '';
        try { if(e.metadata) msg = JSON.parse(e.metadata).message || ''; } catch {}
        return `${e.type},${e.path},"${msg}",${e.country},${e.created_at}`
    }).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `onyx_export_${siteId}.csv`);
    document.body.appendChild(link);
    link.click();
  }

  if (!site) return <div className="p-20 text-center text-gray-500">Initializing Uplink...</div>;

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-8 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-onyx-800 pb-6 gap-4">
        <div className="flex items-start gap-4">
          <button onClick={onBack} className="mt-1.5 p-2 rounded-lg hover:bg-onyx-900 text-gray-400 hover:text-white transition-colors">
            ←
          </button>
          <div>
            <h1 className="text-3xl font-serif text-white">{site.name}</h1>
            <div className="flex items-center gap-4 mt-2">
               <a href={site.url} target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                 {site.url} <ArrowUpRight className="w-3 h-3" />
               </a>
               <div className="flex items-center gap-2 text-xs bg-onyx-900 border border-onyx-800 px-2 py-1 rounded text-gray-400 font-mono">
                 ID: {siteId}
                 <button onClick={copyId}>
                   {copied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 hover:text-white" />}
                 </button>
               </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={exportData} className="flex items-center gap-2 px-4 py-2 bg-onyx-900 border border-onyx-800 rounded-lg text-gray-400 hover:text-white text-sm">
             <Download className="w-4 h-4" /> Export CSV
           </button>
           <div className="flex items-center gap-2 px-3 py-1 bg-green-900/20 border border-green-900/50 rounded-full">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs text-green-400 font-medium">Scanning</span>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-onyx-800 pb-1">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-onyx-900 p-6 rounded-xl border border-onyx-800 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Globe className="w-16 h-16 text-white"/></div>
               <div className="text-3xl font-semibold text-white mb-1">{stats.totalViews.toLocaleString()}</div>
               <div className="text-xs text-gray-500 uppercase tracking-wider">Total Hits</div>
            </div>
            <div className="bg-onyx-900 p-6 rounded-xl border border-onyx-800">
               <div className="text-3xl font-semibold text-white mb-1">{stats.uniqueSessions.toLocaleString()}</div>
               <div className="text-xs text-gray-500 uppercase tracking-wider">Unique Users</div>
            </div>
            <div className="bg-onyx-900 p-6 rounded-xl border border-onyx-800">
               <div className="text-3xl font-semibold text-white mb-1">{stats.avgLoadTime}ms</div>
               <div className="text-xs text-gray-500 uppercase tracking-wider">Avg Latency</div>
            </div>
            <div className="bg-onyx-900 p-6 rounded-xl border border-onyx-800">
               <div className={`text-3xl font-semibold mb-1 ${stats.errorCount > 0 ? 'text-red-400' : 'text-white'}`}>{stats.errorCount}</div>
               <div className="text-xs text-gray-500 uppercase tracking-wider">Captured Errors</div>
            </div>
          </div>

          <div className="bg-onyx-900 p-6 rounded-xl border border-onyx-800">
            <h3 className="text-lg font-medium text-white mb-6">Traffic Volume</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.trafficData}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fff" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#030712', border: '1px solid #1f2937', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="visits" stroke="#fff" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                  <Area type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorErrors)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Diagnostics' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-red-900/10 to-transparent p-6 rounded-xl border border-red-900/30 flex items-start gap-4">
             <Shield className="w-6 h-6 text-red-400 mt-1" />
             <div>
               <h3 className="text-white font-medium">System Vulnerabilities & Errors</h3>
               <p className="text-gray-400 text-sm mt-1">
                 Onyx analyzes error patterns to suggest code-level fixes.
               </p>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
             {stats.errors.length === 0 ? (
                <div className="p-12 text-center text-gray-500 bg-onyx-900 rounded-xl border border-onyx-800">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500 opacity-50" />
                  No errors captured in the current window. System Healthy.
                </div>
             ) : (
                stats.errors.slice().reverse().map((err, i) => {
                  let meta: any = {};
                  try { meta = JSON.parse(err.metadata || '{}'); } catch {}
                  const msg = meta.message || meta.msg || 'Unknown Error';
                  const solution = getSolution(msg);

                  return (
                    <div key={i} className="bg-onyx-900 border border-onyx-800 rounded-xl overflow-hidden hover:border-gray-600 transition-colors">
                      <div className="p-4 border-b border-onyx-800 bg-black/20 flex justify-between items-start">
                         <div className="flex items-start gap-3">
                           <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                           <div>
                             <h4 className="text-red-400 font-mono text-sm break-all">{msg}</h4>
                             <div className="flex gap-4 mt-2 text-xs text-gray-500">
                               <span>{new Date(err.created_at).toLocaleString()}</span>
                               <span>{err.path}</span>
                               <span>{err.device}</span>
                             </div>
                           </div>
                         </div>
                         <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider
                           ${solution.severity === 'critical' ? 'bg-red-900 text-white' : 'bg-gray-800 text-gray-400'}`}>
                           {solution.severity}
                         </div>
                      </div>
                      
                      {/* Solution Panel */}
                      <div className="p-6 bg-onyx-950/50">
                        <div className="flex gap-4">
                          <div className="w-1 bg-blue-500/50 rounded-full" />
                          <div className="flex-1">
                             <h5 className="text-white font-medium text-sm mb-1 flex items-center gap-2">
                               <Zap className="w-3 h-3 text-blue-400" /> Possible Fix: {solution.title}
                             </h5>
                             <p className="text-sm text-gray-400 mb-3">{solution.description}</p>
                             {solution.code_fix && (
                               <div className="bg-black rounded border border-gray-800 p-3 font-mono text-xs text-green-400">
                                 {solution.code_fix}
                               </div>
                             )}
                             {meta.stack && (
                                <details className="mt-3">
                                  <summary className="text-xs text-gray-600 cursor-pointer hover:text-white">View Stack Trace</summary>
                                  <pre className="mt-2 text-[10px] text-gray-500 overflow-x-auto p-2 bg-black rounded">{meta.stack}</pre>
                                </details>
                             )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
             )}
          </div>
        </div>
      )}

      {activeTab === 'Geography' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
           <div className="bg-onyx-900 rounded-xl border border-onyx-800 p-6">
              <h3 className="text-lg font-serif text-white mb-6">Traffic Origin</h3>
              <div className="space-y-4">
                {stats.countryData.map((c, i) => (
                  <div key={c.name} className="relative">
                    <div className="flex justify-between text-sm mb-1 relative z-10">
                      <span className="text-white flex items-center gap-2">
                        <span className="text-gray-600 font-mono w-4">{i+1}</span> {c.name}
                      </span>
                      <span className="text-gray-400">{c.count} hits</span>
                    </div>
                    <div className="h-8 bg-gray-800/30 rounded w-full overflow-hidden relative">
                      <div className="absolute top-0 left-0 h-full bg-blue-900/40 border-r border-blue-500/50" style={{width: `${c.percentage}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-onyx-900 rounded-xl border border-onyx-800 p-6">
              <h3 className="text-lg font-serif text-white mb-6">User Interaction</h3>
              <div className="space-y-2">
                 {stats.clicks.slice().reverse().slice(0, 10).map((click, i) => {
                   let meta: any = {};
                   try { meta = JSON.parse(click.metadata || '{}'); } catch {}
                   return (
                     <div key={i} className="flex items-center gap-3 p-3 bg-black rounded border border-onyx-800">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <div className="flex-1">
                          <div className="text-sm text-gray-300">
                            Clicked <span className="text-white font-mono bg-gray-800 px-1 rounded mx-1">{meta.tag || 'EL'}</span> 
                            "{meta.text || 'Unknown'}"
                          </div>
                          <div className="text-xs text-gray-600 mt-1">{click.path}</div>
                        </div>
                        <div className="text-xs text-gray-600">{new Date(click.created_at).toLocaleTimeString()}</div>
                     </div>
                   )
                 })}
                 {stats.clicks.length === 0 && (
                   <div className="text-gray-500 text-sm text-center py-10">No interaction events captured yet.</div>
                 )}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'Live Feed' && (
        <div className="bg-black rounded-xl border border-onyx-800 overflow-hidden animate-fade-in font-mono text-xs">
          <div className="p-3 bg-onyx-900 border-b border-onyx-800 flex justify-between items-center">
             <div className="flex items-center gap-2 text-gray-400">
               <Terminal className="w-4 h-4"/>
               <span>console.stream</span>
             </div>
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
          </div>
          <div className="max-h-[600px] overflow-y-auto p-4 space-y-1">
            {events.slice().reverse().map((e, i) => {
               let metaStr = '';
               try { 
                 const m = JSON.parse(e.metadata || '{}');
                 metaStr = m.message || m.url || JSON.stringify(m);
               } catch { metaStr = e.metadata || ''; }

               const color = e.type === 'error' || e.type === 'network_fail' ? 'text-red-400' : 
                             e.type === 'click' ? 'text-green-400' : 'text-blue-400';

               return (
                 <div key={i} className="grid grid-cols-12 gap-2 hover:bg-white/5 p-1 rounded">
                   <div className="col-span-2 text-gray-600">{new Date(e.created_at).toLocaleTimeString()}</div>
                   <div className={`col-span-1 ${color} uppercase`}>{e.type.replace('_', ' ')}</div>
                   <div className="col-span-3 text-gray-500 truncate" title={e.path}>{e.path}</div>
                   <div className="col-span-6 text-gray-300 break-all">{metaStr}</div>
                 </div>
               )
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteDetail;