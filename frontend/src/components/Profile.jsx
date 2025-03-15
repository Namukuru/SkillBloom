import { useNavigate } from "react-router-dom";

const ProfileButton = () => {
    const navigate = useNavigate();

    return (
        <button 
            onClick={() => navigate("/profile")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            Go to Profile
        </button>
    );
};

export default ProfileButton;
