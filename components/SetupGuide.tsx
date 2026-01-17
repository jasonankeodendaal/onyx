import React, { useState } from 'react';
import { SETUP_SQL } from '../services/supabaseClient';
import { 
  Code, Copy, CheckCircle, Terminal, Layers, Zap, Globe, 
  AlertCircle, Server, Github, LayoutDashboard, ArrowUpRight,
  Database, Shield, BookOpen, Command, GitBranch, Cloud
} from './Icons';

const SetupGuide: React.FC = () => {
  const [activePhase, setActivePhase] = useState<1 | 2 | 3 | 4>(1);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'react' | 'next' | 'html'>('react');

  const handleCopy = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const REACT_SNIPPET = `/**
 * ONYX DEEP SCAN AGENT (Vite / React)
 * 1. Install Supabase: npm install @supabase/supabase-js
 * 2. Create this file at: src/lib/onyx.js
 * 3. Import and call initOnyx() in your root layout/component.
 */
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
// Get these from your Onyx Dashboard (Create Site -> Get ID) and Supabase Settings
const SITE_ID = 'YOUR_GENERATED_SITE_ID'; 

// Vite Environment Variables
const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const SESSION_ID = Math.random().toString(36).substring(7);

// Simple Location Proxy
const LOCALE = Intl.DateTimeFormat().resolvedOptions();
const REGION = LOCALE.timeZone || 'Unknown';

export const initOnyx = () => {
  if (typeof window === 'undefined') return;

  const track = async (type, payload = {}) => {
    try {
      await supabase.from('events').insert({
        site_id: SITE_ID,
        type,
        session_id: SESSION_ID,
        path: window.location.pathname,
        referrer: document.referrer,
        device: /Mobi/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
        country: REGION, // Proxy for location
        created_at: new Date().toISOString(),
        ...payload
      });
    } catch (e) { console.warn('Onyx Drop:', e); }
  };

  // 1. Navigation & Performance
  track('pageview', { 
    load_time_ms: window.performance?.now() 
  });

  // 2. Global Error Capture (The "Scanner")
  window.addEventListener('error', (event) => {
    track('error', {
      metadata: {
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      }
    });
  });

  // 3. Promise Rejections
  window.addEventListener('unhandledrejection', (event) => {
    track('error', {
      metadata: {
        message: 'Unhandled Promise Rejection: ' + event.reason,
        stack: event.reason?.stack
      }
    });
  });

  // 4. Interaction Tracking
  window.addEventListener('click', (e) => {
    const target = (e.target as Element).closest('button, a, input, [role="button"]');
    if (target) {
      track('click', {
        metadata: {
          tag: target.tagName,
          text: (target as HTMLElement).innerText?.substring(0, 50),
          id: target.id
        }
      });
    }
  });
};`;

  const HTML_SNIPPET = `<!-- 
  ONYX DEEP SCAN AGENT
  Paste this into the <head> tag of your index.html
-->
<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
<script>
  (function() {
    // --- CONFIGURATION ---
    const SITE_ID = 'YOUR_GENERATED_SITE_ID';
    const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
    const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

    if (!window.supabase) return;
    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const SESSION = Math.random().toString(36).substring(7);
    const REGION = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';

    const track = (t, d={}) => client.from('events').insert({
      site_id: SITE_ID, type: t, session_id: SESSION,
      path: window.location.pathname,
      device: /Mobi/i.test(navigator.userAgent)?'Mobile':'Desktop',
      country: REGION,
      created_at: new Date().toISOString(),
      ...d
    });

    // 1. Init
    track('pageview', { load_time_ms: performance.now() });

    // 2. Errors (Live Scanning)
    window.addEventListener('error', e => track('error', { 
      metadata: { msg: e.message, src: e.filename, line: e.lineno } 
    }));

    // 3. Clicks
    window.addEventListener('click', e => {
      const t = e.target.closest('a, button');
      if(t) track('click', { metadata: { tag: t.tagName, text: t.innerText } });
    });
  })();
</script>`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      
      {/* LEFT: Navigation Stepper */}
      <div className="lg:col-span-3">
        <div className="sticky top-24 space-y-2">
          <div className="px-4 mb-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Setup</h3>
          </div>
          
          {[
            { id: 1, title: "Architecture", desc: "System Overview", icon: Layers },
            { id: 2, title: "Database", desc: "Supabase Setup", icon: Database },
            { id: 3, title: "Deployment", desc: "Vercel Hosting", icon: Rocket },
            { id: 4, title: "Deep Scan", desc: "Telemetry Agent", icon: Code },
          ].map((step) => (
            <button 
              key={step.id}
              onClick={() => setActivePhase(step.id as any)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden
                ${activePhase === step.id 
                  ? 'bg-onyx-900 border-gray-700 shadow-xl' 
                  : 'border-transparent hover:bg-onyx-900/30 text-gray-500'}`}
            >
              {activePhase === step.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
              )}
              <div className="flex items-center gap-3 mb-1">
                <div className={`p-1.5 rounded-lg ${activePhase === step.id ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-600'}`}>
                  <step.icon className="w-4 h-4" />
                </div>
                <span className={`font-serif text-lg ${activePhase === step.id ? 'text-white' : 'text-gray-500'}`}>
                  {step.title}
                </span>
              </div>
              <p className="text-xs pl-10 opacity-70">{step.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: Content Area */}
      <div className="lg:col-span-9 min-h-[600px]">
        
        {/* PHASE 1: BLUEPRINT */}
        {activePhase === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-onyx-900 rounded-2xl border border-onyx-800 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-900/20 border border-blue-900/30 rounded-xl">
                  <Layers className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-serif text-white">System Architecture</h2>
                  <p className="text-gray-400">How to achieve 24/7 Global Observability.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="p-6 bg-black rounded-xl border border-onyx-800 text-center relative group">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800 rounded-full text-[10px] uppercase font-bold tracking-wider">Storage</div>
                    <Database className="w-8 h-8 mx-auto text-green-500 mb-4" />
                    <h3 className="text-white font-medium mb-2">Supabase</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      The single source of truth. Captures events, errors, and traffic logs in real-time.
                    </p>
                 </div>
                 <div className="p-6 bg-black rounded-xl border border-onyx-800 text-center relative group">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] uppercase font-bold tracking-wider shadow-[0_0_15px_rgba(37,99,235,0.5)]">Control</div>
                    <LayoutDashboard className="w-8 h-8 mx-auto text-blue-400 mb-4" />
                    <h3 className="text-white font-medium mb-2">Onyx Dashboard</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      This application. It connects to Supabase to visualize data and provide error fixes.
                    </p>
                 </div>
                 <div className="p-6 bg-black rounded-xl border border-onyx-800 text-center relative group">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800 rounded-full text-[10px] uppercase font-bold tracking-wider">Scanner</div>
                    <Globe className="w-8 h-8 mx-auto text-purple-500 mb-4" />
                    <h3 className="text-white font-medium mb-2">Deep Scan Agent</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      A lightweight script you paste into your other websites. It captures clicks, errors, and network fails 24/7.
                    </p>
                 </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setActivePhase(2)} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Start Setup <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PHASE 2: SUPABASE */}
        {activePhase === 2 && (
          <div className="space-y-8 animate-fade-in">
             <div className="bg-onyx-900 rounded-2xl border border-onyx-800 p-8">
               <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-green-900/20 border border-green-900/30 rounded-xl">
                    <Database className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif text-white">Database Setup</h2>
                    <p className="text-gray-400">Initialize the ingestion engine.</p>
                  </div>
               </div>

               <div className="space-y-8">
                 <div className="flex gap-4">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-onyx-800 flex items-center justify-center font-bold text-gray-400">1</div>
                   <div>
                     <h3 className="text-white font-medium mb-1">Create Project</h3>
                     <p className="text-sm text-gray-500 mb-2">
                       Go to <a href="https://supabase.com" target="_blank" className="text-blue-400 hover:underline">Supabase.com</a>. New Project &gt; Name it "Onyx".
                     </p>
                   </div>
                 </div>

                 <div className="flex gap-4">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-onyx-800 flex items-center justify-center font-bold text-gray-400">2</div>
                   <div className="w-full">
                     <h3 className="text-white font-medium mb-1">Run Schema Script</h3>
                     <p className="text-sm text-gray-500 mb-3">
                       In Supabase <strong>SQL Editor</strong>, run this to create the <code>sites</code> and <code>events</code> tables with JSONB metadata.
                     </p>
                     <div className="relative group bg-black rounded-lg border border-onyx-800 overflow-hidden">
                        <div className="flex justify-between items-center px-4 py-2 bg-onyx-950 border-b border-onyx-800">
                          <span className="text-xs text-gray-500 font-mono">setup.sql</span>
                          <button 
                            onClick={() => handleCopy(SETUP_SQL, setCopiedSql)} 
                            className="text-xs text-blue-400 hover:text-white flex items-center gap-1"
                          >
                            {copiedSql ? <CheckCircle className="w-3 h-3"/> : <Copy className="w-3 h-3"/>} Copy SQL
                          </button>
                        </div>
                        <pre className="p-4 text-xs text-gray-400 font-mono overflow-x-auto h-48">{SETUP_SQL}</pre>
                     </div>
                   </div>
                 </div>

                 <div className="flex gap-4">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-onyx-800 flex items-center justify-center font-bold text-gray-400">3</div>
                   <div>
                     <h3 className="text-white font-medium mb-1">Get Credentials</h3>
                     <p className="text-sm text-gray-500">
                       Go to <strong>Project Settings &gt; API</strong>. Copy <code>Project URL</code> and <code>anon key</code>.
                     </p>
                   </div>
                 </div>
               </div>
             </div>
             <div className="flex justify-end">
              <button onClick={() => setActivePhase(3)} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Next: Host Dashboard <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PHASE 3: DEPLOYMENT */}
        {activePhase === 3 && (
          <div className="space-y-8 animate-fade-in">
             <div className="bg-onyx-900 rounded-2xl border border-onyx-800 p-8">
               <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-white/10 border border-white/20 rounded-xl">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif text-white">Global Hosting</h2>
                    <p className="text-gray-400">Deploy this dashboard to Vercel.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="p-2 bg-black rounded-lg h-fit border border-gray-800"><Github className="w-5 h-5 text-white"/></div>
                      <div>
                        <h4 className="text-white font-medium">1. Push to GitHub</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Create a repo. Push this code.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="p-2 bg-black rounded-lg h-fit border border-gray-800"><TriangleIcon className="w-5 h-5 text-white"/></div>
                      <div>
                        <h4 className="text-white font-medium">2. Import to Vercel</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Go to Vercel. Import Repo. <strong>Deploy.</strong> Vercel will auto-detect the configuration.
                        </p>
                      </div>
                    </div>
                 </div>

                 <div className="bg-black/50 p-6 rounded-xl border border-onyx-800">
                   <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                     <Zap className="w-4 h-4 text-yellow-500" /> Config Strategy
                   </h4>
                   <p className="text-sm text-gray-400 leading-relaxed mb-4">
                     Onyx uses <strong>Local Configuration</strong>. You do NOT need to set Environment Variables in Vercel.
                   </p>
                   <p className="text-sm text-gray-400 leading-relaxed">
                     Once deployed, open the live URL. It will ask for your Supabase URL/Key. Enter them in the Settings page to link your specific database.
                   </p>
                 </div>
               </div>
             </div>

             <div className="flex justify-end">
              <button onClick={() => setActivePhase(4)} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Next: Deep Scan Agent <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PHASE 4: INSTRUMENTATION */}
        {activePhase === 4 && (
          <div className="space-y-8 animate-fade-in">
             <div className="bg-onyx-900 rounded-2xl border border-onyx-800 p-8">
               
               <div className="mb-8">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-purple-900/20 border border-purple-900/30 rounded-xl">
                      <Code className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif text-white">The Scanner (Agent)</h2>
                      <p className="text-gray-400 text-sm">Paste this code into the websites you want to monitor to enable 24/7 scanning.</p>
                    </div>
                 </div>

                 {/* Snippet Selector */}
                 <div className="bg-black rounded-xl border border-onyx-800 overflow-hidden shadow-2xl">
                    <div className="flex border-b border-onyx-800">
                      <button onClick={() => setActiveTab('react')} className={`px-6 py-3 text-xs font-medium uppercase ${activeTab === 'react' ? 'bg-onyx-900 text-white border-b-2 border-blue-500' : 'text-gray-500'}`}>React / Vite</button>
                      <button onClick={() => setActiveTab('html')} className={`px-6 py-3 text-xs font-medium uppercase ${activeTab === 'html' ? 'bg-onyx-900 text-white border-b-2 border-blue-500' : 'text-gray-500'}`}>HTML / Vanilla</button>
                      <div className="ml-auto p-2">
                        <button onClick={() => handleCopy(activeTab === 'html' ? HTML_SNIPPET : REACT_SNIPPET, setCopiedCode)} className="flex items-center gap-2 px-3 py-1 bg-onyx-800 text-gray-300 rounded text-xs">
                          {copiedCode ? "Copied" : "Copy Template"}
                        </button>
                      </div>
                    </div>
                    <pre className="p-6 font-mono text-xs text-blue-100 overflow-x-auto h-[400px]">
                      {activeTab === 'html' ? HTML_SNIPPET : REACT_SNIPPET}
                    </pre>
                 </div>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Vercel Icon Helper
const TriangleIcon = (props: any) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L24 22H0L12 1Z"/></svg>
);

// Rocket Icon Helper
const Rocket = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
);

export default SetupGuide;