import axios from "axios";
const API_URL = "http://localhost:8000/api/send_sms/"; 

export const sendSMS = async (phoneNumber, skillName, student, scheduledDate, scheduledTime) => {
    try {
        console.log("📡 Sending request to API:", API_URL, {
            phone_number: phoneNumber,
            skill_name: skillName,
            scheduled_date: scheduledDate,
            student: student,
            time: scheduledTime, // Ensure this is sent
        });

        const response = await axios.post(API_URL, {
            phone_number: phoneNumber,
            skill_name: skillName,
            scheduled_date: scheduledDate,
            student: student,
            time: scheduledTime,
        });

        console.log("✅ SMS sent successfully:", response);
        return response; // Return full response

    } catch (error) {
        if (error.response) {
            console.error("❌ SMS API Error:", error.response.status, error.response.data);
            alert("SMS Error: " + (error.response.data.error || "Unknown error"));
        } else {
            console.error("❌ Network/Server Error:", error.message);
            alert("Network error: Unable to reach the server");
        }
        return null; // Return null on failure
    }
};
