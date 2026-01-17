import React, { useEffect, useState } from 'react';
import { getSupabase } from '../services/supabaseClient';
import SiteCard from '../components/SiteCard';
import SetupGuide from '../components/SetupGuide';
import { Site, AnalyticsEvent } from '../types';
import { Plus, LayoutDashboard, Server, Activity, Users, Zap, AlertCircle, Box, CheckCircle, Copy, Code, ArrowUpRight } from '../components/Icons';

interface DashboardProps {
  onNavigate: (page: string, siteId?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [missingTables, setMissingTables] = useState(false);
  
  // Form State
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  
  // Post-Creation Integration State
  const [newlyCreatedSite, setNewlyCreatedSite] = useState<Site | null>(null);
  const [activeSnippetTab, setActiveSnippetTab] = useState<'react' | 'html'>('react');
  const [copiedCode, setCopiedCode] = useState(false);

  const supabase = getSupabase();

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      const { data: sitesData, error: sitesError } = await supabase.from('sites').select('*').order('created_at', { ascending: false });
      
      if (sitesError) {
        if (sitesError.code === '42P01' || sitesError.message?.includes('does not exist')) {
          setMissingTables(true);
          setLoading(false);
          return;
        }
        console.error("Error fetching sites:", sitesError);
      }
      
      if (sitesData) setSites(sitesData as Site[]);

      const { data: eventsData } = await supabase.from('events').select('*').limit(1000).order('created_at', { ascending: false });
      if (eventsData) setEvents(eventsData as AnalyticsEvent[]);
      
      setLoading(false);
    };

    fetchData();

    if (!missingTables) {
      const subscription = supabase
        .channel('public:events')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'events' }, (payload) => {
          setEvents(prev => [payload.new as AnalyticsEvent, ...prev].slice(0, 1000));
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [supabase, missingTables]);

  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const { data, error } = await supabase.from('sites').insert({
        name: newSiteName,
        url: newSiteUrl,
        status: 'online',
        health_score: 100
      }).select();

      if (error) throw error;

      if (data) {
        const newSite = data[0] as Site;
        setSites([newSite, ...sites]);
        setNewlyCreatedSite(newSite); // Triggers the integration view
        setNewSiteName('');
        setNewSiteUrl('');
      }
    } catch (e: any) {
      console.error("Creation Error:", e);
      // More descriptive error message for RLS/Permission issues
      const msg = e.message || e.details || "Unknown error";
      alert(`Failed to create site: ${msg}. \n\nTip: Go to Supabase SQL Editor and run the setup script from the Docs page to ensure permissions are granted.`);
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setNewlyCreatedSite(null);
  };

  const getSiteEvents = (siteId: string) => events.filter(e => e.site_id === siteId);
  const getAvgLoadTime = (siteEvents: AnalyticsEvent[]) => {
    const perfEvents = siteEvents.filter(e => e.load_time_ms && e.load_time_ms > 0);
    if (perfEvents.length === 0) return 0;
    return perfEvents.reduce((acc, curr) => acc + (curr.load_time_ms || 0), 0) / perfEvents.length;
  };

  const totalHits = events.filter(e => e.type === 'pageview').length;
  const systemHealth = 100 - (events.filter(e => e.type === 'error').length * 2);

  // Dynamic Snippet Generation for the new site
  const getSnippet = (siteId: string, type: 'react' | 'html') => {
    if (type === 'react') {
      return `// 1. Install Supabase: npm install @supabase/supabase-js
// 2. Create file: src/lib/onyx.js
import { createClient } from '@supabase/supabase-js';

const ONYX_SITE_ID = '${siteId}';

// Vite / React Environment Variables
const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL; 
const SUPABASE_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
const REGION = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const SESSION_ID = Math.random().toString(36).substring(7);

export const initOnyx = () => {
  if (typeof window === 'undefined') return;

  const track = (type, payload = {}) => {
    supabase.from('events').insert({
      site_id: ONYX_SITE_ID,
      type,
      session_id: SESSION_ID,
      path: window.location.pathname,
      device: /Mobi/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
      country: REGION,
      created_at: new Date().toISOString(),
      ...payload
    }).then(({ error }) => { if(error) console.error('Onyx Error:', error) });
  };

  // Tracking Logic
  track('pageview', { load_time_ms: window.performance?.now() });
  window.addEventListener('error', (e) => track('error', { metadata: { message: e.message } }));
  window.addEventListener('click', (e) => {
    const t = e.target.closest('button, a');
    if (t) track('click', { metadata: { tag: t.tagName, text: t.innerText?.slice(0,50) } });
  });
};

// 3. In your Root Layout or App Component:
// useEffect(() => { initOnyx(); }, []);`;
    }
    return `<!-- Paste in <head> of index.html -->
<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
<script>
  (function() {
    const SITE_ID = '${siteId}';
    const URL = 'YOUR_SUPABASE_URL';
    const KEY = 'YOUR_SUPABASE_ANON_KEY';

    const client = window.supabase.createClient(URL, KEY);
    const SESSION = Math.random().toString(36).substring(7);
    const REGION = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';

    const track = (t, d={}) => client.from('events').insert({
      site_id: SITE_ID, type: t, session_id: SESSION,
      path: window.location.pathname,
      country: REGION,
      created_at: new Date().toISOString(),
      ...d
    });

    track('pageview');
    window.addEventListener('error', e => track('error', { metadata: { msg: e.message } }));
  })();
</script>`;
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  if (!supabase) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center py-32 animate-fade-in">
        <h1 className="text-5xl font-serif text-white mb-6">Onyx Monitor</h1>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
          Initialize the real-time observability suite. Connect your Supabase database to begin global telemetry tracking.
        </p>
        <button 
          onClick={() => onNavigate('settings')}
          className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          Initialize System
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-onyx-800 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-white">Control Plane</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${missingTables ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></span>
            {missingTables ? 'Database Setup Required' : `Monitoring ${sites.length} Active Endpoints`}
          </p>
        </div>
        {!missingTables && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-all font-medium shadow-lg hover:shadow-white/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add External Site</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      ) : missingTables ? (
        <div className="animate-fade-in">
           <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-xl mb-8 flex items-start gap-4">
             <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
             <div>
               <h3 className="text-lg font-medium text-white mb-1">Database Tables Missing</h3>
               <p className="text-gray-400 text-sm">
                 We connected to Supabase, but the required <code>sites</code> and <code>events</code> tables were not found. 
                 Please run the installation SQL below in your Supabase SQL Editor.
               </p>
             </div>
           </div>
           <SetupGuide />
        </div>
      ) : (
        <>
          {/* Aggregate Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-onyx-900 p-5 rounded-xl border border-onyx-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Activity className="w-5 h-5"/></div>
                <span className="text-gray-400 text-sm">Global Ingestion</span>
              </div>
              <div className="text-2xl font-semibold text-white">{totalHits.toLocaleString()} <span className="text-sm text-gray-600 font-normal">events</span></div>
            </div>
            <div className="bg-onyx-900 p-5 rounded-xl border border-onyx-800">
               <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Users className="w-5 h-5"/></div>
                <span className="text-gray-400 text-sm">Active Visitors</span>
              </div>
              <div className="text-2xl font-semibold text-white">{(totalHits / 10).toFixed(0)} <span className="text-sm text-gray-600 font-normal">est.</span></div>
            </div>
            <div className="bg-onyx-900 p-5 rounded-xl border border-onyx-800">
               <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><Server className="w-5 h-5"/></div>
                <span className="text-gray-400 text-sm">Fleet Health</span>
              </div>
              <div className="text-2xl font-semibold text-white">{systemHealth > 0 ? systemHealth : 0}%</div>
            </div>
             <div className="bg-onyx-900 p-5 rounded-xl border border-onyx-800">
               <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400"><Zap className="w-5 h-5"/></div>
                <span className="text-gray-400 text-sm">Avg Latency</span>
              </div>
              <div className="text-2xl font-semibold text-white">124<span className="text-sm text-gray-600 font-normal">ms</span></div>
            </div>
          </div>

          {/* Site Grid (Side by Side) */}
          <div className="mt-8">
            <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
              <Box className="w-5 h-5 text-gray-400" />
              Connected Applications
            </h2>
            
            {sites.length === 0 ? (
              <div className="bg-onyx-900 rounded-xl p-16 text-center border border-onyx-800">
                <div className="w-16 h-16 bg-onyx-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LayoutDashboard className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-medium text-white">No External Sites Connected</h3>
                <p className="text-gray-500 mt-2 mb-8">Add your Vercel or React projects here to start receiving their telemetry.</p>
                <button onClick={() => setShowAddModal(true)} className="bg-white text-black px-6 py-2 rounded font-medium hover:bg-gray-200">Connect External Site</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sites.map(site => {
                  const siteEvents = getSiteEvents(site.id);
                  return (
                    <SiteCard 
                      key={site.id} 
                      site={site} 
                      onClick={(id) => onNavigate('site', id)}
                      eventCount={siteEvents.length}
                      errorCount={siteEvents.filter(e => e.type === 'error').length}
                      avgLoadTime={getAvgLoadTime(siteEvents)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-12 border-t border-onyx-800 pt-8">
            <h3 className="text-white font-serif text-xl mb-4">Integration Guide</h3>
            <SetupGuide />
          </div>
        </>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-onyx-900 rounded-xl shadow-2xl border border-onyx-700 w-full max-w-2xl overflow-hidden animate-fade-in">
            
            {!newlyCreatedSite ? (
              // PHASE 1: CREATE FORM
              <div className="p-8">
                <h2 className="text-2xl font-serif text-white mb-6">Connect External Site</h2>
                <form onSubmit={handleAddSite} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Project Name</label>
                    <input 
                      type="text" required
                      value={newSiteName} onChange={e => setNewSiteName(e.target.value)}
                      className="w-full px-4 py-3 bg-black border border-onyx-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                      placeholder="e.g. My Vercel Portfolio"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Site URL</label>
                    <input 
                      type="url" required
                      value={newSiteUrl} onChange={e => setNewSiteUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-black border border-onyx-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                      placeholder="https://my-app.vercel.app"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-8">
                    <button type="button" onClick={closeModals} className="px-5 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium">Create & Get Code</button>
                  </div>
                </form>
              </div>
            ) : (
              // PHASE 2: INTEGRATION INSTRUCTIONS
              <div className="flex flex-col h-full max-h-[80vh]">
                 <div className="p-6 border-b border-onyx-800 bg-onyx-950">
                    <div className="flex items-center gap-3 mb-2">
                       <CheckCircle className="w-6 h-6 text-green-500" />
                       <h2 className="text-xl font-serif text-white">Site Active: {newlyCreatedSite.name}</h2>
                    </div>
                    <p className="text-gray-400 text-sm">Inject this code into your application to start sending telemetry.</p>
                 </div>

                 <div className="flex-1 overflow-y-auto p-6 bg-black/50">
                    <div className="flex gap-4 mb-4 border-b border-onyx-800">
                       <button onClick={() => setActiveSnippetTab('react')} className={`pb-2 text-sm font-medium ${activeSnippetTab === 'react' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}>React / Vite</button>
                       <button onClick={() => setActiveSnippetTab('html')} className={`pb-2 text-sm font-medium ${activeSnippetTab === 'html' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}>HTML / CDN</button>
                    </div>

                    <div className="relative group">
                       <div className="absolute top-2 right-2 z-10">
                          <button onClick={() => handleCopyCode(getSnippet(newlyCreatedSite.id, activeSnippetTab))} className="flex items-center gap-2 bg-onyx-800 hover:bg-onyx-700 text-white text-xs px-3 py-1.5 rounded transition-colors border border-onyx-700">
                             {copiedCode ? <CheckCircle className="w-3 h-3 text-green-400"/> : <Copy className="w-3 h-3"/>}
                             {copiedCode ? 'Copied' : 'Copy Snippet'}
                          </button>
                       </div>
                       <pre className="text-xs font-mono text-blue-100 bg-onyx-900 p-4 rounded-lg overflow-x-auto border border-onyx-800 leading-relaxed">
                          {getSnippet(newlyCreatedSite.id, activeSnippetTab)}
                       </pre>
                    </div>
                    
                    <div className="mt-4 p-4 bg-yellow-900/10 border border-yellow-900/30 rounded-lg flex items-start gap-3">
                       <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                       <div className="text-sm text-yellow-500/80">
                          <strong>Remember:</strong> You must also provide your Supabase URL and Anon Key in the code above (or use env variables).
                       </div>
                    </div>
                 </div>

                 <div className="p-6 border-t border-onyx-800 flex justify-end">
                    <button onClick={closeModals} className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2">
                       Done <ArrowUpRight className="w-4 h-4"/>
                    </button>
                 </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;