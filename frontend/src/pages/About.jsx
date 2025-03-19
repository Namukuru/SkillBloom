import Navbar from "@/components/Navbar";
import React from "react";
import { FaUsers, FaChalkboardTeacher, FaRocket } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-purple-600 to-purple-800 py-20 text-center">
          <h1 className="text-5xl font-extrabold">Welcome to SkillBloom</h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
            A place where learning meets collaboration. Swap skills, connect with professionals, and grow together.
          </p>
        </div>

        {/* About Section */}
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h2 className="text-3xl font-bold text-purple-400">Why SkillBloom?</h2>
          <p className="mt-4 text-gray-300 leading-relaxed max-w-2xl mx-auto">
            SkillBloom is built on the belief that everyone has something valuable to share**. Whether you're an expert in coding, music, design, or fitness, there's always someone eager to learn from you.
          </p>
        </div>

        {/* Features Section */}
        <div className="bg-gray-800 py-12">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-purple-400">What We Offer</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              {[
                { icon: <FaUsers size={40} />, title: "Community", desc: "Join a network of learners and teachers worldwide." },
                { icon: <FaChalkboardTeacher size={40} />, title: "Teach & Learn", desc: "Share your knowledge or pick up new skills from others." },
                { icon: <FaRocket size={40} />, title: "Grow", desc: "Enhance your abilities while making valuable connections." },
              ].map((item, index) => (
                <div key={index} className="p-6 bg-gray-900 rounded-lg shadow-lg flex flex-col items-center">
                  <div className="text-purple-400">{item.icon}</div>
                  <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
                  <p className="mt-2 text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold text-purple-400">Join Us Today</h2>
          <p className="mt-2 text-gray-300">Start learning, teaching, and growing with SkillBloom.</p>
          <a
            href="/Login"
            className="mt-6 inline-block px-8 py-3 bg-purple-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-purple-600 transition-transform transform hover:scale-105"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;