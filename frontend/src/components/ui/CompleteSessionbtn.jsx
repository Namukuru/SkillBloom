import React from 'react';

const CompleteSessionButton = ({ skillMatchId }) => {
    const handleComplete = async () => {
        const response = await fetch(`/api/complete-session/${skillMatchId}/`, {
            method: 'POST',
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            alert("Session marked as completed!");
            window.location.reload(); // Refresh the page to update the session list
        } else {
            alert("Failed to mark session as completed.");
        }
    };

    return (
        <button
            onClick={handleComplete}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
            Mark as Completed
        </button>
    );
};

export default CompleteSessionButton;