import { Link } from 'react-router-dom';

const ContactDetails = () => {
    return ( 
        <div>
            <h1>Try</h1>
            <Link to="/admin/manage-contact-us">
                <button>Back</button>
            </Link>
        </div>
        
    );
}

export default ContactDetails;