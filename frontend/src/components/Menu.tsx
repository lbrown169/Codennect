import React, { useState } from 'react'

function Menu()
{
    const [projectView, setProjectView] = useState('overview')
    
    var _ud = localStorage.getItem('user_data')
    if(_ud == null) //redirect if user not found
    {
        window.location.href = '/'
        return
    }

    var userData = JSON.parse(_ud)
    var userName = userData.name

    const showOverview = () =>
    {
        setProjectView('overview')
        return
    }

    const showDetails = () =>
    {
        setProjectView('details')
        return
    }

    return(
        <div id="menuBox" className="min-h-screen bg-white flex flex-col font-sans">
            <div id="contentBox" className="gradient-bg flex md:flex-row flex-col flex-1 p-8 gap-8">
                <div id="leftDiv" className="flex-1 flex flex-col gap-4">
                    <h1 id="welcomeText" className="text-4xl md:text-5xl font-bold text-[#213547] text-opacity-75">Welcome, {userName}!</h1>
                    <button type="button" id="overviewButton" className={`rounded-lg border border-transparent py-2.5 px-4 text-base font-medium bg-gray-200 hover:border-[#646cff] transition-colors ${projectView === 'overview' ? 'bg-[#124559] text-white' : ''}`} onClick={showOverview}>Project Overview</button>
                    <button type="button" id="detailsButton" className={`rounded-lg border border-transparent py-2.5 px-4 text-base font-medium bg-gray-200 hover:border-[#646cff] transition-colors ${projectView === 'details' ? 'bg-[#124559] text-white' : ''}`} onClick={showDetails}>Project Details</button>
                </div>
                <div id="rightDiv" className="flex-[2] flex flex-col">
                    <div id="dashboardBox" className="bg-[#eff6e0] rounded-3xl p-6 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                        <h2 id="dashboardTitle" className="text-3xl md:text-4xl font-bold text-[#213547] text-center mb-4 text-opacity-75">Your Current Projects</h2>
                        <div id="projectCard" className="bg-white border border-[#213547] rounded-lg p-4 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                            <h3 id="projectName" className="text-2xl md:text-3xl font-bold text-[#213547] text-opacity-75">Project Name</h3>
                            <p id="projectMembers" className="text-lg md:text-xl font-medium text-[#213547] text-right text-opacity-75"># of Members</p>
                            <p id="projectDescription" className="text-lg md:text-xl text-[#213547] mt-2 text-opacity-75">Description Here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Menu
