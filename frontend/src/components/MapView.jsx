import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { useTileStore } from '../stores/tileStore';
import { createHexGeoJSON, getHexCenter } from '../utils/h3Utils';
import { getHealthColor, getSurgeColor } from '../utils/scoring';

const MapView = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { tiles, selectedTile, setSelectedTile } = useTileStore();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': '#0f172a'
            }
          },
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            paint: {
              'raster-opacity': 0.3
            }
          }
        ]
      },
      center: [-96.7970, 32.7767], // Dallas center
      zoom: 9,
      pitch: 0,
      bearing: 0
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !tiles.length) return;

    // Remove existing layers and sources
    tiles.forEach(tile => {
      if (map.current.getLayer(`hex-${tile.h3Index}`)) {
        map.current.removeLayer(`hex-${tile.h3Index}`);
      }
      if (map.current.getLayer(`hex-stroke-${tile.h3Index}`)) {
        map.current.removeLayer(`hex-stroke-${tile.h3Index}`);
      }
      if (map.current.getSource(`hex-${tile.h3Index}`)) {
        map.current.removeSource(`hex-${tile.h3Index}`);
      }
    });

    // Add hex tiles
    tiles.forEach(tile => {
      const geoJSON = createHexGeoJSON(tile);
      
      map.current.addSource(`hex-${tile.h3Index}`, {
        type: 'geojson',
        data: geoJSON
      });

      // Fill layer
      map.current.addLayer({
        id: `hex-${tile.h3Index}`,
        type: 'fill',
        source: `hex-${tile.h3Index}`,
        paint: {
          'fill-color': getHealthColor(tile.healthScore),
          'fill-opacity': tile.surgeLevel === 'critical' ? 0.8 : 0.6
        }
      });

      // Stroke layer
      map.current.addLayer({
        id: `hex-stroke-${tile.h3Index}`,
        type: 'line',
        source: `hex-${tile.h3Index}`,
        paint: {
          'line-color': getSurgeColor(tile.surgeLevel),
          'line-width': tile.surgeLevel === 'critical' ? 3 : 2,
          'line-opacity': 0.8
        }
      });

      // Add click handler
      map.current.on('click', `hex-${tile.h3Index}`, (e) => {
        setSelectedTile(tile);
        
        // Create popup
        const popup = new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="p-3">
              <h3 class="font-bold text-lg mb-2">${tile.name}</h3>
              <div class="space-y-1 text-sm">
                <div>Health Score: <span class="font-semibold">${tile.healthScore}</span></div>
                <div>Orders: <span class="font-semibold">${tile.orderVolume.toLocaleString()}</span></div>
                <div>Avg Delivery: <span class="font-semibold">${tile.avgDeliveryTime} min</span></div>
                <div>Stock Level: <span class="font-semibold">${tile.stockLevel}%</span></div>
              </div>
            </div>
          `)
          .addTo(map.current);
      });

      // Add hover effects
      map.current.on('mouseenter', `hex-${tile.h3Index}`, () => {
        map.current.getCanvas().style.cursor = 'pointer';
        map.current.setPaintProperty(`hex-${tile.h3Index}`, 'fill-opacity', 0.8);
      });

      map.current.on('mouseleave', `hex-${tile.h3Index}`, () => {
        map.current.getCanvas().style.cursor = '';
        map.current.setPaintProperty(`hex-${tile.h3Index}`, 'fill-opacity', 
          tile.surgeLevel === 'critical' ? 0.8 : 0.6);
      });
    });
  }, [mapLoaded, tiles, setSelectedTile]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-dark-800 border border-dark-600 rounded-lg p-4 text-white">
        <h4 className="font-semibold mb-2">Health Score</h4>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
            <span>80-100 (Excellent)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
            <span>60-79 (Good)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }}></div>
            <span>40-59 (Fair)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span>0-39 (Poor)</span>
          </div>
        </div>
        
        <h4 className="font-semibold mt-4 mb-2">Surge Level</h4>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span>Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;