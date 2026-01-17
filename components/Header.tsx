import React, { useState } from 'react';
import { LayoutDashboard, Settings, Info, History, Menu, X, BookOpen } from './Icons';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'docs', label: 'Setup', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'version', label: 'Version', icon: History },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-onyx-800 bg-black/80 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Area */}
        <div 
          onClick={() => handleNav('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center text-black font-serif italic font-bold text-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all">
            O
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-medium tracking-tight text-white leading-none">ONYX</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] leading-none mt-1">Observability</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = currentPage === item.id || (currentPage === 'site' && item.id === 'dashboard');
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 relative group py-2
                  ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-white shadow-[0_0_10px_white]" />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Status Indicator */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-onyx-900 border border-onyx-800 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-gray-300 font-mono">System Active</span>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full h-[calc(100vh-80px)] bg-black border-t border-onyx-800 p-6 flex flex-col gap-4 animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex items-center gap-4 text-lg font-serif p-4 border-b border-onyx-900
                ${currentPage === item.id ? 'text-white' : 'text-gray-500'}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;