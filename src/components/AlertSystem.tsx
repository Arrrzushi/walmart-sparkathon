import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Bell, Clock, CheckCircle } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  tileId?: string;
  acknowledged: boolean;
}

interface AlertSystemProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
}

const AlertSystem: React.FC<AlertSystemProps> = ({ alerts, onAcknowledge, onDismiss }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newAlerts, setNewAlerts] = useState<string[]>([]);

  useEffect(() => {
    const unacknowledgedIds = alerts
      .filter(alert => !alert.acknowledged)
      .map(alert => alert.id);
    setNewAlerts(unacknowledgedIds);
  }, [alerts]);

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'warning': return 'border-yellow-500 bg-yellow-500/10';
      case 'info': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <Bell className="w-4 h-4 text-blue-400" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const criticalAlerts = alerts.filter(alert => alert.type === 'critical').length;
  const warningAlerts = alerts.filter(alert => alert.type === 'warning').length;

  return (
    <div className="fixed top-20 right-4 z-50 w-80">
      {/* Alert Summary */}
      <div 
        className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg
                   cursor-pointer hover:shadow-xl transition-all duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className={`w-5 h-5 ${criticalAlerts > 0 ? 'text-red-500' : 'text-blue-600'}`} />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {alerts.length} Active Alerts
              </div>
              <div className="text-xs text-gray-600">
                {criticalAlerts} Critical • {warningAlerts} Warning
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {criticalAlerts > 0 && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            )}
            <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Alert List */}
      {isExpanded && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg
                        max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">System Alerts</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.map(alert => (
              <div 
                key={alert.id}
                className={`p-3 ${getAlertColor(alert.type)} ${
                  newAlerts.includes(alert.id) ? 'animate-pulse' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-white">{alert.title}</h4>
                        {alert.tileId && (
                          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                            {alert.tileId}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-300 mb-2">{alert.message}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{alert.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => onAcknowledge(alert.id)}
                        className="text-green-400 hover:text-green-300 transition-colors"
                        title="Acknowledge"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDismiss(alert.id)}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertSystem;