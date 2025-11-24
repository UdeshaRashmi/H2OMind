import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProgressCircle from '../components/ProgressCircle';
import DailyUsageChart from '../components/DailyUsageChart';
import WaterUsageCard from '../components/WaterUsageCard';
import AlertBanner from '../components/AlertBanner';

const Dashboard = () => {
  const [todayUsage, setTodayUsage] = useState(1200); // Mock data
  const [dailyGoal, setDailyGoal] = useState(2000); // Mock data
  const [showAlert, setShowAlert] = useState(true);

  // Mock data for the chart
  const weeklyData = [
    { day: 'Mon', usage: 1800 },
    { day: 'Tue', usage: 2100 },
    { day: 'Wed', usage: 1950 },
    { day: 'Thu', usage: 2200 },
    { day: 'Fri', usage: 1750 },
    { day: 'Sat', usage: 2400 },
    { day: 'Sun', usage: 1200 },
  ];

  // Mock data for recent usage
  const recentUsage = [
    { id: 1, title: 'Morning Drink', amount: 300, category: 'drinking', date: 'Today, 8:30 AM' },
    { id: 2, title: 'Shower', amount: 800, category: 'shower', date: 'Today, 7:15 AM' },
    { id: 3, title: 'Cooking', amount: 100, category: 'cooking', date: 'Yesterday, 6:45 PM' },
  ];

  const progressPercentage = Math.min(100, (todayUsage / dailyGoal) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Track your water consumption and progress toward your goals.</p>
      </div>

      {showAlert && progressPercentage > 100 && (
        <AlertBanner 
          type="warning" 
          message={`You've exceeded your daily goal by ${Math.round(progressPercentage - 100)}%! Try to conserve water tomorrow.`}
          onClose={() => setShowAlert(false)}
        />
      )}

      {/* Stats Section */}
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

      {/* Quick Action */}
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

      {/* Chart Section */}
      <div className="mb-8">
        <DailyUsageChart data={weeklyData} />
      </div>

      {/* Recent Usage */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Usage</h2>
          <Link to="/insights" className="text-sm font-medium text-primary-600 hover:text-primary-500">
            View all
          </Link>
        </div>
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
      </div>
    </div>
  );
};

export default Dashboard;