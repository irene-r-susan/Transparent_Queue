import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PatientForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function handleContinue() {
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      setError("Invalid phone number. Please enter 10 digits.");
      return;
    }

    
    setError("");
    navigate("/service");
  }

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Patient Registration</h2>

      <input
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Enter Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <br /><br />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleContinue}>
        Continue →  
      </button>
    </div>
  );
}
