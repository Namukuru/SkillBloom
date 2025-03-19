import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const UserProfile = () => {
    const [profile, setProfile] = useState({
        fullName: '',
        proficiency: '',
        skills: [],
        xp_points: 100,
        badges: [],
        reviews: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/profile/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                console.log("Profile Data:", response.data); // Debug: Log the profile data
                setProfile(response.data);
            } catch (err) {
                console.error("API Error:", err); // Debug: Log the error
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }

    if (!profile) {
        return <div className="flex justify-center items-center h-screen">No profile data found.</div>;
    }

    return (
        <div>
            {/* Include the Navbar */}
            <Navbar isAuthenticated={true} />
            <div className="mt-6">
                {/* Profile Content */}
                <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                    {/* Profile Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">{profile.fullName}</h1>
                        <p className="text-gray-600">Photography</p>
                        <p className="text-gray-600">Proficiency: <span className="font-semibold">{profile.proficiency}</span></p>
                    </div>

                    {/* Skill Portfolio */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Skill Portfolio</h2>
                        <p className="text-gray-600 mb-4">Skills you have collected from SkillBloom connections</p>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills?.map((skill, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* User Stats */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Stats</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* XP Points */}
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-800">XP Points</h3>
                                <p className="text-3xl font-bold text-gray-900">{profile.xp_points}</p>
                                <p className="text-gray-600">Earn points by exchanging skills</p>
                            </div>

                            {/* Badges Earned */}
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-800">Badges Earned</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {profile.badges?.map((badge, index) => (
                                        <img key={index} src={badge.image} alt={badge.name} className="w-12 h-12 rounded-full" />
                                    ))}
                                </div>
                                <p className="text-gray-600 mt-2">Collect badges when you complete exchanges</p>
                            </div>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>
                        <div className="space-y-4">
                            {profile.reviews?.map((review, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <p className="text-gray-800"><strong>{review.reviewer}</strong>: {review.comment}</p>
                                    <p className="text-gray-600">Rating: {review.rating}/5</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    );
};

export default UserProfile;