import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getValidToken } from "../utils/auth";

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
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-red-500 text-lg p-4 bg-white rounded shadow">
                    {error}
                </div>
            </div>
        );
    }

    if (!profile) return null;

    // Helper function to capitalize proficiency level
    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div className="min-h-screen bg-gray-800">
            <Navbar isAuthenticated={true} />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-gray-700 rounded-xl shadow-md overflow-hidden ">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="relative mb-4 md:mb-0 md:mr-6">
                                <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-purple-600">
                                    {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow">
                                    <div className="bg-green-500 rounded-full h-5 w-5"></div>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {profile.fullName || 'Anonymous User'}
                                </h1>
                                <p className="text-purple-200">{profile.email}</p>
                                <div className="mt-2 inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                                    {capitalize(profile.proficiency)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-6">
                        {/* Stats Section */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-white mb-4">User Statistics</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* XP Points Card */}
                                <div className="bg-gray-300 p-4 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-medium text-gray-700">XP Points</h3>
                                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                                            Level {Math.floor(profile.xp_points / 100) || 1}
                                        </span>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{profile.xp_points}</p>
                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-purple-600 h-2 rounded-full" 
                                            style={{ width: `${profile.xp_points % 100}% `}}
                                        ></div>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {100 - (profile.xp_points % 100)} XP to next level
                                    </p>
                                </div>

                                {/* Credits Card */}
                                <div className="bg-gray-300 p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-medium text-gray-700 mb-2">Credits</h3>
                                    <p className="text-3xl font-bold text-gray-900">{profile.credits || 0}</p>
                                </div>

                                {/* Badges Card */}
                                <div className="bg-gray-300 p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-medium text-gray-700 mb-2">Badges</h3>
                                    <p className="text-3xl font-bold text-gray-900">{profile.badges?.length || 0}</p>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {profile.badges?.slice(0, 3).map((badge, index) => (
                                            <span key={index} className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                                                {badge.name}
                                            </span>
                                        ))}
                                        {profile.badges?.length > 3 && (
                                            <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                                                +{profile.badges.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Skills Section */}
                        {profile.skills?.length > 0 && (
                            <div className="mb-8 pt-6 border-t border-gray-200">
                                <h2 className="text-xl font-semibold text-white mb-4">Your Skills</h2>
                                <div className="flex flex-wrap gap-3">
                                    {profile.skills.map((skill, index) => (
                                        <div key={index} className="bg-purple-50 px-4 py-2 rounded-full border border-purple-100">
                                            <div className="flex items-center">
                                                <span className="text-purple-800 font-medium">{skill.name}</span>
                                                {skill.level && (
                                                    <span className="ml-2 text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                                                        {skill.level}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews Section */}
                        {profile.reviews?.length > 0 && (
                            <div className="pt-6 border-t border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Reviews</h2>
                                <div className="space-y-4">
                                    {profile.reviews.map((review, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <div className="flex items-center mb-2">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-sm text-gray-600">
                                                    {review.rating}/5
                                                </span>
                                            </div>
                                            <p className="text-gray-700">{review.comment}</p>
                                            {review.reviewer_name && (
                                                <p className="mt-2 text-sm text-gray-500">
                                                    - {review.reviewer_name}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Proficiency Details */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="font-medium text-gray-700 mb-3">Proficiency Details</h3>
                            <div className="space-y-2">
                                {profile.proficiency === 'beginner' && (
                                    <p className="text-white">
                                        As a beginner, you're just starting your journey. Keep learning and earning XP!
                                    </p>
                                )}
                                {profile.proficiency === 'intermediate' && (
                                    <p className="text-gray-600">
                                        You're making great progress as an intermediate user. Keep up the good work!
                                    </p>
                                )}
                                {profile.proficiency === 'expert' && (
                                    <p className="text-gray-600">
                                        You've reached expert level! Consider mentoring others in the community.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;