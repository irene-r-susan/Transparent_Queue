import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StaffDashboard() {
   const navigate = useNavigate()
   const handleDeptClick = (department) => {
    // Navigate to /livequeue and send department as state
    navigate('/livequeue', { state: { department } });
  };
  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Staff Dashboard</h2>
      <div>
         <label>E-Mail:</label><br/>  
         <input placeholder="eg:name@hospital.ac.in"></input>
      </div>
      <div>
        <h2> which department are you from : </h2>
        <button  onClick={() => handleDeptClick('Dentistry')}>Dentistry  </button>
        <br/>
        <br/>
        <button onClick={() => handleDeptClick('Cardiology')}>Cardiology</button>
        <br/>
         <br/>
        <button onClick={() => handleDeptClick('General')}>General</button>
      </div>
    </div>
  );
}
