import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { MessageCircle, Calendar, User, Send } from "lucide-react";
import { sendSMS } from "@/lib/sms";


export default function ChatPage() {
  // State for managing chat messages and user input
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { sender: "user", text: "Hello, I have a question about the session!" },
    { sender: "admin", text: "Sure, how can I assist you?" },
  ]);
  const [feedback, setFeedback] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { sender: "user", text: message }]);
      setMessage(""); // Clear the input field after sending
    }
  };

  // Handle scheduling the session
  const handleConfirmSchedule = async () => {
    if (scheduledDate) {
        alert(`Session scheduled for ${scheduledDate}`);

        // Replace with user's phone number (could be from user state or auth)
        const userPhoneNumber = "+254736131740";  
        const message = `Your Skillbloom session has been scheduled for ${scheduledDate}. Thank you!`;

        await sendSMS(userPhoneNumber, message);
    }
};

  // Handle feedback submission
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  return (
    <div className="min-h-screen bg-black p-6 flex flex-col items-center text-white font-mono overflow-hidden relative">
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
          onClick={() => window.location.href = "/profile"} // Redirect to profile page
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
            {/* Chat messages */}
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
              onChange={(e) => setMessage(e.target.value)} // Update message input
              style={{ color: 'white', backgroundColor: '#2d2d2d' }} // Add color to make the text visible
            />
            <Button
              className="bg-purple-500 hover:bg-purple-400 text-white py-2 px-4 rounded-lg"
              onClick={handleSendMessage} // Handle send message
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

            {/* Feedback Section */}
            <div className="mt-6 text-gray-300">
              <h3 className="text-xl font-semibold mb-3">Feedback</h3>
              <textarea
                className="w-full p-3 bg-gray-850 border border-gray-700 text-white rounded-lg"
                rows="4"
                placeholder="Provide feedback about your session..."
                value={feedback}
                onChange={handleFeedbackChange} // Handle feedback text change
                style={{ color: 'white', backgroundColor: '#2d2d2d' }} // Add color to make text visible in feedback section
              ></textarea>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Input
              className="bg-gray-850 border-gray-700 text-white rounded-lg flex-1"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)} // Handle date input
            />
            <Button
              className="bg-purple-500 hover:bg-purple-400 text-white py-2 px-4 rounded-lg"
              onClick={handleConfirmSchedule} // Confirm scheduling
            >
              Confirm
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
