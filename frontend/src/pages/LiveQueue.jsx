// import { useLocation } from "react-router-dom";

// export default function LiveQueue() {
//   const location = useLocation();
//   const { department } = location.state || {}; // get department from navigation state

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h2>Live Queue</h2>
//       {department ? (
//         <p>Showing queue for: <strong>{department}</strong></p>
//       ) : (
//         <p>No department selected</p>
//       )}
//       <h2>Total no of people in queue: 12</h2>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

// 1. Initialize the socket outside the component to prevent multiple connections
const socket = io("http://localhost:5050");

export default function LiveQueue() {
  const location = useLocation();
  const { department, serviceId } = location.state || {}; 
  
  // 2. Add these state variables for error detection and data
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [nowCalling, setNowCalling] = useState(null);

  useEffect(() => {
    // 3. Connection Monitor Logic
    function onConnect() {
      setIsConnected(true);
      console.log("Connected to Backend!");
      if (serviceId) socket.emit("join_department", serviceId);
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("Disconnected from Backend!");
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // 4. Listen for backend events
    socket.on("token_called", (data) => {
      setNowCalling(data); 
    });

    // Cleanup when page is closed
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off("token_called");
    };
  }, [serviceId]);

  return (
    <div style={{ textAlign: "center", fontFamily: "sans-serif" }}>
      
      {/* 5. THE VISUAL ERROR DETECTOR */}
      <div style={{ 
        padding: '10px', 
        fontSize: '14px',
        backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
        color: isConnected ? '#155724' : '#721c24',
        borderBottom: `1px solid ${isConnected ? '#c3e6cb' : '#f5c6cb'}`
      }}>
        {isConnected 
          ? "✅ Backend Connected (Ready for live updates)" 
          : "❌ BACKEND NOT CONNECTED - Check if server.js is running on port 5050"}
      </div>

      <div style={{ marginTop: "40px" }}>
        <h1>Live Queue</h1>
        {department ? (
          <p>Showing queue for: <strong>{department}</strong></p>
        ) : (
          <p>No department selected</p>
        )}
        
        <div style={{ 
            marginTop: "20px", 
            padding: "30px", 
            border: "2px solid #eee", 
            display: "inline-block",
            borderRadius: "15px"
        }}>
            {nowCalling ? (
                <div>
                    <small>NOW SERVING</small>
                    <h2 style={{ fontSize: "3rem", margin: "10px 0" }}>{nowCalling.token}</h2>
                </div>
            ) : (
                <p>Waiting for staff to call next patient...</p>
            )}
        </div>
      </div>
    </div>
  );
}