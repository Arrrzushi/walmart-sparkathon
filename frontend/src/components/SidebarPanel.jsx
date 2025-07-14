import { motion } from 'framer-motion';
import { BarChart3, Activity, AlertCircle, TrendingUp, Clock, Package } from 'lucide-react';
import { useTileStore } from '../stores/tileStore';
import { formatMetric } from '../utils/scoring';

const SidebarPanel = () => {
  const { tiles } = useTileStore();

  const totalOrders = tiles.reduce((sum, tile) => sum + tile.orderVolume, 0);
  const avgHealthScore = Math.floor(tiles.reduce((sum, tile) => sum + tile.healthScore, 0) / tiles.length);
  const avgDeliveryTime = Math.floor(tiles.reduce((sum, tile) => sum + tile.avgDeliveryTime, 0) / tiles.length);
  const criticalTiles = tiles.filter(tile => tile.surgeLevel === 'critical').length;
  const highSurgeTiles = tiles.filter(tile => tile.surgeLevel === 'high').length;

  const topPerformers = [...tiles]
    .sort((a, b) => b.healthScore - a.healthScore)
    .slice(0, 3);

  const criticalAlerts = tiles
    .filter(tile => tile.alerts && tile.alerts.length > 0)
    .flatMap(tile => tile.alerts.map(alert => ({ tile: tile.name, alert })));

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 bg-dark-800 border-l border-dark-600 h-full overflow-y-auto"
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">System Overview</h2>
          <p className="text-dark-400 text-sm">Real-time fulfillment metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="space-y-4 mb-6">
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span className="text-dark-300 text-sm">Total Orders</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatMetric(totalOrders, 'orders')}
            </div>
          </div>

          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-dark-300 text-sm">Avg Health Score</span>
            </div>
            <div className="text-2xl font-bold text-white">{avgHealthScore}</div>
          </div>

          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-dark-300 text-sm">Avg Delivery</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatMetric(avgDeliveryTime, 'time')}
            </div>
          </div>
        </div>

        {/* Surge Status */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Surge Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-dark-300">Critical Tiles</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                criticalTiles > 0 ? 'bg-red-900/20 text-red-300' : 'bg-green-900/20 text-green-300'
              }`}>
                {criticalTiles}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-dark-300">High Surge Tiles</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                highSurgeTiles > 0 ? 'bg-yellow-900/20 text-yellow-300' : 'bg-green-900/20 text-green-300'
              }`}>
                {highSurgeTiles}
              </span>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Top Performers</h3>
          <div className="space-y-2">
            {topPerformers.map((tile, index) => (
              <div key={tile.h3Index} className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg">
                <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full text-white text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{tile.name}</div>
                  <div className="text-dark-400 text-sm">Score: {tile.healthScore}</div>
                </div>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Critical Alerts</h3>
            <div className="space-y-2">
              {criticalAlerts.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-red-900/10 border border-red-800 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-red-300 font-medium text-sm">{item.tile}</div>
                    <div className="text-red-400 text-xs">{item.alert}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tile List */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">All Tiles</h3>
          <div className="space-y-2">
            {tiles.map(tile => (
              <div key={tile.h3Index} className="p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium">{tile.name}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    tile.surgeLevel === 'normal' ? 'bg-blue-400' :
                    tile.surgeLevel === 'high' ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`}></div>
                </div>
                <div className="flex justify-between text-sm text-dark-400">
                  <span>Health: {tile.healthScore}</span>
                  <span>{formatMetric(tile.orderVolume, 'orders')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SidebarPanel;