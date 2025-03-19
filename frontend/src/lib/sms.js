import axios from "axios";
const API_URL = "http://localhost:8000/api/send_sms/"; // Include "/api/"

export const sendSMS = async (phoneNumber, message) => {
    try {
        const response = await axios.post(API_URL, {
            phone_number: phoneNumber,
            message: message,
        });

        console.log("SMS sent:", response.data);
        return response.data;
    } catch (error) {
        console.error("SMS sending error:", error);
    }
};
