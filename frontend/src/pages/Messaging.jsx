import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { MessageCircle, Calendar, User, Send } from "lucide-react";
import axios from "axios";
import { sendSMS } from "@/lib/sms";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { sender: "user", text: "Hello, I have a question about the session!" },
    { sender: "admin", text: "Sure, how can I assist you?" },
  ]);
  const [feedback, setFeedback] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(localStorage.getItem("selectedSkill") || "");
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (!storedToken) {
      alert("Please log in to access this page");
      navigate("/login");
      return;
    }
    setToken(storedToken);
    setIsLoading(false);
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
  
    if (!scheduledDate) {
      alert("Please select a date and time");
      return;
    }
  
    try {
      // Decode token to get user info
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.user_id;
      const userName = decodedToken.fullName || decodedToken.email || "User";
      console.log("Decoded token:", decodedToken);
  
      if (!userId) {
        throw new Error("User ID not found in token");
      }
  
      // Get phone number
      let userPhoneNumber = prompt("Enter phone number (+2547XXXXXXXX):");
      if (!userPhoneNumber?.match(/^\+2547\d{8}$/)) {
        alert("Invalid Kenyan phone format");
        return;
      }
  
      if (!selectedSkill) {
        alert("Please select a skill first");
        return;
      }
  
      // Find teacher match
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
      const skillId = matchResponse.data.match?.id;
      const teachSkill = matchResponse.data.match?.teaches;

      //const teachSkill = matchResponse.data.match?.selectedSkill; // Ensure this field exists in response
      console.log("Matched teacher:", teacher, teacherId, teachSkill);
      console.log(selectedSkill);
  
      if (!teacher || !teacherId || !teachSkill) {
        alert("No available teachers for this skill");
        return;
      }
  
      // Save session - Ensure correct field names
      const sessionData = {
        user_id: userId, // Corrected from "user"
        teacher_id: teacherId, // Corrected from "teach_skill"
        learn_skill: selectedSkill, // Corrected from skill ID to skill name
        scheduled_date: new Date(scheduledDate).toISOString(), // Format remains correct
        student_phone: userPhoneNumber, // Added correct field
        student_name: userName, // Added correct field
        status: "pending" // Ensure default status
      };
      
  
      console.log("📡 Sending request:", JSON.stringify(sessionData));
  
      const sessionResponse = await axios.post(
        "http://localhost:8000/api/scheduled-sessions/", // Corrected endpoint
        sessionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      // Check for successful creation
      if (sessionResponse.status === 201 || sessionResponse.data.status === "success") {
        try {
          // Send SMS
          await sendSMS(userPhoneNumber, selectedSkill, userName, scheduledDate);
          alert("✓ Session booked! SMS confirmation sent");
        } catch (smsError) {
          console.warn("SMS failed:", smsError);
          alert("✓ Session booked! (SMS not sent)");
        }
      } else {
        throw new Error("Failed to save session");
      }
  
    } catch (error) {
      console.error("Booking error:", error);
      if (error.response?.status === 404) {
        alert("Server error: Endpoint not found. Contact support.");
      } else if (error.response?.data?.detail) {
        alert(`Error: ${error.response.data.detail}`);
      } else {
        alert("Failed to schedule. Please try again.");
      }
    }
  };
  
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-800 p-6 flex flex-col items-center text-white font-mono overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900/50 to-black opacity-50 pointer-events-none"></div>

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
              <p className="text-gray-300">Plan your learning sessions effortlessly.</p>

              <div className="mt-6 text-gray-300">
                <h3 className="text-xl font-semibold mb-3">Feedback</h3>
                <textarea
                  className="w-full p-3 bg-gray-850 border border-gray-700 text-white rounded-lg"
                  rows="4"
                  placeholder="Provide feedback about your session..."
                  value={feedback}
                  onChange={handleFeedbackChange}
                  style={{ color: 'white', backgroundColor: '#2d2d2d' }}
                ></textarea>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Input
                className="bg-gray-850 border-gray-700 text-white rounded-lg flex-1"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
              <Button
                className="bg-purple-500 hover:bg-purple-400 text-white py-2 px-4 rounded-lg"
                onClick={handleConfirmSchedule}
              >
                Confirm
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}