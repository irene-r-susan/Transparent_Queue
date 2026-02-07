import { useNavigate } from "react-router-dom";

export default function TokenPage() {
  const navigate = useNavigate();

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",textAlign:"center",minHeight:"100vh",
      background:" radial-gradient(ellipse at center, #f0f4f8, rgba(0, 162, 255, 0.3), #e0f7fa)"}}>
       <div style={{ textAlign: "center", marginTop: "50px",padding:"35px",margin:"15px",borderRadius:"10px",
        boxShadow:"5px 5px 5px rgba(0,0,0,0.35)",backgroundColor:"#e3e2e1"}}>
<div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Your Token is Generated 🎫</h2>

      <h1>Token #D12</h1>
      <p>Estimated Wait Time: 25 minutes</p>
    </div>
    </div>
    </div>

  );
}