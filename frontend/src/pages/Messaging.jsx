import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { MessageCircle, Calendar, User, Send, Clock } from "lucide-react";
import axios from "axios";
import { sendSMS } from "@/lib/sms";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { sender: "user", text: "Hello, I have a question about the session!" },
    { sender: "admin", text: "Sure, how can I assist you?" },
  ]);
  const [feedback, setFeedback] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(localStorage.getItem("selectedSkill") || "");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (!storedToken) {
      alert("Please log in to access this page");
      navigate("/login");
      return;
    }
    setToken(storedToken);
  }, [navigate]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { sender: "user", text: message }]);
      setMessage("");
    }
  };

  const handleConfirmSchedule = async () => {
    if (!token) {
      alert("Please log in to schedule a session");
      navigate("/login");
      return;
    }
  
    if (!scheduledDate || !scheduledTime) {
      alert("Please select both date and time");
      return;
    }
  
    try {
     
      const decodedToken = jwtDecode(token); 
      const userId = decodedToken.user_id;
      const userName = decodedToken.fullName || decodedToken.email || "User";
      console.log("Current Token:", token);
  
      if (!userId) {
        throw new Error("User ID not found in token");
      }
  
      const userPhoneNumber = prompt("Enter your phone number (07XXXXXXXX):");
      if (!userPhoneNumber?.match(/^07\d{8}$/)) {
        alert("❌ Invalid format! Please use 07XXXXXXXX (10 digits). Example: 0712345678");
        return;
      }
      
      if (!selectedSkill) {
        alert("Please select a skill first");
        return;
      }
  
      // Find matching teacher
      const matchResponse = await axios.post(
        "http://localhost:8000/api/find_match/",
        { learn: selectedSkill },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      const teacher = matchResponse.data.match?.name;
      const teacherId = matchResponse.data.match?.id;
      const teachSkill = matchResponse.data.match?.teaches;

      if (!teacher || !teacherId || !teachSkill) {
        alert("No available teachers for this skill");
        return;
      }
  
      // Prepare session data
      const sessionData = {
        user_id: userId,
        teacher_id: teacherId,
        learn_skill: selectedSkill,
        scheduled_date: `${scheduledDate}T${scheduledTime}:00`, // ISO format with seconds
        student_phone: userPhoneNumber,
        student_name: userName,
        status: "pending",
      };

      console.log("Sending session data:", sessionData); // Debug log

      // Save session
      const sessionResponse = await axios.post(
        "http://localhost:8000/api/scheduled-sessions/",
        sessionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      if (sessionResponse.status === 201 || sessionResponse.status === 200) {
        try {
          await sendSMS(userPhoneNumber, selectedSkill, userName, `${scheduledDate} at ${scheduledTime}`);
          alert("✓ Session booked! SMS confirmation sent");
          // Clear form after successful booking
          setScheduledDate("");
          setScheduledTime("");
          setFeedback("");
        } catch (smsError) {
          console.warn("SMS failed:", smsError);
          alert("✓ Session booked! (SMS not sent)");
        }
      } else {
        throw new Error(`Unexpected response status: ${sessionResponse.status}`);
      }
  
    } catch (error) {
      console.error("Booking error:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        
        if (error.response.status === 400) {
          alert(`Validation error: ${JSON.stringify(error.response.data)}`);
        } else if (error.response.status === 401) {
          alert("Session expired. Please login again.");
          navigate("/login");
        } else if (error.response.status === 404) {
          alert("Server error: Endpoint not found. Contact support.");
        } else if (error.response.data?.detail) {
          alert(`Error: ${error.response.data.detail}`);
        } else {
          alert(`Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        alert("No response from server. Check your connection.");
      } else {
        alert(`Request setup error: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-800 p-6 flex flex-col items-center text-white font-mono overflow-hidden relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto my-10"
        >
          <h1 className="text-5xl font-extrabold text-purple-400 tracking-widest">SkillBloom</h1>
          <p className="text-lg text-gray-300 mt-3 font-medium tracking-wide">
            Seamlessly Connect & Schedule Sessions
          </p>
          <Button
            className="mt-4 bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-lg"
            onClick={() => navigate("/profile")}
          >
            <User className="mr-2" /> View Profile
          </Button>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
          {/* Messaging Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900/80 p-6 rounded-xl shadow-xl border border-gray-700 flex-1 flex flex-col"
          >
            <h2 className="text-3xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <MessageCircle /> Chat
            </h2>
            <div className="flex-grow overflow-y-auto p-4 bg-gray-850 rounded-lg shadow-inner h-72">
              <div className="mt-4 text-gray-300 space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <p
                      className={`p-3 rounded-lg max-w-[80%] ${msg.sender === "user" ? "bg-purple-500 text-white" : "bg-gray-800"}`}
                    >
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Input
                className="bg-gray-850 border-gray-700 text-white rounded-lg flex-1"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ color: 'white', backgroundColor: '#2d2d2d' }}
              />
              <Button
                className="bg-purple-500 hover:bg-purple-400 text-white py-2 px-4 rounded-lg"
                onClick={handleSendMessage}
              >
                <Send className="mr-2" /> Send
              </Button>
            </div>
          </motion.div>

          {/* Scheduling Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900/80 p-6 rounded-xl shadow-xl border border-gray-700 flex-1 flex flex-col"
          >
            <h2 className="text-3xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <Calendar /> Schedule a Session
            </h2>
            <div className="flex-grow overflow-y-auto p-4 bg-gray-850 rounded-lg shadow-inner h-72">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                  <Input
                    type="date"
                    min={today}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                  <Input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Feedback</label>
                  <textarea
                    className="w-full p-3 bg-gray-800 border border-gray-700 text-white rounded-lg"
                    rows="4"
                    placeholder="Provide feedback about your session..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button
                className="w-full bg-purple-500 hover:bg-purple-400 text-white py-2 px-4 rounded-lg"
                onClick={handleConfirmSchedule}
              >
                <Clock className="mr-2" /> Confirm Schedule
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}