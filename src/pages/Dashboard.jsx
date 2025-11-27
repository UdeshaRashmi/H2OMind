import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProgressCircle from '../components/ProgressCircle';
import DailyUsageChart from '../components/DailyUsageChart';
import WaterUsageCard from '../components/WaterUsageCard';
import AlertBanner from '../components/AlertBanner';
import Loader from '../components/Loader';
import { insightsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          setError(err.message || 'Failed to load dashboard data.');
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
        <h2 className="text-2xl font-semibold mb-4">Please sign in to view your dashboard.</h2>
        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
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

  const formatDate = (value) => {
    if (!value) return 'Unknown date';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  };

  const todayUsage = summary?.totals?.today ?? 0;
  const dailyGoal = summary?.totals?.goal ?? 0;
  const progressPercentage = summary?.progress?.percentage ?? 0;
  const weeklyData = summary?.weeklyTrend?.map(({ day, usage }) => ({ day, usage })) || [];
  const alerts = summary?.alerts || [];
  const recentUsage = summary?.recentEntries?.map((entry) => ({
    id: entry.id,
    title: entry.notes || entry.category,
    amount: entry.liters,
    category: entry.category,
    date: formatDate(entry.date),
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Track your water consumption and progress toward your goals.</p>
      </div>

      {alerts.length > 0 && (
        <AlertBanner type={alerts[0].type} message={alerts[0].message} />
      )}

      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
                </svg>
              </div>
              <div className="ml-4">
                <dt className="text-sm font-medium text-gray-500 truncate">Today's Usage</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{todayUsage}L</dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4">
                <dt className="text-sm font-medium text-gray-500 truncate">Daily Goal</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{dailyGoal}L</dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-center">
              <ProgressCircle percentage={progressPercentage} />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <Link
          to="/add-usage"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Water Usage
        </Link>
      </div>

      <div className="mb-8">
        <DailyUsageChart data={weeklyData} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Usage</h2>
          <Link to="/insights" className="text-sm font-medium text-primary-600 hover:text-primary-500">
            View all
          </Link>
        </div>
        {recentUsage.length === 0 ? (
          <p className="text-sm text-gray-500">No entries yet. Start by logging your water usage.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentUsage.map((usage) => (
              <WaterUsageCard
                key={usage.id}
                title={usage.title}
                amount={usage.amount}
                category={usage.category}
                date={usage.date}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;