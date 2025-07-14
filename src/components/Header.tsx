import React, { useState } from 'react';
import { Menu, Search, Settings, User, Grid, Activity, Zap } from 'lucide-react';

const Header: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm relative z-40">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Google Maps Style Menu and Logo */}
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <Grid className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-normal text-gray-800">TileFlow</span>
                <span className="text-sm text-gray-500">OS</span>
              </div>
            </div>
            
            {/* Google Maps Style Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search for places, addresses, or supply chain facilities..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-full 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           shadow-sm hover:shadow-md transition-all duration-200 text-gray-900
                           placeholder-gray-500"
                />
                {searchValue && (
                  <button
                    onClick={() => setSearchValue('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Status Indicators */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-medium">Live</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5">
                <Zap className="w-3 h-3 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">AI</span>
              </div>
            </div>
            
            {/* User Controls */}
            <div className="flex items-center space-x-1">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;