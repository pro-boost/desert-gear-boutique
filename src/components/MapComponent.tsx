
import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Note: In a real implementation, you would use a proper mapping library
// like Mapbox, Google Maps, or Leaflet. This is a simplified placeholder.
const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // In a real implementation, this is where you would initialize the map
    const mapElement = mapRef.current;
    if (mapElement) {
      // Simulate map with a placeholder
      const mapPlaceholder = document.createElement('div');
      mapPlaceholder.style.width = '100%';
      mapPlaceholder.style.height = '100%';
      mapPlaceholder.style.backgroundImage = 'url(/placeholder.svg)';
      mapPlaceholder.style.backgroundSize = 'cover';
      mapPlaceholder.style.backgroundPosition = 'center';
      mapPlaceholder.style.display = 'flex';
      mapPlaceholder.style.alignItems = 'center';
      mapPlaceholder.style.justifyContent = 'center';
      
      // Add a marker element
      const marker = document.createElement('div');
      marker.className = 'bg-tactical text-white px-4 py-2 rounded-lg shadow-lg';
      marker.textContent = 'Nidal Boots';
      
      mapPlaceholder.appendChild(marker);
      mapElement.appendChild(mapPlaceholder);
    }
  }, []);

  return (
    <div className="rounded-lg overflow-hidden shadow-lg border border-border bg-card">
      <div className="p-4 bg-muted">
        <h3 className="font-semibold text-lg">{t('findUs')}</h3>
      </div>
      <div 
        ref={mapRef} 
        className="w-full h-64 relative"
      />
      <div className="p-4">
        <p className="text-muted-foreground">
          123 Rue Exemple, Casablanca, Maroc
        </p>
      </div>
    </div>
  );
};

export default MapComponent;
