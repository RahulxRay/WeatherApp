import { useState } from 'react';
import './App.css';
import Geocoding from './components/search/Geocoding';
import HomePage from './components/forecast/HomePage';
import DetailView from './components/detail/DetailView';
import WarningsPage from './components/pages/WarningsPage';
import MapPage from './components/pages/MapPage';
import SettingsPage from './components/pages/SettingsPage';
import { Settings as IconSettings, Calendar as IconCalendar, AlertCircle as IconWarning, Map as IconMap, Sun as IconSun, CloudSun as IconSunCloud, Cloud as IconCloud, CloudFog as IconFog, CloudRain as IconRain, CloudLightning as IconStorm } from 'lucide-react';

const MOCK_WARNING = { level: 'YELLOW', type: 'Thunderstorms', active: true };

const MOCK_CURRENT = {
  temperature_2m: 14,
  apparent_temperature: 10,
  precipitation: 0.4,
  wind_speed_10m: 25,
  wind_direction_10m: 225,
  wind_gusts_10m: 32,
  weather_code: 61,
};

const MOCK_DAILY = {
  time: ['2026-03-25','2026-03-26','2026-03-27','2026-03-28','2026-03-29','2026-03-30','2026-03-31'],
  temperature_2m_max: [14, 17, 13, 9, 16, 18, 12],
  weather_code:       [61,  0, 63, 1,  2,  0, 61],
};

const MOCK_HOURLY = {
  time: Array.from({ length: 24 }, (_, i) => `2026-03-25T${String(i).padStart(2,'0')}:00`),
  temperature_2m:           [10,10,10,10,11,11,12,12,13,13,14,14,14,14,14,13,13,12,12,11,11,11,10,10],
  wind_speed_10m:            [20,20,21,22,23,24,25,25,26,25,24,23,22,21,20,20,21,22,23,24,24,23,22,21],
  precipitation_probability: [70,70,65,65,60,60,55,50,45,40,40,45,50,55,60,65,65,60,55,50,50,55,60,65],
};

const WEATHER = {
  0:  { label: 'Clear Sky',     icon: <IconSun />      },
  1:  { label: 'Mainly Clear',  icon: <IconSunCloud /> },
  2:  { label: 'Partly Cloudy', icon: <IconSunCloud /> },
  3:  { label: 'Overcast',      icon: <IconCloud />    },
  45: { label: 'Foggy',         icon: <IconFog />      },
  48: { label: 'Foggy',         icon: <IconFog />      },
  61: { label: 'Light Showers', icon: <IconRain />     },
  63: { label: 'Rain',          icon: <IconRain />     },
  65: { label: 'Heavy Rain',    icon: <IconRain />     },
  80: { label: 'Showers',       icon: <IconRain />     },
  95: { label: 'Thunderstorm',  icon: <IconStorm />    },
  99: { label: 'Thunderstorm',  icon: <IconStorm />    },
};

const NAV_ITEMS = [
  { key: 'settings',  Icon: IconSettings, label: 'Settings'  },
  { key: 'forecasts', Icon: IconCalendar, label: 'Forecasts' },
  { key: 'warnings',  Icon: IconWarning,  label: 'Warnings'  },
  { key: 'map',       Icon: IconMap,      label: 'Map'       },
];

const toF   = (c)   => Math.round(c * 9 / 5 + 32);
const toKmh = (mph) => Math.round(mph * 1.609);

const App = () => {
  const [activePage, setActivePage]           = useState('forecasts');
  const [detailMetric, setDetailMetric]       = useState(null);
  const [locationDisplay, setLocationDisplay] = useState('Tor Bay, England');
  const [settings, setSettings] = useState({
    tempUnit: 'C', speedUnit: 'mph', notifications: true, gps: false,
  });

  const T     = (c)   => settings.tempUnit  === 'F'    ? toF(c)     : c;
  const S     = (mph) => settings.speedUnit === 'km/h' ? toKmh(mph) : mph;
  const tUnit = `°${settings.tempUnit}`;
  const sUnit = settings.speedUnit;

  const cond = WEATHER[MOCK_CURRENT.weather_code] ?? { label: 'Unknown', icon: <IconRain /> };

  const metricCards = [
    { id: 'temperature', label: 'Temperature', value: `${T(MOCK_CURRENT.temperature_2m)}`, unit: tUnit, subLabel: `Feels like ${T(MOCK_CURRENT.apparent_temperature)}${tUnit}`, icon: cond.icon, bgColor: '#bdd9f2', hasDetail: true, chartKey: 'temperature_2m', chartLabel: `Temperature (${tUnit})`, detailCondition: `${T(MOCK_CURRENT.temperature_2m)}${tUnit} ${cond.label}`, detailSub: `Wind Chill: feels like ${T(MOCK_CURRENT.apparent_temperature)}${tUnit}` },
    { id: 'visibility',  label: 'Visibility',  value: 'Good', unit: '', subLabel: '', icon: null, bgColor: '#b2e8aa', hasDetail: false, isText: true, textColor: '#1a6a1a' },
    { id: 'windspeed',   label: 'Wind Speed',  value: `${S(MOCK_CURRENT.wind_speed_10m)}`, unit: sUnit, subLabel: '', icon: null, bgColor: '#f0e8a0', hasDetail: true, chartKey: 'wind_speed_10m', chartLabel: `Wind Speed (${sUnit})`, detailCondition: `${S(MOCK_CURRENT.wind_speed_10m)}${sUnit} South West`, detailSub: `Gusts up to ${S(MOCK_CURRENT.wind_gusts_10m)}${sUnit}` },
    { id: 'winddir',     label: 'Wind Southwest', value: '', unit: '', subLabel: '', icon: null, isArrow: true, arrowDeg: MOCK_CURRENT.wind_direction_10m, bgColor: '#d8c4f0', hasDetail: false },
    { id: 'swell',       label: 'Swell', value: '1.1', unit: 'm', subLabel: '', icon: null, bgColor: '#f4c4c4', hasDetail: true, chartKey: 'precipitation_probability', chartLabel: 'Swell Height (m)', detailCondition: '1.1m South Swell', detailSub: 'Period: 8 seconds' },
    { id: 'tide',        label: 'Tide',  value: '3.1', unit: 'm', subLabel: '', icon: null, bgColor: '#a8ecda', hasDetail: false },
  ];

  const displayHourly = {
    ...MOCK_HOURLY,
    temperature_2m: MOCK_HOURLY.temperature_2m.map(T),
    wind_speed_10m:  MOCK_HOURLY.wind_speed_10m.map(S),
  };

  const displayDaily = {
    ...MOCK_DAILY,
    temperature_2m_max: MOCK_DAILY.temperature_2m_max.map(T),
  };

  const handleCardClick    = (metric) => { if (metric.hasDetail) setDetailMetric(metric); };
  const handleBack         = ()       => setDetailMetric(null);
  const handleLocationSelect = (loc)  => setLocationDisplay([loc.name, loc.admin1].filter(Boolean).slice(0,2).join(', '));
  const handleNavClick     = (page)   => { setActivePage(page); setDetailMetric(null); };

  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'gps' && value === true) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setLocationDisplay(`GPS (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`),
          ()    => setLocationDisplay('GPS unavailable')
        );
      } else {
        setLocationDisplay('GPS not supported');
      }
    }
    if (key === 'gps' && value === false) setLocationDisplay('Tor Bay, England');
  };

  const activeWarning = settings.notifications ? MOCK_WARNING : null;

  const renderContent = () => {
    if (activePage === 'forecasts') {
      if (detailMetric) {
        const liveMetric = metricCards.find(c => c.id === detailMetric.id) ?? detailMetric;
        return <DetailView metric={liveMetric} onBack={handleBack} daily={displayDaily} hourly={displayHourly} />;
      }
      return <HomePage warning={activeWarning} cards={metricCards} onCardClick={handleCardClick} />;
    }
    if (activePage === 'warnings') return <WarningsPage warning={activeWarning} />;
    if (activePage === 'map')      return <MapPage />;
    if (activePage === 'settings') return <SettingsPage settings={settings} onSettingsChange={handleSettingsChange} />;
    return null;
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="app-shell d-flex flex-column position-relative overflow-hidden flex-shrink-0">

        <div className="search-wrapper flex-shrink-0" style={{ zIndex: 10 }}>
          <Geocoding sendData={handleLocationSelect} locationDisplay={locationDisplay} />
        </div>

        <div className="content-area flex-grow-1 overflow-y-auto d-flex flex-column">
          {renderContent()}
        </div>

        <nav className="bottom-nav flex-shrink-0 d-flex border-top">
          {NAV_ITEMS.map(nav => (
            <button
              key={nav.key}
              className={`nav-btn flex-fill border-0 bg-transparent d-flex flex-column align-items-center gap-1 ${activePage === nav.key ? 'active' : ''}`}
              onClick={() => handleNavClick(nav.key)}
            >
              <span className="nav-icon d-flex align-items-center justify-content-center"><nav.Icon /></span>
              <span className="nav-label fw-medium">{nav.label}</span>
            </button>
          ))}
        </nav>

      </div>
    </div>
  );
};

export default App;
