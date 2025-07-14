import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, Cloud, Truck, ShoppingCart, AlertTriangle } from 'lucide-react';
import { useTileStore } from '../stores/tileStore';

const ScenarioSimulator = () => {
  const [selectedEvent, setSelectedEvent] = useState('flash_sale');
  const [isSimulating, setIsSimulating] = useState(false);
  const { tiles, updateTile, setSimulationEvent } = useTileStore();

  const scenarios = [
    {
      id: 'flash_sale',
      name: 'Flash Sale Event',
      icon: ShoppingCart,
      description: 'Sudden spike in order volume across all tiles',
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20'
    },
    {
      id: 'storm',
      name: 'Weather Storm',
      icon: Cloud,
      description: 'Delivery delays and reduced capacity',
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20'
    },
    {
      id: 'truck_delay',
      name: 'Truck Delay',
      icon: Truck,
      description: 'Supply chain disruption affecting stock levels',
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20'
    },
    {
      id: 'system_surge',
      name: 'System Surge',
      icon: Zap,
      description: 'High traffic causing system performance issues',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20'
    }
  ];

  const simulateEvent = async (eventType) => {
    setIsSimulating(true);
    setSimulationEvent(eventType);

    // Simulate different event effects
    switch (eventType) {
      case 'flash_sale':
        tiles.forEach(tile => {
          const orderIncrease = Math.floor(Math.random() * 500) + 300;
          const newOrderVolume = tile.orderVolume + orderIncrease;
          const newSurgeLevel = newOrderVolume > 1600 ? 'critical' : 
                               newOrderVolume > 1300 ? 'high' : 'normal';
          
          updateTile(tile.h3Index, {
            orderVolume: newOrderVolume,
            surgeLevel: newSurgeLevel,
            alerts: newSurgeLevel === 'critical' ? 
              [...(tile.alerts || []), 'Flash sale surge detected'] : tile.alerts
          });
        });
        break;

      case 'storm':
        tiles.forEach(tile => {
          const deliveryIncrease = Math.floor(Math.random() * 20) + 10;
          const stockDecrease = Math.floor(Math.random() * 15) + 5;
          const newDeliveryTime = tile.avgDeliveryTime + deliveryIncrease;
          const newStockLevel = Math.max(0, tile.stockLevel - stockDecrease);
          
          updateTile(tile.h3Index, {
            avgDeliveryTime: newDeliveryTime,
            stockLevel: newStockLevel,
            surgeLevel: newDeliveryTime > 45 ? 'critical' : 'high',
            alerts: [...(tile.alerts || []), 'Weather delays affecting deliveries']
          });
        });
        break;

      case 'truck_delay':
        // Affect random tiles
        const affectedTiles = tiles.slice(0, Math.floor(tiles.length / 2));
        affectedTiles.forEach(tile => {
          const stockDecrease = Math.floor(Math.random() * 30) + 20;
          const newStockLevel = Math.max(0, tile.stockLevel - stockDecrease);
          
          updateTile(tile.h3Index, {
            stockLevel: newStockLevel,
            surgeLevel: newStockLevel < 30 ? 'critical' : 'high',
            alerts: [...(tile.alerts || []), 'Supply chain disruption - low stock']
          });
        });
        break;

      case 'system_surge':
        tiles.forEach(tile => {
          const deliveryIncrease = Math.floor(Math.random() * 15) + 5;
          const orderIncrease = Math.floor(Math.random() * 200) + 100;
          
          updateTile(tile.h3Index, {
            avgDeliveryTime: tile.avgDeliveryTime + deliveryIncrease,
            orderVolume: tile.orderVolume + orderIncrease,
            surgeLevel: 'high',
            alerts: [...(tile.alerts || []), 'System performance degraded']
          });
        });
        break;
    }

    // Reset simulation after 10 seconds
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationEvent(null);
    }, 10000);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-dark-800 border border-dark-600 rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Scenario Simulator</h3>
      </div>

      <p className="text-dark-400 text-sm mb-6">
        Test system resilience by simulating real-world events
      </p>

      {/* Scenario Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {scenarios.map(scenario => {
          const Icon = scenario.icon;
          return (
            <button
              key={scenario.id}
              onClick={() => setSelectedEvent(scenario.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedEvent === scenario.id
                  ? 'border-blue-500 bg-blue-900/20'
                  : 'border-dark-600 bg-dark-700 hover:border-dark-500'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-5 h-5 ${scenario.color}`} />
                <span className="text-white font-medium">{scenario.name}</span>
              </div>
              <p className="text-dark-400 text-sm">{scenario.description}</p>
            </button>
          );
        })}
      </div>

      {/* Simulate Button */}
      <button
        onClick={() => simulateEvent(selectedEvent)}
        disabled={isSimulating}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
          isSimulating
            ? 'bg-dark-600 text-dark-400 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
      >
        <Play className="w-4 h-4" />
        {isSimulating ? 'Simulation Running...' : 'Run Simulation'}
      </button>

      {/* Simulation Status */}
      {isSimulating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-red-300 text-sm font-medium">
              Simulating {scenarios.find(s => s.id === selectedEvent)?.name}...
            </span>
          </div>
          <p className="text-red-400 text-xs mt-1">
            Effects will automatically reset in 10 seconds
          </p>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-dark-700 rounded-lg">
        <h4 className="text-white font-medium mb-2">How to Use</h4>
        <ul className="text-dark-400 text-sm space-y-1">
          <li>• Select a scenario from the options above</li>
          <li>• Click "Run Simulation" to trigger the event</li>
          <li>• Watch the map tiles update in real-time</li>
          <li>• Effects will automatically reset after 10 seconds</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default ScenarioSimulator;