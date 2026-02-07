import { BrowserRouter, Routes, Route } from "react-router-dom";

import RolePage from "./pages/RolePage";
import PatientForm from "./pages/PatientForm";
import StaffDashboard from "./pages/StaffDashboard";
import ServicePage from "./pages/ServicePage";
import TokenPage from "./pages/TokenPage";
import LiveQueue from "./pages/LiveQueue";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RolePage />} />
        <Route path="/patient" element={<PatientForm />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/service" element={<ServicePage />} />
        <Route path="/token" element={<TokenPage />} />
        <Route path="/queue" element={<StaffDashboard />} />
        <Route path="/livequeue" element={<LiveQueue />} />

      </Routes>
    </BrowserRouter>
  );
}
