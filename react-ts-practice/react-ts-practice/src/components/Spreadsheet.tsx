import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'spreadsheet-data';

type CellData = string[][];
const defaultData: CellData = Array.from({ length: 5 }, () =>
  Array.from({ length: 5 }, () => '')
);

export default function Spreadsheet() {
  const [data, setData] = useState<CellData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultData;
  });

  const [editing, setEditing] = useState<{ row: number; col: number } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateCell = (row: number, col: number, value: string) => {
    setData(prev => {
      const copy = prev.map(row => [...row]);
      copy[row][col] = value;
      return copy;
    });
  };

  const addRow = () => {
    setData(prev => [...prev, Array(prev[0].length).fill('')]);
  };

  const removeRow = () => {
    if (data.length <= 1) return alert('Нельзя удалить последнюю строку');
    const lastRow = data[data.length - 1];
    if (lastRow.some(val => val !== '')) {
      if (!confirm('Удаляемая строка содержит данные. Удалить?')) return;
    }
    setData(prev => prev.slice(0, -1));
  };

  const addCol = () => {
    setData(prev => prev.map(row => [...row, '']));
  };

  const removeCol = () => {
    if (data[0].length <= 1) return alert('Нельзя удалить последний столбец');
    const lastColData = data.map(row => row.at(-1));
    if (lastColData.some(val => val !== '')) {
      if (!confirm('Удаляемый столбец содержит данные. Удалить?')) return;
    }
    setData(prev => prev.map(row => row.slice(0, -1)));
  };

  const handleDoubleClick = (row: number, col: number) => {
    setEditing({ row, col });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, row: number, col: number) => {
    updateCell(row, col, e.target.value);
    setEditing(null);
  };

  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <h2>Электронная таблица:</h2>
      <div style={{ display: 'inline-block', position: 'relative' }}>
        <table
          style={{
            borderCollapse: 'collapse',
            margin: '1rem auto',
            background: 'white'
          }}
        >
          <tbody>
            {data.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    style={{
                      border: '1px solid black',
                      width: '80px',
                      height: '40px',
                      padding: 0
                    }}
                    onDoubleClick={() => handleDoubleClick(rIdx, cIdx)}
                  >
                    {editing?.row === rIdx && editing?.col === cIdx ? (
                      <input
                        type="text"
                        autoFocus
                        defaultValue={cell}
                        onBlur={(e) => handleBlur(e, rIdx, cIdx)}
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          outline: 'none',
                          textAlign: 'center'
                        }}
                      />
                    ) : (
                      <div style={{ lineHeight: '40px' }}>{cell}</div>
                    )}
                  </td>
                ))}
                {}
                {rIdx === Math.floor(data.length / 2) && (
                  <td rowSpan={data.length} style={{ border: 'none', verticalAlign: 'middle' }}>
                    <div>
                      <button onClick={addCol} style={buttonStyle}>+</button>
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                      <button onClick={removeCol} style={buttonStyle}>−</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {}
            <tr>
              <td colSpan={data[0].length} style={{ border: 'none', textAlign: 'center' }}>
                <button onClick={addRow} style={buttonStyle}>+</button>
                <button onClick={removeRow} style={{ ...buttonStyle, marginLeft: '1rem' }}>−</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: '0.4rem 0.8rem',
  fontSize: '1.2rem',
  cursor: 'pointer',
  borderRadius: '5px',
  border: '1px solid gray',
  backgroundColor: 'white',
};
