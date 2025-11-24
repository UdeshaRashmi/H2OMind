import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertBanner from '../components/AlertBanner';

const AddUsage = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [liters, setLiters] = useState('');
  const [category, setCategory] = useState('drinking');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = [
    { id: 'drinking', name: 'Drinking' },
    { id: 'shower', name: 'Shower' },
    { id: 'bathing', name: 'Bathing' },
    { id: 'cleaning', name: 'Cleaning' },
    { id: 'cooking', name: 'Cooking' },
    { id: 'gardening', name: 'Gardening' },
    { id: 'other', name: 'Other' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Mock API call - in a real app, you would call an API
      if (date && liters && category) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess(true);
        // Reset form
        setLiters('');
      } else {
        setError('Please fill in all fields');
      }
    } catch (err) {
      setError('Failed to add water usage. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Water Usage</h1>
        <p className="mt-1 text-sm text-gray-500">Record your water consumption for better tracking.</p>
      </div>

      {success && (
        <AlertBanner 
          type="success" 
          message="Water usage recorded successfully!" 
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="liters" className="block text-sm font-medium text-gray-700">
                Liters Used
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="liters"
                  id="liters"
                  min="0.1"
                  step="0.1"
                  value={liters}
                  onChange={(e) => setLiters(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm" id="liters-unit">
                    liters
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUsage;