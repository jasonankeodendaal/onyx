import React, { useState } from 'react';
import { Site } from '../types';
import { Activity, Globe, AlertCircle, ArrowUpRight, Zap, CheckCircle, Copy, Layers } from './Icons';

interface SiteCardProps {
  site: Site;
  onClick: (id: string) => void;
  eventCount: number;
  errorCount: number;
  avgLoadTime: number;
}

const SiteCard: React.FC<SiteCardProps> = ({ site, onClick, eventCount, errorCount, avgLoadTime }) => {
  const [copied, setCopied] = useState(false);
  const isHealthy = site.status === 'online' && errorCount < 10;
  
  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(site.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      onClick={() => onClick(site.id)}
      className="group bg-onyx-900 rounded-xl p-6 border border-onyx-800 hover:border-gray-600 transition-all cursor-pointer relative overflow-hidden shadow-lg flex flex-col justify-between h-full"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-serif text-xl text-white font-medium group-hover:text-blue-200 transition-colors truncate max-w-[200px]">{site.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Globe className="w-3 h-3" />
              <span className="truncate max-w-[150px]">{site.url}</span>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 border
            ${isHealthy ? 'bg-green-950/30 text-green-400 border-green-900/50' : 'bg-red-950/30 text-red-400 border-red-900/50'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
            {isHealthy ? 'Live' : 'Check'}
          </div>
        </div>

        {/* Integration ID Helper */}
        <div className="mb-6 bg-black/40 border border-onyx-800 rounded p-2 flex items-center justify-between group/id hover:border-gray-600 transition-colors" onClick={(e) => e.stopPropagation()}>
           <div className="flex items-center gap-2 overflow-hidden">
             <Layers className="w-3 h-3 text-gray-600" />
             <code className="text-[10px] text-gray-500 font-mono truncate">ID: {site.id}</code>
           </div>
           <button 
             onClick={handleCopyId}
             className="text-gray-500 hover:text-white transition-colors"
             title="Copy Site ID for Client Script"
           >
             {copied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
           </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 bg-onyx-950 rounded-lg border border-onyx-800">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Hits
            </div>
            <div className="text-lg font-semibold text-white">{eventCount.toLocaleString()}</div>
          </div>
          
          <div className="p-3 bg-onyx-950 rounded-lg border border-onyx-800">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Latency
            </div>
            <div className="text-lg font-semibold text-white">{avgLoadTime > 0 ? avgLoadTime.toFixed(0) : '-'}ms</div>
          </div>

          <div className="p-3 bg-onyx-950 rounded-lg border border-onyx-800">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Errors
            </div>
            <div className={`text-lg font-semibold ${errorCount > 0 ? 'text-red-400' : 'text-gray-400'}`}>
              {errorCount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs text-gray-600 border-t border-onyx-800 pt-3">
         <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-gray-600"/> Listening for events...</span>
         <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1 text-gray-400">Deep Dive <ArrowUpRight className="w-3 h-3"/></span>
      </div>
    </div>
  );
};

export default SiteCard;