import { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, BarChart3, Settings, Zap } from 'lucide-react';
import MapView from './components/MapView';
import TileModal from './components/TileModal';
import SidebarPanel from './components/SidebarPanel';
import ScenarioSimulator from './components/ScenarioSimulator';
import TileHealthCard from './components/TileHealthCard';
import { useLiveTileData } from './hooks/useLiveTileData';
import { useTileStore } from './stores/tileStore';

function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [showSidebar, setShowSidebar] = useState(true);
  const { tiles } = useLiveTileData();
  const { isSimulating, simulationEvent } = useTileStore();

  const tabs = [
    { id: 'map', name: 'Map View', icon: Map },
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'simulator', name: 'Simulator', icon: Zap },
  ];

  return (
    <div className="h-screen bg-dark-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Map className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">GeoFulfillment OS</h1>
                <p className="text-dark-400 text-sm">Walmart Supply Chain Intelligence</p>
              </div>
            </div>
            
            {/* Simulation Status */}
            {isSimulating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1 bg-red-900/20 border border-red-800 rounded-full"
              >
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-red-300 text-sm font-medium">
                  Simulating {simulationEvent?.replace('_', ' ')}
                </span>
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Tab Navigation */}
            <nav className="flex bg-dark-700 rounded-lg p-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-dark-300 hover:text-white hover:bg-dark-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Sidebar Toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-dark-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Content Area */}
        <div className="flex-1 relative">
          {activeTab === 'map' && <MapView />}
          
          {activeTab === 'dashboard' && (
            <div className="p-6 overflow-y-auto h-full">
              <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Fulfillment Dashboard</h2>
                  <p className="text-dark-400">Real-time monitoring of all fulfillment tiles</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tiles.map((tile, index) => (
                    <TileHealthCard key={tile.h3Index} tile={tile} index={index} />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'simulator' && (
            <div className="p-6 overflow-y-auto h-full">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Scenario Simulator</h2>
                  <p className="text-dark-400">Test system resilience and response capabilities</p>
                </div>
                
                <ScenarioSimulator />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {showSidebar && <SidebarPanel />}
      </div>

      {/* Modal */}
      <TileModal />
    </div>
  );
}

export default App;