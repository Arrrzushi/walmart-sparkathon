export const getHealthColor = (score) => {
  if (score >= 80) return '#10b981'; // Green
  if (score >= 60) return '#f59e0b'; // Yellow
  if (score >= 40) return '#f97316'; // Orange
  return '#ef4444'; // Red
};

export const getSurgeColor = (surgeLevel) => {
  switch (surgeLevel) {
    case 'normal': return '#3b82f6'; // Blue
    case 'high': return '#f59e0b'; // Yellow
    case 'critical': return '#ef4444'; // Red
    default: return '#6b7280'; // Gray
  }
};

export const calculateHealthScore = (tile) => {
  const deliveryScore = Math.max(0, 100 - (tile.avgDeliveryTime - 20) * 2);
  const stockScore = tile.stockLevel;
  const volumeScore = Math.min(100, (tile.orderVolume / 1500) * 100);
  
  return Math.floor((deliveryScore + stockScore + volumeScore) / 3);
};

export const formatMetric = (value, type) => {
  switch (type) {
    case 'time':
      return `${value} min`;
    case 'percentage':
      return `${value}%`;
    case 'orders':
      return value.toLocaleString();
    default:
      return value;
  }
};