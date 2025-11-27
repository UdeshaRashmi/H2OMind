import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AlertBanner from '../components/AlertBanner';
import Loader from '../components/Loader';
import { insightsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Insights = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchSummary = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const data = await insightsApi.summary(user.id);
        if (isMounted) {
          setSummary(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load insights.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSummary();
    return () => {
      isMounted = false;
    };
  }, [user, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Sign in to view personalized insights.</h2>
        <p className="text-gray-500">Your analytics are available once you start tracking your usage.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AlertBanner type="error" message={error} />
      </div>
    );
  }

  const weeklyData = summary?.weeklyTrend || [];
  const monthlyData = summary?.monthlyTrend || [];
  const categoryData = summary?.categoryBreakdown?.map((item) => ({
    name: item.category,
    value: item.value,
  })) || [];
  const recommendations = summary?.recommendations || [];
  const trendData = timeRange === 'week' ? weeklyData : monthlyData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
        <p className="mt-1 text-sm text-gray-500">Analyze your water consumption patterns and get recommendations.</p>
      </div>

      <div className="mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              timeRange === 'week' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              timeRange === 'month' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {timeRange === 'week' ? 'Weekly' : 'Monthly'} Water Usage Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            {timeRange === 'week' ? (
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="usage" stroke="#0ea5e9" name="Liters" strokeWidth={2} activeDot={{ r: 6 }} />
              </LineChart>
            ) : (
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="usage" fill="#0ea5e9" name="Liters" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Usage by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}L`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} L`, 'Usage']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
          {recommendations.length === 0 ? (
            <p className="text-sm text-gray-500">Add more usage data to unlock personalized tips.</p>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Insights;