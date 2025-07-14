import { useState } from 'react';

// Вынесенная функция генерации цвета
function getRandomColor(): string {
  const r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

export default function RandomColor() {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [color, setColor] = useState('#d6eaf8');

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f7f7f7',
      }}
    >
      <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2 style={{ marginBottom: '1rem' }}>Случайный цвет</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label>
            Ширина:{' '}
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              style={{ width: '100%', padding: '6px' }}
            />
          </label>

          <label>
            Высота:{' '}
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              style={{ width: '100%', padding: '6px' }}
            />
          </label>

          <button
            onClick={() => setColor(getRandomColor())}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #555',
              background: '#eee',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Случайный цвет
          </button>
        </div>

        <hr style={{ margin: '2rem 0' }} />

        <div
          style={{
            margin: '0 auto',
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: color,
            border: '1px solid #aaa',
            borderRadius: '8px',
            transition: '0.3s',
          }}
        />
      </div>
    </div>
  );
}
