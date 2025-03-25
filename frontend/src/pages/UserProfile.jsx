import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getValidToken } from "../utils/auth"; 

const UserProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [recipient, setRecipient] = useState(""); // Input for recipient
    const [amount, setAmount] = useState(""); // Input for XP amount

    useEffect(() => {
        const fetchProfile = async () => {
            const token = await getValidToken();
            if (!token) {
                alert("Session expired. Please log in again.");
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("http://127.0.0.1:8000/api/profile/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setProfile(response.data);
            } catch (err) {
                console.error("API Error:", err.response ? err.response.data : err.message);
                setError("Failed to fetch profile.");
            }
        };

        fetchProfile();
    }, [navigate]);

    const transferXP = async () => {
        const token = await getValidToken();
        if (!recipient || !amount) {
            alert("Please enter a recipient and amount.");
            return;
        }

        try {
            await axios.post(
                "http://localhost:8000/api/transfer_xp/",
                { recipient, amount },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert(`Successfully transferred ${amount} XP to ${recipient}`);
            setProfile((prevProfile) => ({
                ...prevProfile,
                xp_points: prevProfile.xp_points - amount,
            }));
        } catch (error) {
            alert(error.response?.data?.error || "Transfer failed");
        }
    };

    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (!profile) return null; // Changed from loading message to null

    return (
        <div>
            <Navbar isAuthenticated={true} />
            <div className="mt-6">
                <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                    {/* Profile Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">{profile.fullName}</h1>
                        <p className="text-gray-600">Proficiency: <span className="font-semibold">{profile.proficiency}</span></p>
                    </div>

                    {/* XP Transfer Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Transfer XP</h2>
                        <input 
                            type="text" 
                            placeholder="Recipient Username"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="border p-2 rounded w-full mb-2"
                        />
                        <input 
                            type="number" 
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="border p-2 rounded w-full mb-2"
                        />
                        <button 
                            onClick={transferXP} 
                            className="bg-blue-500 text-white px-4 py-2 rounded">
                            Send XP
                        </button>
                    </div>

                    {/* User Stats */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Stats</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-800">XP Points</h3>
                                <p className="text-3xl font-bold text-gray-900">{profile.xp_points}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    );
};

export default UserProfile;