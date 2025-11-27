import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertBanner from '../components/AlertBanner';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../api/client';

const Profile = () => {
  const { user, isAuthenticated, setUser, logout, theme } = useAuth();
  const navigate = useNavigate();

  const [isEditing, isEditingMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Please sign in to view your profile.</h2>
        <button
          onClick={() => navigate('/login')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { user: updatedUser } = await usersApi.update(user.id, formData);
      setUser(updatedUser);
      isEditingMode(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await usersApi.update(user.id, {
        password: passwordData.newPassword,
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
      setSuccess('Password updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await usersApi.delete(user.id);
      logout();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete account.');
      setLoading(false);
    }
  };

  const initials = user?.name
    ?.split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase() || 'U';

  const accountCreated = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : 'Unknown';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Profile
          </h1>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage your account settings and personal information
          </p>
        </div>

        {/* Alerts */}
        {success && <AlertBanner type="success" message={success} />}
        {error && <AlertBanner type="error" message={error} />}

        {/* Profile Card */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg overflow-hidden mb-8`}>
          <div className="px-4 py-5 sm:p-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-center mb-8">
              <div className={`h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold text-white ${
                theme === 'dark' ? 'bg-primary-700' : 'bg-primary-600'
              }`}>
                {initials}
              </div>
              <div className="ml-6">
                <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name}
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Member since {accountCreated}
                </p>
              </div>
            </div>

            {/* Profile Information */}
            {!isEditing ? (
              <div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Full Name
                    </label>
                    <p className={`mt-1 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      {user?.name}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <p className={`mt-1 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      {user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => isEditingMode(true)}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 ${
                        theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'
                      } shadow-sm focus:ring-primary-500 focus:border-primary-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 ${
                        theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'
                      } shadow-sm focus:ring-primary-500 focus:border-primary-500`}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => isEditingMode(false)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${
                      theme === 'dark' 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Account Stats Card */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg overflow-hidden mb-8`}>
          <div className="px-4 py-5 sm:p-6">
            <h3 className={`text-lg font-medium mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Account Information
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Daily Goal
                </p>
                <p className={`mt-2 text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {user?.dailyGoal || 2000}L
                </p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Account Status
                </p>
                <p className={`mt-2 text-2xl font-semibold text-green-600`}>
                  Active
                </p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Member Since
                </p>
                <p className={`mt-2 text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {new Date(user?.createdAt).getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Password & Security Card */}
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg overflow-hidden mb-8`}>
          <div className="px-4 py-5 sm:p-6">
            <h3 className={`text-lg font-medium mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Password & Security
            </h3>

            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Change Password
              </button>
            ) : (
              <form onSubmit={handlePasswordUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className={`mt-1 block w-full rounded-md border-gray-300 ${
                        theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'
                      } shadow-sm focus:ring-primary-500 focus:border-primary-500`}
                      placeholder="At least 6 characters"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className={`mt-1 block w-full rounded-md border-gray-300 ${
                        theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'
                      } shadow-sm focus:ring-primary-500 focus:border-primary-500`}
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                    }}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${
                      theme === 'dark' 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className={`${theme === 'dark' ? 'bg-red-900 bg-opacity-20 border border-red-900' : 'bg-red-50 border border-red-200'} rounded-lg overflow-hidden`}>
          <div className="px-4 py-5 sm:p-6">
            <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-900'}`}>
              Danger Zone
            </h3>
            <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
              This action is permanent and cannot be undone. All your data will be deleted.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
