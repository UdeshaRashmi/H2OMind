import React, { useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Insights = () => {
  const [timeRange, setTimeRange] = useState('week');

  // Mock data for charts
  const weeklyData = [
    { day: 'Mon', usage: 1800 },
    { day: 'Tue', usage: 2100 },
    { day: 'Wed', usage: 1950 },
    { day: 'Thu', usage: 2200 },
    { day: 'Fri', usage: 1750 },
    { day: 'Sat', usage: 2400 },
    { day: 'Sun', usage: 1200 },
  ];

  const monthlyData = [
    { week: 'Week 1', usage: 14500 },
    { week: 'Week 2', usage: 15200 },
    { week: 'Week 3', usage: 13800 },
    { week: 'Week 4', usage: 16100 },
  ];

  const categoryData = [
    { name: 'Drinking', value: 35 },
    { name: 'Shower', value: 45 },
    { name: 'Cleaning', value: 10 },
    { name: 'Cooking', value: 5 },
    { name: 'Gardening', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const recommendations = [
    "Reduce shower time by 2 mins to save 20L daily",
    "Fix dripping taps to prevent water wastage",
    "Use a bucket instead of a hose when washing your car",
    "Collect rainwater for gardening purposes"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
        <p className="mt-1 text-sm text-gray-500">Analyze your water consumption patterns and get recommendations.</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              timeRange === 'week'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              timeRange === 'month'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {timeRange === 'week' ? 'Weekly' : 'Monthly'} Water Usage Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            {timeRange === 'week' ? (
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="usage" stroke="#0ea5e9" name="Liters" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            ) : (
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="usage" fill="#0ea5e9" name="Liters" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Category Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Usage by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start p-4 bg-primary-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;