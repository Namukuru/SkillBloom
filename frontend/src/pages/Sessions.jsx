import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CompleteSessionButton from '../components/ui/CompleteSessionbtn';
import Navbar from "@/components/Navbar";
import { getValidToken } from "../utils/auth";

const SessionsPage = () => {
    const [sessions, setSessions] = useState(null); // Initialize as null
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const token = await getValidToken();
                if (!token) {
                    window.location.href = "/login";
                    return;
                }

                const response = await axios.get("/api/sessions/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setSessions(Array.isArray(response.data) ? response.data : response.data.sessions || []);
            } catch (err) {
                console.error("API Error:", err);
                setError(err.message);
            }
        };

        fetchSessions();
    }, []);

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar isAuthenticated={true} />
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="max-w-md w-full text-center">
                        <div className="text-red-500 text-lg font-medium mb-4">
                            Error loading sessions
                        </div>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar isAuthenticated={true} />
            <div className="flex-1 p-6 max-w-6xl w-full mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Sessions</h1>
                
                {sessions === null ? null : (
                    sessions.length === 0 ? (
                        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                            <p className="text-gray-600 mb-4">You don't have any sessions yet.</p>
                            <a
                                href="/skill-exchange"
                                className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                            >
                                Find Learning Partners
                            </a>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {sessions.map((session) => (
                                <div key={session.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Teaching</h3>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {session.teach_skill?.name || "Not specified"}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Learning</h3>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {session.learn_skill?.name || "Not specified"}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Partner</h3>
                                            <p className="text-gray-800">
                                                {session.user?.fullName || "Unknown"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {session.user?.email || "No email"}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                session.is_completed 
                                                    ? "bg-green-100 text-green-800" 
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}>
                                                {session.is_completed ? "Completed" : "Scheduled"}
                                            </span>
                                            
                                            {!session.is_completed && (
                                                <CompleteSessionButton 
                                                    sessionId={session.id}
                                                    className="text-sm px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default SessionsPage;