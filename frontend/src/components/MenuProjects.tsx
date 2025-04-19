import { useState, useEffect } from 'react';
import { SegmentedControl } from '@mantine/core';
import '@mantine/core/styles/global.css'
import '@mantine/core/styles/FloatingIndicator.css';
import '@mantine/core/styles/SegmentedControl.css';
import '../App.css';

//import { isProd } from '../utils';

//const app_name = "cop4331.tech";

/*
function buildPath(route: string) : string {
    if (isProd()) {
        return 'http://' + app_name + route;
    } else {
        return 'http://localhost:5001' + route;
    }
}
*/

type FieldDetails = {
    name: string;
    value: string;
    private: boolean;
};

interface Project {
    _id: string
    name: string
    domain: string
    owner: string
    is_private: boolean
    description: string
    fields: FieldDetails[]
    roles: { [role: string]: number }
    users: { [role: string]: string[] }
    required_skills: string[]
}

function MenuProjects()
{
    var _ud = localStorage.getItem('user_data');
    if(_ud == null) //redirect if user not found
    {
        window.location.href = '/';
        return;
    }

    //var userData = JSON.parse(_ud);
    //var userId = userData.id;
    //var userName = userData.name;

    const [ownedProjectsList, setOwnedProjectsList] = useState<Project[]>([]);
    const [partProjectsList, setPartProjectsList] = useState<Project[]>([]);
    const [sliderValue, setSliderValue] = useState('ownedProjects');
    const [resultDisplay, setResultDisplay] = useState<Project[]>(ownedProjectsList);   //the actual display of list

    const testProj: Project = {
        _id: "1234-5678",
        name: "Codennect",
        domain: "",
        owner: "",
        is_private: false,
        description: "A testing project for a testing world, with a testing long description for a testing-ly long purpose.",
        fields: [],
        roles: { "Frontend": 2, "Backend": 2 },
        users: { "Frontend": [], "Backend": []},
        required_skills: ["MongoDB", "Express", "React", "Node.js"]
    };
    const testList: Project[] = [testProj];

    
    const testProj2: Project = {
        _id: "8765-4321",
        name: "Codennect2",
        domain: "",
        owner: "",
        is_private: false,
        description: "A testing project for a testing world, with a testing long description for a testing-ly long purpose.",
        fields: [],
        roles: { "Frontend": 2, "Backend": 2 },
        users: { "Frontend": [], "Backend": []},
        required_skills: ["MongoDB", "Express", "React", "Node.js"]
    };
    const testList2: Project[] = [testProj2];
    
    //will later write code to fetch actual projects into the 'testList'
    useEffect(() => {
        setOwnedProjectsList(testList);
        setPartProjectsList(testList2);
        setResultDisplay(testList);
    }, []);

    const handleSetSliderValue = () =>
    {
        if(sliderValue == 'participatingProjects')
        {
            setSliderValue('ownedProjects');
            setResultDisplay(ownedProjectsList);
        }
        else
        {
            setSliderValue('participatingProjects');
            setResultDisplay(partProjectsList);
        }
    }

    //mapping reference
    //{projects.map((project) => ( ))}

    return(
        <div id="mainMenuBox" className="bg-[#EFF6E0] p-4 w-9/10 m-auto">
            <div id="sliderBox" className="text-white text-lg mb-4">
                <SegmentedControl
                    
                    color='#124559'
                    fullWidth
                    value={sliderValue}
                    onChange={handleSetSliderValue}
                    data={[
                        {value:'ownedProjects', label: 'Owned Projects'},
                        {value:'participatingProjects', label:'Projects I Participate In'}
                    ]} 
                />
            </div>
            <div id="resultsBox">
                {resultDisplay.map((project) => (
                    <div id={project._id} className="text-black">
                        <p>Name: {project.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default MenuProjects;