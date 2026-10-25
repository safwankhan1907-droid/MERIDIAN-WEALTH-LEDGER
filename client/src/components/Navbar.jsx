import React from 'react';

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="w-full backdrop-blur-2xl bg-[#0b2219]/95 border-b border-[#d4af37]/30 px-6 py-4 flex items-center justify-between text-[#fbf9f1] shadow-xl sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 shadow-inner">
          Private Wealth
        </span>
        <h1 className="text-xl font-serif font-bold tracking-wide text-[#fbf9f1]">Meridian</h1>
      </div>

      <div className="flex items-center space-x-6">
        <span className="text-xs text-gray-300 hidden sm:inline">
          Client: <strong className="text-[#d4af37]">{user.name || 'Account Holder'}</strong>
        </span>
        
        <button 
          onClick={handleSignOut}
          className="px-4 py-2 bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 rounded-xl transition-all duration-300 text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-md"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}