import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // For navigation
import CompleteSessionButton from '../components/ui/CompleteSessionbtn';
import Navbar from "@/components/Navbar";

const SessionsPage = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch sessions when the component mounts
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get('/api/sessions/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                console.log("Sessions Data:", response.data); // Debug: Log the sessions data
                console.log("Type of sessions data:", typeof response.data); // Debug: Log the type of data
                setSessions(response.data);
            } catch (err) {
                console.error("API Error:", err); // Debug: Log the error
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []); // Empty dependency array means this runs only once when the component mounts

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
                {!Array.isArray(sessions) ? (
                    <p className="text-gray-600">Invalid sessions data.</p>
                ) : sessions.length === 0 ? (
                    <p className="text-gray-600">No sessions found.</p>
                ) : (
                    <div className="space-y-4">
                        {sessions.map((session) => (
                            <div key={session.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <p className="text-gray-800">
                                    <strong>Teaching:</strong> {session.teach_skill?.name || "N/A"}
                                </p>
                                <p className="text-gray-800">
                                    <strong>Learning:</strong> {session.learn_skill?.name || "N/A"}
                                </p>
                                <p className="text-gray-600">
                                    <strong>With:</strong> {session.user?.fullName || "N/A"} ({session.user?.email || "N/A"})
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