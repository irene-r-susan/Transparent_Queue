import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ServicePage() {
  const [selectedDept, setSelectedDept] = useState(null); // which department is clicked
  const navigate = useNavigate()

  // handle department click
  const handleDeptClick = (department) => {
    setSelectedDept(department); 
  };

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",textAlign:"center",minHeight:"100vh",
      background:" radial-gradient(ellipse at center, #f0f4f8, rgba(0, 162, 255, 0.3), #e0f7fa)"}}> 
       <div style={{ textAlign: "center", marginTop: "80px",padding:"35px",margin:"15px",borderRadius:"10px",
        boxShadow:"5px 5px 5px rgba(0,0,0,0.35)",backgroundColor:"#e3e2e1"
        }}>
 <div style={{ textAlign: "center", marginTop: "10px" }}>
      <h1 >Welcome!</h1>
      <h2>Select Department</h2>

      <ul style={{ listStyleType: "disc",  listStylePosition: "outside",
  paddingLeft: "70px",  
  textAlign: "left" }}>
        <li
          onClick={() => handleDeptClick("Cardiology")}
          style={{ cursor: "pointer", marginBottom: "10px" }}
        >
          Cardiology
        </li>
        <li
          onClick={() => handleDeptClick("Dentist")}
          style={{ cursor: "pointer", marginBottom: "10px" }}
        >
          Dentist
        </li>
        <li
          onClick={() => handleDeptClick("General")}
          style={{ cursor: "pointer", marginBottom: "10px" }}
        >
          General
        </li>
      </ul>

    </div>
    </div>
      {/* Conditionally render the div with buttons */}
      {selectedDept && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ccc",
            display: "inline-block",
            borderRadius: "10px",
            backgroundColor:"#e3e2e1"
            
          }}
        >
          <h3>Options for {selectedDept}</h3>
          <button style={{ margin: "10px",
          padding:"9px"
                      
           }}  onClick={() => navigate('/token')}>Quick(5-10 mins)</button>
          <br/>
          <button style={{ margin: "6px", padding:"9px" }}  onClick={() => navigate('/token')}>Normal(15-20 mins)</button>
          <br/>
          <button style={{ margin: "6px", padding:"9px" }}  onClick={() => navigate('/token')}>Long Consultation(&gt; 20mins)</button>
        </div>
      )}
    </div>
  );
}
