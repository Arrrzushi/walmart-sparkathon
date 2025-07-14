import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getHealthColor, formatMetric } from '../utils/scoring';

const TileHealthCard = ({ tile, index }) => {
  const healthColor = getHealthColor(tile.healthScore);
  
  // Calculate trend (mock for now)
  const trend = Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable';
  const trendValue = Math.floor(Math.random() * 10) + 1;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-dark-700 border border-dark-600 rounded-lg p-4 hover:border-dark-500 transition-colors"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium">{tile.name}</h3>
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          tile.surgeLevel === 'normal' ? 'bg-blue-900/20 text-blue-300' :
          tile.surgeLevel === 'high' ? 'bg-yellow-900/20 text-yellow-300' :
          'bg-red-900/20 text-red-300'
        }`}>
          {tile.surgeLevel.toUpperCase()}
        </div>
      </div>

      {/* Health Score */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: healthColor }}
            ></div>
            <span className="text-dark-300 text-sm">Health Score</span>
          </div>
          <div className="text-2xl font-bold text-white">{tile.healthScore}</div>
        </div>
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="w-4 h-4" />
          <span className="text-sm">{trendValue}%</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-dark-400 text-xs mb-1">Orders</div>
          <div className="text-white font-medium">
            {formatMetric(tile.orderVolume, 'orders')}
          </div>
        </div>
        <div>
          <div className="text-dark-400 text-xs mb-1">Delivery</div>
          <div className="text-white font-medium">
            {formatMetric(tile.avgDeliveryTime, 'time')}
          </div>
        </div>
        <div>
          <div className="text-dark-400 text-xs mb-1">Stock</div>
          <div className="text-white font-medium">
            {formatMetric(tile.stockLevel, 'percentage')}
          </div>
        </div>
        <div>
          <div className="text-dark-400 text-xs mb-1">Forecast</div>
          <div className="text-white font-medium">
            {formatMetric(tile.forecast, 'orders')}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-dark-600 rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${tile.healthScore}%`,
            backgroundColor: healthColor
          }}
        ></div>
      </div>

      {/* Alerts */}
      {tile.alerts && tile.alerts.length > 0 && (
        <div className="mt-3 text-xs text-red-400">
          {tile.alerts[0]}
        </div>
      )}
    </motion.div>
  );
};

export default TileHealthCard;