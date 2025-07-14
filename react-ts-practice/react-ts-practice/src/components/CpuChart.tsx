import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function CpuChart() {
  const [data, setData] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState(0);
  const [paused, setPaused] = useState(false);
  const [useTimeLabels, setUseTimeLabels] = useState(false); // <- переключатель
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCpuLoad = async () => {
    try {
      const res = await fetch('/api/service/cpu/', {
        headers: {
          Authorization: 'Basic ' + btoa('cli:12344321'),
        },
      });

      if (!res.ok) throw new Error('Ошибка запроса');

      const text = await res.text();
      const value = parseInt(text);
      const now = format(new Date(), 'HH:mm:ss');

      setTotal((t) => t + 1);
      setTimestamps((prev) => [...prev, now]);

      if (value === 0) {
        setErrors((e) => e + 1);
        setData((prev) => [...prev, prev.at(-1) ?? 0]);
      } else {
        setData((prev) => [...prev, value]);
      }
    } catch {
      setTotal((t) => t + 1);
      setErrors((e) => e + 1);
      setTimestamps((prev) => [...prev, format(new Date(), 'HH:mm:ss')]);
      setData((prev) => [...prev, prev.at(-1) ?? 0]);
    }
  };

  useEffect(() => {
    if (!paused && !intervalRef.current) {
      intervalRef.current = setInterval(fetchCpuLoad, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [paused]);

  const handlePause = () => {
    setPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleResume = () => {
    setPaused(false);
  };

  const handleReset = () => {
    setData([]);
    setTimestamps([]);
    setTotal(0);
    setErrors(0);
    setPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(fetchCpuLoad, 5000);
  };

  const toggleLabels = () => {
    setUseTimeLabels((prev) => !prev);
  };

  const chartData = {
    labels: timestamps.map(String),
    datasets: [
      {
        label: 'CPU %',
        data,
        borderColor: 'teal',
        backgroundColor: 'rgba(0, 128, 128, 0.2)',
        pointRadius: 4,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: string | number) => `${value}%`,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) => {
            const index = tooltipItems[0].dataIndex;
            return `Время: ${timestamps[index]}`;
          },
          label: (tooltipItem: any) => `CPU: ${tooltipItem.formattedValue}%`,
        },
      },
    },
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>📈 График загруженности процессора</h2>

      <Line data={chartData} options={chartOptions} />

      <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
        Всего запросов: {total}
        <br />
        Процент ошибок: {total === 0 ? '0.0' : ((errors / total) * 100).toFixed(1)}%
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button onClick={handlePause} disabled={paused}>⏸️ Пауза</button>
        <button onClick={handleResume} disabled={!paused}>▶️ Продолжить</button>
        <button onClick={handleReset}>🔄 Сброс</button>
        <button onClick={toggleLabels}>
          {useTimeLabels ? '🔢 Переключить подписи (№)' : '⏱️ Переключить подписи (Время)'}
        </button>
      </div>
    </div>
  );
}
