import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package, Truck, Clock, Activity, Navigation, MapPin, Zap, Plus, Minus, Layers, Satellite } from 'lucide-react';

interface TileData {
  id: string;
  x: number;
  y: number;
  score: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  inventory: number;
  demand: number;
  traffic: number;
  weather: number;
  fulfillmentPressure: number;
}

interface TileGridProps {
  tiles: TileData[];
  selectedTile: string | null;
  onTileSelect: (tileId: string) => void;
  simulationMode: boolean;
}

const TileGrid: React.FC<TileGridProps> = ({ tiles, selectedTile, onTileSelect, simulationMode }) => {
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [mapType, setMapType] = useState<'satellite' | 'roadmap' | 'hybrid'>('satellite');
  const [showTraffic, setShowTraffic] = useState(true);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'rgba(34, 197, 94, 0.8)';
      case 'medium': return 'rgba(251, 191, 36, 0.8)';
      case 'high': return 'rgba(249, 115, 22, 0.8)';
      case 'critical': return 'rgba(239, 68, 68, 0.8)';
      default: return 'rgba(148, 163, 184, 0.8)';
    }
  };

  const getMapBackground = () => {
    switch (mapType) {
      case 'satellite':
        return 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900';
      case 'roadmap':
        return 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300';
      case 'hybrid':
        return 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800';
      default:
        return 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900';
    }
  };

  const getTextColor = () => {
    return mapType === 'roadmap' ? 'text-gray-800' : 'text-white';
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${getMapBackground()}`}>
      {/* Google Maps Style Background Pattern */}
      <div className="absolute inset-0">
        {mapType === 'satellite' && (
          <>
            {/* Satellite imagery simulation */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-900/20 via-brown-800/20 to-gray-800/20"></div>
              <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-green-700/30 rounded-full blur-xl"></div>
              <div className="absolute top-2/3 left-1/4 w-24 h-24 bg-brown-600/30 rounded-full blur-lg"></div>
              <div className="absolute top-1/2 right-1/3 w-40 h-20 bg-blue-800/30 rounded-full blur-2xl"></div>
            </div>
            {/* Street patterns */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="streets" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 0 50 L 100 50" stroke="rgba(156, 163, 175, 0.3)" strokeWidth="2"/>
                  <path d="M 50 0 L 50 100" stroke="rgba(156, 163, 175, 0.3)" strokeWidth="2"/>
                  <path d="M 25 0 L 25 100" stroke="rgba(156, 163, 175, 0.2)" strokeWidth="1"/>
                  <path d="M 75 0 L 75 100" stroke="rgba(156, 163, 175, 0.2)" strokeWidth="1"/>
                  <path d="M 0 25 L 100 25" stroke="rgba(156, 163, 175, 0.2)" strokeWidth="1"/>
                  <path d="M 0 75 L 100 75" stroke="rgba(156, 163, 175, 0.2)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#streets)" />
            </svg>
          </>
        )}

        {mapType === 'roadmap' && (
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="roads" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect width="80" height="80" fill="#f8fafc"/>
                <path d="M 0 40 L 80 40" stroke="#e2e8f0" strokeWidth="3"/>
                <path d="M 40 0 L 40 80" stroke="#e2e8f0" strokeWidth="3"/>
                <path d="M 20 0 L 20 80" stroke="#f1f5f9" strokeWidth="1"/>
                <path d="M 60 0 L 60 80" stroke="#f1f5f9" strokeWidth="1"/>
                <path d="M 0 20 L 80 20" stroke="#f1f5f9" strokeWidth="1"/>
                <path d="M 0 60 L 80 60" stroke="#f1f5f9" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#roads)" />
          </svg>
        )}
      </div>

      {/* Google Maps Style Controls */}
      <div className="absolute top-4 right-4 z-30 space-y-2">
        {/* Map Type Selector */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => setMapType('satellite')}
            className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
              mapType === 'satellite' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapType('roadmap')}
            className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
              mapType === 'roadmap' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setMapType('hybrid')}
            className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
              mapType === 'hybrid' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
            }`}
          >
            Hybrid
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => setZoomLevel(Math.min(18, zoomLevel + 1))}
            className="block w-full p-2 text-gray-700 hover:bg-gray-50 border-b border-gray-200"
          >
            <Plus className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => setZoomLevel(Math.max(8, zoomLevel - 1))}
            className="block w-full p-2 text-gray-700 hover:bg-gray-50"
          >
            <Minus className="w-4 h-4 mx-auto" />
          </button>
        </div>

        {/* Layers Control */}
        <div className="bg-white rounded-lg shadow-lg p-2">
          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`flex items-center space-x-2 px-2 py-1 rounded text-sm ${
              showTraffic ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Traffic</span>
          </button>
        </div>
      </div>

      {/* Coordinate Display */}
      <div className={`absolute top-4 left-4 ${getTextColor()} text-xs font-mono bg-black/70 px-3 py-2 rounded-lg backdrop-blur-sm`}>
        <div>40.7128° N, 74.0060° W</div>
        <div>Zoom: {zoomLevel}</div>
      </div>

      {/* Supply Chain Zones Overlay */}
      <div className="relative p-8 h-full flex items-center justify-center">
        <div className="grid grid-cols-12 gap-1 max-w-6xl">
          {tiles.map((tile, index) => {
            const isSelected = selectedTile === tile.id;
            const isHovered = hoveredTile === tile.id;
            const riskColor = getRiskColor(tile.risk);
            
            return (
              <div
                key={tile.id}
                className={`
                  relative group cursor-pointer transform transition-all duration-300 ease-out
                  ${isSelected ? 'scale-110 z-20' : isHovered ? 'scale-105 z-10' : 'hover:scale-105'}
                  rounded-lg border-2 border-white/30 backdrop-blur-sm
                  ${simulationMode ? 'animate-pulse' : ''}
                `}
                style={{
                  backgroundColor: riskColor,
                  minHeight: '60px',
                  width: '60px',
                  boxShadow: isSelected ? `0 0 20px ${riskColor}` : isHovered ? `0 0 10px ${riskColor}` : 'none'
                }}
                onClick={() => onTileSelect(tile.id)}
                onMouseEnter={() => setHoveredTile(tile.id)}
                onMouseLeave={() => setHoveredTile(null)}
              >
                {/* Zone Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-white">
                  <div className="font-bold text-lg mb-1 drop-shadow-lg">{tile.score}</div>
                  <div className="text-xs text-white/90 font-medium drop-shadow">{tile.id}</div>
                  <div className="flex space-x-1 mt-1">
                    {tile.risk === 'critical' && <AlertTriangle className="w-3 h-3 text-red-200 animate-pulse drop-shadow" />}
                    {tile.inventory < 30 && <Package className="w-3 h-3 text-orange-200 drop-shadow" />}
                    {tile.traffic > 70 && <Truck className="w-3 h-3 text-yellow-200 drop-shadow" />}
                    {tile.fulfillmentPressure > 80 && <Zap className="w-3 h-3 text-cyan-200 animate-bounce drop-shadow" />}
                  </div>
                </div>
                
                {/* Google Maps Style Info Window */}
                {isHovered && (
                  <div className="absolute z-30 -top-32 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white rounded-lg shadow-2xl p-4 min-w-64 text-gray-800 border">
                      <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-200">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <span className="font-semibold text-gray-900">Fulfillment Zone {tile.id}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Risk Level:</span>
                          <span className={`font-medium ${
                            tile.risk === 'critical' ? 'text-red-600' : 
                            tile.risk === 'high' ? 'text-orange-600' : 
                            tile.risk === 'medium' ? 'text-yellow-600' : 'text-green-600'
                          }`}>{tile.risk.charAt(0).toUpperCase() + tile.risk.slice(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Score:</span>
                          <span className="font-medium text-blue-600">{tile.score}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Inventory:</span>
                          <span className="font-medium">{tile.inventory}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Demand:</span>
                          <span className="font-medium">{tile.demand}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Traffic:</span>
                          <span className="font-medium">{tile.traffic}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weather:</span>
                          <span className="font-medium">{tile.weather}%</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Fulfillment Pressure:</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${
                                  tile.fulfillmentPressure > 80 ? 'bg-red-500' :
                                  tile.fulfillmentPressure > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${tile.fulfillmentPressure}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{tile.fulfillmentPressure}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Info window pointer */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
                    </div>
                  </div>
                )}

                {/* Traffic Layer Overlay */}
                {showTraffic && tile.traffic > 50 && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute inset-0 rounded-lg ${
                      tile.traffic > 80 ? 'bg-red-500/30' :
                      tile.traffic > 65 ? 'bg-yellow-500/30' : 'bg-green-500/30'
                    } animate-pulse`}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Google Maps Style Scale */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded px-3 py-2 text-xs text-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-16 h-0.5 bg-gray-700"></div>
          <span>2 km</span>
        </div>
      </div>

      {/* Google Maps Style Attribution */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
        TileFlow OS • Supply Chain Intelligence
      </div>
    </div>
  );
};

export default TileGrid;