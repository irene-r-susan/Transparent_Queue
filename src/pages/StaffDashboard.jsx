import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StaffDashboard() {
   const navigate = useNavigate()
   const handleDeptClick = (department) => {
    // Navigate to /livequeue and send department as state
    navigate('/livequeue', { state: { department } });
  };
  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",textAlign:"center",minHeight:"100vh",
      background:" radial-gradient(ellipse at center, #f0f4f8, rgba(0, 162, 255, 0.3), #e0f7fa)"}}>
         <div style={{ textAlign: "center", marginTop: "50px",padding:"10px",paddingLeft:"15px",margin:"15px",borderRadius:"10px",width:"300px",
        boxShadow:"5px 5px 5px rgba(0,0,0,0.35)",backgroundColor:"#e3e2e1"}}>
        <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Staff Dashboard</h2>
      <div style={{display:"flex",flexDirection:"column",alignItems:"left",justifyContent:"left"}}>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

  <div style={{ display: "flex", alignItems: "center" }}>
    <label style={{ width: "90px" }}>E-Mail:</label>
    <input
      style={{
        padding: "8px",
        borderRadius: "5px",
        border: "1px solid gray",
        flex: 1
      }}
      placeholder="eg: name@hospital.ac.in"
    />
  </div>
  <div style={{ display: "flex", alignItems: "center" }}>
    <label style={{ width: "90px" }}>Password:</label>
    <input
      type="password"
      style={{
        padding: "8px",
        borderRadius: "5px",
        border: "1px solid gray",
        flex: 1
      }}
      placeholder="Enter password"
    />
  </div>

</div>
        <h2 style={{fontSize:"large"}}> which department are you from : </h2>
         <button style={{ margin: "6px", padding:"9px" }} onClick={() => handleDeptClick('Cardiology')}>Cardiology</button>
        <br/>
        <button   style={{ margin: "6px", padding:"9px" }}
        onClick={() => handleDeptClick('Dentistry')}>Dentistry  </button>
        <br/>
        
        <button style={{ margin: "6px", padding:"9px" }} onClick={() => handleDeptClick('General')}>General</button>
      </div>
        
    </div>
    </div>
    </div>
  );
}
