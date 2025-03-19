import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
      </Routes>
    </Router>
  );
}

export default App;
