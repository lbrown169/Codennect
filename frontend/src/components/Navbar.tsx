import { AppShell, Group, NavLink, ScrollArea } from '@mantine/core'
import { useContext } from 'react'
import { FaRegAddressBook, FaRegUser } from 'react-icons/fa'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdExit } from 'react-icons/io'
import { LuCrown, LuCirclePlus } from 'react-icons/lu'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { UserContext } from '../hooks/UserContext'

export function Navbar() {
    const { user } = useContext(UserContext)

    return (
        <AppShell.Navbar p="md">
            {user ? (
                <>
                    <AppShell.Section>
                        <NavLink
                            href="/"
                            label="Dashboard"
                            autoContrast
                            leftSection={<MdOutlineSpaceDashboard size={16} />}
                        />
                    </AppShell.Section>
                    <AppShell.Section grow my="md" component={ScrollArea}>
                        <div>
                            <p className="uppercase text-sm font-bold text-[#5c8593] pb-1">
                                Projects
                            </p>
                            <NavLink
                                label="My Projects"
                                childrenOffset={56}
                                autoContrast
                                leftSection={<LuCrown size={16} />}
                            >
                                {user.projects.map((project) => (
                                    <NavLink
                                        key={project._id}
                                        label={project.name}
                                        href={`/projects/${project._id}`}
                                    />
                                ))}
                            </NavLink>
                            <NavLink
                                href="/projects"
                                label="Browse Projects"
                                autoContrast
                                leftSection={<FaMagnifyingGlass size={16} />}
                            ></NavLink>
                            <NavLink
                                href="/projects/create"
                                label="Create Project"
                                autoContrast
                                leftSection={<LuCirclePlus size={16} />}
                            ></NavLink>
                        </div>
                        <br />
                        <div>
                            <p className="uppercase text-sm font-bold text-[#5c8593] pb-1">
                                Users
                            </p>
                            <NavLink
                                href="/users/me"
                                label="My Profile"
                                autoContrast
                                leftSection={<FaRegUser size={16} />}
                            />
                            <NavLink
                                href="/users/related"
                                label="My Teams"
                                autoContrast
                                leftSection={<FaRegAddressBook size={16} />}
                            />
                            <NavLink
                                href="/users"
                                label="Browse Users"
                                autoContrast
                                leftSection={<FaMagnifyingGlass size={16} />}
                            />
                        </div>
                    </AppShell.Section>
                    <AppShell.Section>
                        <Group justify="space-between" mx="md">
                            <p>
                                Logged in as{' '}
                                <span className="font-bold text-[#5c8593] pb-1">
                                    {user.name}
                                </span>
                            </p>
                            <Link to="/logout">
                                <IoMdExit size={25} />
                            </Link>
                        </Group>
                    </AppShell.Section>
                </>
            ) : (
                <AppShell.Section>
                    <p className="uppercase text-sm font-bold text-[#5c8593] pb-1">
                        Loading user...
                    </p>
                </AppShell.Section>
            )}
        </AppShell.Navbar>
    )
}
