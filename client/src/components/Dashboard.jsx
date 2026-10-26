import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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

  // Category-wise breakdown for Doughnut / Pie Chart
  const categoryMap = {};
  transactions.forEach(t => {
    if (t.type === 'expense') {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
    }
  });

  const pieChartData = {
    labels: Object.keys(categoryMap).length > 0 ? Object.keys(categoryMap) : ['No Data'],
    datasets: [
      {
        data: Object.keys(categoryMap).length > 0 ? Object.values(categoryMap) : [1],
        backgroundColor: ['#d4af37', '#0e4429', '#10b981', '#f43f5e', '#3b82f6', '#8b5cf6'],
        borderWidth: 1,
        borderColor: '#061a12',
      },
    ],
  };

  // Bar Graph Data (Inflows vs Outflows)
  const barChartData = {
    labels: ['Inflows', 'Outflows'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [totalIncome, totalExpense],
        backgroundColor: ['#10b981', '#f43f5e'],
        borderRadius: 12,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#fbf9f1',
          font: { family: 'serif', size: 11 },
        },
      },
    },
    scales: {
      x: { grid: { color: 'rgba(212, 175, 55, 0.1)' }, ticks: { color: '#fbf9f1' } },
      y: { grid: { color: 'rgba(212, 175, 55, 0.1)' }, ticks: { color: '#fbf9f1' } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#fbf9f1',
          font: { family: 'serif', size: 11 },
        },
      },
    },
  };

  return (
    <div className="space-y-10 animate-fade-in pt-4">
      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0b2219]/80 border border-[#d4af37]/20 rounded-3xl p-8 shadow-xl backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">Net Liquid Wealth</p>
          <h3 className="text-3xl font-serif font-bold text-[#fbf9f1] mt-3">
            ₹{netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-emerald-400 mt-2">
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

      {/* Analytics Section (Pie Chart & Bar Graph) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Graph: Inflows vs Outflows */}
        <div className="bg-[#0b2219]/80 border border-[#d4af37]/20 rounded-3xl p-8 shadow-xl backdrop-blur-md">
          <div className="mb-6">
            <h3 className="text-xl font-serif font-bold text-[#fbf9f1]">Capital Flow Analysis</h3>
            <p className="text-xs text-gray-400">Comparison of total inflows and outflows</p>
          </div>
          {loading ? (
            <div className="text-center py-20 text-gray-400 text-xs tracking-widest uppercase">Loading analytics...</div>
          ) : (
            <div className="flex justify-center items-center h-[300px]">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          )}
        </div>

        {/* Pie / Doughnut Chart: Category Distribution */}
        <div className="bg-[#0b2219]/80 border border-[#d4af37]/20 rounded-3xl p-8 shadow-xl backdrop-blur-md">
          <div className="mb-6">
            <h3 className="text-xl font-serif font-bold text-[#fbf9f1]">Expense Distribution</h3>
            <p className="text-xs text-gray-400">Category breakdown of expenditures</p>
          </div>
          {loading ? (
            <div className="text-center py-20 text-gray-400 text-xs tracking-widest uppercase">Loading analytics...</div>
          ) : (
            <div className="flex justify-center items-center h-[300px]">
              <Doughnut data={pieChartData} options={doughnutOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}