import { useState } from "react";
import { ProjectCard } from "../dashboard/ProjectsPanel";
import { FaSearch } from "react-icons/fa";
import { Button, Combobox, useCombobox, CloseButton, Input, InputBase, MultiSelect, TextInput } from "@mantine/core";

export function ProjectSearchBar()
{

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
    const [skillValues, setSkillValues] = useState<string[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const searchIcon = <FaSearch />

    const comboOptions = roleOptions.map((role) => (
        <Combobox.Option value={role} key={role}>
            {role}
        </Combobox.Option>
    ));


    async function doSearch(event: React.FormEvent)
    {
        event.preventDefault();
        alert("WIP");
    }

    

    return(
        <form onSubmit={doSearch}>
            <TextInput
                placeholder="Search"
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
                placeholder="Filter by skills"
                data={skillOptions}
            />

            <Button type="submit" color="#5c8593">
                Search
            </Button>
            
        </form>
    );
}