import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IdentityCard from './identityCard';
import PatientPage from './PatientPage';
import StaffPage from './StaffPage';

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<IdentityCard />} />
        <Route path="/patient" element={<PatientPage />} />
        <Route path="/staff" element={<StaffPage />} />
      </Routes>
    </Router>
  );
}

export default App
