import React, { useState, useEffect } from 'react';
function InfoBox()
{
    var _ud = localStorage.getItem('user_data');
    if(_ud == null) //redirect if user not found
    {
        window.location.href = '/';
        return;
    }
    var userData = JSON.parse(_ud);
    var userId = userData.id;
    //var userName = userData.name;

    const app_name = "cop4331.tech";
    function buildPath(route: string) : string {
        if (process.env.NODE_ENV != "production") {
            return 'http://localhost:5001' + route;
        } else {
            return 'http://' + app_name + route;
        }
    }

    //profile info
    const [fullName, setFullName] = useState('');
    const [communication, setCommunication] = useState('');
    const [skills, setSkills] = useState([]);
    const [roles, setRoles] = useState([]);
    const [interests, setInterests] = useState([]);

    const getProfile = async () =>
    {
            
        const obj = {id: userId};
        const js = JSON.stringify(obj);

        try{
            const response = await fetch(buildPath('/api/get-user-info'),
            {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });
            const res = await response.json(); // Parse response

            if(res._id > 0)
            {
                alert('ERROR');
            }
            else
            {
                setFullName(res.name);
                setCommunication(res.comm);
                setSkills(res.skills);
                setRoles(res.roles);
                setInterests(res.interests);
            }
        }
        catch(error: any){
            alert('Error');

        }
    }

    //fetch profile info upon loading
    useEffect(() => {

        getProfile();
    }, []);

    //converts skills array into a string
    const stringArray = (theArray: string[]) =>
    {
        let newString = '';
        if(theArray.length > 0)
        {
            for(let i=0; i<theArray.length - 1; ++i)
            {
                newString += theArray[i] + ", "
            }
            newString += theArray[theArray.length-1];
        }
        return newString;
    }
    
    return(
        <div id="information">
            <div id="profName">
                <p>Name:</p>
                <p>{fullName}</p>
            </div>
            <div id="profCommunication" className="mt-2">
                <p>Preferred Communication Method:</p>
                <p>{communication}</p>
            </div>
            <div id="profSkills" className="mt-2">
                <p>Skills:</p>
                <p>{stringArray(skills)}</p>
            </div>
            <div id="profRoles" className="mt-2">
                <p>Roles:</p>
                <p>{stringArray(roles)}</p>
            </div>
            <div id="profInterests" className="mt-2">
                <p>Interests:</p>
                <p>{stringArray(interests)}</p>
            </div>
        </div>
    );
}
export default InfoBox;