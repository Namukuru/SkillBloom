import Navbar from "@/components/Navbar";
import React from "react";
import { FaUsers, FaChalkboardTeacher, FaRocket, FaStar, FaExchangeAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="bg-gray-900 text-white">
      <Navbar />
      
      {/* Compact Hero Section */}
      <section className="min-h-[50vh] flex flex-col md:flex-row">
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 bg-gradient-to-br from-purple-900 to-purple-700 p-8 md:p-10 flex flex-col justify-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="block text-purple-300">SkillBloom</span>
            <span className="text-xl md:text-2xl font-normal text-gray-200">Where Knowledge Meets Opportunity</span>
          </h1>
          <motion.a
            href="/Login"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="self-start px-6 py-2 mt-4 bg-white text-purple-800 font-bold rounded-lg shadow-lg text-sm md:text-base"
          >
            Start Your Journey
          </motion.a>
        </motion.div>
        
        <div className="md:w-1/2 bg-gray-800 p-6 md:p-8 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative w-full max-w-md"
          >
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
            <div className="relative space-y-4 bg-gray-900 bg-opacity-80 backdrop-blur-sm p-6 rounded-xl border border-purple-900">
              <h3 className="text-xl font-bold text-purple-300">Today's Featured Skills</h3>
              <ul className="space-y-3">
                {['UI/UX Design', 'Blockchain Basics', 'Public Speaking'].map((skill, i) => (
                  <motion.li 
                    key={i}
                    initial={{ x: 20 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center text-sm md:text-base"
                  >
                    <FaExchangeAlt className="text-purple-500 mr-2" size={14} />
                    <span>{skill}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-400"
        >
          The SkillBloom Difference
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <FaUsers size={32} />, title: "Community First", desc: "Learn with and from peers in our supportive network" },
            { icon: <FaChalkboardTeacher size={32} />, title: "Mentorship", desc: "Get guidance from experienced professionals" },
            { icon: <FaRocket size={32} />, title: "Accelerated Growth", desc: "Structured paths to quickly level up your skills" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              whileHover={{ y: -8 }}
              className="bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 border-purple-600"
            >
              <div className="text-purple-400 mb-3">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-300 text-sm md:text-base">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonial Mosaic */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-400"
          >
            Voices From Our Community
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: "Sarah K.", role: "Web Developer", quote: "Doubled my freelance rate after SkillBloom mentoring" },
              { name: "Miguel T.", role: "Data Scientist", quote: "Found my perfect study group in just 2 days" },
              { name: "Priya M.", role: "UX Designer", quote: "Landed 3 clients through community connections" },
              { name: "James L.", role: "Student", quote: "Went from beginner to job-ready in 6 months" },
              { name: "Aisha B.", role: "Product Manager", quote: "The skill swapping system is revolutionary" },
              { name: "David R.", role: "Teacher", quote: "Finally found a platform that values knowledge sharing" }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-gray-900 p-5 rounded-lg border-l-4 border-purple-500"
              >
                <div className="flex mb-2">
                  {[...Array(5)].map((_, star) => (
                    <FaStar key={star} className="text-purple-400 mr-1" size={14} />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-3 text-sm md:text-base">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-sm md:text-base">{testimonial.name}</p>
                  <p className="text-xs md:text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center bg-gradient-to-br from-purple-900 to-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to <span className="text-purple-300">Transform</span> Your Learning?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands who are accelerating their growth through community-powered education.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <motion.a
              href="/Login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg text-sm md:text-base"
            >
              Get Started Free
            </motion.a>
            <motion.a
              href="/about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-transparent border-2 border-purple-400 text-purple-300 font-bold rounded-lg text-sm md:text-base"
            >
              How It Works
            </motion.a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;