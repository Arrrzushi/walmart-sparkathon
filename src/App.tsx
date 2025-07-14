import React from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import SidePanel from './components/SidePanel';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex h-[calc(100vh-64px)]">
        <SidePanel />
        <div className="flex-1">
          <MapView />
        </div>
      </div>
    </div>
  );
}

export default App;