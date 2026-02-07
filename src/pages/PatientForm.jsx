import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PatientForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  function handleContinue() {
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

      <button onClick={handleContinue}>
        Continue →
      </button>
    </div>
  );
}
