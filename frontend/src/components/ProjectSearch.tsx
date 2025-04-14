import React, {useState} from 'react';
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

    //note: later, make the div or li hold id equal to project id
    const createNewCard = (num: number) =>
    {
        var theKey: string = num.toString();
        return(
            <li>
                <div className="projSearchCard" id={theKey}>
                    <p id="projName">Project Name</p>
                    <p id="memberCount" className="text-right"># of Members</p>
                    <div id="projDesc" className="projSearchCardDesc w-[50%]">Description here</div>
                    <button type="button" id="moreInfoButton" className="moreInfoButton" onClick={projMoreInfo}>Test</button>
                </div> 
            </li>
        );
    }
    const [theResults, setTheResults] = useState<React.ReactElement[]>([]);

    createNewCard.onClick = () =>
    {
        projMoreInfo;
    }

    function doSearch(event: React.MouseEvent)
    {
        event.preventDefault();
        var theList = document.getElementById("resultList");
        if(theList == null ) return;
        let newList: React.ReactElement[] = [];
        for(let i=0; i<3; ++i)
        {
            let t = createNewCard(i);
            newList = [...newList, t];
        }
        setTheResults(newList);
    }

    function projMoreInfo()
    {
        alert("WIP");
        //later: redirect to '/projects/{id}'
    }

    return(
        <div id="searchBox" className="searchBox">
            <div id="searchArea">
                <input type="text" id="searchBar" placeholder="Search Projects" />
                <button type="button" id="searchButton" className="searchButton" onClick={doSearch}>Search</button>
            </div>
            <span id="searchResults" className="searchResults">
                <ul id="resultList">
                    {theResults}
                </ul>
            </span>
            {testPrev}
        </div>

    );
}
export default ProjectSearch;