import { useNavigate } from 'react-router-dom';
import patientLogo from '../assets/patient_logo.jpeg';
import staffLogo from '../assets/staff_logo.jpeg';
import Header from './Temp';
import Footer from "./Footer";

function RolePage() {
  const navigate = useNavigate();

  return (
    <div className="whole">
      <Header/>
       <div className="page">
        <h1 style={{textAlign:"center"}}>Primary Health Centre</h1>
        <h1 style={{fontFamily:"sans-serif",fontSize:"larger",fontWeight:"750"}}>Please select your role</h1>
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
    <Footer/>
    </div>
    
  );
}

export default RolePage;
