import { useNavigate } from "react-router-dom";
import "../Admin/styles/AdminNavbar.css";


const AdminNavbar = () => {
    const navigate = useNavigate();

    const handleSignout = () => {
        console.log("Signed out");

        navigate("/admin");
    }

    return (
        <nav className="admin-navbar">
            <div className='admin-panel'>
                <h1>iSKed - Admin Panel</h1>
            </div>
            <button onClick={handleSignout}>
                Sign out
            </button>
        </nav>
    );
}

export default AdminNavbar;