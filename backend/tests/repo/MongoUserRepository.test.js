import { config } from "dotenv";
import { UserRegistration } from "../../src/domain/User";
import { loadDatabaseDriver } from "../../src/repo/Driver";

var driver;

beforeAll(async () => {
    process.env.EXPLICIT_USE_MONGO = "true";
    config();

    driver = loadDatabaseDriver();
})

afterAll(async () => {
    await driver.destroy();
})

test("Tests getting a mongo user by ID", async () => {
    let result = await driver.userRepository.GetById("67bf9446fc89bb9e490cfe40");
    expect(result).toBeDefined();
    await driver.destroy();
})

test("Tests failing to get a mongo user by ID", async () => {
    let result = await driver.userRepository.GetById("67bf9446fc89bb9eaaaaaaaa");
    expect(result).not.toBeDefined();
    await driver.destroy();
})

test("Tests getting a mongo user only by Email", async () => {
    let result = await driver.userRepository.GetByEmail("john.smith@example.com");
    expect(result).toBeDefined();
    await driver.destroy();
})

test("Tests failing to get a mongo user only by Email", async () => {
    let result = await driver.userRepository.GetByEmail("a wrong email");
    expect(result).not.toBeDefined();
    await driver.destroy();
})

test("Tests getting a mongo user by Email and Password", async () => {
    let result = await driver.userRepository.GetByEmailAndPassword("john.smith@example.com", "SecurePassword123!");
    expect(result).toBeDefined();
    await driver.destroy();
})

test("Tests failing to get a mongo user by Email and Password", async () => {
    let result = await driver.userRepository.GetByEmailAndPassword("john.doe@example.com", "VeryWrongPassword");
    expect(result).not.toBeDefined();
    await driver.destroy();
})

test("Tests registering a mongo user", async () => {
    let result = await driver.userRepository.Register(new UserRegistration("Jane Smith", "jane.smith@example.com", "AnotherPassword!"));
    expect(result).toBeDefined();
    await driver.destroy();
})

test("Tests failing to register a mongo user", async () => {
    let result = driver.userRepository.Register(new UserRegistration("Jane Smith", "john.smith@example.com", "AnotherPassword!"));
    await expect(result).rejects.toThrow('already exists');
})