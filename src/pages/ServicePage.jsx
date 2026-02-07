import { useNavigate } from "react-router-dom";

export default function ServicePage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome!</h1>
      <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Select Department</h2>

      <button onClick={() => navigate("/token")}>
        Dentist (Quick Consultation)
      </button>

      <br /><br />

      <button onClick={() => navigate("/token")}>
        Cardiology (Long Consultation)
      </button>
    </div>
    </div>
    
  );
}
