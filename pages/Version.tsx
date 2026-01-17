import React from 'react';
import { 
  CheckCircle, Clock, ChevronRight, Rocket, Flag, 
  GitBranch, Star, Calendar, Box, Target 
} from '../components/Icons';

const Version: React.FC = () => {
  const roadmap = [
    {
      quarter: 'Q4 2025',
      title: 'Predictive Anomalies',
      description: 'AI-driven detection of traffic spikes and error patterns before they impact users.',
      icon: Star
    },
    {
      quarter: 'Q3 2025',
      title: 'Global Mesh',
      description: 'Multi-region availability checks from 12 locations worldwide.',
      icon: GlobeIcon
    }
  ];

  const versions = [
    {
      version: 'v2.4.0',
      tag: 'Current Release',
      date: 'Oct 24, 2025',
      title: 'The Visual Overhaul',
      description: 'A complete reimagining of the user interface, introducing the "Modern Fashion" design language.',
      type: 'major',
      features: [
        'New "About" and "Journey" visualization pages.',
        'Enhanced dashboard grid with side-by-side card layouts.',
        'Deep-dive "Setup Guide" with interactive code generation.',
        'Optimized database queries for 10x faster load times.'
      ]
    },
    {
      version: 'v2.3.0',
      tag: 'Feature Drop',
      date: 'Sept 15, 2025',
      title: 'Real-time Streaming',
      description: 'Enabled WebSocket connections via Supabase Realtime for instant event propagation.',
      type: 'minor',
      features: [
        'Live "Pulse" indicator on site cards.',
        'Streaming table view in Site Details.',
        'CSV Export for raw data analysis.'
      ]
    },
    {
      version: 'v2.0.0',
      tag: 'Foundation',
      date: 'Aug 01, 2025',
      title: 'Initial Launch',
      description: 'The first public release of the Onyx Observability Suite.',
      type: 'major',
      features: [
        'Core Pageview & Error tracking.',
        'Supabase Auth integration.',
        'Basic multi-site management.'
      ]
    }
  ];

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-16 animate-fade-in">
      
      {/* Header */}
      <div className="mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-900/50 text-blue-400 text-xs font-mono mb-6">
          <Rocket className="w-3 h-3" />
          <span>Product Journey</span>
        </div>
        <h1 className="text-5xl font-serif text-white mb-4">Evolution Log</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Tracking the development velocity of the Onyx platform. From humble beginnings to a global observability standard.
        </p>
      </div>

      {/* Roadmap Section */}
      <div className="mb-24">
        <h2 className="text-xl font-serif text-white mb-8 flex items-center gap-3">
          <Flag className="w-5 h-5 text-purple-500" />
          Future Horizons
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmap.map((item, idx) => (
             <div key={idx} className="bg-gradient-to-br from-onyx-900 to-black p-6 rounded-xl border border-onyx-800 hover:border-purple-500/50 transition-colors group">
               <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-purple-900/10 rounded-lg group-hover:bg-purple-900/20 transition-colors">
                   <item.icon className="w-6 h-6 text-purple-400" />
                 </div>
                 <span className="text-xs font-mono text-purple-500 bg-purple-900/10 px-2 py-1 rounded border border-purple-900/20">{item.quarter}</span>
               </div>
               <h3 className="text-lg font-medium text-white mb-2">{item.title}</h3>
               <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
             </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-white via-gray-800 to-transparent opacity-20" />

        <div className="space-y-16">
          {versions.map((v, i) => (
            <div key={i} className="relative pl-20 group">
              {/* Timeline Node */}
              <div className={`absolute left-0 top-0 w-14 h-14 rounded-full border-4 border-black flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${
                v.type === 'major' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-onyx-800 text-gray-400 border-onyx-700'
              }`}>
                {v.type === 'major' ? <Star className="w-6 h-6" /> : <GitBranch className="w-6 h-6" />}
              </div>

              {/* Content */}
              <div className="bg-onyx-900/40 border border-onyx-800 rounded-2xl p-8 hover:bg-onyx-900/60 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-serif text-white">{v.version}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium ${
                        v.type === 'major' ? 'bg-white text-black' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {v.tag}
                      </span>
                    </div>
                    <h4 className="text-lg text-gray-200">{v.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-mono bg-black/30 px-3 py-1 rounded-full border border-white/5">
                    <Calendar className="w-3 h-3" />
                    {v.date}
                  </div>
                </div>

                <p className="text-gray-400 mb-8 leading-relaxed border-l-2 border-gray-700 pl-4 italic">
                  "{v.description}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {v.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3 text-sm text-gray-400 group/feature">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-600 group-hover/feature:bg-white transition-colors" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// Helper for Roadmap Icon
const GlobeIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);

export default Version;