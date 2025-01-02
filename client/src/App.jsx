import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CafeDetail from './pages/CafeDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cafe/:id" element={<CafeDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
