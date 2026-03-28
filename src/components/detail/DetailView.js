import DailyForecast from '../forecast/DailyForecast';
import LineChart from './LineChart';
import { CloudRain as IconRain } from 'lucide-react';

const DetailView = ({ metric, onBack, daily, hourly }) => {
  return (
    <div className="pb-1">

      <div className="d-flex align-items-center gap-3 mb-3">
        <button className="back-btn btn rounded-pill px-3 py-1 small fw-semibold text-nowrap border-0" onClick={onBack}>
          ← Go Back
        </button>
        <h2 className="fw-bold mb-0 fs-4">{metric.label}</h2>
      </div>

      <div className="bg-white rounded-4 p-3 d-flex align-items-center gap-3 mb-3 shadow-sm">
        <span className="detail-current-icon lh-1">{metric.icon || <IconRain />}</span>
        <div>
          <div className="fw-semibold" style={{ color: '#1a2a3a' }}>{metric.detailCondition}</div>
          <div className="detail-current-sub small mt-1">{metric.detailSub}</div>
        </div>
      </div>

      <div className="bg-white rounded-4 p-3 mb-3 shadow-sm">
        <div className="chart-container">
          <LineChart labels={hourly.time} values={hourly[metric.chartKey]} name={metric.chartLabel} />
        </div>
      </div>

      <div>
        <div className="daily-section-label text-uppercase fw-semibold small mb-2">Daily Forecast</div>
        <DailyForecast daily={daily} />
      </div>

    </div>
  );
};

export default DetailView;
