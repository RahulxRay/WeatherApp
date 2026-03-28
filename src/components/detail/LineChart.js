import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function LineChart({ labels, values, name }) {
  const canvasRef = useRef();
  const chartRef  = useRef(null);

  const formattedLabels = labels.map(t =>
    t.includes('T') ? t.split('T')[1].slice(0, 5) : t
  );

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: formattedLabels,
        datasets: [{
          label: name,
          data: values,
          borderColor: '#2060c0',
          backgroundColor: 'rgba(32, 96, 192, 0.08)',
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: '#2060c0',
          tension: 0.4,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(20, 40, 80, 0.88)',
            titleColor: '#90c0ff',
            bodyColor: '#fff',
            borderColor: 'rgba(32,96,192,0.3)',
            borderWidth: 1,
            padding: 10,
          },
        },
        scales: {
          x: {
            ticks: { color: '#6a7a8a', maxTicksLimit: 8, font: { size: 10 } },
            grid:  { color: 'rgba(0,0,0,0.05)' },
            border: { color: '#dce4ef' },
          },
          y: {
            ticks: { color: '#6a7a8a', font: { size: 10 } },
            grid:  { color: 'rgba(0,0,0,0.05)' },
            border: { color: '#dce4ef' },
          },
        },
      },
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [labels, values, name]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}
