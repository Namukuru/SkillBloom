import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login"; 
import SkillExchange from "./pages/SkillExchange";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/skill-exchange" element={<SkillExchange />} />
      </Routes>
    </Router>
  );
}

export default App;
