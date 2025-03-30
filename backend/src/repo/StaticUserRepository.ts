import { randomInt } from "crypto";
import { Account } from "../domain/Account";
import { Invite } from "../domain/Invite";
import { User, UserRegistration, UserRepository } from "../domain/User";

class StaticUser extends User {
    password: string;

    constructor(
        _id: string,
        name: string,
        email: string,
        comm: string,
        skills: string[],
        roles: string[],
        interests: string[],
        accounts: Account[],
        projects: string[],
        invites: Invite[],
        password: string
    ) {
        super(
            _id,
            name,
            email,
            comm,
            skills,
            roles,
            interests,
            accounts,
            projects,
            invites
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
                "john.doe@example.com",
                "Online",
                ["React", "Tailwind", "Typescript"],
                ["frontend"],
                ["games"],
                [],
                [],
                [],
                "SuperSecret123!"
            ),
            new StaticUser(
                "1",
                "Jane Doe",
                "jane.doe@example.com",
                "In Person",
                ["Python", "Flask", "SQL"],
                ["backend", "database"],
                ["games"],
                [],
                [],
                [],
                "VeryS3cureP4ssw0!d"
            ),
        ];
    }

    async GetById(id: string): Promise<User | undefined> {
        return Promise.resolve(this._internal.find((user) => user._id === id));
    }

    async GetByEmail(email: string): Promise<User | undefined> {
        return Promise.resolve(
            this._internal.find((user) => user.email === email)
        );
    }

    async GetByEmailAndPassword(
        email: string,
        password: string
    ): Promise<User | undefined> {
        return Promise.resolve(
            this._internal.find(
                (user) => user.email === email && user.password === password
            )
        );
    }

    async Register(user: UserRegistration): Promise<User> {
        if ((await this.GetByEmail(user.email)) !== undefined) {
            throw new Error("A user with that email already exists");
        }

        const newUser = new StaticUser(
            randomInt(1000000).toString(),
            user.name,
            user.email,
            "",
            [],
            [],
            [],
            [],
            [],
            [],
            user.password
        );

        this._internal.push(newUser);

        return Promise.resolve(newUser);
    }

    async updateUser(id: string, updates: Partial<User>) {
        // find user, return false if not found
        const user = this._internal.find(user => user._id === id);
        
        if (!user)
            return false;
    
        // update the found user
        Object.assign(user, updates);

        return true;
    }
}
