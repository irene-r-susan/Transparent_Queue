import { useNavigate } from 'react-router-dom';
import patientLogo from '../assets/patient_logo.jpeg';
import staffLogo from '../assets/staff_logo.jpeg';

function RolePage() {
  const navigate = useNavigate();

  return (
    <div className="whole">
       <div className="page">
        <h1>I am</h1>
      <div className="card">
        <div className="identity-card" onClick={() => navigate('/patient')}>
          <img className="patient-logo" src={patientLogo} alt="patientlogo" />
          <p className="title">A Patient</p>
        </div>
        <div className="identity-card" onClick={() => navigate('/staff')}>
          <img className="staff-logo" src={staffLogo} alt="stafflogo" />
          <p className="title">A Staff</p>
        </div>
      </div>
    </div>
    </div>
    
  );
}

export default RolePage;
