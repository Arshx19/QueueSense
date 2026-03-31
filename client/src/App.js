import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Settings from "./pages/settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/settings" element={<Settings/>}/>
      </Routes>
    </Router>
  );
}

export default App;