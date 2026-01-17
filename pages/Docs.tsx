import React from 'react';
import SetupGuide from '../components/SetupGuide';
import { Database, Server, Code, CheckCircle, ArrowUpRight, Shield, Globe, AlertCircle } from '../components/Icons';

const Docs: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 animate-fade-in">
      
      {/* Introduction */}
      <div className="mb-12 border-b border-onyx-800 pb-8">
        <h1 className="text-5xl font-serif text-white mb-6">Integration Master Guide</h1>
        <p className="text-xl text-gray-400 font-light max-w-3xl leading-relaxed">
          This manual covers the complete lifecycle of deploying Onyx: from setting up your global database to instrumenting your application fleet on Vercel.
        </p>
      </div>

      {/* Troubleshooting Alert (Top) */}
      <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-xl mb-12 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-medium text-white mb-1">Important: Do not confuse SQL with JavaScript</h3>
          <p className="text-gray-400 text-sm">
            A common error (42601) occurs when users accidentally paste the <strong>JavaScript Agent Code</strong> into the <strong>Supabase SQL Editor</strong>. 
            <br/>
            <ul>
              <li className="list-disc ml-5 mt-2">Use the <strong>SQL Editor</strong> only for creating tables (Phase 2 in guide).</li>
              <li className="list-disc ml-5">Use the <strong>JavaScript Agent</strong> inside your VS Code project (Phase 4 in guide).</li>
            </ul>
          </p>
        </div>
      </div>

      {/* Step-by-Step Written Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        
        {/* Step 1: Database Setup */}
        <div className="space-y-8">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 bg-blue-900/20 rounded-lg flex items-center justify-center border border-blue-900/40 text-blue-400 font-bold text-lg">1</div>
             <h3 className="text-2xl font-serif text-white">Global Database (Supabase)</h3>
           </div>
           
           <div className="bg-onyx-900/50 p-6 rounded-xl border border-onyx-800 space-y-4">
             <p className="text-gray-400 text-sm leading-relaxed">
               Onyx relies on Supabase for real-time event ingestion. You must configure the permissions correctly to allow anonymous visitors (your users) to write telemetry data without logging in.
             </p>
             <ul className="space-y-3">
               <li className="flex gap-3 text-sm text-gray-300">
                 <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                 <span>Create a new project on <strong>Supabase.com</strong>.</span>
               </li>
               <li className="flex gap-3 text-sm text-gray-300">
                 <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                 <span>Go to <strong>SQL Editor</strong> and run the <code>setup.sql</code> script.</span>
               </li>
               <li className="flex gap-3 text-sm text-gray-300">
                 <Shield className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                 <span><strong>Important:</strong> The script enables RLS but GRANTS insert permissions to the <code>anon</code> role. This is critical for the "Deep Scan Agent" to work.</span>
               </li>
             </ul>
           </div>
        </div>

        {/* Step 2: Vercel Deployment */}
        <div className="space-y-8">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 bg-purple-900/20 rounded-lg flex items-center justify-center border border-purple-900/40 text-purple-400 font-bold text-lg">2</div>
             <h3 className="text-2xl font-serif text-white">Go Live on Vercel</h3>
           </div>

           <div className="bg-onyx-900/50 p-6 rounded-xl border border-onyx-800 space-y-4">
             <p className="text-gray-400 text-sm leading-relaxed">
               Deploy this dashboard to Vercel to access it from anywhere.
             </p>
             <ul className="space-y-3">
               <li className="flex gap-3 text-sm text-gray-300">
                 <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                 <span>Push this code to a GitHub repository.</span>
               </li>
               <li className="flex gap-3 text-sm text-gray-300">
                 <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                 <span>Import the repo into Vercel and click <strong>Deploy</strong>.</span>
               </li>
               <li className="flex gap-3 text-sm text-gray-300">
                 <Globe className="w-5 h-5 text-blue-400 flex-shrink-0" />
                 <span><strong>Configuration:</strong> You do NOT need environment variables on Vercel. Once deployed, open the live URL and enter your Supabase URL/Key in the Settings page. This saves the config to your browser's local storage.</span>
               </li>
             </ul>
           </div>
        </div>

      </div>

      <div className="bg-onyx-900/50 border border-onyx-800 rounded-xl p-8 mb-16">
         <h2 className="text-white font-serif text-xl mb-4">Interactive Setup</h2>
         <p className="text-gray-400 mb-8 max-w-2xl text-sm">
           Follow this interactive guide to obtain your SQL Schema and Client Agents.
         </p>
         <SetupGuide />
      </div>

    </div>
  );
};

export default Docs;