import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PatientForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  async function handleContinue() {
  const phoneRegex = /^[0-9]{10}$/;

  if (!phoneRegex.test(phone)) {
    setError("Invalid phone number. Please enter 10 digits.");
    return;
  }

  // --- NEW BACKEND CONNECTION ---
  try {
    const response = await fetch("http://localhost:5000/api/token/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }), // Sending data to your index.js
    });

    if (!response.ok) {
      setError("Failed to register. Please try again.");
      return;
    }

    const data = await response.json();
    
    // Pro-tip: Store the ID returned by the backend 
    // so you can use it on the /service page
    localStorage.setItem("currentPatientId", data.token_id);

    setError("");
    navigate("/service");
  } catch (err) {
    setError("Cannot connect to server. Is it running on port 5173?");
  }
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