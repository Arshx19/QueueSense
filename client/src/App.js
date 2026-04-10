import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Settings from "./pages/settings";
import Dashboard from "./pages/Dashboard";
import QueuePage from "./pages/QueuePage";
import PublicDisplay from "./pages/PublicDisplay";
import History from "./pages/History";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/display" element={<PublicDisplay />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;