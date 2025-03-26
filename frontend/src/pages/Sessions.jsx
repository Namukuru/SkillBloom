import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { getValidToken } from "../utils/auth";
import Navbar from "../components/Navbar";

const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        fetchSessions();
    }, [refreshTrigger]);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const token = await getValidToken();
            
            if (!token) {
                window.location.href = "/login";
                return;
            }

            const apiUrl = process.env.NODE_ENV === 'development' 
                ? 'http://localhost:8000/api/sessions/' 
                : '/api/sessions/';

            const response = await axios.get(apiUrl, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
                throw new Error("Frontend routing error - check API endpoint");
            }

            if (!response.data?.success) {
                throw new Error(response.data?.message || "Failed to fetch sessions");
            }

            const formattedSessions = response.data.sessions.map((session) => ({
                id: session.id,
                teach_skill: session.teach_skill,
                learn_skill: session.learn_skill,
                role: session.role,
                counterpart: {
                    id: session.counterpart.id,
                    fullName: session.counterpart.fullName || "Unknown",
                    email: session.counterpart.email || "",
                },
                status: session.status,
                is_rated: session.is_rated,
                scheduled_date: moment(session.scheduled_date).format("LLL"),
                raw_date: session.scheduled_date,
            }));

            formattedSessions.sort((a, b) => new Date(b.raw_date) - new Date(a.raw_date));
            setSessions(formattedSessions);
            setError(null);
        } catch (err) {
            console.error("API Error:", err);
            setError(err.response?.data?.message || err.message || "Failed to load sessions");
            setSessions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteSession = async (sessionId) => {
        try {
            const token = await getValidToken();
            await axios.patch(
                `${process.env.NODE_ENV === 'development' 
                    ? 'http://localhost:8000' 
                    : ''}/api/sessions/${sessionId}/complete/`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            console.error("Completion error:", err);
            setError(err.response?.data?.message || "Failed to complete session");
        }
    };

    const handleRateSession = (sessionId) => {
        // Implement rating functionality
        console.log("Rating session:", sessionId);
    };

    const refreshSessions = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div>
            <Navbar isAuthenticated={true} />
             <div className="container mx-auto p-4 max-w-6xl">

<div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-gray-800">Your Sessions</h2>
    <div className="flex gap-2">
        <button
            onClick={refreshSessions}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
        </button>
        <a
            href="/skill-exchange"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
            Find Partners
        </a>
    </div>
</div>

{loading && (
    <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
)}

{error && (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
        <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
                <h3 className="text-sm font-medium text-red-800">Error loading sessions</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
        </div>
    </div>
)}

{!loading && !error && sessions.length === 0 && (
    <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
        <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions scheduled</h3>
        <p className="text-gray-600 mb-4">Get started by finding learning partners</p>
        <a
            href="/skill-exchange"
            className="inline-block px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
            Browse Skills
        </a>
    </div>
)}

<div className="space-y-4">
    {sessions.map((session) => (
        <div key={session.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">
                        {session.role === 'teacher' ? 'Teaching' : 'Learning'}
                    </h3>
                    <p className="text-lg font-semibold text-gray-800">
                        {session.role === 'teacher' ? session.teach_skill : session.learn_skill}
                    </p>
                </div>
                
                <div>
                    <h3 className="text-sm font-medium text-gray-500">
                        {session.role === 'teacher' ? 'Student' : 'Teacher'}
                    </h3>
                    <p className="text-gray-800">{session.counterpart.fullName}</p>
                    <p className="text-sm text-gray-600">{session.counterpart.email}</p>
                </div>
                
                <div>
                    <h3 className="text-sm font-medium text-gray-500">When</h3>
                    <p className="text-gray-800">{session.scheduled_date}</p>
                </div>
                
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        session.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {session.status === 'completed' ? 'Completed' : 'Upcoming'}
                    </span>
                </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-2">
                {session.status === 'pending' && session.role === 'teacher' && (
                    <button
                        onClick={() => handleCompleteSession(session.id)}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                    >
                        Mark Complete
                    </button>
                )}
                
                {session.status === 'completed' && !session.is_rated && (
                    <button
                        onClick={() => handleRateSession(session.id)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                    >
                        Rate Session
                    </button>
                )}
            </div>
        </div>
    ))}
</div>
</div>
        </div>
       
    );
};

export default Sessions;