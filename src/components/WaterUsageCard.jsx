import React from 'react';

const WaterUsageCard = ({ title, amount, category, date }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'drinking':
        return '💧';
      case 'cleaning':
        return '🧼';
      case 'shower':
        return '🚿';
      case 'cooking':
        return '🍳';
      default:
        return '🌊';
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className="flex-shrink-0 text-2xl">
          {getCategoryIcon(category)}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-2xl font-bold text-primary-600">{amount}L</p>
          <div className="flex justify-between mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
            <span className="text-sm text-gray-500">{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterUsageCard;