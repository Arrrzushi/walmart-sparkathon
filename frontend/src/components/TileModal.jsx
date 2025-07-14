import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Clock, Package, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTileStore } from '../stores/tileStore';
import { getHealthColor, formatMetric } from '../utils/scoring';

const TileModal = () => {
  const { selectedTile, setSelectedTile } = useTileStore();

  if (!selectedTile) return null;

  const healthColor = getHealthColor(selectedTile.healthScore);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={() => setSelectedTile(null)}
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="bg-dark-800 border border-dark-600 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedTile.name}</h2>
              <p className="text-dark-400">Fulfillment Tile Analytics</p>
            </div>
            <button
              onClick={() => setSelectedTile(null)}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-dark-400" />
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-dark-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: healthColor }}
                ></div>
                <span className="text-dark-300 text-sm">Health Score</span>
              </div>
              <div className="text-2xl font-bold text-white">{selectedTile.healthScore}</div>
            </div>

            <div className="bg-dark-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-dark-300 text-sm">Order Volume</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {formatMetric(selectedTile.orderVolume, 'orders')}
              </div>
            </div>

            <div className="bg-dark-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-dark-300 text-sm">Avg Delivery</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {formatMetric(selectedTile.avgDeliveryTime, 'time')}
              </div>
            </div>

            <div className="bg-dark-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-purple-400" />
                <span className="text-dark-300 text-sm">Stock Level</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {formatMetric(selectedTile.stockLevel, 'percentage')}
              </div>
            </div>
          </div>

          {/* Alerts */}
          {selectedTile.alerts && selectedTile.alerts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Active Alerts</h3>
              <div className="space-y-2">
                {selectedTile.alerts.map((alert, index) => (
                  <div key={index} className="flex items-center gap-2 bg-red-900/20 border border-red-800 rounded-lg p-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-red-300">{alert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historical Chart */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">24-Hour Order Volume</h3>
            <div className="bg-dark-700 rounded-lg p-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedTile.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Forecast */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-dark-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Next Hour Forecast</h4>
              <div className="text-xl font-bold text-blue-400">
                {formatMetric(selectedTile.forecast, 'orders')} orders
              </div>
              <p className="text-dark-400 text-sm mt-1">
                {selectedTile.forecast > selectedTile.orderVolume ? '+' : ''}
                {((selectedTile.forecast - selectedTile.orderVolume) / selectedTile.orderVolume * 100).toFixed(1)}% vs current
              </p>
            </div>

            <div className="bg-dark-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Surge Status</h4>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                selectedTile.surgeLevel === 'normal' ? 'bg-blue-900/20 text-blue-300' :
                selectedTile.surgeLevel === 'high' ? 'bg-yellow-900/20 text-yellow-300' :
                'bg-red-900/20 text-red-300'
              }`}>
                {selectedTile.surgeLevel.toUpperCase()}
              </div>
              <p className="text-dark-400 text-sm mt-2">
                {selectedTile.surgeLevel === 'normal' && 'Operating within normal parameters'}
                {selectedTile.surgeLevel === 'high' && 'Elevated demand detected'}
                {selectedTile.surgeLevel === 'critical' && 'Critical surge - immediate attention required'}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TileModal;