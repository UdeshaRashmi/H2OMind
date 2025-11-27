import React, { useEffect, useState } from 'react';
import AlertBanner from '../components/AlertBanner';
import Loader from '../components/Loader';
import { insightsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

const Alerts = () => {
  const { user, isAuthenticated } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchAlerts = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const data = await insightsApi.alerts(user.id);
        if (isMounted) {
          setAlerts(data.alerts || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load alerts.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAlerts();
    return () => {
      isMounted = false;
    };
  }, [user, isAuthenticated]);

  const markAsRead = (id) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert))
    );
  };

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })));
  };

  const unreadCount = alerts.filter((alert) => !alert.read).length;

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <AlertBanner type="warning" message="Sign in to view your alerts." />
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your notifications and alerts.</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {alerts.map((alert) => (
            <li key={alert.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {!alert.read && (
                      <span className="flex-shrink-0 h-3 w-3 rounded-full bg-primary-500 mr-3"></span>
                    )}
                    <AlertBanner 
                      type={alert.type} 
                      message={alert.message} 
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-4">
                      {alert.date}
                    </span>
                    {!alert.read && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="inline-flex items-center px-2.5 py-0.5 border border-transparent text-xs font-medium rounded-full text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts</h3>
          <p className="mt-1 text-sm text-gray-500">
            You're all caught up! We'll notify you when something requires your attention.
          </p>
        </div>
      )}
    </div>
  );
};

export default Alerts;