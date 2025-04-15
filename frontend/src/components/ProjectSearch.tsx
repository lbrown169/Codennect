import React, {useState} from 'react';
//import {Link} from 'react-router-dom';
import { isProd } from '../utils';

const app_name = "cop4331.tech";

function buildPath(route: string) : string {
    if (isProd()) {
        return 'http://' + app_name + route;
    } else {
        return 'http://localhost:5001' + route;
    }
}

function ProjectSearch(this: any)
{
    var _ud = localStorage.getItem('user_data');
    if(_ud == null) //redirect if user not found
    {
        window.location.href = '/';
        return;
    }

    //note: later, make the div or li hold id equal to project id
    const createNewCard = (num: number) =>
    {
        var theKey: string = num.toString();
        return(
            <li key={theKey}>
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
    const [searchInfo, setSearchInfo] = useState('');

    const handleSetSearchInfo = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
        setSearchInfo(event.target.value);
    }

    createNewCard.onClick = () =>
    {
        projMoreInfo;
    }

    const doSearch = async (event: React.FormEvent) =>
    {
        event.preventDefault();
        //REFERENCE BELOW
        /*
        let newList: React.ReactElement[] = [];
        for(let i=0; i<3; ++i)
        {
            let t = createNewCard(i);
            newList = [...newList, t];
        }
        setTheResults(newList);
        */
        //const obj = {name: searchInfo, required_skills: ''};
        //const js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath('/api/get-all-projects'),
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin'
            });
            const res = await response.json();

            if(res.error)
            {
                alert(res.error);
                return;
            }

            
            alert(res.projects);
            let newList: React.ReactElement[] = [];
            for(let i=0; i<3; ++i)
            {
                let t = createNewCard(i);
                newList = [...newList, t];
            }
            setTheResults(newList);
        }
        catch(error: any)
        {
            alert(error);
            console.log(error);
        }


    }

    function projMoreInfo()
    {
        alert("WIP");
        //later: redirect to '/projects/{id}'
    }

    return(
        <div id="searchBox" className="searchBox">
            <form id="searchArea" onSubmit={doSearch}>
                <input type="text" id="searchBar" placeholder="Search Projects" value={searchInfo} onChange={handleSetSearchInfo} />
                <input type="submit" id="searchButton" className="searchButton" value="Search" />
            </form>
            <span id="searchResults" className="searchResults">
                <ul id="resultList">
                    {theResults}
                </ul>
            </span>
        </div>

    );
}
export default ProjectSearch;