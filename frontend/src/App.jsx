import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Correct import
import Login from "./components/Login";
import Signup from "./components/Signup";
import SkillExchange from "./pages/SkillExchange";
import ChatPage from "./pages/Messaging";
import Dashboard from "./components/Dashboard";
import LogoutButton from "./components/Logout";
import ProfileButton from "./components/Profile";
import LandingPage from "./pages/Landing";
import UserProfile from "./pages/UserProfile";
import AboutPage from "./pages/About";
import SessionsPage from "./pages/Sessions";
import HomePage from "./pages/Home";
import TransactionPage from "./components/TransactionPage";

function App() {
  return (
   
      <Router>
         <AuthProvider> {/* Wrap everything to persist auth state */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<LogoutButton />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/skill-exchange" element={<SkillExchange />} />
          <Route path="/message" element={<ChatPage />} />
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/transactions" element={<TransactionPage />} />
        </Routes>
        </AuthProvider>
      </Router>
    
  );
}

export default App;
