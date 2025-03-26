import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getValidToken } from "../utils/auth";
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4
    }
  },
  hover: {
    y: -5,
    transition: {
      duration: 0.2
    }
  }
};

const UserProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = await getValidToken();
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("http://127.0.0.1:8000/api/profile/", {
                    headers: { Authorization: `Bearer ${token}`},
                });
                setProfile(response.data);
            } catch (err) {
                console.error("API Error:", err);
                setError(err.response?.data?.error || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-800">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"
                ></motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center h-screen bg-gray-800"
            >
                <div className="text-red-500 text-lg p-4 bg-gray-700 rounded shadow">
                    {error}
                </div>
            </motion.div>
        );
    }

    if (!profile) return null;

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gray-800"
        >
            <Navbar isAuthenticated={true} />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-gray-700 rounded-xl shadow-md overflow-hidden"
                >
                    {/* Profile Header */}
                    <motion.div 
                        variants={itemVariants}
                        className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white"
                    >
                        <div className="flex flex-col md:flex-row items-center">
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="relative mb-4 md:mb-0 md:mr-6"
                            >
                                <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-purple-600">
                                    {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <motion.div 
                                    animate={{ 
                                        scale: [1, 1.1, 1],
                                        transition: { repeat: Infinity, duration: 2 }
                                    }}
                                    className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow"
                                >
                                    <div className="bg-green-500 rounded-full h-5 w-5"></div>
                                </motion.div>
                            </motion.div>
                            <div>
                                <motion.h1 
                                    initial={{ x: -20 }}
                                    animate={{ x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-2xl font-bold"
                                >
                                    {profile.fullName || 'Anonymous User'}
                                </motion.h1>
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-purple-200"
                                >
                                    {profile.email}
                                </motion.p>
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="mt-2 inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm"
                                >
                                    {capitalize(profile.proficiency)}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="p-6">
                        {/* Stats Section */}
                        <motion.div 
                            variants={containerVariants}
                            className="mb-8"
                        >
                            <motion.h2 
                                variants={itemVariants}
                                className="text-xl font-semibold text-white mb-4"
                            >
                                User Statistics
                            </motion.h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* XP Points Card */}
                                <motion.div 
                                    variants={cardVariants}
                                    whileHover="hover"
                                    className="bg-gray-600 p-4 rounded-lg border border-gray-500"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-medium text-gray-200">XP Points</h3>
                                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                                            Level {Math.floor(profile.xp_points / 100) || 1}
                                        </span>
                                    </div>
                                    <p className="text-3xl font-bold text-white">{profile.xp_points}</p>
                                    <div className="mt-2 w-full bg-gray-500 rounded-full h-2">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${profile.xp_points % 100}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="bg-purple-600 h-2 rounded-full" 
                                        ></motion.div>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-300">
                                        {100 - (profile.xp_points % 100)} XP to next level
                                    </p>
                                </motion.div>

                                {/* Credits Card */}
                                <motion.div 
                                    variants={cardVariants}
                                    whileHover="hover"
                                    className="bg-gray-600 p-4 rounded-lg border border-gray-500"
                                >
                                    <h3 className="font-medium text-gray-200 mb-2">Credits</h3>
                                    <motion.p 
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="text-3xl font-bold text-white"
                                    >
                                        {profile.credits || 0}
                                    </motion.p>
                                </motion.div>

                                {/* Badges Card */}
                                <motion.div 
                                    variants={cardVariants}
                                    whileHover="hover"
                                    className="bg-gray-600 p-4 rounded-lg border border-gray-500"
                                >
                                    <h3 className="font-medium text-gray-200 mb-2">Badges</h3>
                                    <p className="text-3xl font-bold text-white">{profile.badges?.length || 0}</p>
                                    <motion.div 
                                        variants={containerVariants}
                                        className="mt-2 flex flex-wrap gap-1"
                                    >
                                        {profile.badges?.slice(0, 3).map((badge, index) => (
                                            <motion.span 
                                                key={index}
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.1 }}
                                                className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full"
                                            >
                                                {badge.name}
                                            </motion.span>
                                        ))}
                                        {profile.badges?.length > 3 && (
                                            <motion.span 
                                                variants={itemVariants}
                                                className="text-xs px-2 py-1 bg-gray-400 text-gray-800 rounded-full"
                                            >
                                                +{profile.badges.length - 3} more
                                            </motion.span>
                                        )}
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Skills Section */}
                        {profile.skills?.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mb-8 pt-6 border-t border-gray-600"
                            >
                                <h2 className="text-xl font-semibold text-white mb-4">Your Skills</h2>
                                <motion.div 
                                    variants={containerVariants}
                                    className="flex flex-wrap gap-3"
                                >
                                    {profile.skills.map((skill, index) => (
                                        <motion.div 
                                            key={index}
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.05, backgroundColor: "#e9d5ff" }}
                                            className="bg-purple-100 px-4 py-2 rounded-full border border-purple-200"
                                        >
                                            <div className="flex items-center">
                                                <span className="text-purple-800 font-medium">{skill.name}</span>
                                                {skill.level && (
                                                    <motion.span 
                                                        whileHover={{ scale: 1.1 }}
                                                        className="ml-2 text-xs px-2 py-1 bg-purple-200 text-purple-800 rounded-full"
                                                    >
                                                        {skill.level}
                                                    </motion.span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Reviews Section */}
                        {profile.reviews?.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="pt-6 border-t border-gray-600"
                            >
                                <h2 className="text-xl font-semibold text-white mb-4">Reviews</h2>
                                <motion.div 
                                    variants={containerVariants}
                                    className="space-y-4"
                                >
                                    {profile.reviews.map((review, index) => (
                                        <motion.div 
                                            key={index}
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.01 }}
                                            className="bg-gray-600 p-4 rounded-lg border border-gray-500"
                                        >
                                            <div className="flex items-center mb-2">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <motion.svg
                                                            key={i}
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ delay: 0.2 + i * 0.1 }}
                                                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-400'}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </motion.svg>
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-sm text-gray-300">
                                                    {review.rating}/5
                                                </span>
                                            </div>
                                            <p className="text-gray-200">{review.comment}</p>
                                            {review.reviewer_name && (
                                                <p className="mt-2 text-sm text-gray-400">
                                                    - {review.reviewer_name}
                                                </p>
                                            )}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Proficiency Details */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-6 pt-6 border-t border-gray-600"
                        >
                            <h3 className="font-medium text-gray-200 mb-3">Proficiency Details</h3>
                            <div className="space-y-2">
                                {profile.proficiency === 'beginner' && (
                                    <motion.p 
                                        animate={{ 
                                            color: ["#ffffff", "#d8b4fe", "#ffffff"],
                                            transition: { duration: 3, repeat: Infinity }
                                        }}
                                        className="text-white"
                                    >
                                        As a beginner, you're just starting your journey. Keep learning and earning XP!
                                    </motion.p>
                                )}
                                {profile.proficiency === 'intermediate' && (
                                    <p className="text-gray-300">
                                        You're making great progress as an intermediate user. Keep up the good work!
                                    </p>
                                )}
                                {profile.proficiency === 'expert' && (
                                    <p className="text-gray-300">
                                        You've reached expert level! Consider mentoring others in the community.
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default UserProfile;