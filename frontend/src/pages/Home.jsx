import Navbar from "@/components/Navbar";
import React from "react";
import { FaUsers, FaChalkboardTeacher, FaRocket, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-r from-purple-600 to-purple-800 py-20 text-center shadow-2xl"
        >
          <h1 className="text-6xl font-extrabold drop-shadow-lg">
            Welcome to SkillBloom
          </h1>
          <p className="mt-6 text-xl text-gray-200 max-w-2xl mx-auto">
            A platform where learning and teaching come together. Grow your skills, share your knowledge, and connect with a global community.
          </p>
        </motion.div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold text-center text-purple-400"
          >
            What We Offer
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: <FaUsers size={50} />, title: "Global Network", desc: "Connect with learners and professionals worldwide." },
              { icon: <FaChalkboardTeacher size={50} />, title: "Skill Swap", desc: "Teach what you know and learn what you don’t." },
              { icon: <FaRocket size={50} />, title: "Fast Growth", desc: "Achieve your goals with personalized learning paths." },
            ].map((item, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.3 }}
                whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" }}
                className="p-8 bg-gray-800 rounded-lg shadow-lg text-center hover:shadow-xl transition-all"
              >
                <div className="text-purple-400">{item.icon}</div>
                <h3 className="text-2xl font-semibold mt-6">{item.title}</h3>
                <p className="mt-4 text-gray-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-gray-800 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl font-bold text-center text-purple-400"
            >
              What Our Users Say
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {[
                { name: "Alice Johnson", role: "Graphic Designer", testimonial: "SkillBloom helped me connect with amazing mentors who guided me to improve my design skills. Highly recommended!" },
                { name: "John Smith", role: "Software Developer", testimonial: "I’ve learned so much from the community. It’s a great platform for both teaching and learning." },
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.3 }}
                  className="p-8 bg-gray-900 rounded-lg shadow-lg"
                >
                  <div className="flex items-center">
                    <div className="text-purple-400">
                      <FaStar size={24} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <p className="text-gray-400">{item.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-300">{item.testimonial}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;