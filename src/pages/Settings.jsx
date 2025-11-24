import React, { useState } from 'react';
import AlertBanner from '../components/AlertBanner';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { theme, updateTheme } = useAuth();
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });
  const [localTheme, setLocalTheme] = useState(theme);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleNotificationChange = (type) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTheme(localTheme);
    setSuccess(true);
    setError('');
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your preferences and account settings.</p>
      </div>

      {success && (
        <AlertBanner 
          type="success" 
          message="Settings saved successfully!" 
        />
      )}

      {error && (
        <AlertBanner 
          type="error" 
          message={error} 
        />
      )}

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Daily Goal */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Daily Water Goal</h3>
              <p className="mt-1 text-sm text-gray-500">
                Set your target water consumption for each day.
              </p>
              <div className="mt-4">
                <div className="flex items-center">
                  <input
                    type="number"
                    min="500"
                    max="10000"
                    step="100"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(e.target.value)}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-32 sm:text-sm border-gray-300 rounded-md"
                  />
                  <span className="ml-3 text-sm text-gray-500">milliliters</span>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                Choose how you want to be notified.
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="email-notifications"
                    name="email-notifications"
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange('email')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="email-notifications" className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">Email notifications</span>
                    <span className="block text-sm text-gray-500">Receive notifications via email</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="push-notifications"
                    name="push-notifications"
                    type="checkbox"
                    checked={notifications.push}
                    onChange={() => handleNotificationChange('push')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="push-notifications" className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">Push notifications</span>
                    <span className="block text-sm text-gray-500">Receive notifications on your devices</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="sms-notifications"
                    name="sms-notifications"
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={() => handleNotificationChange('sms')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sms-notifications" className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">SMS notifications</span>
                    <span className="block text-sm text-gray-500">Receive text messages for important alerts</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Theme */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Appearance</h3>
              <p className="mt-1 text-sm text-gray-500">
                Customize how the app looks on your device.
              </p>
              <div className="mt-4">
                <div className="flex space-x-6">
                  <div className="flex items-center">
                    <input
                      id="theme-light"
                      name="theme"
                      type="radio"
                      value="light"
                      checked={localTheme === 'light'}
                      onChange={(e) => setLocalTheme(e.target.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor="theme-light" className="ml-3 block text-sm font-medium text-gray-700">
                      Light
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="theme-dark"
                      name="theme"
                      type="radio"
                      value="dark"
                      checked={localTheme === 'dark'}
                      onChange={(e) => setLocalTheme(e.target.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor="theme-dark" className="ml-3 block text-sm font-medium text-gray-700">
                      Dark
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;