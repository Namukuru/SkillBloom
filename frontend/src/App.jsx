import Login from "./components/Login"; // Import the Login component
import SkillExchange from "./pages/SkillExchange"; // Import the SkillExchange component
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import the Router, Routes, and Route components from react-router-dom
import Signup from "./components/Signup"; // Import the Signup component
import Dashboard from "./components/Dashboard"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/skill-exchange" element={<SkillExchange />} />
      </Routes>
    </Router>
  );
}

export default App;
