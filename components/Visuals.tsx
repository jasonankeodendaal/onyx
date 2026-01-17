import React from 'react';
import { Database, Server, Globe, Activity, Lock, Smartphone } from 'lucide-react';

export const VisualDatabase = () => (
  <div className="relative w-full h-48 flex items-center justify-center overflow-hidden bg-onyx-950/50 rounded-xl border border-onyx-800">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50" />
    
    {/* Central Node */}
    <div className="relative z-10 flex flex-col items-center gap-2 animate-float">
      <div className="w-16 h-16 rounded-full bg-onyx-900 border border-blue-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.1)]">
        <Database className="w-8 h-8 text-blue-400" />
      </div>
      <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rounded-full animate-pulse-slow" />
    </div>

    {/* Orbiting Particles */}
    <div className="absolute w-32 h-32 border border-dashed border-onyx-700 rounded-full animate-spin-slow opacity-30" />
    <div className="absolute w-48 h-48 border border-dashed border-onyx-800 rounded-full animate-spin-slow opacity-20" style={{ animationDirection: 'reverse' }} />
    
    {/* Floating Data Points */}
    <div className="absolute top-8 left-12 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
    <div className="absolute bottom-10 right-16 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)] delay-75" />
    <div className="absolute top-1/2 right-8 w-1 h-1 bg-purple-500 rounded-full animate-pulse delay-150" />
  </div>
);

export const VisualCode = () => (
  <div className="relative w-full h-48 flex items-center justify-center overflow-hidden bg-onyx-950/50 rounded-xl border border-onyx-800">
     <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-shimmer opacity-10" />
     
     <div className="w-3/4 h-3/4 bg-onyx-900 rounded-lg border border-onyx-800 p-4 shadow-xl flex flex-col gap-2 relative z-10">
        <div className="flex gap-1.5 mb-2">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
        <div className="space-y-2">
          <div className="w-3/4 h-2 bg-onyx-800 rounded animate-pulse" />
          <div className="w-1/2 h-2 bg-onyx-800 rounded animate-pulse delay-75" />
          <div className="w-full h-2 bg-onyx-800 rounded animate-pulse delay-150" />
          <div className="w-2/3 h-2 bg-blue-900/30 rounded animate-pulse delay-200" />
        </div>
     </div>
  </div>
);

export const VisualDeploy = () => (
  <div className="relative w-full h-48 flex items-center justify-center overflow-hidden bg-onyx-950/50 rounded-xl border border-onyx-800">
    {/* Connection Lines */}
    <svg className="absolute inset-0 w-full h-full text-onyx-800" strokeWidth="1">
       <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="currentColor" strokeDasharray="4" />
       <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="currentColor" strokeDasharray="4" />
    </svg>

    <div className="flex items-center gap-12 relative z-10">
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-onyx-900 rounded-lg border border-onyx-700 flex items-center justify-center">
          <Globe className="w-5 h-5 text-gray-400" />
        </div>
        <span className="text-[10px] text-gray-500 uppercase">Local</span>
      </div>

      <div className="flex flex-col items-center gap-2 animate-pulse">
        <div className="w-8 h-8 bg-green-900/20 rounded-full border border-green-900 flex items-center justify-center">
          <Activity className="w-4 h-4 text-green-500" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-onyx-900 rounded-lg border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <Server className="w-5 h-5 text-white" />
        </div>
        <span className="text-[10px] text-gray-500 uppercase">Live</span>
      </div>
    </div>
  </div>
);