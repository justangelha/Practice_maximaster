import { useEffect, useState, useMemo } from 'react';

type Product = {
  name: string;
  price: number;
  quantity: number;
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadError, setLoadError] = useState('');
  const [filterError, setFilterError] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/service/products/', {
        headers: {
            Authorization: 'Basic ' + btoa('cli:12344321'),
        },
        });


        if (!res.ok) {
          throw new Error('Ошибка при загрузке данных');
        }

        const data = await res.json();
        setProducts(data);
      } catch (e) {
        setLoadError('Ошибка при загрузке данных');
      }
    };

    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    const minVal = parseInt(min);
    const maxVal = parseInt(max);

    if (min && isNaN(minVal)) {
      setFilterError('Неверное значение в поле "Цена от"');
      return [];
    }

    if (max && isNaN(maxVal)) {
      setFilterError('Неверное значение в поле "до"');
      return [];
    }

    setFilterError('');

    return products.filter((p) => {
      const aboveMin = minVal ? p.price >= minVal : true;
      const belowMax = maxVal ? p.price <= maxVal : true;
      return aboveMin && belowMax;
    });
  }, [products, min, max]);

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Таблица товаров</h2>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <label>
          Цена от:{' '}
          <input value={min} onChange={(e) => setMin(e.target.value)} style={{ width: '80px' }} />
        </label>
        <label>
          до:{' '}
          <input value={max} onChange={(e) => setMax(e.target.value)} style={{ width: '80px' }} />
        </label>
      </div>

      {loadError && <div style={{ color: 'red', marginBottom: '1rem' }}>{loadError}</div>}
      {filterError && <div style={{ color: 'red', marginBottom: '1rem' }}>{filterError}</div>}

      {filtered.length > 0 ? (
        <table border={1} cellPadding={6} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#eee' }}>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Количество</th>
              <th>Цена за единицу</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loadError && <div style={{ marginTop: '1rem' }}>Нет данных, попадающих под условие фильтра</div>
      )}
    </div>
  );
}
