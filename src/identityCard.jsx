import { useNavigate } from 'react-router-dom';
import patientLogo from './assets/patient-logo-welcomepage.jpg'
import staffLogo from './assets/doctor-logo-welcomepage.jpg'

function IdentityCard(){
  const navigate=useNavigate();
  return(
    <div className="page">
      <div className="card">
      <div className="identity-card" onClick={()=>navigate('/patient')}>
      <img className="patient-logo" src={patientLogo} alt="patientlogo"></img>
      <p className="title">A Patient</p>
    </div>
    <div className="identity-card"onClick={() => navigate('/staff')}>
      <img className="patient-logo" src={staffLogo} alt="patientlogo"></img>
      <p className="title">A Staff</p>
    </div>
    </div>
    </div>
    
  );
}
export default IdentityCard;