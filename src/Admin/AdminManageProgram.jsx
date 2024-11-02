import { useState } from 'react';

const NavigationLinks = ({ setActiveContent }) => {
    return (
        <ul className="sidebar-links">
            <li onClick={() => setActiveContent('allPrograms')}>All Programs</li>
            <li onClick={() => setActiveContent('addProgram')}>Add Program</li>
        </ul>
    );
};

const ManageProgram = () => {
    const [activeContent, setActiveContent] = useState('allPrograms');

    return (
        <div>
            {/* Conditional Rendering of Components */}
            <div className="component-contents">
                {activeContent === 'allPrograms' && (
                    <div>
                        <h2>Manage Programs</h2>
                        <NavigationLinks setActiveContent={setActiveContent} />
                        {/* The contents of this view is all about the programs that are stored in database. */}
                    </div>
                )}

                {activeContent === 'addProgram' && (
                    <div>
                        <h2>Manage Programs</h2>
                        <NavigationLinks setActiveContent={setActiveContent} />
                        <form>
                            <input type="text" placeholder="Name of Program" />
                            <input type="text" placeholder="Blah" />
                            <button>Submit</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageProgram;
