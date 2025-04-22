import {
    Project,
    ProjectCreation,
    ProjectRepository,
    ProjectUsers,
} from '../domain/Project.js'
import { Collection, Db, ObjectId } from 'mongodb'
import { PossibleSkills, PossibleRoles } from '../domain/User.js'
export class MongoProjectRepository implements ProjectRepository {
    private collection: Collection

    constructor(db: Db) {
        this.collection = db.collection('projects')
    }

    async GetAll(): Promise<Project[]> {
        const results = await this.collection
            .find({ isPrivate: false })
            .toArray()

        return results.map(
            (result) =>
                new Project(
                    result._id.toString(),
                    result.name,
                    result.domain,
                    result.owner,
                    result.isPrivate,
                    result.description,
                    result.fields,
                    result.users,
                    result.required_skills
                )
        )
    }

    async GetById(id: string): Promise<Project | undefined> {
        let result = await this.collection.findOne({ _id: new ObjectId(id) })
        if (!result) {
            return undefined
        }

        return new Project(
            result._id.toString(),
            result.name,
            result.domain,
            result.owner,
            result.isPrivate,
            result.description,
            result.fields,
            result.users,
            result.required_skills
        )
    }

    async GetByPartialName(name: string): Promise<Project[]> {
        let results = await this.collection
            .find({ name: { $regex: name }, isPrivate: false })
            .toArray()

        return results.map(
            (result) =>
                new Project(
                    result._id.toString(),
                    result.name,
                    result.domain,
                    result.owner,
                    result.isPrivate,
                    result.description,
                    result.fields,
                    result.users,
                    result.required_skills
                )
        )
    }

    async Create(project: ProjectCreation): Promise<Project> {
        // validate roles if users field is present
        if (project.users) {
            project.users = Object.fromEntries(
                Object.entries(project.users).filter(([role]) =>
                    PossibleRoles.includes(role)
                )
            )
        }

        if (project.required_skills) {
            project.required_skills = project.required_skills.filter((skill) =>
                PossibleSkills.includes(skill)
            )
        }

        const result = await this.collection.insertOne({
            name: project.name,
            domain: project.domain,
            owner: project.owner,
            isPrivate: project.isPrivate,
            description: project.description ?? '',
            fields: project.fields ?? [],
            users: project.users ?? {},
            required_skills: project.required_skills ?? [],
        })

        let returning = await this.GetById(result.insertedId.toString())

        if (!returning) {
            throw new Error('Failed to create project')
        }

        return returning
    }

    // async Update(id: string, updates: Partial<Project>): Promise<boolean> {
    //     const objectId = new ObjectId(id);

    //     if (updates.required_skills) {
    //         const allValid = updates.required_skills.every(skill =>
    //             PossibleSkills.includes(skill)
    //         );

    //         if (!allValid) {
    //             console.warn("Update failed: invalid skills in input.");
    //             return false;
    //         }
    //     }

    //     const result = await this.collection.updateOne(
    //         { _id: objectId }, // find by id
    //         { $set: updates } // do all the updates
    //     );

    //     // true if updated
    //     return result.modifiedCount > 0;
    // }

    async Update(id: string, updates: Partial<Project>): Promise<boolean> {
        const objectId = new ObjectId(id)

        // validate skills if present
        if (updates.required_skills) {
            const allValid = updates.required_skills.every((skill) =>
                PossibleSkills.includes(skill)
            )

            if (!allValid) {
                console.warn('Update failed: invalid skills in input.')
                return false
            }
        }

        // if users is present, preserve existing members
        if (updates.users) {
            console.warn(
                'Cannot edit project members from this endpoint. Updating roles...'
            )

            // Validate role keys
            const invalidRoles = Object.keys(updates.users).filter(
                (role) => !PossibleRoles.includes(role)
            )

            if (invalidRoles.length > 0) {
                console.warn('Update failed: invalid roles:', invalidRoles)
                return false
            }

            // get current project data
            const currentProject = await this.GetById(id)
            if (!currentProject) return false

            const cleanedUsers: ProjectUsers = {}

            // for any new roles, get the current users and merge with previous ones
            for (const [role, data] of Object.entries(updates.users)) {
                const currentUsers = currentProject.users?.[role]?.users ?? []

                cleanedUsers[role] = {
                    max: data.max, // allow max updates
                    users: currentUsers, // preserve current user list
                }
            }

            // Apply the cleaned-up structure back to updates
            updates.users = cleanedUsers
        }

        // apply the update normally
        const result = await this.collection.updateOne(
            { _id: objectId },
            { $set: updates }
        )

        return result.modifiedCount > 0
    }

    async AddUserToProject(
        project_id: string,
        user_id: string,
        roles: string[]
    ): Promise<boolean> {
        const project = await this.GetById(project_id)
        if (!project) return false

        // for each role that we're giving to a user
        for (const role of roles) {
            // validate the roles
            if (!PossibleRoles.includes(role)) {
                console.warn(`Skipping invalid role: ${role}`)
                continue
            }

            // create role if it doesn't exist
            if (!project.users[role]) {
                project.users[role] = {
                    max: 1,
                    users: [],
                }
            }

            // avoid duplicates
            if (!project.users[role].users.includes(user_id)) {
                project.users[role].users.push(user_id)
            }
        }

        return this.Update(project_id, { users: project.users })
    }
}
