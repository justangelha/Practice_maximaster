import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RandomColor from './components/RandomColor';
import OrderForm from './components/OrderForm';
import ProductTable from './components/ProductTable';
import CpuChart from './components/CpuChart';
import Spreadsheet from './components/Spreadsheet'; // ✅ импорт новой таблицы

function App() {
  return (
    <Router>
      <nav style={{
        textAlign: 'center',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <Link to="/color">🎨 Случайный цвет</Link>
        <Link to="/order">📦 Оформление заказа</Link>
        <Link to="/products">📝 Таблица товаров</Link>
        <Link to="/cpu">📈 Загрузка CPU</Link>
        <Link to="/spreadsheet">📋 Электронная таблица</Link> {}
      </nav>

      <Routes>
        <Route path="/color" element={<RandomColor />} />
        <Route path="/order" element={<OrderForm />} />
        <Route path="/products" element={<ProductTable />} />
        <Route path="/cpu" element={<CpuChart />} />
        <Route path="/spreadsheet" element={<Spreadsheet />} /> {}
        <Route path="*" element={<div style={{ textAlign: 'center', marginTop: '2rem' }}>Выберите задание в меню ↑</div>} />
      </Routes>
    </Router>
  );
}

export default App;
