import React from 'react';
import { Github, Globe, Command, Phone } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-onyx-800 bg-black text-gray-500 mt-auto overflow-hidden">
      {/* Ambient Background Glow - subtle and tight */}
      <div className="absolute -top-24 -right-24 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* Left Side: Brand Narrative */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-3">
              <h3 className="text-white font-serif text-2xl tracking-tight">ONYX Monitor</h3>
              <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em]">Observability</p>
            </div>

            <p className="text-sm text-gray-400 font-light leading-relaxed max-w-md">
              <span className="text-white font-medium">Ascend beyond simple metrics.</span> Onyx isn't just monitoring; it's clarity refined.
              We turn the chaos of digital traffic into a curated narrative, empowering you to orchestrate your infrastructure with absolute precision.
            </p>
          </div>

          {/* Right Side: Compact Contact Card */}
          <div className="flex justify-start md:justify-end">
            <div className="bg-onyx-900/30 backdrop-blur-sm border border-onyx-800 p-5 rounded-xl relative overflow-hidden group hover:border-gray-700 transition-colors duration-500 w-full max-w-md">

               {/* The "Prism" Logo Effect Background */}
               <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity duration-700 rotate-12 pointer-events-none">
                  <div className="w-32 h-32 bg-gradient-to-br from-white via-gray-400 to-black transform rotate-45 border border-white/20"></div>
               </div>

               <div className="relative z-10 flex items-center justify-between gap-6">
                  <div>
                    <h4 className="text-white font-serif text-lg mb-0.5">Jason Odendaal</h4>
                    <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-2">Lead Systems Architect</p>

                    <a href="tel:0695989427" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors group/link">
                       <Phone className="w-3.5 h-3.5" />
                       <span className="font-mono text-sm tracking-wide border-b border-transparent group-hover/link:border-white transition-all">069 598 9427</span>
                    </a>
                  </div>

                  {/* Geometric Prism Logo */}
                  <div className="w-12 h-12 bg-white flex items-center justify-center transform rotate-45 shadow-[0_0_15px_rgba(255,255,255,0.15)] flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                     <span className="text-black font-serif font-black text-xl -rotate-45">O</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom (Very Minimal) */}
        <div className="pt-8 mt-8 border-t border-onyx-900/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-wider">
          <div className="text-gray-600 flex items-center gap-2">
            <span>© {new Date().getFullYear()} Onyx Systems</span>
            <span className="w-0.5 h-0.5 bg-gray-700 rounded-full"></span>
            <span>JHB, ZA</span>
          </div>

          <div className="flex items-center gap-6 opacity-60">
            <a href="#" className="text-gray-600 hover:text-white transition-colors"><Github className="w-3 h-3" /></a>
            <a href="#" className="text-gray-600 hover:text-white transition-colors"><Globe className="w-3 h-3" /></a>
            <a href="#" className="text-gray-600 hover:text-white transition-colors"><Command className="w-3 h-3" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;