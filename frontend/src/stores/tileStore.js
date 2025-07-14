import { create } from 'zustand';

export const useTileStore = create((set, get) => ({
  tiles: [],
  selectedTile: null,
  isSimulating: false,
  simulationEvent: null,
  
  setTiles: (newTiles) => set({ tiles: newTiles }),
  
  setSelectedTile: (tile) => set({ selectedTile: tile }),
  
  updateTile: (h3Index, updates) => set((state) => ({
    tiles: state.tiles.map(tile => 
      tile.h3Index === h3Index ? { ...tile, ...updates } : tile
    )
  })),
  
  setSimulating: (isSimulating) => set({ isSimulating }),
  
  setSimulationEvent: (event) => set({ simulationEvent: event }),
  
  // Mock data generator for development
  generateMockTiles: () => {
    const mockTiles = [
      {
        h3Index: '8a2a1072b59ffff',
        name: 'Downtown Dallas',
        healthScore: 85,
        orderVolume: 1250,
        avgDeliveryTime: 28,
        stockLevel: 92,
        surgeLevel: 'normal',
        coordinates: [-96.7970, 32.7767],
        history: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          orders: Math.floor(Math.random() * 200) + 800,
          deliveryTime: Math.floor(Math.random() * 20) + 20
        })),
        forecast: 1400,
        alerts: []
      },
      {
        h3Index: '8a2a1072b5affff',
        name: 'Plano District',
        healthScore: 72,
        orderVolume: 890,
        avgDeliveryTime: 35,
        stockLevel: 78,
        surgeLevel: 'high',
        coordinates: [-96.6989, 33.0198],
        history: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          orders: Math.floor(Math.random() * 150) + 600,
          deliveryTime: Math.floor(Math.random() * 25) + 25
        })),
        forecast: 1100,
        alerts: ['High demand surge detected']
      },
      {
        h3Index: '8a2a1072b5bffff',
        name: 'Arlington Hub',
        healthScore: 91,
        orderVolume: 1450,
        avgDeliveryTime: 22,
        stockLevel: 95,
        surgeLevel: 'normal',
        coordinates: [-97.1081, 32.7357],
        history: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          orders: Math.floor(Math.random() * 250) + 900,
          deliveryTime: Math.floor(Math.random() * 15) + 18
        })),
        forecast: 1600,
        alerts: []
      },
      {
        h3Index: '8a2a1072b5cffff',
        name: 'Fort Worth Zone',
        healthScore: 68,
        orderVolume: 720,
        avgDeliveryTime: 42,
        stockLevel: 65,
        surgeLevel: 'critical',
        coordinates: [-97.3308, 32.7555],
        history: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          orders: Math.floor(Math.random() * 120) + 500,
          deliveryTime: Math.floor(Math.random() * 30) + 30
        })),
        forecast: 850,
        alerts: ['Stock level critical', 'Delivery delays expected']
      },
      {
        h3Index: '8a2a1072b5dffff',
        name: 'Richardson Area',
        healthScore: 88,
        orderVolume: 1100,
        avgDeliveryTime: 26,
        stockLevel: 89,
        surgeLevel: 'normal',
        coordinates: [-96.7298, 32.9481],
        history: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          orders: Math.floor(Math.random() * 180) + 700,
          deliveryTime: Math.floor(Math.random() * 18) + 22
        })),
        forecast: 1250,
        alerts: []
      }
    ];
    
    set({ tiles: mockTiles });
  }
}));