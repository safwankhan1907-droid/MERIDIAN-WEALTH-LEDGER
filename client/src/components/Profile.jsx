import React from 'react';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-[#0b2219]/90 border border-[#d4af37]/30 rounded-3xl p-10 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#997a22] flex items-center justify-center shadow-lg border border-[#d4af37]/40 text-[#061a12] text-3xl font-serif font-bold mb-4">
            {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-semibold px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10">
            Verified Client Profile
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#fbf9f1] mt-4 tracking-wide">{user.name || 'Private Client'}</h2>
          <p className="text-xs text-gray-400 mt-1">High-Net-Worth Account Credentials</p>
        </div>

        <div className="space-y-4 border-t border-[#d4af37]/20 pt-6">
          <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-[#d4af37]/10">
            <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">Registered Email</span>
            <span className="text-sm text-[#fbf9f1] font-mono">{user.email || 'Not specified'}</span>
          </div>

          <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-[#d4af37]/10">
            <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">Security Clearance</span>
            <span className="text-sm text-emerald-400 font-medium">JWT Authenticated & Encrypted</span>
          </div>

          <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-[#d4af37]/10">
            <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">Terminal Access</span>
            <span className="text-sm text-[#fbf9f1]">Render Cloud Cluster (Active)</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[11px] text-gray-400">
            To modify security credentials or transfer private accounts, please contact Meridian Concierge support.
          </p>
        </div>
      </div>
    </div>
  );
}