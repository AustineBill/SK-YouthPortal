import { useState } from 'react';

const Reports = () => {
    const [activeContent, setActiveContent] = useState('reports');

    return (
        <div>
            <h2>All Reports</h2>
            <ul>
                <li onClick={() => setActiveContent('reports')}>
                    Reports
                </li>
                <li onClick={() => setActiveContent('generateReport')}>
                    Generate Report
                </li>
            </ul>

            {/* Conditional Rendering of Components */}
            <div className="component-contents">
                {activeContent === 'reports' && (
                    <div>
                        {/* The contents of this view is all about the reports that are stored in database. */}
                    </div>
                )}

                {activeContent === 'generateReport' && (
                    <div>
                        <form>
                            <input type="text" placeholder="Blah" />
                            <input type="text" placeholder="Blah" />
                            <button>Submit</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
        
    );
}

export default Reports;