import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Settings from "./pages/settings";
import QueuePage from "./pages/QueuePage";
import PublicDisplay from "./pages/PublicDisplay";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/display" element={<PublicDisplay />} />
      </Routes>
    </Router>
  );
}

export default App;