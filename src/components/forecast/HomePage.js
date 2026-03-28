import ForecastButton from './ForecastButton';
import { AlertTriangle as IconAlertTriangle } from 'lucide-react';

const WarningBanner = ({ warning }) => {
  if (!warning?.active) return null;
  return (
    <div className="warning-banner rounded-4 px-3 py-2 mb-2 d-flex align-items-center justify-content-between flex-shrink-0">
      <div>
        <div className="warning-title fw-bold text-uppercase small">{warning.level} WEATHER WARNING</div>
        <div className="warning-sub small mt-1">{warning.type}</div>
      </div>
      <span className="warning-icon d-flex align-items-center"><IconAlertTriangle /></span>
    </div>
  );
};

const HomePage = ({ warning, cards, onCardClick }) => {
  return (
    <div>
      <WarningBanner warning={warning} />
      <div className="row g-2">
        {cards.map(card => (
          <div key={card.id} className="col-6">
            <ForecastButton card={card} onClick={() => onCardClick(card)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
