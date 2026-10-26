import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    }
  };

  // Description input handler: sirf alphabets aur spaces allow karega (numbers block karega)
  const handleTitleChange = (e) => {
    const val = e.target.value;
    // Regex jo numbers ko reject kar dega
    if (/^[a-zA-Z\s]*$/.test(val)) {
      setTitle(val);
      setError('');
    } else {
      setError('Description mein sirf text (strings) allow hai, numbers nahi.');
    }
  };

  // Amount input handler: sirf integer numbers allow karega
  const handleAmountChange = (e) => {
    const val = e.target.value;
    // Regex jo sirf integers allow karega
    if (val === '' || /^\d+$/.test(val)) {
      setAmount(val);
      setError('');
    } else {
      setError('Amount mein sirf integer numbers allow hai.');
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Extra validation check before submitting
    if (/\d/.test(title)) {
      setError('Description mein numbers nahi aa sakte.');
      return;
    }

    if (!/^\d+$/.test(amount)) {
      setError('Amount ek valid integer hona chahiye.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/transactions',
        { title, amount: parseInt(amount, 10), type, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Transaction successfully recorded in secure ledger.');
      setTitle('');
      setAmount('');
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record transaction.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="bg-[#0b2219]/80 border border-[#d4af37]/20 rounded-3xl p-8 backdrop-blur-md shadow-xl">
        <span className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-semibold px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10">
          Financial Ledger Management
        </span>
        <h2 className="text-3xl font-serif font-bold text-[#fbf9f1] mt-3 tracking-wide">
          Transaction Records
        </h2>
        <p className="text-gray-300 text-xs mt-2">
          Add, audit, and manage all incoming capital and outgoing expenses with cryptographic integrity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Transaction Form */}
        <div className="lg:col-span-1 bg-[#0b2219]/90 border border-[#d4af37]/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl h-fit">
          <h3 className="text-lg font-serif font-bold text-[#fbf9f1] mb-4">Record New Entry</h3>

          {error && <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs rounded-xl">{error}</div>}
          {success && <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl">{success}</div>}

          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold mb-1">Description (Text Only)</label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Dividend Payout"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#d4af37]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold mb-1">Amount (Integer ₹)</label>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="e.g. 5000"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#d4af37]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] text-sm font-serif"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold mb-1">Transaction Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#d4af37]/30 bg-[#061a12] text-white focus:outline-none focus:border-[#d4af37] text-sm"
              >
                <option value="income">Income (Inflow)</option>
                <option value="expense">Expense (Outflow)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Investments"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#d4af37]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b38f27] hover:opacity-95 text-[#061a12] font-bold rounded-xl shadow-lg transition-all tracking-widest uppercase text-xs cursor-pointer mt-2"
            >
              {loading ? 'Recording...' : 'Commit to Ledger'}
            </button>
          </form>
        </div>

        {/* Transactions Table List */}
        <div className="lg:col-span-2 bg-[#0b2219]/80 border border-[#d4af37]/20 rounded-3xl p-8 shadow-xl backdrop-blur-md">
          <h3 className="text-xl font-serif font-bold text-[#fbf9f1] mb-6">Complete Transaction History</h3>

          {transactions.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#d4af37]/20 rounded-2xl">
              <p className="text-gray-400 text-sm">No transactions logged yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto pr-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#d4af37]/20 text-[10px] uppercase tracking-[0.2em] text-[#d4af37] sticky top-0 bg-[#0b2219]">
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4af37]/10 text-sm">
                  {transactions.map((t) => (
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
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-lg text-xs transition-all cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}