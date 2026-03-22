import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GlobalOverviewChart = ({ data }) => {
  // data expected: { income: 50000, expense: 20000 }
  const chartData = [
    {
      name: 'Totals',
      Income: data.income || 0,
      Expense: data.expense || 0,
    }
  ];

  return (
    <div style={{ width: '100%', height: 300, background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <h3 style={{ marginBottom: '20px', color: '#495057' }}>Global Financial Overview</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
          <Tooltip 
            formatter={(value) => `₹${value.toLocaleString()}`}
            cursor={{fill: 'transparent'}}
          />
          <Legend />
          <Bar dataKey="Income" fill="#2e7d32" radius={[4, 4, 0, 0]} barSize={60} />
          <Bar dataKey="Expense" fill="#c62828" radius={[4, 4, 0, 0]} barSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlobalOverviewChart;
