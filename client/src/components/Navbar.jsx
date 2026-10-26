import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header className="w-full bg-[#061a12] border-b border-[#d4af37]/20 px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50 backdrop-blur-xl bg-opacity-95">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#997a22] flex items-center justify-center shadow-lg border border-[#d4af37]/40">
          <span className="text-[#061a12] font-serif font-bold text-lg">M</span>
        </div>
        <div>
          <h1 className="text-lg font-serif font-bold tracking-wider text-[#fbf9f1]">MERIDIAN</h1>
          <p className="text-[9px] uppercase tracking-[0.3em] text-[#d4af37]">Private Wealth Terminal</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-2 bg-[#0b2219] p-1.5 rounded-2xl border border-[#d4af37]/20 shadow-inner">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all duration-300 ${
            activeTab === 'dashboard'
              ? 'bg-gradient-to-r from-[#d4af37] to-[#b38f27] text-[#061a12] shadow-md'
              : 'text-gray-300 hover:text-[#d4af37]'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all duration-300 ${
            activeTab === 'transactions'
              ? 'bg-gradient-to-r from-[#d4af37] to-[#b38f27] text-[#061a12] shadow-md'
              : 'text-gray-300 hover:text-[#d4af37]'
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all duration-300 ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-[#d4af37] to-[#b38f27] text-[#061a12] shadow-md'
              : 'text-gray-300 hover:text-[#d4af37]'
          }`}
        >
          User Profile
        </button>
      </nav>

      {/* User Info & Logout */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-[#fbf9f1]">{user.name || 'Private Client'}</p>
          <p className="text-[10px] text-[#d4af37]">{user.email || 'client@meridian.wealth'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl border border-rose-500/30 text-rose-300 text-xs uppercase tracking-wider hover:bg-rose-500/10 transition-all cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}