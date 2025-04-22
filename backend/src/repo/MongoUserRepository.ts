import {
    User,
    UserRegistration,
    UserRepository,
    VerificationInUser,
    PossibleSkills,
    PossibleRoles,
} from '../domain/User.js';
import { HashPassword } from '../service/auth.js';

import { Collection, Db, ObjectId } from 'mongodb';
import { isProd } from '../utils.js';
import bcrypt from 'bcrypt';

export class MongoUserRepository implements UserRepository {
    private collection: Collection;

    constructor(db: Db) {
        this.collection = db.collection('users');
    }

    async GetAll(): Promise<User[]> {
        const results = await this.collection
            .find({ isPrivate: false })
            .toArray();

        return results.map(
            (result) =>
                new User(
                    result._id.toString(),
                    result.name,
                    result.isPrivate,
                    result.email,
                    result.comm,
                    result.skills,
                    result.roles,
                    result.interests,
                    result.accounts,
                    result.projects,
                    result.verification
                )
        );
    }

    async GetById(id: string): Promise<User | undefined> {
        let result = await this.collection.findOne({ _id: new ObjectId(id) });
        if (!result) {
            return undefined;
        }

        return new User(
            result._id.toString(),
            result.name,
            result.isPrivate,
            result.email,
            result.comm,
            result.skills,
            result.roles,
            result.interests,
            result.accounts,
            result.projects,
            result.verification
        );
    }

    async GetByEmail(email: string): Promise<User | undefined> {
        let result = await this.collection.findOne({ email: email });
        if (!result) {
            return undefined;
        }

        return new User(
            result._id.toString(),
            result.name,
            result.isPrivate,
            result.email,
            result.comm,
            result.skills,
            result.roles,
            result.interests,
            result.accounts,
            result.projects,
            result.verification
        );
    }

    async GetByEmailAndPassword(
        email: string,
        password: string
    ): Promise<User | undefined> {
        let result = await this.collection.findOne({ email: email });

        // if couldn't find by email
        if (!result) {
            return undefined;
        }

        // compare hashed password
        const isMatch = await bcrypt.compare(password, result.password);

        // if couldn't find by password
        if (!isMatch) {
            return undefined;
        }

        return new User(
            result._id.toString(),
            result.name,
            result.isPrivate,
            result.email,
            result.comm,
            result.skills,
            result.roles,
            result.interests,
            result.accounts,
            result.projects,
            result.verification
        );
    }

    async Register(user: UserRegistration): Promise<User> {
        if ((await this.GetByEmail(user.email)) !== undefined) {
            throw new Error('A user with that email already exists');
        }

        const result = await this.collection.insertOne({
            name: user.name,
            isPrivate: false,
            email: user.email,
            password: await HashPassword(user.password),
            accounts: {},
            comm: '',
            skills: [],
            roles: [],
            interests: [],
            projects: [],
            verification: user.verification,
        });

        let returning = await this.GetById(result.insertedId.toString());

        if (!returning) {
            throw new Error('Failed to create user');
        }

        return returning;
    }

    async Update(id: string, updates: Partial<User>): Promise<boolean> {
        const objectId = new ObjectId(id);

        // make sure all the skills are correct
        if (updates.skills) {
            const allValid = updates.skills.every((skill) =>
                PossibleSkills.includes(skill)
            );

            // crash if not, can be changed
            if (!allValid) {
                console.warn('Update failed: invalid skills detected.');
                return false;
            }
        }

        // make sure all the roles are correct
        if (updates.roles) {
            const allValid = updates.roles.every((role) =>
                PossibleRoles.includes(role)
            );

            // crash if not, can be changed
            if (!allValid) {
                console.warn('Update failed: invalid roles detected.');
                return false;
            }
        }

        const result = await this.collection.updateOne(
            { _id: objectId }, // find by id
            { $set: updates } // do all the updates
        );

        // true if updated
        return result.modifiedCount > 0;
    }

    async UpdatePassword(id: string, newPassword: string): Promise<boolean> {
        const objectId = new ObjectId(id);

        const newHashedPassword = await HashPassword(newPassword);

        const result = await this.collection.updateOne(
            { _id: objectId }, // find by id
            { $set: { password: newHashedPassword } } // do the update
        );

        // true if updated
        return result.modifiedCount > 0;
    }

    async ValidateVerification(code: string): Promise<boolean> {
        let result = await this.collection.findOne({
            verification: { $ne: null },
            'verification.code': code,
        });

        if (result === null) {
            return false;
        }
        if (result.expires < Date.now()) {
            return false;
        }
        return true;
    }

    async DeleteVerification(code: string): Promise<boolean> {
        let result = await this.collection.updateOne(
            { 'verification.code': code },
            { $set: { verification: null } } // do the update
        );

        // true if updated
        return true;
    }
}
