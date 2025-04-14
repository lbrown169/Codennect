import { Account } from "../domain/Account.js";
import { HashPassword } from "../service/auth.js";
import { User, UserRegistration, UserRepository } from "../domain/User.js";
import { randomInt } from "crypto";
import bcrypt from "bcrypt";

class StaticUser extends User {
    password: string;

    constructor(
        _id: string,
        name: string,
        isPrivate: boolean,
        email: string,
        comm: string,
        skills: string[],
        roles: string[],
        interests: string[],
        accounts: Account[],
        projects: string[],
        password: string
    ) {
        super(
            _id,
            name,
            isPrivate,
            email,
            comm,
            skills,
            roles,
            interests,
            accounts,
            projects
        );
        this.password = password;
    }
}

export class StaticUserRepository implements UserRepository {
    private _internal: StaticUser[];

    constructor() {
        this._internal = [
            new StaticUser(
                "0",
                "John Doe",
                false,
                "john.doe@example.com",
                "Online",
                ["React", "Tailwind", "Typescript"],
                ["frontend"],
                ["games"],
                [],
                [],
                "$2b$10$px4/4rdjDTmlqv9nd0/A8OTOMwUUEx.wIgXua/AtS0IdTnzgGvAUG" //"SuperSecret123!"
            ),
            new StaticUser(
                "1",
                "Jane Doe",
                true,
                "jane.doe@example.com",
                "In Person",
                ["Python", "Flask", "SQL"],
                ["backend", "database"],
                ["games"],
                [],
                [],
                "$2b$10$Qs8T/bvyZ20GaQo2tLCEge1F3XGZkyODeibH2dTJbBmUet/WYnBje" //"VeryS3cureP4ssw0!d"
            ),
        ];
    }

    _trim(user: StaticUser | undefined): User | undefined {
        if (!user) return user;
        return new User(
            user._id.toString(),
            user.name,
            user.email,
            user.comm,
            user.skills,
            user.roles,
            user.interests,
            user.accounts,
            user.projects
        );
    }

    async GetById(id: string): Promise<User | undefined> {
        return this._trim(this._internal.find((user) => user._id === id));
    }

    async GetByEmail(email: string): Promise<User | undefined> {
        return this._trim(this._internal.find((user) => user.email === email));
    }

    async GetByEmailAndPassword(
        email: string,
        password: string
    ): Promise<User | undefined> {
        const user = this._internal.find((user) => user.email === email);

        // if couldn't find by email
        if (!user) {
            return undefined;
        }

        // compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        // if couldn't find by password
        if (!isMatch) {
            return undefined;
        }

        return this._trim(user);
    }

    async GetAll(): Promise<User[]> {
        return Promise.resolve(this._internal);
    }

    async Register(user: UserRegistration): Promise<User> {
        if ((await this.GetByEmail(user.email)) !== undefined) {
            throw new Error("A user with that email already exists");
        }

        const newUser = new StaticUser(
            randomInt(1000000).toString(),
            user.name,
            false,
            user.email,
            "",
            [],
            [],
            [],
            [],
            [],
            await HashPassword(user.password)
        );

        this._internal.push(newUser);

        return this._trim(newUser)!;
    }

    async Update(id: string, updates: Partial<User>): Promise<boolean> {
        // find user, return false if not found
        const user = this._internal.find((user) => user._id === id);

        if (!user) return false;

        // update the found user
        Object.assign(user, updates);

        return true;
    }
}
