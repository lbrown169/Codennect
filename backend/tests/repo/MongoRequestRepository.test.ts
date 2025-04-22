import { Driver, loadDatabaseDriver } from 'src/repo/Driver.js';
import { beforeEach, afterEach, test, expect } from '@jest/globals';
import { Request, RequestType } from 'src/domain/Request.js';
import { config } from 'dotenv';

var driver: Driver
var project_id = crypto.randomUUID()
var user_id = crypto.randomUUID()

beforeEach(() => {
    process.env.EXPLICIT_USE_MONGO = 'true';
    config();

    driver = loadDatabaseDriver()
})

afterEach(async () => {
    await driver.requestRepository.DeleteRequest(
        new Request(
            project_id,
            user_id,
            RequestType.INVITE,
            ['frontend'],
            'message'
        )
    )
    await driver.requestRepository.DeleteRequest(
        new Request(
            project_id,
            user_id,
            RequestType.APPLICATION,
            ['frontend'],
            'message'
        )
    )
    await driver.destroy()
})

test('Tests creating and getting an invite', async () => {
    let req = new Request(
        project_id,
        user_id,
        RequestType.INVITE,
        ['frontend'],
        'Inviting user to project'
    );

    let result = await driver.requestRepository.CreateRequest(req)
    expect(result).toBe(true)

    let returned = await driver.requestRepository.GetUserInvites(user_id)
    expect(returned).toContainEqual(req)

    returned = await driver.requestRepository.GetUserApplications(user_id)
    expect(returned).not.toContainEqual(req)

    returned = await driver.requestRepository.GetProjectInvites(project_id)
    expect(returned).toContainEqual(req)

    returned = await driver.requestRepository.GetProjectApplications(project_id)
    expect(returned).not.toContainEqual(req)
})

test('Tests failing to create an invite', async () => {
    let req = new Request(
        project_id,
        user_id,
        RequestType.INVITE,
        ['frontend'],
        'Inviting user to project'
    );

    let result = await driver.requestRepository.CreateRequest(req)
    expect(result).toBe(true)

    let returned = await driver.requestRepository.GetUserInvites(user_id)
    expect(returned).toContainEqual(req)

    result = await driver.requestRepository.CreateRequest(req)
    expect(result).toBe(false)
})

test('Tests failing to get an invite', async () => {
    let returned = await driver.requestRepository.GetUserInvites(user_id);
    expect(returned).toHaveLength(0);
});

test('Tests creating and getting an application', async () => {
    let req = new Request(
        project_id,
        user_id,
        RequestType.APPLICATION,
        ['frontend'],
        'Requesting to join project'
    );

    let result = await driver.requestRepository.CreateRequest(req)
    expect(result).toBe(true)

    let returned = await driver.requestRepository.GetUserApplications(user_id)
    expect(returned).toContainEqual(req)

    returned = await driver.requestRepository.GetUserInvites(user_id)
    expect(returned).not.toContainEqual(req)

    returned = await driver.requestRepository.GetProjectApplications(project_id)
    expect(returned).toContainEqual(req)

    returned = await driver.requestRepository.GetProjectInvites(project_id)
    expect(returned).not.toContainEqual(req)
})

test('Tests deleting a request', async () => {
    let req = new Request(
        project_id,
        user_id,
        RequestType.APPLICATION,
        ['frontend'],
        'Requesting to join project'
    );

    let result = await driver.requestRepository.CreateRequest(req)
    expect(result).toBe(true)

    let returned = await driver.requestRepository.GetUserApplications(user_id)
    expect(returned).toContainEqual(req)

    await driver.requestRepository.DeleteRequest(req)

    returned = await driver.requestRepository.GetUserApplications(user_id)
    expect(returned).not.toContainEqual(req)
})
