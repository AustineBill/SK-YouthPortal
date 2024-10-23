import { Link } from 'react-router-dom';

const ManageContactUs = () => {
    return ( 
        <div>
            <h2>Manage Contact Details</h2>
            <Link to="/admin/edit-contact-us-details">
                <button>Edit Details</button>
            </Link>
        </div>

    );
}

export default ManageContactUs;