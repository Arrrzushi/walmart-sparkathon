import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Star, Phone, Globe, ChevronDown, ChevronUp } from 'lucide-react';

const SidePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('nearby');
  const [expandedSection, setExpandedSection] = useState<string | null>('recent');

  const recentSearches = [
    'Walmart Supercenter Manhattan',
    'Distribution Center Queens',
    'Fulfillment Hub Brooklyn',
    'Last Mile Depot Bronx'
  ];

  const nearbyPlaces = [
    { name: 'Walmart Supercenter', address: '1515 Northern Blvd, Manhasset, NY', rating: 4.2, type: 'Store' },
    { name: 'Distribution Center', address: '200 Warehouse Ave, Queens, NY', rating: 4.5, type: 'Warehouse' },
    { name: 'Fulfillment Hub', address: '789 Logistics Dr, Long Island City, NY', rating: 4.3, type: 'Fulfillment' },
    { name: 'Neighborhood Market', address: '456 Market St, Astoria, NY', rating: 4.1, type: 'Store' }
  ];

  const directions = [
    { step: 'Head north on 5th Ave toward E 42nd St', distance: '0.2 mi' },
    { step: 'Turn right onto E 42nd St', distance: '0.5 mi' },
    { step: 'Continue onto Queens-Midtown Tunnel', distance: '1.2 mi' },
    { step: 'Take exit 14 for Northern Blvd', distance: '0.8 mi' }
  ];

  const SectionHeader = ({ title, isExpanded, onClick }: any) => (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 transition-colors"
    >
      <span className="font-medium text-gray-900">{title}</span>
      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('nearby')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'nearby'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Nearby
          </button>
          <button
            onClick={() => setActiveTab('directions')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'directions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Directions
          </button>
        </div>
      </div>

      {activeTab === 'nearby' && (
        <div>
          {/* Recent Searches */}
          <div className="border-b border-gray-200">
            <SectionHeader
              title="Recent"
              isExpanded={expandedSection === 'recent'}
              onClick={() => setExpandedSection(expandedSection === 'recent' ? null : 'recent')}
            />
            {expandedSection === 'recent' && (
              <div className="pb-3">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{search}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nearby Places */}
          <div>
            <SectionHeader
              title="Supply Chain Facilities"
              isExpanded={expandedSection === 'facilities'}
              onClick={() => setExpandedSection(expandedSection === 'facilities' ? null : 'facilities')}
            />
            {expandedSection === 'facilities' && (
              <div className="pb-3">
                {nearbyPlaces.map((place, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{place.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{place.address}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{place.rating}</span>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {place.type}
                          </span>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <button className="text-blue-600 text-sm hover:underline">Directions</button>
                          <button className="text-blue-600 text-sm hover:underline">Call</button>
                          <button className="text-blue-600 text-sm hover:underline">Website</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'directions' && (
        <div className="p-4">
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-600">Your location</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3 h-3 text-red-500" />
              <span className="text-sm text-gray-600">Walmart Supercenter</span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-blue-900">12 min</div>
                <div className="text-sm text-blue-700">2.7 mi</div>
              </div>
              <Navigation className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="space-y-3">
            {directions.map((direction, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{direction.step}</p>
                  <p className="text-xs text-gray-500 mt-1">{direction.distance}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 font-medium hover:bg-blue-700 transition-colors">
            Start Navigation
          </button>
        </div>
      )}
    </div>
  );
};

export default SidePanel;