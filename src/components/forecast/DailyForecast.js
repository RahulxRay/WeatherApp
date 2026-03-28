import { Sun as IconSun, CloudSun as IconSunCloud, Cloud as IconCloud, CloudFog as IconFog, CloudRain as IconRain, CloudSnow as IconSnow, CloudLightning as IconStorm } from 'lucide-react';

const WEATHER = {
  0:  <IconSun />,  1:  <IconSunCloud />, 2:  <IconSunCloud />, 3:  <IconCloud />,
  45: <IconFog />,  48: <IconFog />,
  51: <IconRain />, 53: <IconRain />,     55: <IconRain />,
  61: <IconRain />, 63: <IconRain />,     65: <IconRain />,
  71: <IconSnow />, 73: <IconSnow />,     75: <IconSnow />,
  80: <IconRain />, 95: <IconStorm />,    99: <IconStorm />,
};

const DailyForecast = ({ daily }) => {
  if (!daily) return null;
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="forecast-strip d-flex gap-2 overflow-x-auto pb-2">
      {daily.time.map((date, i) => {
        const isToday = date === todayStr;
        const icon    = WEATHER[daily.weather_code[i]] ?? <IconSun />;
        const label   = isToday
          ? 'Today'
          : new Date(date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short' });

        return (
          <div key={i} className={`forecast-day bg-white rounded-4 py-3 px-2 text-center shadow-sm ${isToday ? 'today' : ''}`}>
            <div className="forecast-day-label text-uppercase fw-semibold mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>{label}</div>
            <div className="forecast-day-icon lh-1 mb-1">{icon}</div>
            <div className="forecast-day-temp fw-bold" style={{ fontSize: '0.95rem' }}>{daily.temperature_2m_max[i]}°C</div>
          </div>
        );
      })}
    </div>
  );
};

export default DailyForecast;
