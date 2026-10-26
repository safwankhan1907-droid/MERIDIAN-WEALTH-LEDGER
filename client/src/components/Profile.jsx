import React, { useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(storedUser.name || '');
  const [email, setEmail] = useState(storedUser.email || '');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [isCurrentPasswordVerified, setIsCurrentPasswordVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleVerifyCurrentPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/auth/verify-password',
        { currentPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsCurrentPasswordVerified(true);
      setMessage('Current password verified. You can now set a new password.');
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect current password.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        '/api/auth/update',
        { 
          name, 
          email, 
          currentPassword: currentPassword ? currentPassword : undefined,
          password: newPassword ? newPassword : undefined 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem('user', JSON.stringify(res.data.user || { name, email }));
      setMessage('Profile updated successfully.');
      setNewPassword('');
      setCurrentPassword('');
      setIsCurrentPasswordVerified(false);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-[#0b2219]/90 border border-[#d4af37]/30 rounded-3xl p-10 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#997a22] flex items-center justify-center shadow-lg border border-[#d4af37]/40 text-[#061a12] text-3xl font-serif font-bold mb-4">
            {name ? name.charAt(0).toUpperCase() : 'C'}
          </div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-semibold px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10">
            Account Management
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#fbf9f1] mt-4 tracking-wide">Client Profile</h2>
          <p className="text-xs text-gray-400 mt-1">Manage your personal credentials and security keys</p>
        </div>

        {error && <div className="mb-6 p-4 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs rounded-xl">{error}</div>}
        {message && <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl">{message}</div>}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              required
              className={`w-full px-4 py-3.5 rounded-xl border border-[#d4af37]/30 text-white placeholder-gray-400 text-sm ${
                isEditing ? 'bg-white/10 focus:outline-none focus:border-[#d4af37]' : 'bg-black/20 text-gray-300 cursor-not-allowed'
              }`}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              required
              className={`w-full px-4 py-3.5 rounded-xl border border-[#d4af37]/30 text-white placeholder-gray-400 text-sm font-mono ${
                isEditing ? 'bg-white/10 focus:outline-none focus:border-[#d4af37]' : 'bg-black/20 text-gray-300 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Current Password Verification Section */}
          {isEditing && !isCurrentPasswordVerified && (
            <div className="bg-black/30 p-6 rounded-2xl border border-[#d4af37]/20 space-y-4">
              <p className="text-xs text-[#d4af37] uppercase tracking-wider font-semibold">Security Verification Required</p>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-300 mb-2">Enter Current Password to Change Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-[#d4af37]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] text-sm"
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyCurrentPassword}
                disabled={loading || !currentPassword}
                className="w-full py-3 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37]/40 text-[#d4af37] font-bold rounded-xl transition-all tracking-widest uppercase text-xs cursor-pointer"
              >
                {loading ? 'Verifying...' : 'Verify Current Password'}
              </button>
            </div>
          )}

          {/* New Password Appears Only When Verified */}
          {isEditing && isCurrentPasswordVerified && (
            <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/30 space-y-4 animate-fade-in">
              <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">✓ Current Password Verified Successfully</p>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-emerald-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new secure password"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-emerald-500/40 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 text-sm"
                />
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#b38f27] hover:opacity-95 text-[#061a12] font-bold rounded-xl shadow-lg transition-all tracking-widest uppercase text-xs cursor-pointer"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setIsCurrentPasswordVerified(false);
                    setCurrentPassword('');
                    setNewPassword('');
                  }}
                  className="w-1/2 py-4 border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 font-bold rounded-xl transition-all tracking-widest uppercase text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-4 bg-gradient-to-r from-[#d4af37] to-[#b38f27] hover:opacity-95 text-[#061a12] font-bold rounded-xl shadow-lg transition-all tracking-widest uppercase text-xs cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}