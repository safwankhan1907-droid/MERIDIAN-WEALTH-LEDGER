import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ setActiveTab }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-10 animate-fade-in pt-4">
      {/* Financial Metric Cards (Spacious & Clean) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0b2219]/80 border border-[#d4af37]/20 rounded-3xl p-8 shadow-xl backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">Net Liquid Wealth</p>
          <h3 className="text-3xl font-serif font-bold text-[#fbf9f1] mt-3">
            ₹{netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
            <span>↑ Fully Encrypted & Synced</span>
          </p>
        </div>

        <div className="bg-[#0b2219]/80 border border-[#d4af37]/20 rounded-3xl p-8 shadow-xl backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">Total Inflows</p>
          <h3 className="text-3xl font-serif font-bold text-emerald-400 mt-3">
            +₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-gray-400 mt-2">Verified capital deposits</p>
        </div>

        <div className="bg-[#0b2219]/80 border border-[#d4af37]/20 rounded-3xl p-8 shadow-xl backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">Total Outflows</p>
          <h3 className="text-3xl font-serif font-bold text-rose-400 mt-3">
            -₹{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-gray-400 mt-2">Allocated expenditures</p>
        </div>
      </div>

      {/* Recent Ledger Preview */}
      <div className="bg-[#0b2219]/80 border border-[#d4af37]/20 rounded-3xl p-8 shadow-xl backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#fbf9f1]">Recent Ledger Activity</h3>
            <p className="text-xs text-gray-400">Latest recorded asset movements</p>
          </div>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs uppercase tracking-wider text-[#d4af37] hover:underline font-semibold cursor-pointer"
          >
            View All Ledger →
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400 text-xs tracking-widest uppercase">Decrypting secure records...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#d4af37]/20 rounded-2xl">
            <p className="text-gray-400 text-sm">No transaction records found in ledger.</p>
            <button
              onClick={() => setActiveTab('transactions')}
              className="mt-4 px-5 py-2.5 bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 rounded-xl text-xs uppercase tracking-wider hover:bg-[#d4af37]/30 transition-all cursor-pointer"
            >
              Add First Transaction
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#d4af37]/20 text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/10 text-sm">
                {transactions.slice(0, 5).map((t) => (
                  <tr key={t._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-medium text-[#fbf9f1]">{t.title}</td>
                    <td className="py-4 px-4 text-gray-300 text-xs">{t.category}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                        t.type === 'income' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`py-4 px-4 text-right font-serif font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}