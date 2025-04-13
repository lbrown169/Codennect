import React, {useState} from 'react';
import { renderToString } from 'react-dom/server';
import ProjectPreview from './ProjectPreview';


function ProjectSearch(this: any)
{
    var _ud = localStorage.getItem('user_data');
    if(_ud == null) //redirect if user not found
    {
        window.location.href = '/';
        return;
    }

    const [testPrev, editTestPrev] = useState(<ProjectPreview />)

    function createNewCard(num: number)
    {
        var theKey = "item" + num;
        return(
            <li key={theKey}>
                <div className="projSearchCard">
                    <p>Project Name</p>
                    <p className="text-right"># of Members</p>
                    <div className="projSearchCardDesc w-[50%]">Description here</div>
                    <button type="button" onClick={projMoreInfo}>Test</button>
                </div> 
            </li>
        );
    }

    createNewCard.onClick = () =>
    {
        projMoreInfo;
    }

    function doSearch(event: React.MouseEvent)
    {
        event.preventDefault();
        var theList = document.getElementById("resultList");
        if(theList == null ) return;
        var t = createNewCard(2);
        theList.innerHTML += renderToString(t);
    }

    function projMoreInfo()
    {
        alert("WIP");
    }

    return(
        <div id="searchBox" className="searchBox">
            <div id="searchArea">
                <input type="text" id="searchBar" placeholder="Search Projects" />
                <button type="button" id="searchButton" className="searchButton" onClick={doSearch}>Search</button>
            </div>
            <span id="searchResults" className="searchResults">
                <ul id="resultList">
                    <li>
                        <div className="projSearchCard">
                            <p>Project Name</p>
                            <p className="text-right"># of Members</p>
                            <div className="projSearchCardDesc w-[50%]">Description here</div>
                            <button type="button" onClick={projMoreInfo}>Test</button>
                        </div> 
                    </li>
                </ul>
            </span>
            {testPrev}
        </div>

    );
}
export default ProjectSearch;