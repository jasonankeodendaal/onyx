import React from 'react';
import { Shield, Zap, Globe, Layers, Database, Cpu, Lock, Lightbulb, Target, Compass } from '../components/Icons';

const About: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 animate-fade-in">
      
      {/* Hero Section */}
      <div className="text-center mb-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] -z-10" />
        <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 tracking-tight leading-tight">
          Observability,<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600">Reimagined.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
          Onyx transforms raw telemetry into an editorial narrative. We believe system monitoring shouldn't just be functional—it should be a visceral experience of your digital infrastructure's heartbeat.
        </p>
      </div>

      {/* The Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
        <div className="space-y-4">
           <div className="w-12 h-12 bg-onyx-900 border border-onyx-800 rounded-lg flex items-center justify-center mb-4">
             <Compass className="w-6 h-6 text-white" />
           </div>
           <h3 className="text-2xl font-serif text-white">Precision</h3>
           <p className="text-gray-500 leading-relaxed">
             We strip away the noise of traditional APM tools. No cluttered menus, no confusing query languages. Just the metrics that matter, delivered with surgical accuracy.
           </p>
        </div>
        <div className="space-y-4">
           <div className="w-12 h-12 bg-onyx-900 border border-onyx-800 rounded-lg flex items-center justify-center mb-4">
             <Layers className="w-6 h-6 text-white" />
           </div>
           <h3 className="text-2xl font-serif text-white">Aesthetics</h3>
           <p className="text-gray-500 leading-relaxed">
             Data is beautiful. Our interface is inspired by high-end editorial design, using typography and negative space to let your data breathe and tell its story.
           </p>
        </div>
        <div className="space-y-4">
           <div className="w-12 h-12 bg-onyx-900 border border-onyx-800 rounded-lg flex items-center justify-center mb-4">
             <Lock className="w-6 h-6 text-white" />
           </div>
           <h3 className="text-2xl font-serif text-white">Sovereignty</h3>
           <p className="text-gray-500 leading-relaxed">
             You own your data. Onyx acts as a lens, but the storage engine (Supabase) belongs to you. We never sell, share, or mine your telemetry.
           </p>
        </div>
      </div>

      {/* Technical Deep Dive */}
      <div className="mb-32">
        <div className="border-l-2 border-white pl-8 mb-12">
          <h2 className="text-4xl font-serif text-white mb-2">The Architecture</h2>
          <p className="text-gray-400">A symphony of modern technologies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-onyx-900/30 p-8 rounded-2xl border border-onyx-800 backdrop-blur-sm group hover:bg-onyx-900/50 transition-colors">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-green-900/20 border border-green-900/30 rounded-xl">
                 <Database className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h4 className="text-xl font-medium text-white mb-2">Supabase Core</h4>
                <p className="text-gray-400 leading-relaxed text-sm">
                  The backbone of Onyx. We utilize PostgreSQL for robust relational data storage and <strong>Realtime Channels</strong> for sub-millisecond event streaming. Row Level Security (RLS) ensures that write-access is public (for agents) but read-access is strictly secured.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-onyx-900/30 p-8 rounded-2xl border border-onyx-800 backdrop-blur-sm group hover:bg-onyx-900/50 transition-colors">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-black border border-white/10 rounded-xl">
                 <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-medium text-white mb-2">Vercel Edge</h4>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Deployed on the edge. The Onyx dashboard leverages Vercel's global CDN to serve assets instantly to any location. The telemetry agent is designed to be lightweight (Under 2KB), ensuring it never impacts your site's Core Web Vitals.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-onyx-900/30 p-8 rounded-2xl border border-onyx-800 backdrop-blur-sm group hover:bg-onyx-900/50 transition-colors">
             <div className="flex items-start gap-6">
              <div className="p-4 bg-blue-900/20 border border-blue-900/30 rounded-xl">
                 <Cpu className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h4 className="text-xl font-medium text-white mb-2">React 19 & Tailwind</h4>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Built for the future. We use the latest concurrent features of React 19 for fluid transitions and Tailwind CSS for a utility-first, design-system driven approach to UI construction.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-onyx-900/30 p-8 rounded-2xl border border-onyx-800 backdrop-blur-sm group hover:bg-onyx-900/50 transition-colors">
             <div className="flex items-start gap-6">
              <div className="p-4 bg-purple-900/20 border border-purple-900/30 rounded-xl">
                 <Lightbulb className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h4 className="text-xl font-medium text-white mb-2">Client-Side Logic</h4>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Smart aggregation. To keep the backend simple, much of the analytical processing (session grouping, bounce rate calculation) happens dynamically in the client, distributing the compute load.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Origin Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 border-t border-onyx-800 pt-32">
        <div>
          <h2 className="text-4xl font-serif text-white mb-6">The Genesis</h2>
          <div className="space-y-6 text-gray-500 text-lg leading-relaxed font-light">
            <p>
              Onyx was born from frustration. As developers, we found ourselves juggling multiple expensive, bloated monitoring tools just to answer simple questions: "Is my site up?" and "Who is visiting?".
            </p>
            <p>
              We realized that for 99% of projects, you don't need complex tracing or deep packet inspection. You need clarity. You need to know if your latest deploy broke the checkout flow, or if your traffic spike is coming from Japan or Brazil.
            </p>
            <p>
              We set out to build a "Fashion-First" tool. One that you'd be proud to show on a monitor in your office. One that treats telemetry data with the same visual respect as a luxury editorial.
            </p>
          </div>
        </div>
        <div className="relative h-[500px] w-full bg-onyx-950 rounded-2xl border border-onyx-800 overflow-hidden flex items-center justify-center group">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
           <div className="relative z-10 text-center">
             <Target className="w-24 h-24 text-gray-700 mb-6 mx-auto group-hover:text-white transition-colors duration-700" />
             <div className="h-px w-24 bg-gray-700 mx-auto mb-6" />
             <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">Target: Simplicity</p>
           </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-24 bg-gradient-to-b from-transparent to-onyx-900/50 rounded-3xl border border-onyx-800/50">
        <h2 className="text-3xl font-serif text-white mb-6">Ready to see the unseen?</h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
          Deploying Onyx takes less than 5 minutes. Connect your database and start streaming.
        </p>
        <button className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
          Begin Integration
        </button>
      </div>

    </div>
  );
};

export default About;