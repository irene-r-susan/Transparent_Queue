
import { Link } from "react-router-dom";

function RolePage() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "50px",
          marginTop: "30px",
        }}
      >
        {/* Patient */}
        <Link to="/patient" style={{ textDecoration: "none", color: "black" }}>
          <img
            src="/patientlogo.jpeg"
            alt="Patient"
            style={{ width: "250px", cursor: "pointer", borderRadius: "10px" }}
          />
          <p>Patient</p>
        </Link>

        {/* Staff */}
        <Link to="/staff" style={{ textDecoration: "none", color: "black" }}>
          <img
            src="/stafflogo.jpeg"
            alt="Staff"
            style={{ width: "290px", cursor: "pointer", borderRadius: "10px",height:"250px" }}
          />
          <p>Staff</p>
        </Link>
      </div>
    </div>
  );
}

export default RolePage;
