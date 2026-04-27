import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Settings from "./pages/settings";
import Dashboard from "./pages/Dashboard";
import QueuePage from "./pages/QueuePage";
import PublicDisplay from "./pages/PublicDisplay";
import History from "./pages/History";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";


function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Landing />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        {/* <Route path="/settings" element={<Settings />} /> */}
        <Route path="/user-dashboard" element={<UserDashboard />} />

        <Route path="/queue/:id/settings" element={<Settings />} />

        <Route path="/queue/:id" element={<QueuePage />} />

        <Route path="/display/:id" element={<PublicDisplay />} />
        <Route path="/history" element={<History />} />

      </Routes>
    </Router>
  );
}

export default App;