import { useState, useContext } from "react";
import { Project } from '../../types/Project';
import { ProjectCard } from "../dashboard/ProjectsPanel";
import { UserContext } from '../../hooks/UserContext';
import { FaSearch } from "react-icons/fa";
import { Alert, Button, Combobox, useCombobox, CloseButton, Grid, Input, InputBase, MultiSelect, ScrollArea, Skeleton, TextInput } from "@mantine/core";

import { IoMdInformationCircleOutline } from 'react-icons/io';

export function ProjectSearchBar()
{
    const {user} = useContext(UserContext);
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption,
    });
    const roleOptions = [
        'Project Manager',
        'Frontend',
        'Backend',
        'Database',
        'Mobile',
    ];
    const skillOptions = [
        'Android(Kotlin/Java)',
        'Angular',
        'Arduino',
        'AWS',
        'C#',
        'C++',
        'Dart',
        'Docker',
        'Express.js',
        'Figma(UI/UX)',
        'Firebase',
        'Flutter',
        'Google Cloud',
        'GraphQL',
        'iOS(Swift)',
        'Java',
        'JavaScript',
        'Machine Learning',
        'MongoDB',
        'MySQL',
        'Node.js',
        'OpenAI API',
        'PostgreSQL',
        'Raspberry Pi',
        'React',
        'React Native',
        'REST API',
        'Swift',
        'TensorFlow',
        'TypeScript',
        'Vue.js',
    ];
    const [roleValue, setRoleValue] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState('');
    const searchIcon = <FaSearch />
    const [searchResults, setSearchResults] = useState<Project[]>([]);

    if (!user) {
        return <Skeleton />;
    }

    const projects = user.projects.filter((project) =>
        Object.values(project.users)
            .map((role) => role.users.includes(user._id))
            .includes(true)
    );

    const comboOptions = roleOptions.map((role) => (
        <Combobox.Option value={role} key={role}>
            {role}
        </Combobox.Option>
    ));


    async function doSearch(event: React.FormEvent)
    {
        event.preventDefault();
        alert("WIP");
        const newProjects = projects.filter(    //filter out owned projects
            (project) => project.owner !== user?._id
        );
        setSearchResults(newProjects);
    }

    

    return(
        <form onSubmit={doSearch}>
            <TextInput
                placeholder="Search"
                mb="4"
                radius="md"
                leftSection={searchIcon}
                value={searchInput}
                onChange={(event) => setSearchInput(event.currentTarget.value)} 
            />

            <Combobox
                store={combobox}
                onOptionSubmit={(role) => {
                    setRoleValue(role);
                    combobox.closeDropdown();
                }}
                resetSelectionOnOptionHover
            >
                <Combobox.Target>
                    <InputBase
                        component="button"
                        type="button"
                        pointer
                        radius="md"
                        rightSection={
                            roleValue !== null ? (
                                <CloseButton
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => setRoleValue(null)}
                                    aria-label="Clear value"
                                />
                            ) : (
                                <Combobox.Chevron />
                            )
                        }
                        onClick={() => combobox.toggleDropdown()}
                        rightSectionPointerEvents={roleValue === null ? 'none' : 'all'}
                    >
                        {roleValue || <Input.Placeholder>Filter by Role</Input.Placeholder>}
                    </InputBase>
                </Combobox.Target>
                <Combobox.Dropdown>
                    <Combobox.Options>
                        {comboOptions}
                    </Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>

            <MultiSelect 
                radius = "md"
                my="4"
                placeholder="Filter by skills"
                data={skillOptions}
            />

            <Button type="submit" color="#5c8593" mb="20">
                Search
            </Button>

            <ScrollArea type="never" scrollbars="y">
            {searchResults.length > 0 ? (
                <Grid align="stretch">
                    {searchResults.map((project) => (
                        <Grid.Col
                            span={{ base: 12, md: 6, lg: 4 }}
                            key={project._id}
                        >
                            <ProjectCard project={project} />
                        </Grid.Col>
                    ))}
                </Grid>
            ) : (
                <Alert
                    variant="light"
                    color="#5c8593"
                    title="No Results Found"
                    icon={<IoMdInformationCircleOutline />}
                />

            )}
            </ScrollArea>
            
        </form>
    );
}
