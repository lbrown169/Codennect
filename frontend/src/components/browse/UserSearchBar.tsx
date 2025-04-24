import { useState, useContext, useEffect } from "react";
import { UserContext } from '../../hooks/UserContext';
import { FaSearch } from "react-icons/fa";
import { Alert, Button, Combobox, useCombobox, CloseButton, Grid, Input, InputBase, MultiSelect, ScrollArea, TextInput, Stack, Flex, Loader, Card, Group, Text, Divider, Badge } from "@mantine/core";

import { IoMdInformationCircleOutline } from 'react-icons/io';
import { searchUsers } from "../../api/UserAPI";
import { User } from "../../types/User";
import { Link } from "react-router-dom";

export function UserSearchBar()
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
        'Android (Kotlin/Java)',
        'Angular',
        'Arduino',
        'AWS',
        'C#',
        'C++',
        'Dart',
        'Docker',
        'Express.js',
        'Figma (UI/UX)',
        'Firebase',
        'Flutter',
        'Google Cloud',
        'GraphQL',
        'iOS (Swift)',
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
    const [skillValue, setSkillValue] = useState<string[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const searchIcon = <FaSearch />
    const [searchResults, setSearchResults] = useState<User[]>([]);

    useEffect(() => {
        doSearch();
    }, [user])

    if (!user) {
        return <Loader />;
    }

    /*
    const projects = user.projects.filter((project) =>
        Object.values(project.users)
            .map((role) => role.users.includes(user._id))
            .includes(true)
    );
    */

    const comboOptions = roleOptions.map((role) => (
        <Combobox.Option value={role} key={role}>
            {role}
        </Combobox.Option>
    ));

    async function doSearch(event?: React.FormEvent)
    {
        if (event) {
            event.preventDefault();
        }

        if (!user) {
            return;
        }

        try {
            let n = '';
            let s = '';
            let r = '';
            if(searchInput || skillValue.length > 0 || roleValue)
            {
                if(searchInput)
                {
                    //n += new URLSearchParams({ name: searchInput }).toString();
                    n += searchInput.toString();
                }
                if(skillValue.length > 0)
                {
                    //if(query.length > 1)   query += '&';
                    //query += new URLSearchParams({ required_skills: skillValue.toString() }).toString();
                    s += skillValue.toString();
                }
                if(roleValue)
                {
                    //if(query.length > 1)    query += '&';
                    //query += new URLSearchParams({ roles: roleValue });
                    r += roleValue.toString();
                }
                //query += new URLSearchParams({ name: searchInput, required_skills: skillValue.toString(), roles: roleString }).toString();
                
            }

            const query = {
                name: n,
                skills: s,
                roles: r,
            }

            const response = await searchUsers(query);
            const res = await response.json();

            if(res.error)
            {
                alert(res.error);
                return;
            }
            const allResults = res.result;

            setSearchResults(allResults);
        }
        catch(error: unknown) {
            console.log(error);
        }
        
    }

    return(
        <Stack gap='xl'>
            <form onSubmit={doSearch}>
                <Flex align="middle" gap="lg">
                    <TextInput
                        className="grow-3"
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
                                className="grow-1"
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
                        className="grow-1"
                        radius = "md"
                        placeholder="Filter by skills"
                        data={skillOptions}
                        value={skillValue}
                        onChange={setSkillValue}
                        searchable
                    />

                    <Button className="grow-0" type="submit" color="#5c8593">
                        Search
                    </Button>

                </Flex>
            </form>

            <ScrollArea type="never" scrollbars="y">
            {searchResults.length > 0 ? (
                <Grid align="stretch">
                    {searchResults.map((user) => (
                        <Grid.Col
                            span={{ base: 12, md: 6, lg: 4 }}
                            key={user._id}
                        >
                            <Card
                                className="h-full gap-3"
                                shadow="sm"
                                padding="lg"
                                radius="md"
                                withBorder
                            >
                                <Stack>
                                    <Link to={`/users/${user._id}`}>
                                        <Text fw={500}>{user.name}</Text>
                                    </Link>
                                </Stack>
                                <Divider />
                                <Stack>
                                    <Text size="sm" c="dimmed">
                                        User Roles
                                    </Text>
                                    <Group>
                                        {user.roles.map((role) => (
                                            <Badge color="#5b8580" key={role}>
                                                {role}
                                            </Badge>
                                        ))}
                                    </Group>
                                </Stack>
                                <Stack gap="xs">
                                    <Text size="sm" c="dimmed">
                                        User Skills
                                    </Text>
                                    <Group>
                                        {user.skills.slice(0, 6).map((role) => (
                                            <Badge color="#5b8580" key={role}>
                                                {role}
                                            </Badge>
                                        ))}
                                    </Group>
                                </Stack>
                            </Card>
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
        </Stack>
    );
}
