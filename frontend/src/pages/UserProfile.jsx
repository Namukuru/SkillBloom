import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getValidToken } from "../utils/auth";

const UserProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState(0);

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
                setError("Failed to fetch profile.");
            } finally {
                setLoading(false);
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

    if (loading) return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (!profile) return <div className="flex justify-center items-center h-screen text-white">No profile data found.</div>;

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <Navbar isAuthenticated={true} />
            <div className="flex justify-center items-center mt-10">
                <div className="max-w-3xl w-full bg-gray-800 shadow-lg rounded-lg p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold">{profile.fullName}</h1>
                        <p className="text-gray-400">Email: {profile.email}</p>
                        <p className="text-gray-400">Skill: {profile.skills}</p>
                        <p className="text-gray-400">Proficiency: <span className="font-semibold">{profile.proficiency}</span></p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Your Stats</h2>
                        <div className="bg-gray-700 p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-xl font-semibold">XP Points</h3>
                            <p className="text-4xl font-bold">{profile.xp_points}</p>
                            <button
                                onClick={() => navigate("/transactions")}
                                className="mt-3 px-3 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition"
                            >
                                Transfer XP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
