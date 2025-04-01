import { loadDatabaseDriver } from "../../src/repo/Driver";

var driver;

beforeEach(() => {
    driver = loadDatabaseDriver();
})

afterEach(async () => {
    await driver.destroy();
})

test("Creating a static verification code", async () => {
    let result = await driver.verificationRepository.RegisterVerification("test@example.com", "abc12345");
    expect(result).toBe(true);
})

test("Fail creating a static verification code", async () => {
    await driver.verificationRepository.RegisterVerification("test@example.com", "abc12345");
    let result = await driver.verificationRepository.RegisterVerification("test@example.com", "def12345");
    expect(result).toBe(false);
})

test("Deleting a static verification code", async () => {
    let result = await driver.verificationRepository.RegisterVerification("test@example.com", "abc12345");
    expect(result).toBe(true);
    result = await driver.verificationRepository.DeleteVerification("test@example.com")
    expect(result).toBe(true);
})

test("Fail deleting a static verification code", async () => {
    let result = await driver.verificationRepository.DeleteVerification("test@example.com")
    expect(result).toBe(false);
})

test("Verifying a static verification code", async () => {
    let result = await driver.verificationRepository.RegisterVerification("test@example.com", "abc12345");
    expect(result).toBe(true);
    result = await driver.verificationRepository.ValidateVerification("test@example.com", "abc12345")
    expect(result).toBe(true);
})

test("Fail verifying a static verification code (wrong code)", async () => {
    let result = await driver.verificationRepository.RegisterVerification("test@example.com", "abc12345");
    expect(result).toBe(true);
    result = await driver.verificationRepository.ValidateVerification("test@example.com", "def67890")
    expect(result).toBe(false);
})

test("Fail verifying a static verification code (doesn't exist)", async () => {
    let result = await driver.verificationRepository.ValidateVerification("test@example.com", "def67890")
    expect(result).toBe(false);
})