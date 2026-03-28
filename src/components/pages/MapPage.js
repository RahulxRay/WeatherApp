import { Map as IconMap } from 'lucide-react';

const MapPage = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center py-5 px-4">
      <div className="stub-icon mb-3"><IconMap /></div>
      <h2 className="fw-bold mb-2" style={{ fontSize: '1.3rem', color: '#1a2a3a' }}>Weather Map</h2>
      <p className="small text-secondary">Interactive weather map coming soon.</p>
      <p className="mt-2 text-secondary" style={{ fontSize: '0.78rem', opacity: 0.6 }}>
        Will show radar, pressure, and temperature overlays.
      </p>
    </div>
  );
};

export default MapPage;
