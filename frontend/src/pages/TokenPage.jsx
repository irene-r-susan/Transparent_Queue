import { useNavigate } from "react-router-dom";

export default function TokenPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Your Token is Generated 🎫</h2>

      <h1>Token #D12</h1>
      <p>Estimated Wait Time: 25 minutes</p>

      <button onClick={() => navigate("/queue")}>
        View Live Queue
      </button>
    </div>
  );
}