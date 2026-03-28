import { Navigation as IconNavigation } from 'lucide-react';

const ForecastButton = ({ card, onClick }) => {
  const { value, unit, label, subLabel, icon, arrowDeg, isArrow, isText, textColor, bgColor, hasDetail } = card;

  return (
    <div
      className={`metric-card ${hasDetail ? 'clickable' : ''} d-flex flex-column align-items-center justify-content-center text-center shadow-sm p-3 w-100`}
      style={{ backgroundColor: bgColor }}
      onClick={hasDetail ? onClick : undefined}
      role={hasDetail ? 'button' : undefined}
    >
      {isArrow && (
        <>
          <span className="card-arrow d-inline-flex mb-1" style={{ transform: `rotate(${arrowDeg}deg)` }}>
            <IconNavigation />
          </span>
          <div className="card-label fw-bold mt-2">{label}</div>
        </>
      )}

      {isText && !isArrow && (
        <>
          <div className="card-text-value fw-bold" style={{ color: textColor || '#1a4a1a' }}>{value}</div>
          <div className="card-label fw-bold mt-2">{label}</div>
        </>
      )}

      {!isArrow && !isText && (
        <>
          {icon && <div className="card-icon lh-1">{icon}</div>}
          <div className="card-value fw-bold">
            {value}<span className="card-unit fw-medium">{unit}</span>
          </div>
          {subLabel && <div className="card-sublabel small mt-1">{subLabel}</div>}
          <div className="card-label fw-bold mt-2">{label}</div>
        </>
      )}
    </div>
  );
};

export default ForecastButton;
