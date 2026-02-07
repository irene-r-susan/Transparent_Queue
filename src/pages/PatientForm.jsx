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
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",textAlign:"center",minHeight:"100vh",
      background:" radial-gradient(ellipse at center, #f0f4f8, rgba(0, 162, 255, 0.3), #e0f7fa)"
    }}>
       <div style={{ textAlign: "center", marginTop: "80px",padding:"35px",margin:"15px",borderRadius:"10px",
        boxShadow:"5px 5px 5px rgba(0,0,0,0.35)",backgroundColor:"#e3e2e1"
        }}>
      <h2>Patient Registration</h2>

      <input
      style={{padding:"5px"}}
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
      style={{padding:"5px"}}
        placeholder="Enter Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <br /><br />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
      style={{padding:"8px"}}
      onClick={handleContinue}>
      Continue →  
      </button>
    </div>
    </div>
   
  );
}
