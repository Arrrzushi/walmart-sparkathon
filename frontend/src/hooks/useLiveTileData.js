import { useEffect, useRef } from 'react';
import { useTileStore } from '../stores/tileStore';

export const useLiveTileData = () => {
  const { tiles, setTiles, updateTile, generateMockTiles } = useTileStore();
  const intervalRef = useRef(null);

  useEffect(() => {
    // Initialize with mock data
    generateMockTiles();

    // Simulate real-time updates
    intervalRef.current = setInterval(() => {
      const currentTiles = useTileStore.getState().tiles;
      
      currentTiles.forEach(tile => {
        // Randomly update some metrics
        if (Math.random() < 0.3) {
          const orderVolumeChange = Math.floor(Math.random() * 100) - 50;
          const deliveryTimeChange = Math.floor(Math.random() * 10) - 5;
          const stockChange = Math.floor(Math.random() * 10) - 5;
          
          const newOrderVolume = Math.max(0, tile.orderVolume + orderVolumeChange);
          const newDeliveryTime = Math.max(15, Math.min(60, tile.avgDeliveryTime + deliveryTimeChange));
          const newStockLevel = Math.max(0, Math.min(100, tile.stockLevel + stockChange));
          
          // Calculate new health score
          const deliveryScore = Math.max(0, 100 - (newDeliveryTime - 20) * 2);
          const stockScore = newStockLevel;
          const volumeScore = Math.min(100, (newOrderVolume / 1500) * 100);
          const newHealthScore = Math.floor((deliveryScore + stockScore + volumeScore) / 3);
          
          // Determine surge level
          let surgeLevel = 'normal';
          if (newOrderVolume > 1300) surgeLevel = 'high';
          if (newOrderVolume > 1600) surgeLevel = 'critical';
          if (newHealthScore < 70) surgeLevel = 'critical';
          
          updateTile(tile.h3Index, {
            orderVolume: newOrderVolume,
            avgDeliveryTime: newDeliveryTime,
            stockLevel: newStockLevel,
            healthScore: newHealthScore,
            surgeLevel
          });
        }
      });
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { tiles };
};