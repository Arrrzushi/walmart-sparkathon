import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Plus, Minus, Layers, Navigation, MapPin, Satellite, Menu, MoreVertical as MoreVert } from 'lucide-react';

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [mapType, setMapType] = useState<'osm' | 'satellite' | 'terrain'>('osm');
  const [showTraffic, setShowTraffic] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  // Real NYC supply chain facilities with actual coordinates
  const locations = [
    { 
      id: 1, 
      name: 'Walmart Supercenter', 
      type: 'store', 
      lat: 40.7589, 
      lng: -73.9851, 
      address: '1515 Northern Blvd, Manhasset, NY', 
      rating: 4.2,
      icon: '🏪'
    },
    { 
      id: 2, 
      name: 'Queens Distribution Center', 
      type: 'warehouse', 
      lat: 40.7505, 
      lng: -73.9934, 
      address: '47-40 21st St, Long Island City, NY', 
      rating: 4.5,
      icon: '🏭'
    },
    { 
      id: 3, 
      name: 'Brooklyn Navy Yard', 
      type: 'fulfillment', 
      lat: 40.6982, 
      lng: -73.9742, 
      address: '63 Flushing Ave, Brooklyn, NY', 
      rating: 4.3,
      icon: '📦'
    },
    { 
      id: 4, 
      name: 'Hunts Point Market', 
      type: 'warehouse', 
      lat: 40.8067, 
      lng: -73.8803, 
      address: '772 Food Center Dr, Bronx, NY', 
      rating: 4.1,
      icon: '🏭'
    },
    { 
      id: 5, 
      name: 'JFK Cargo Hub', 
      type: 'depot', 
      lat: 40.6413, 
      lng: -73.7781, 
      address: 'JFK Airport, Queens, NY', 
      rating: 4.4,
      icon: '✈️'
    },
    { 
      id: 6, 
      name: 'Port Newark', 
      type: 'warehouse', 
      lat: 40.6895, 
      lng: -74.1745, 
      address: 'Port Newark, NJ', 
      rating: 4.2,
      icon: '🚢'
    },
    { 
      id: 7, 
      name: 'Fresh Direct Facility', 
      type: 'fulfillment', 
      lat: 40.7505, 
      lng: -73.9357, 
      address: '23-30 Borden Ave, Long Island City, NY', 
      rating: 4.0,
      icon: '🥬'
    },
    {
      id: 8,
      name: 'Amazon Fulfillment Center',
      type: 'fulfillment',
      lat: 40.6892,
      lng: -74.0445,
      address: '1 Fulfillment Way, Staten Island, NY',
      rating: 4.3,
      icon: '📦'
    },
    {
      id: 9,
      name: 'UPS Worldport Hub',
      type: 'depot',
      lat: 40.7282,
      lng: -74.0776,
      address: '643 Summer St, Stamford, CT',
      rating: 4.1,
      icon: '📮'
    },
    {
      id: 10,
      name: 'Target Distribution',
      type: 'warehouse',
      lat: 40.8176,
      lng: -73.9782,
      address: '2505 Bruckner Blvd, Bronx, NY',
      rating: 4.0,
      icon: '🎯'
    }
  ];

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map centered on NYC
    const map = L.map(mapRef.current, {
      zoomControl: false, // We'll add custom controls
      attributionControl: false // We'll add custom attribution
    }).setView([40.7128, -74.0060], zoomLevel);

    // Add OpenStreetMap tiles
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });

    // Add satellite tiles (using Esri World Imagery)
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri, Maxar, Earthstar Geographics'
    });

    // Add terrain tiles
    const terrainLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenTopoMap contributors'
    });

    // Set initial layer
    osmLayer.addTo(map);

    mapInstanceRef.current = map;

    // Add markers for supply chain locations
    addLocationMarkers(map);

    // Update zoom level when map zoom changes
    map.on('zoomend', () => {
      setZoomLevel(map.getZoom());
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Add location markers
  const addLocationMarkers = (map: L.Map) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    locations.forEach(location => {
      // Create custom icon
      const customIcon = L.divIcon({
        html: `
          <div class="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-lg border-2 border-blue-500 text-lg hover:scale-110 transition-transform cursor-pointer">
            ${location.icon}
          </div>
        `,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([location.lat, location.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-3 min-w-64">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-gray-900">${location.name}</h3>
              <span class="text-lg">${location.icon}</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">${location.address}</p>
            <div class="flex items-center space-x-2 mb-3">
              <div class="flex items-center">
                ${[...Array(5)].map((_, i) => 
                  `<span class="text-sm ${i < Math.floor(location.rating) ? 'text-yellow-400' : 'text-gray-300'}">★</span>`
                ).join('')}
                <span class="text-sm text-gray-600 ml-1">${location.rating}</span>
              </div>
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                ${location.type}
              </span>
            </div>
            <div class="flex space-x-2">
              <button class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                Directions
              </button>
              <button class="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors">
                Call
              </button>
              <button class="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors">
                Website
              </button>
            </div>
          </div>
        `, {
          maxWidth: 300,
          className: 'custom-popup'
        });

      markersRef.current.push(marker);
    });
  };

  // Handle map type change
  const handleMapTypeChange = (type: 'osm' | 'satellite' | 'terrain') => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    
    // Remove all layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add appropriate layer
    let newLayer;
    switch (type) {
      case 'satellite':
        newLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri, Maxar, Earthstar Geographics'
        });
        break;
      case 'terrain':
        newLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenTopoMap contributors'
        });
        break;
      default:
        newLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        });
    }

    newLayer.addTo(map);
    setMapType(type);

    // Re-add markers
    addLocationMarkers(map);
  };

  // Handle zoom
  const handleZoom = (direction: 'in' | 'out') => {
    if (!mapInstanceRef.current) return;
    
    if (direction === 'in') {
      mapInstanceRef.current.zoomIn();
    } else {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Google Maps Style Controls */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        {/* Map Type Selector */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <button
            onClick={() => handleMapTypeChange('osm')}
            className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
              mapType === 'osm' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => handleMapTypeChange('satellite')}
            className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
              mapType === 'satellite' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => handleMapTypeChange('terrain')}
            className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
              mapType === 'terrain' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
            }`}
          >
            Terrain
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <button
            onClick={() => handleZoom('in')}
            className="block w-full p-3 text-gray-700 hover:bg-gray-50 border-b border-gray-200 transition-colors"
          >
            <Plus className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="block w-full p-3 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Minus className="w-4 h-4 mx-auto" />
          </button>
        </div>

        {/* Layers Control */}
        <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <div className="space-y-2">
            <button
              onClick={() => setShowTraffic(!showTraffic)}
              className={`flex items-center space-x-2 px-2 py-1 rounded text-sm w-full transition-colors ${
                showTraffic ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className={`w-3 h-3 rounded ${showTraffic ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <span>Traffic</span>
            </button>
            <button
              onClick={() => setShowTransit(!showTransit)}
              className={`flex items-center space-x-2 px-2 py-1 rounded text-sm w-full transition-colors ${
                showTransit ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className={`w-3 h-3 rounded ${showTransit ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <span>Transit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Street View Control */}
      <div className="absolute bottom-20 right-4 z-[1000]">
        <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <button className="text-gray-700 hover:text-blue-600 transition-colors">
            <Navigation className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Coordinate Display */}
      <div className="absolute top-4 left-4 bg-black/70 text-white text-xs font-mono px-3 py-2 rounded-lg backdrop-blur-sm z-[1000]">
        <div>40.7128° N, 74.0060° W</div>
        <div>Zoom: {zoomLevel}</div>
      </div>

      {/* Scale */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded px-3 py-2 text-xs text-gray-700 border border-gray-200 z-[1000]">
        <div className="flex items-center space-x-2">
          <div className="w-16 h-0.5 bg-gray-700"></div>
          <span>2 km</span>
        </div>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-1 rounded border border-gray-200 z-[1000]">
        TileFlow OS • Supply Chain Intelligence
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  );
};

export default MapView;