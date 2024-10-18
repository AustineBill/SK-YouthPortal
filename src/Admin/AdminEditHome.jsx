import { Link } from 'react-router-dom';

const HomeDetails = () => {
    return ( 
        <div>
            <h1>Try</h1>
            <Link to="/admin/manage-home">
                <button>Back</button>
            </Link>
        </div>
    );
}
 
export default HomeDetails;
