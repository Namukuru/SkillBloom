import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CompleteSessionButton from '../components/ui/CompleteSessionbtn';
import Navbar from "@/components/Navbar";
import { getValidToken } from "../utils/auth";

const SessionsPage = () => {
    const [sessions, setSessions] = useState([]); // Initialize as empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const token = await getValidToken();
            if (!token) {
                window.location.href = "/login";
                return;
            }
    
            const response = await axios.get("/api/user-sessions/", {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (!response.data?.success) {
                throw new Error("API request failed");
            }
    
            const formattedSessions = response.data.sessions.map(session => ({
                id: session.id,
                teach_skill: { 
                    name: session.teach_skill || "Not specified" 
                },
                learn_skill: { 
                    name: session.learn_skill || "Not specified" 
                },
                role: session.role,  // 'teacher' or 'student'
                counterpart: {
                    ...session.counterpart,
                    fullName: session.counterpart.fullName || "Unknown",
                },
                is_completed: session.status === "completed",
                is_rated: session.is_rated,
                scheduled_date: session.scheduled_date,
            }));
    
            setSessions(formattedSessions);
            setError(null);
        } catch (err) {
            console.error("API Error:", err);
            setError(err.message || "Failed to load sessions");
            setSessions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [refreshTrigger]);

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleCompleteSession = async (sessionId) => {
        try {
            const token = await getValidToken();
            await axios.patch(`/api/scheduled-sessions/${sessionId}/`, {
                status: "completed"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            handleRefresh();
        } catch (err) {
            console.error("Completion error:", err);
            setError(err.response?.data?.message || "Failed to complete session");
        }
    };

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
                            onClick={handleRefresh}
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
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Your Sessions</h1>
                    <button 
                        onClick={handleRefresh}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Refresh
                    </button>
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : sessions.length === 0 ? (
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
                                        <h3 className="text-sm font-medium text-gray-500">Session Date</h3>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {new Date(session.scheduled_date).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Learning</h3>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {session.learn_skill || "Not specified"}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Teacher</h3>
                                        <p className="text-gray-800">
                                            {session.user?.fullName || "Unknown"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {session.user?.email || "No email"}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Student</h3>
                                        <p className="text-gray-800">
                                            {session.student_name || "You"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {session.student_phone || "No phone"}
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
                                            <button
                                                onClick={() => handleCompleteSession(session.id)}
                                                className="text-sm px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                                            >
                                                Mark Complete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionsPage;