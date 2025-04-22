import { UserRegistration } from "src/domain/User.js";
import { loadDatabaseDriver } from "src/repo/Driver.js";
import { test, expect } from "@jest/globals";

test("Tests getting a static user by ID", async () => {
    let driver = loadDatabaseDriver();

    let result = await driver.userRepository.GetById("0");
    expect(result).toBeDefined();
});

test("Tests failing to get a static user by ID", async () => {
    let driver = loadDatabaseDriver();

    let result = await driver.userRepository.GetById("100");
    expect(result).not.toBeDefined();
});

test("Tests getting a static user by Email", async () => {
    let driver = loadDatabaseDriver();

    let result = await driver.userRepository.GetByEmail("jane.doe@example.com");
    expect(result).toBeDefined();
});

test("Tests failing to get a static user by Email", async () => {
    let driver = loadDatabaseDriver();

    let result = await driver.userRepository.GetByEmail("a wrong email");
    expect(result).not.toBeDefined();
});

test("Tests getting a static user by Email and Password", async () => {
    let driver = loadDatabaseDriver();

    let result = await driver.userRepository.GetByEmailAndPassword(
        "john.doe@example.com",
        "SuperSecret123!"
    );
    expect(result).toBeDefined();
});

test("Tests failing to get a static user by Email and Password", async () => {
    let driver = loadDatabaseDriver();

    let result = await driver.userRepository.GetByEmailAndPassword(
        "john.doe@example.com",
        "VeryWrongPassword"
    );
    expect(result).not.toBeDefined();
});

/*
test("Tests registering a static user", async () => {
    let driver = loadDatabaseDriver();

    let result = await driver.userRepository.Register(
        new UserRegistration(
            "Jane Smith",
            "jane.smith@example.com",
            "AnotherPassword!"
        )
    );
    expect(result).toBeDefined();
});
*/

/*
test("Tests failing to register a static user", async () => {
    let driver = loadDatabaseDriver();

    expect(async () => {
        await driver.userRepository.Register(
            new UserRegistration(
                "Jane Smith",
                "jane.doe@example.com",
                "AnotherPassword!"
            )
        );
    }).rejects.toThrow("already exists");
});
*/
