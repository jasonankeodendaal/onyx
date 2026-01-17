import React from 'react';
import SetupGuide from '../components/SetupGuide';
import { Database, Server, Code, CheckCircle, ArrowUpRight } from '../components/Icons';

const Docs: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 animate-fade-in">
      
      {/* Introduction */}
      <div className="mb-12 border-b border-onyx-800 pb-8">
        <h1 className="text-5xl font-serif text-white mb-6">Integration Master Guide</h1>
        <p className="text-xl text-gray-400 font-light max-w-3xl leading-relaxed">
          Welcome to Onyx. This guide serves as your comprehensive manual for deploying the monitoring system and connecting your external fleet of applications. Follow these steps to achieve total observability.
        </p>
      </div>

      {/* Step-by-Step Written Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
        
        {/* Step 1: The Core */}
        <div className="space-y-6">
           <div className="w-12 h-12 bg-blue-900/20 rounded-lg flex items-center justify-center border border-blue-900/40 text-blue-400 font-bold text-xl">1</div>
           <h3 className="text-2xl font-serif text-white">Setup Core System</h3>
           <p className="text-gray-400 text-sm leading-7">
             Before monitoring other sites, you must deploy this dashboard and connect it to a database.
           </p>
           <ul className="space-y-4">
             <li className="flex gap-3 text-sm text-gray-300">
               <CheckCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
               <span>Create a free project on <strong>Supabase.com</strong>.</span>
             </li>
             <li className="flex gap-3 text-sm text-gray-300">
               <CheckCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
               <span>Go to the <strong>SQL Editor</strong> in Supabase and run the installation script provided below (in the interactive guide).</span>
             </li>
             <li className="flex gap-3 text-sm text-gray-300">
               <CheckCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
               <span>Go to <strong>Project Settings &gt; API</strong>. Copy your URL and Anon Public Key.</span>
             </li>
             <li className="flex gap-3 text-sm text-gray-300">
               <CheckCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
               <span>Open the <strong>Settings</strong> page in this Onyx Dashboard and paste your credentials. Save.</span>
             </li>
           </ul>
        </div>

        {/* Step 2: Adding Sites */}
        <div className="space-y-6">
           <div className="w-12 h-12 bg-purple-900/20 rounded-lg flex items-center justify-center border border-purple-900/40 text-purple-400 font-bold text-xl">2</div>
           <h3 className="text-2xl font-serif text-white">Add External Sites</h3>
           <p className="text-gray-400 text-sm leading-7">
             Once the dashboard is running, you can add unlimited websites (React, Vercel, HTML) to the fleet.
           </p>
           <ul className="space-y-4">
             <li className="flex gap-3 text-sm text-gray-300">
               <CheckCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
               <span>Go to the <strong>Dashboard</strong> page.</span>
             </li>
             <li className="flex gap-3 text-sm text-gray-300">
               <CheckCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
               <span>Click <strong>Add External Site</strong>. Enter the project name and its live URL.</span>
             </li>
             <li className="flex gap-3 text-sm text-gray-300">
               <CheckCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
               <span>Upon creation, you will receive a <strong>Unique Site ID</strong> and a code snippet. Copy this immediately.</span>
             </li>
           </ul>
        </div>

        {/* Step 3: Injection */}
        <div className="space-y-6">
           <div className="w-12 h-12 bg-green-900/20 rounded-lg flex items-center justify-center border border-green-900/40 text-green-400 font-bold text-xl">3</div>
           <h3 className="text-2xl font-serif text-white">Inject & Verify</h3>
           <p className="text-gray-400 text-sm leading-7">
             The final step is planting the "Deep Scan Agent" into your target website's code.
           </p>
           <ul className="space-y-4">
             <li className="flex gap-3 text-sm text-gray-300">
               <CheckCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
               <span>Paste the code snippet into your target app (e.g., inside <code>src/lib/onyx.js</code> for React).</span>
             </li>
             <li className="flex gap-3 text-sm text-gray-300">
               <CheckCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
               <span>Deploy your target site.</span>
             </li>
             <li className="flex gap-3 text-sm text-gray-300">
               <CheckCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
               <span>Visit your target site. Click a few buttons.</span>
             </li>
             <li className="flex gap-3 text-sm text-gray-300">
               <CheckCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
               <span>Return to Onyx Dashboard. You will see live traffic appearing instantly.</span>
             </li>
           </ul>
        </div>

      </div>

      <div className="bg-onyx-900/50 border border-onyx-800 rounded-xl p-8 mb-16">
         <h2 className="text-white font-serif text-xl mb-4">Technical Resources & SQL</h2>
         <p className="text-gray-400 mb-8 max-w-2xl">
           Use the interactive guide below to get the database schema setup scripts and generic tracking code templates if you need them again.
         </p>
         <SetupGuide />
      </div>

    </div>
  );
};

export default Docs;