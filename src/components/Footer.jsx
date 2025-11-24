import React from 'react';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { theme } = useAuth();
  
  return (
    <footer className={theme === 'dark' ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <span className="text-xl font-bold text-primary-600">💧 H2OMind</span>
          </div>
          <div className="mt-4 md:mt-0 md:order-1">
            <p className={theme === 'dark' ? 'text-center text-sm text-gray-400' : 'text-center text-sm text-gray-500'}>
              &copy; 2025 H2OMind. Mindful hydration and consumption.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;