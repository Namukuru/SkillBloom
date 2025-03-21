import Login from "./components/Login"; // Import the Login component
import SkillExchange from "./pages/SkillExchange"; // Import the SkillExchange component
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import the Router, Routes, and Route components from react-router-dom
import { AuthProvider } from "./context/AuthContext"; // Updated import path
import Signup from "./components/Signup"; // Import the Signup component
import ChatPage from "./pages/Messaging"; // Import the MessagingScheduling component
import Dashboard from "./components/Dashboard";
import LogoutButton from "./components/Logout";
import ProfileButton from "./components/Profile";
import LandingPage from "./pages/Landing";
import UserProfile from "./pages/UserProfile";
import AboutPage from "./pages/About";
import SessionsPage from "./pages/Sessions";

function App() {
  return (
    <Router>
      <AuthProvider>
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
          <Route path="/About" element={<AboutPage />} />
          <Route path="/sessions" element={<SessionsPage />} /> 
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
