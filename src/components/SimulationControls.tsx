import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Zap, Cloud, AlertTriangle, Settings, MapPin, Radar } from 'lucide-react';

interface SimulationControlsProps {
  simulationMode: boolean;
  onToggleSimulation: () => void;
  onReset: () => void;
  onRunScenario: (scenario: string) => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  simulationMode,
  onToggleSimulation,
  onReset,
  onRunScenario
}) => {
  const [selectedScenario, setSelectedScenario] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const scenarios = [
    { id: 'flash-sale', name: 'Flash Sale Event', icon: Zap, color: 'text-yellow-400' },
    { id: 'weather-disruption', name: 'Weather Disruption', icon: Cloud, color: 'text-blue-400' },
    { id: 'fulfillment-outage', name: 'Fulfillment Center Outage', icon: AlertTriangle, color: 'text-red-400' },
    { id: 'traffic-surge', name: 'Traffic Congestion', icon: AlertTriangle, color: 'text-orange-400' }
  ];

  const ControlButton = ({ icon: Icon, label, onClick, active = false, color = 'text-cyan-400' }: any) => (
    <button
      onClick={onClick}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300
        ${active 
          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/20' 
          : 'bg-black/50 text-gray-300 border border-gray-600/50 hover:bg-black/70 hover:text-white hover:border-cyan-500/30'
        }
        backdrop-blur-md hover:scale-105 hover:shadow-lg
      `}
    >
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="bg-white p-4 border-b border-gray-200 shadow-sm">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ControlButton
              icon={simulationMode ? Pause : Play}
              label={simulationMode ? 'Pause' : 'Run Simulation'}
              onClick={onToggleSimulation}
              active={simulationMode}
            />
            <ControlButton
              icon={RotateCcw}
              label="Reset"
              onClick={onReset}
            />
            <ControlButton
              icon={Settings}
              label="Settings"
              onClick={() => setShowSettings(!showSettings)}
              active={showSettings}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Scenario:</span>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                         hover:border-gray-400 transition-all duration-200"
            >
              <option value="">Select Scenario</option>
              {scenarios.map(scenario => (
                <option key={scenario.id} value={scenario.id}>{scenario.name}</option>
              ))}
            </select>
            <button
              onClick={() => selectedScenario && onRunScenario(selectedScenario)}
              disabled={!selectedScenario}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium 
                         hover:bg-blue-700 transition-colors disabled:opacity-50 
                         disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              Run Scenario
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Radar className={`w-4 h-4 ${simulationMode ? 'text-green-400 animate-spin' : 'text-gray-600'}`} />
            <div className={`w-3 h-3 rounded-full ${simulationMode ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}></div>
            <span className="text-sm text-gray-300">
              {simulationMode ? 'Simulation Active' : 'Real-time Mode'}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            <MapPin className="w-3 h-3 inline mr-1" />
            Sync: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="mt-4 bg-black/60 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 
                        shadow-2xl shadow-black/50">
          <h4 className="text-sm font-medium text-white mb-3">Simulation Settings</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Update Frequency</label>
              <select className="w-full bg-black/50 border border-gray-600/50 rounded-lg px-2 py-1 text-xs text-white
                                 focus:border-cyan-500/50 transition-all duration-300">
                <option>Real-time</option>
                <option>1 second</option>
                <option>5 seconds</option>
                <option>10 seconds</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Scenario Intensity</label>
              <select className="w-full bg-black/50 border border-gray-600/50 rounded-lg px-2 py-1 text-xs text-white
                                 focus:border-cyan-500/50 transition-all duration-300">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Auto-Response</label>
              <select className="w-full bg-black/50 border border-gray-600/50 rounded-lg px-2 py-1 text-xs text-white
                                 focus:border-cyan-500/50 transition-all duration-300">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationControls;