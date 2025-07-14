import { cellToBoundary, cellToLatLng } from 'h3-js';

export const getHexBoundary = (h3Index) => {
  try {
    const boundary = cellToBoundary(h3Index, true);
    return boundary.map(coord => [coord[1], coord[0]]); // Convert to [lng, lat]
  } catch (error) {
    console.error('Error getting hex boundary:', error);
    return [];
  }
};

export const getHexCenter = (h3Index) => {
  try {
    const [lat, lng] = cellToLatLng(h3Index);
    return [lng, lat];
  } catch (error) {
    console.error('Error getting hex center:', error);
    return [0, 0];
  }
};

export const createHexGeoJSON = (tile) => {
  const boundary = getHexBoundary(tile.h3Index);
  
  return {
    type: 'Feature',
    properties: {
      ...tile
    },
    geometry: {
      type: 'Polygon',
      coordinates: [boundary]
    }
  };
};