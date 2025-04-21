import { useState, useEffect } from 'react';
import { SegmentedControl, Button, Collapse } from '@mantine/core';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import '@mantine/core/styles/global.css'
import '@mantine/core/styles/FloatingIndicator.css';
import '@mantine/core/styles/SegmentedControl.css';
import '@mantine/core/styles/UnstyledButton.css'
import '@mantine/core/styles/Button.css'
import { useDisclosure } from '@mantine/hooks';

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

function MenuUsers()
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

    const [projList, setProjList] = useState<Project[]>([]);
    const [opened, {toggle}] = useDisclosure(true);

    const testProj: Project = {
        _id: "1234-5678",
        name: "Codennect",
        domain: "",
        owner: "",
        is_private: false,
        description: "A testing project for a testing world, with a testing long description for a testing-ly long purpose.",
        fields: [],
        roles: { "Frontend": 2, "Backend": 2 },
        users: { "Frontend": ["John"], "Backend": ["Jane"]},
        required_skills: ["MongoDB", "Express", "React", "Node.js"]
    };
    const testProj2: Project = {
        _id: "8765-4321",
        name: "Codennect2",
        domain: "",
        owner: "",
        is_private: false,
        description: "Another testing project for a testing world, with a testing long description for a testing-ly long purpose.",
        fields: [],
        roles: { "Frontend": 2, "Backend": 2 },
        users: { "Frontend": ["Jack", "Jill"], "Backend": ["Jake"]},
        required_skills: ["MongoDB", "Express", "React", "Node.js"]
    };
    const testList: Project[] = [testProj, testProj2];

    useEffect(() => {
        setProjList(testList);
    }, []);

    function getCapacity(project: Project)
    {
        let currentCap = 0;
        let maxCap = 0;
        for(const role in project.users)
            currentCap += project.users[role].length;
        for(const role in project.roles)
            maxCap += project.roles[role];

        return '(' + currentCap + '/' + maxCap + ')';
    }

    return(
        <div id="projMenuBox" className="bg-[#EFF6E0] p-4 w-9/10 m-auto rounded-xl mt-4">
            <div id="collapseButton">
                <Button color="#598392" fullWidth size="lg" onClick={toggle}>Toggle User List</Button>
            </div>
            <Collapse in={opened}>
                <div id="resultsBox" className="mt-4">
                    {projList.map((project) => (
                        <div key={project._id} className="border-white border-4 rounded-xl text-black drop-shadow-md">
                            <div className="flex gap-2 justify-between bg-white p-2">
                                <h3 className="font-bold text-lg">Name: {project.name} {getCapacity(project)}</h3>
                                <Link to={`/projects/${project._id}`}>
                                    <button className="bg-[#598392] text-white px-2 py-2 rounded-[10px] hover:bg-[#90b0bb] hover:cursor-pointer">
                                        <FaArrowRight />
                                    </button>
                                </Link>
                            </div>
                            <div className="m-2">
                                <p className="text-gray-500 uppercase">Description</p>
                                <p className="font-medium">{project.description}</p>
                            </div>
                        </div>
                ))}
                </div>
            </Collapse>
        </div>
    );
}
export default MenuUsers;