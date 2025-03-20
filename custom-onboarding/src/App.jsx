import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import PageOne from './pages/Onboarding/PageOne';
import Admin from './pages/Admin';
import DataTable from './pages/DataTable';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageOne />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/data" element={<DataTable />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
