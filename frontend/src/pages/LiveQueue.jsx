import { useLocation } from "react-router-dom";

export default function LiveQueue() {
  const location = useLocation();
  const { department } = location.state || {}; // get department from navigation state

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Live Queue</h2>
      {department ? (
        <p>Showing queue for: <strong>{department}</strong></p>
      ) : (
        <p>No department selected</p>
      )}
      <h2>Total no of people in queue: 12</h2>
    </div>
  );
}
