import React from 'react';
import { Activity, Package, Truck, Cloud, AlertTriangle, TrendingUp, Map, Layers, Target } from 'lucide-react';

interface MetricsPanelProps {
  selectedTile: string | null;
  tiles: any[];
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ selectedTile, tiles }) => {
  const selectedTileData = tiles.find(tile => tile.id === selectedTile);
  
  const globalMetrics = {
    totalTiles: tiles.length,
    criticalTiles: tiles.filter(t => t.risk === 'critical').length,
    averageScore: Math.round(tiles.reduce((sum, tile) => sum + tile.score, 0) / tiles.length),
    inventoryHealth: Math.round(tiles.reduce((sum, tile) => sum + tile.inventory, 0) / tiles.length),
    trafficLoad: Math.round(tiles.reduce((sum, tile) => sum + tile.traffic, 0) / tiles.length),
    fulfillmentPressure: Math.round(tiles.reduce((sum, tile) => sum + tile.fulfillmentPressure, 0) / tiles.length)
  };

  const MetricCard = ({ icon: Icon, label, value, unit, status, trend }: any) => (
    <div className="bg-black/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 
                    hover:bg-black/70 hover:border-cyan-500/30 transition-all duration-300 group
                    hover:shadow-lg hover:shadow-cyan-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className={`w-5 h-5 ${status === 'critical' ? 'text-red-400' : 
                                      status === 'warning' ? 'text-yellow-400' : 'text-cyan-400'}`} />
          <div>
            <div className="text-sm text-gray-300">{label}</div>
            <div className={`text-xl font-bold ${status === 'critical' ? 'text-red-400' : 
                                                status === 'warning' ? 'text-yellow-400' : 'text-white'}`}>
              {value}{unit}
            </div>
          </div>
        </div>
        {trend && (
          <div className={`text-xs px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 border-l border-gray-200 overflow-y-auto shadow-lg">
      <div className="space-y-6">
        {/* Global Metrics */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2 border-b border-gray-200 pb-2">
            <Map className="w-5 h-5 text-blue-600" />
            <span>Network Overview</span>
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <MetricCard 
              icon={Package} 
              label="Total Tiles" 
              value={globalMetrics.totalTiles} 
              unit=""
              status="normal"
            />
            <MetricCard 
              icon={AlertTriangle} 
              label="Critical Tiles" 
              value={globalMetrics.criticalTiles} 
              unit=""
              status={globalMetrics.criticalTiles > 5 ? "critical" : "normal"}
            />
            <MetricCard 
              icon={TrendingUp} 
              label="Avg Score" 
              value={globalMetrics.averageScore} 
              unit=""
              status="normal"
              trend={-2}
            />
            <MetricCard 
              icon={Package} 
              label="Inventory Health" 
              value={globalMetrics.inventoryHealth} 
              unit="%"
              status={globalMetrics.inventoryHealth < 30 ? "critical" : "normal"}
            />
            <MetricCard 
              icon={Truck} 
              label="Traffic Load" 
              value={globalMetrics.trafficLoad} 
              unit="%"
              status={globalMetrics.trafficLoad > 70 ? "warning" : "normal"}
            />
            <MetricCard 
              icon={Cloud} 
              label="Fulfillment Pressure" 
              value={globalMetrics.fulfillmentPressure} 
              unit="%"
              status={globalMetrics.fulfillmentPressure > 80 ? "critical" : "normal"}
            />
          </div>
        </div>

        {/* Selected Tile Details */}
        {selectedTile && selectedTileData && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2 border-b border-gray-700 pb-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <span>Zone {selectedTile}</span>
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <MetricCard 
                icon={TrendingUp} 
                label="Tile Score" 
                value={selectedTileData.score} 
                unit=""
                status={selectedTileData.risk === 'critical' ? "critical" : "normal"}
              />
              <MetricCard 
                icon={Package} 
                label="Inventory Level" 
                value={selectedTileData.inventory} 
                unit="%"
                status={selectedTileData.inventory < 30 ? "critical" : "normal"}
              />
              <MetricCard 
                icon={Activity} 
                label="Demand Level" 
                value={selectedTileData.demand} 
                unit="%"
                status="normal"
              />
              <MetricCard 
                icon={Truck} 
                label="Traffic Congestion" 
                value={selectedTileData.traffic} 
                unit="%"
                status={selectedTileData.traffic > 70 ? "warning" : "normal"}
              />
              <MetricCard 
                icon={Cloud} 
                label="Weather Impact" 
                value={selectedTileData.weather} 
                unit="%"
                status={selectedTileData.weather > 60 ? "warning" : "normal"}
              />
              <MetricCard 
                icon={AlertTriangle} 
                label="Fulfillment Pressure" 
                value={selectedTileData.fulfillmentPressure} 
                unit="%"
                status={selectedTileData.fulfillmentPressure > 80 ? "critical" : "normal"}
              />
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2 border-b border-gray-700 pb-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>AI Recommendations</span>
          </h3>
          <div className="space-y-3">
            <div className="bg-black/50 backdrop-blur-md border border-orange-500/30 rounded-lg p-4 
                            hover:bg-black/70 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-orange-400 font-medium">High Priority</span>
              </div>
              <p className="text-sm text-gray-300">
                Redistribute inventory from Zone A12 to B7-B9 to prevent stockouts
              </p>
            </div>
            <div className="bg-black/50 backdrop-blur-md border border-yellow-500/30 rounded-lg p-4 
                            hover:bg-black/70 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-yellow-400 font-medium">Medium Priority</span>
              </div>
              <p className="text-sm text-gray-300">
                Reroute Fleet-7 via Route-C to avoid traffic congestion
              </p>
            </div>
            <div className="bg-black/50 backdrop-blur-md border border-green-500/30 rounded-lg p-4 
                            hover:bg-black/70 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">Low Priority</span>
              </div>
              <p className="text-sm text-gray-300">
                Pre-position stock for predicted demand surge in C4-C6
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;