const SettingsPage = ({ settings, onSettingsChange }) => {
  const { tempUnit, speedUnit, notifications, gps } = settings;

  const unitBtnStyle = {
    background: 'none', border: '1px solid #dce4ef',
    borderRadius: '8px', padding: '4px 12px',
    fontSize: '0.82rem', cursor: 'pointer', color: '#2050a0', fontWeight: '600',
  };

  return (
    <div className="py-1">
      <div className="fw-bold mb-4" style={{ fontSize: '1.1rem', color: '#1a2a3a' }}>Settings</div>

      <div className="mb-4">
        <div className="settings-section-label text-uppercase fw-semibold small mb-2">Units</div>
        <div className="bg-white rounded-4 px-3 py-3 d-flex justify-content-between align-items-center mb-1 shadow-sm">
          <span style={{ color: '#1a2a3a' }}>Temperature</span>
          <button style={unitBtnStyle} onClick={() => onSettingsChange('tempUnit', tempUnit === 'C' ? 'F' : 'C')}>
            °{tempUnit} / °{tempUnit === 'C' ? 'F' : 'C'}
          </button>
        </div>
        <div className="bg-white rounded-4 px-3 py-3 d-flex justify-content-between align-items-center mb-1 shadow-sm">
          <span style={{ color: '#1a2a3a' }}>Wind Speed</span>
          <button style={unitBtnStyle} onClick={() => onSettingsChange('speedUnit', speedUnit === 'mph' ? 'km/h' : 'mph')}>
            {speedUnit}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="settings-section-label text-uppercase fw-semibold small mb-2">Preferences</div>
        <div className="bg-white rounded-4 px-3 py-3 d-flex justify-content-between align-items-center mb-1 shadow-sm">
          <span style={{ color: '#1a2a3a' }}>Warning Notifications</span>
          <div className={`settings-toggle ${notifications ? '' : 'off'}`} onClick={() => onSettingsChange('notifications', !notifications)} />
        </div>
        <div className="bg-white rounded-4 px-3 py-3 d-flex justify-content-between align-items-center mb-1 shadow-sm">
          <span style={{ color: '#1a2a3a' }}>Auto GPS Location</span>
          <div className={`settings-toggle ${gps ? '' : 'off'}`} onClick={() => onSettingsChange('gps', !gps)} />
        </div>
      </div>

      <div className="mb-4">
        <div className="settings-section-label text-uppercase fw-semibold small mb-2">About</div>
        <div className="bg-white rounded-4 px-3 py-3 d-flex justify-content-between align-items-center mb-1 shadow-sm">
          <span style={{ color: '#1a2a3a' }}>App Version</span>
          <span className="small" style={{ color: '#5a6a7a' }}>1.0.0</span>
        </div>
        <div className="bg-white rounded-4 px-3 py-3 d-flex justify-content-between align-items-center mb-1 shadow-sm">
          <span style={{ color: '#1a2a3a' }}>Data Source</span>
          <span className="small" style={{ color: '#5a6a7a' }}>Open-Meteo</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
