import React, { useState } from 'react';

const Menu: React.FC = () => {
    const [projectView, setProjectView] = useState('overview');

    const userDataString = localStorage.getItem('user_data');
    if (!userDataString) {
        window.location.href = '/';
        return null;
    }

    const userData = JSON.parse(userDataString);
    const userName = userData.name;

    const showOverview = () => setProjectView('overview');
    const showDetails = () => setProjectView('details');

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <div className="gradient-bg flex flex-row flex-1 p-8 gap-8 md:flex-row flex-col">
                <div className="flex-1 flex flex-col gap-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#213547] text-opacity-75">
                        Welcome, {userName}!
                    </h1>
                    <button
                        type="button"
                        className={`rounded-lg border border-transparent py-2.5 px-4 text-base font-medium bg-gray-200 hover:border-[#646cff] transition-colors ${
                            projectView === 'overview' ? 'bg-[#124559] text-white' : ''
                        }`}
                        onClick={showOverview}
                    >
                        Project Overview
                    </button>
                    <button
                        type="button"
                        className={`rounded-lg border border-transparent py-2.5 px-4 text-base font-medium bg-gray-200 hover:border-[#646cff] transition-colors ${
                            projectView === 'details' ? 'bg-[#124559] text-white' : ''
                        }`}
                        onClick={showDetails}
                    >
                        Project Details
                    </button>
                </div>
                <div className="flex-2 flex flex-col">
                    <div className="bg-[#eff6e0] rounded-3xl p-6 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#213547] text-center mb-4 text-opacity-75">
                            Your Current Projects
                        </h2>
                        <div className="bg-white border border-[#213547] rounded-lg p-4 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                            <h3 className="text-2xl md:text-3xl font-bold text-[#213547] text-opacity-75">
                                Project Name
                            </h3>
                            <p className="text-lg md:text-xl font-medium text-[#213547] text-right text-opacity-75">
                                # of Members
                            </p>
                            <p className="text-lg md:text-xl text-[#213547] mt-2 text-opacity-75">
                                Description Here
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;
