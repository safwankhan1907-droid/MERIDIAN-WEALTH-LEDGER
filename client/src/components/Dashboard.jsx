import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data || [];
      setTransactions(data);
      calculateTotals(data);
    } catch (err) {
      console.log('Using local state view');
    }
  };

  const calculateTotals = (data) => {
    let inc = 0;
    let exp = 0;
    data.forEach(tx => {
      if (tx.type === 'income') inc += Number(tx.amount);
      else exp += Number(tx.amount);
    });
    setIncome(inc);
    setExpense(exp);
    setBalance(inc - exp);
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newTx = { title, amount: Number(amount), type };
    const updatedTransactions = [newTx, ...transactions];
    setTransactions(updatedTransactions);
    calculateTotals(updatedTransactions);

    setTitle('');
    setAmount('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/transactions', newTx, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.log('Saved locally');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const total = income + expense || 1;
  const expensePercent = Math.round((expense / total) * 100);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const expenseDasharray = `${(expensePercent / 100) * circumference} ${circumference}`;

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#0b2219] font-sans pb-16 px-4 md:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Banner */}
        <div className="bg-[#0b2219] border border-[#d4af37]/30 rounded-3xl p-6 md:px-8 md:py-6 flex flex-col md:flex-row items-center justify-between shadow-2xl text-[#fbf9f1]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
              Meridian Wealth Ledger
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold mt-1 tracking-wide text-[#fbf9f1]">
              Welcome back, {user.name || 'Safwan Khan'}
            </h1>
          </div>

          <button 
            onClick={handleSignOut}
            className="mt-4 md:mt-0 px-6 py-2.5 border border-[#d4af37]/60 text-[#d4af37] hover:bg-[#d4af37]/10 rounded-xl transition-all duration-300 text-xs font-semibold uppercase tracking-widest cursor-pointer shadow-md"
          >
            Sign Out
          </button>
        </div>

        {/* Top 3 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0b2219] border border-[#d4af37]/30 rounded-3xl p-6 text-[#fbf9f1] shadow-xl">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold">Total Net Worth</span>
            <h3 className="text-3xl font-serif font-bold mt-2 text-[#d4af37]">
              Rs. {balance.toLocaleString()}
            </h3>
          </div>

          <div className="bg-[#0b2219] border border-[#d4af37]/30 rounded-3xl p-6 text-[#fbf9f1] shadow-xl">
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-semibold">Monthly Inflows</span>
            <h3 className="text-3xl font-serif font-bold mt-2 text-emerald-400">
              +Rs. {income.toLocaleString()}
            </h3>
          </div>

          <div className="bg-[#0b2219] border border-[#d4af37]/30 rounded-3xl p-6 text-[#fbf9f1] shadow-xl">
            <span className="text-[10px] uppercase tracking-[0.2em] text-rose-400 font-semibold">Monthly Outflows</span>
            <h3 className="text-3xl font-serif font-bold mt-2 text-rose-400">
              -Rs. {expense.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Charts Section: Side by Side (Pie Chart & Bar Graph) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Expense Distribution by Category (Pie Chart) */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl flex flex-col justify-between">
            <h3 className="text-xl font-serif font-bold text-[#0b2219] mb-6">Expense Distribution by Category</h3>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke="#0b2219"
                    strokeWidth="20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke="#f43f5e"
                    strokeWidth="20"
                    strokeDasharray={expenseDasharray}
                  />
                </svg>
              </div>
              <div className="text-sm font-semibold text-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-[#0b2219]"></span> Outflows: {expensePercent}%
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-300"></span> Other: {100 - expensePercent}%
                </div>
              </div>
            </div>
          </div>

          {/* Cash Flow Analysis (Bar Graph) */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl flex flex-col justify-between">
            <h3 className="text-xl font-serif font-bold text-[#0b2219] mb-6">Cash Flow Analysis</h3>
            
            <div className="flex items-end justify-around h-48 border-b border-l border-gray-300 p-4 relative">
              <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-gray-200"></div>
              <div className="absolute inset-x-0 top-2/4 border-t border-dashed border-gray-200"></div>
              <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-gray-200"></div>

              <div className="flex flex-col items-center z-10">
                <div 
                  style={{ height: `${Math.max((income / (Math.max(income, expense, 1))) * 140, 10)}px` }} 
                  className="w-20 bg-emerald-600 rounded-t-lg transition-all duration-500 shadow-lg"
                ></div>
                <span className="text-xs font-bold text-gray-700 mt-2">Income</span>
              </div>

              <div className="flex flex-col items-center z-10">
                <div 
                  style={{ height: `${Math.max((expense / (Math.max(income, expense, 1))) * 140, 10)}px` }} 
                  className="w-20 bg-rose-600 rounded-t-lg transition-all duration-500 shadow-lg"
                ></div>
                <span className="text-xs font-bold text-gray-700 mt-2">Expense</span>
              </div>
            </div>

            <div className="flex justify-center gap-6 text-xs font-semibold mt-4">
              <span className="text-rose-600 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-600 inline-block"></span> Expense
              </span>
              <span className="text-emerald-600 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span> Income
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Section: Record Transaction & Ledger History Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          
          <div className="bg-[#0b2219] border border-[#d4af37]/40 rounded-3xl p-6 text-[#fbf9f1] shadow-xl lg:col-span-1">
            <h3 className="text-lg font-serif font-bold text-[#d4af37] mb-4">Record Transaction</h3>
            
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-semibold mb-1">Description</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Asset Dividend / Investment" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#d4af37]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-semibold mb-1">Amount (Rs.)</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50000" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#d4af37]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-semibold mb-1">Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#d4af37]/30 bg-[#0b2219] text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="income">Inflow (Income)</option>
                  <option value="expense">Outflow (Expense)</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#d4af37] to-[#b38f27] text-[#0b2219] font-bold rounded-xl shadow-lg hover:opacity-95 transition-all uppercase tracking-widest text-xs cursor-pointer"
              >
                Add Ledger Entry
              </button>
            </form>
          </div>

          <div className="bg-[#0b2219] border border-[#d4af37]/40 rounded-3xl p-6 text-[#fbf9f1] shadow-xl lg:col-span-2">
            <h3 className="text-lg font-serif font-bold text-[#d4af37] mb-4">Ledger History</h3>
            
            <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#d4af37]/20 text-[10px] uppercase tracking-widest text-[#d4af37] sticky top-0 bg-[#0b2219]">
                    <th className="py-3 px-4">Particulars</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-8 text-gray-400 text-xs italic">
                        No transactions recorded in this ledger yet.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-sm font-medium">{tx.title}</td>
                        <td className="py-3 px-4 text-xs uppercase">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-semibold ${tx.type === 'income' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-right font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.type === 'income' ? '+' : '-'} Rs. {Number(tx.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}