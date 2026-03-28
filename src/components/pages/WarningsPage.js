import { CheckCircle as IconCheckCircle } from 'lucide-react';

const LEVEL_COLORS = { YELLOW: '#f5c800', AMBER: '#f58000', RED: '#e02020' };

const MOCK_WARNINGS = [
  { level: 'YELLOW', type: 'Thunderstorms', area: 'South West England',   valid: 'Until 23:59 today',          detail: 'Isolated heavy thunderstorms possible, with lightning and localised flooding.' },
  { level: 'YELLOW', type: 'Wind',          area: 'Devon & Cornwall',     valid: 'Tomorrow 06:00 – 18:00',     detail: 'Gusts of 50–60mph likely during the morning. Some disruption to travel expected.' },
];

const WarningsPage = () => {
  return (
    <div className="py-1">
      <div className="fw-bold mb-3" style={{ fontSize: '1.1rem', color: '#1a2a3a' }}>Active Weather Warnings</div>

      {MOCK_WARNINGS.length === 0 && (
        <div className="d-flex flex-column align-items-center justify-content-center text-center py-5 px-4">
          <div className="stub-icon mb-3"><IconCheckCircle /></div>
          <h2 className="fw-bold mb-2" style={{ fontSize: '1.3rem', color: '#1a2a3a' }}>No Active Warnings</h2>
          <p className="small text-secondary">There are currently no weather warnings for your area.</p>
        </div>
      )}

      {MOCK_WARNINGS.map((w, i) => (
        <div key={i} className="bg-white rounded-4 p-3 mb-2 shadow-sm d-flex gap-3 align-items-start">
          <div className="warning-dot" style={{ backgroundColor: LEVEL_COLORS[w.level] ?? '#ccc' }} />
          <div className="flex-grow-1">
            <div className="fw-bold small" style={{ color: '#1a2a3a' }}>{w.level} WARNING — {w.type}</div>
            <div className="small text-secondary mt-1">{w.area}</div>
            <div className="small text-secondary mt-1">{w.detail}</div>
            <div className="warning-card-meta small mt-1">{w.valid}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WarningsPage;
