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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome!</h1>
      <h2>Select Department</h2>

      <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
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

      {/* Conditionally render the div with buttons */}
      {selectedDept && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ccc",
            display: "inline-block",
            borderRadius: "10px",
          }}
        >
          <h3>Options for {selectedDept}</h3>
          <button style={{ margin: "5px" }}  onClick={() => navigate('/token')}>Quick(5-10 mins)</button>
          <br/>
          <button style={{ margin: "5px" }}  onClick={() => navigate('/token')}>Normal(15-20 mins)</button>
          <br/>
          <button style={{ margin: "5px" }}  onClick={() => navigate('/token')}>Long Consultation(&gt; 20mins)</button>
        </div>
      )}
    </div>
  );
}
