import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Force reload to dashboard to sync auth state
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    }
  };

  // Register Handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      setMessage(res.data.message || 'Registration successful! Please sign in.');
      setTimeout(() => {
        setIsRegistering(false);
        setMessage('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Server error during registration.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md backdrop-blur-2xl bg-[#0b2219]/90 border border-[#d4af37]/40 shadow-[0_12px_40px_0_rgba(0,0,0,0.45)] rounded-3xl p-8 text-[#fbf9f1]">
        
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 shadow-inner">
            Private Wealth Management
          </span>
          <h1 className="text-3xl font-serif font-bold mt-3 tracking-wide text-[#fbf9f1]">Meridian</h1>
          <p className="text-xs uppercase tracking-widest text-[#d4af37]">Wealth Ledger</p>
          <p className="text-xs text-gray-300 mt-2">
            {isRegistering 
              ? 'Establish your secure wealth tracking profile' 
              : 'Access your high-net-worth portfolio overview'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs rounded-xl text-center backdrop-blur-md">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl text-center backdrop-blur-md">
            {message}
          </div>
        )}

        {isRegistering ? (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-semibold mb-1">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Farooque Ali Khan" 
                required
                className="w-full px-4 py-3 rounded-xl border border-[#d4af37]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-semibold mb-1">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@wealth.com" 
                required
                className="w-full px-4 py-3 rounded-xl border border-[#d4af37]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-semibold mb-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••" 
                required
                className="w-full px-4 py-3 rounded-xl border border-[#d4af37]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] backdrop-blur-sm"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b38f27] hover:opacity-95 text-[#0b2219] font-bold rounded-xl shadow-lg transition-all duration-300 tracking-widest uppercase text-sm mt-2 cursor-pointer"
            >
              Complete Registration
            </Button>

            <div className="text-center mt-3">
              <span className="text-xs text-gray-300">Already registered? </span>
              <button 
                type="button" 
                onClick={() => { setIsRegistering(false); setError(''); setMessage(''); }}
                className="text-xs text-[#d4af37] font-semibold hover:underline ml-1 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-semibold mb-1">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@wealth.com" 
                required
                className="w-full px-4 py-3 rounded-xl border border-[#d4af37]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-semibold mb-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••" 
                required
                className="w-full px-4 py-3 rounded-xl border border-[#d4af37]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] backdrop-blur-sm"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b38f27] hover:opacity-95 text-[#0b2219] font-bold rounded-xl shadow-lg transition-all duration-300 tracking-widest uppercase text-sm mt-3 cursor-pointer"
            >
              Authenticate
            </button>

            <div className="text-center mt-3">
              <span className="text-xs text-gray-300">New to Meridian? </span>
              <button 
                type="button" 
                onClick={() => { setIsRegistering(true); setError(''); setMessage(''); }}
                className="text-xs text-[#d4af37] font-semibold hover:underline ml-1 cursor-pointer"
              >
                Request Account
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}