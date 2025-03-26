import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const TransactionPage = () => {
    const navigate = useNavigate();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");

    const transferXP = async () => {
        const token = sessionStorage.getItem("access_token");
        if (!recipient || !amount) {
            alert("⚠️ Please enter a recipient and amount.");
            return;
        }

        try {
            await axios.post("http://localhost:8000/api/transfer_xp/", 
                { recipient, amount }, 
                { headers: { Authorization: `Bearer ${token}` } } // ✅ Fixed template string
            );
            alert(`✅ Successfully transferred ${amount} XP to ${recipient}`);
            navigate("/profile"); // Redirect after transfer
        } catch (error) {
            alert(error.response?.data?.error || "❌ Transfer failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
            <Navbar isAuthenticated={true} />

            {/* Card Wrapper */}
            <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Transfer XP</h2>

                {/* Input Fields */}
                <input 
                    type="text" 
                    placeholder="Recipient Username"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input 
                    type="number" 
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* Buttons */}
                <button 
                    onClick={transferXP} 
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition duration-300"
                >
                    Send XP
                </button>

                <button 
                    onClick={() => navigate("/profile")}
                    className="mt-4 w-full text-purple-400 hover:text-blue-500 underline text-center block"
                >
                    Back to Profile
                </button>
            </div>
        </div>  
    );
};

export default TransactionPage;
