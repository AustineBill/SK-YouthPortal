import { Link } from 'react-router-dom';

const ManageAboutUs = () => {
    return ( 
        <div>
            <h2>Manage About Us Details</h2>
            <Link to="/admin/edit-about-details">
                <button>Edit Details</button>
            </Link>
        </div>

    );
}

export default ManageAboutUs;