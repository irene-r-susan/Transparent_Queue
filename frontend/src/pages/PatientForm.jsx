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
      setError("Enter valid 10-digit phone number");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:5050/api/tokens/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            phone,
            service_id: 1,
            is_offline: true,
            lat: 0,
            lng: 0
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token_number);

      navigate("/service");

    } catch (err) {
      setError("Backend not reachable");
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h2>Patient Registration</h2>

      <input
        placeholder="Enter Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="Enter Phone"
        value={phone}
        onChange={(e)=>setPhone(e.target.value)}
      />

      <br/><br/>

      {error && <p style={{color:"red"}}>{error}</p>}

      <button onClick={handleContinue}>
        Continue →
      </button>
    </div>
  );
}
