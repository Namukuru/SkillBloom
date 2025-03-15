import { LogOut } from "lucide-react";
import LogoutButton from "./Logout";
import ProfileButton from "./Profile";

function Dashboard() {
    return (
        <div>
            <h2>Welcome to the Dashboard Noooow</h2>
            <LogoutButton/>  <ProfileButton/>  
        </div>
    );
}

export default Dashboard;
