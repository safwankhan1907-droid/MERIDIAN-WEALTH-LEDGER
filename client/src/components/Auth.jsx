import React, { useState } from 'react';
import axios from 'axios';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Inline error state for Full Name validation
  const [nameError, setNameError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Strict Name validation: allows only alphabets and spaces, blocks numbers
  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (/\d/.test(val)) {
      setNameError('Please enter a valid name (numbers are not allowed).');
    } else {
      setNameError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && /\d/.test(name)) {
      setNameError('Please enter a valid name (numbers are not allowed).');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };

      const res = await axios.post(endpoint, payload);

      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onLoginSuccess();
      } else {
        // Automatically switch to login or notify success
        setIsLogin(true);
        setError('Registration successful! Please sign in with your credentials.');
        setPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#061a12] text-[#fbf9f1] flex items-center justify-center px-4 font-sans selection:bg-[#d4af37] selection:text-[#061a12]">
      <div className="max-w-md w-full bg-[#0b2219]/90 border border-[#d4af37]/30 rounded-3xl p-10 shadow-2xl backdrop-blur-xl animate-fade-in">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-semibold px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10">
            Private Wealth Management
          </span>
          <h1 className="text-4xl font-serif font-bold text-[#fbf9f1] mt-4 tracking-wide">Meridian</h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#d4af37] mt-1 font-semibold">Wealth Ledger</p>
          <p className="text-xs text-gray-400 mt-2">Establish your secure wealth tracking profile</p>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-xl text-xs border ${
            error.includes('successful') 
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
              : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
          }`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Farooque Ali Khan"
                required
                className={`w-full px-4 py-3.5 rounded-xl border bg-white/10 text-white placeholder-gray-400 focus:outline-none text-sm ${
                  nameError ? 'border-rose-500 focus:border-rose-500' : 'border-[#d4af37]/30 focus:border-[#d4af37]'
                }`}
              />
              {nameError && (
                <p className="mt-1 text-[11px] text-rose-400 font-medium animate-pulse">
                  ⚠ {nameError}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@wealth.com"
              required
              className="w-full px-4 py-3.5 rounded-xl border border-[#d4af37]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-3.5 rounded-xl border border-[#d4af37]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading || (!isLogin && Boolean(nameError))}
            className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all tracking-widest uppercase text-xs cursor-pointer mt-4 ${
              (!isLogin && nameError) 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#d4af37] to-[#b38f27] hover:opacity-95 text-[#061a12]'
            }`}
          >
            {loading ? 'Processing...' : isLogin ? 'Authorize Terminal' : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            {isLogin ? "New to Meridian?" : "Already registered?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setNameError('');
              }}
              className="text-[#d4af37] font-semibold hover:underline cursor-pointer ml-1"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}