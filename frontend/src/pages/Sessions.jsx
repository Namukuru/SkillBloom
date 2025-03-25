import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CompleteSessionButton from '../components/ui/CompleteSessionbtn';
import Navbar from "@/components/Navbar";

const SessionsPage = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const token = sessionStorage.getItem('access_token');
                if (!token) {
                    alert("Please log in to view your sessions.");
                    window.location.href = "/login";
                    return;
                }

                const response = await axios.get('/api/sessions/', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Sessions Data:", response.data); // Debug API response

                // Ensure data is in array format
                setSessions(Array.isArray(response.data) ? response.data : response.data.sessions || []);
            } catch (err) {
                console.error("API Error:", err);

                if (err.response?.status === 401) {
                    alert("Session expired. Please log in again.");
                    localStorage.removeItem("access_token");
                    window.location.href = "/login";
                }

                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <Navbar isAuthenticated={true} />
            <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Sessions</h1>
                {!sessions.length ? (
                    <p className="text-gray-600">No sessions found.</p>
                ) : (
                    <div className="space-y-4">
                        {sessions.map((session) => (
                            <div key={session.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <p className="text-gray-800">
                                    <strong>Teaching:</strong> {session.teach_skill?.name ?? "N/A"}
                                </p>
                                <p className="text-gray-800">
                                    <strong>Learning:</strong> {session.learn_skill?.name ?? "N/A"}
                                </p>
                                <p className="text-gray-600">
                                    <strong>With:</strong> {session.user?.fullName ?? "N/A"} ({session.user?.email ?? "N/A"})
                                </p>
                                <p className="text-gray-600">
                                    <strong>Status:</strong> {session.is_completed ? "Completed" : "Scheduled"}
                                </p>
                                {!session.is_completed && (
                                    <div className="mt-2">
                                        <CompleteSessionButton skillMatchId={session.id} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionsPage;
