import { Link } from 'react-router-dom';

const AboutDetails = () => {
    return ( 
        <div>
            <h1>Try</h1>
            <Link to="/admin/manage-about-us">
                <button>Back</button>
            </Link>
        </div>
    );
}

export default AboutDetails;
