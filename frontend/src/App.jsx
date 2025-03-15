import Login from "./components/Login"; // Import the Login component
import SkillExchange from "./pages/SkillExchange"; // Import the SkillExchange component
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import the Router, Routes, and Route components from react-router-dom
import Signup from "./components/Signup"; // Import the Signup component
import ChatPage from "./pages/Messaging"; // Import the MessagingScheduling component
import Dashboard from "./components/Dashboard";
import LogoutButton from "./components/Logout";
import ProfileButton from "./components/Profile";
import LandingPage from "./pages/Landing";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Logout" element={<LogoutButton />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/skill-exchange" element={<SkillExchange />} />
        <Route path="/message" element={<ChatPage/>} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
