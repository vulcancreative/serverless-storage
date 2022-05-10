import sinon from 'sinon';
import { describe, beforeEach, afterEach, it} from "mocha";

import ServerlessStorage from '../src/index';
// import {ServerlessInstance, ServerlessOptions} from "../src/types";
import DynamoDB from "../src/aws/dynamodb";
import * as AWS from "aws-sdk";
// import Operations from "../src/operations";
// import * as assert from "assert";

const plugin = ServerlessStorage;
const TIMEOUT = 10000;

describe('Test create table', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    })

    it('should be able to create a table', async () => {
        const create = sandbox.spy(DynamoDB, "create");
        await plugin.serverlessStorage.createTable('table-name');
        create.restore();
        sandbox.assert.calledOnce(create);
    }).timeout(TIMEOUT);

    it('should be able to create a table (with wait)', async () => {
        sandbox.stub(DynamoDB, "existsTable").returns(Promise.resolve(false));
        sandbox.stub(DynamoDB, "create").returns(Promise.resolve(true));
        sandbox.stub(DynamoDB, "waitForCreate").returns(Promise.resolve(true));

        const waitCreate = sandbox.spy(DynamoDB, "waitCreate");
        await plugin.serverlessStorage.createTable('table-name', true);
        waitCreate.restore();
        sandbox.assert.calledOnce(waitCreate);
    }).timeout(TIMEOUT);

    it('should be able to remove a table', async () => {
        const remove = sandbox.spy(DynamoDB, "remove");
        await plugin.serverlessStorage.removeTable('table-name');
        remove.restore();
        sandbox.assert.calledOnce(remove);
    }).timeout(TIMEOUT);

    it('should be able to remove a table (with wait)', async () => {
        sandbox.stub(DynamoDB, "existsTable").returns(Promise.resolve(false));
        sandbox.stub(DynamoDB, "remove").returns(Promise.resolve(true));
        sandbox.stub(DynamoDB, "waitForRemove").returns(Promise.resolve(true));

        const waitRemove = sandbox.spy(DynamoDB, "waitRemove");
        await plugin.serverlessStorage.removeTable('table-name', true);
        waitRemove.restore();
        sandbox.assert.calledOnce(waitRemove);
    }).timeout(TIMEOUT);
})

describe('Test basic functionalities', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(() => {
        sandbox.stub(DynamoDB, "existsTable").returns(Promise.resolve(true));
        sandbox.stub(DynamoDB, "create").returns(Promise.resolve(true));
        sandbox.stub(DynamoDB, "waitForCreate").returns(Promise.resolve(true));

    });
    afterEach(() => {
        sandbox.restore();
    });

    it('should properly put data in in dynamoDB', async () => {
        const db = new AWS.DynamoDB({
            apiVersion: "2012-08-10",
            region: "us-west-2",
        })

        sandbox.stub(DynamoDB, "dial").returns(db);
        sandbox.stub(db, "putItem").returns(Promise.resolve(true));
        sandbox.stub(DynamoDB, "removeData").returns(Promise.resolve(true));

        const waitCreate = sandbox.spy(DynamoDB, "waitCreate");
        const putData = sandbox.spy(DynamoDB, "putData");
        await plugin.serverlessStorage.putData('key', 'data', 'table-name');
        waitCreate.restore();
        putData.restore();
        sandbox.assert.calledOnce(putData);
        sandbox.assert.calledOnce(waitCreate);
    }).timeout(TIMEOUT);

    it('should properly put data in in dynamoDB (legacy)', async () => {
        const db = new AWS.DynamoDB({
            apiVersion: "2012-08-10",
            region: "us-west-2",
        })

        sandbox.stub(DynamoDB, "dial").returns(db);
        sandbox.stub(db, "putItem").returns(Promise.resolve(true));
        sandbox.stub(DynamoDB, "removeData").returns(Promise.resolve(true));

        const waitCreate = sandbox.spy(DynamoDB, "waitCreate");
        const putData = sandbox.spy(DynamoDB, "putData");
        await plugin.serverlessStorage.putItem('key', 'data', 'table-name');
        waitCreate.restore();
        putData.restore();
        sandbox.assert.calledOnce(putData);
        sandbox.assert.calledOnce(waitCreate);
    }).timeout(TIMEOUT);

    it('should properly put data in in dynamoDB (legacy - multiple items)', async () => {
        const db = new AWS.DynamoDB({
            apiVersion: "2012-08-10",
            region: "us-west-2",
        })

        sandbox.stub(DynamoDB, "dial").returns(db);
        sandbox.stub(db, "putItem").returns(Promise.resolve(true));
        sandbox.stub(DynamoDB, "removeData").returns(Promise.resolve(true));

        const waitCreate = sandbox.spy(DynamoDB, "waitCreate");
        const putData = sandbox.spy(DynamoDB, "putData");
        await plugin.serverlessStorage.putItems('key', 'data', 'table-name');
        waitCreate.restore();
        putData.restore();
        sandbox.assert.calledOnce(putData);
        sandbox.assert.calledOnce(waitCreate);
    }).timeout(TIMEOUT);

    it('should properly get data in dynamoDB', async () => {
        const getData = sandbox.spy(DynamoDB, "getData");
        await plugin.serverlessStorage.getData('key', 'table-name');
        getData.restore();
        sandbox.assert.calledOnce(getData);
    }).timeout(TIMEOUT);

    it('should properly get data in dynamoDB (legacy)', async () => {
        const getData = sandbox.spy(DynamoDB, "getData");
        await plugin.serverlessStorage.getItem('key', 'table-name');
        getData.restore();
        sandbox.assert.calledOnce(getData);
    }).timeout(TIMEOUT);

    it('should properly get data in dynamoDB (legacy - get multiple data)', async () => {
        const getData = sandbox.spy(DynamoDB, "getData");
        await plugin.serverlessStorage.getItems('key', 'table-name');
        getData.restore();
        sandbox.assert.calledOnce(getData);
    }).timeout(TIMEOUT);

    it('should properly remove data in dynamoDB', async () => {
        const removeData = sandbox.spy(DynamoDB, "removeData");
        await plugin.serverlessStorage.removeData('key', 'table-name');
        removeData.restore();
        sandbox.assert.calledOnce(removeData);
    }).timeout(TIMEOUT);

    it('should properly remove data in dynamoDB (legacy)', async () => {
        const removeData = sandbox.spy(DynamoDB, "removeData");
        await plugin.serverlessStorage.removeItem('key', 'table-name');
        removeData.restore();
        sandbox.assert.calledOnce(removeData);
    }).timeout(TIMEOUT);

    it('should properly remove data in dynamoDB (legacy - multiple items)', async () => {
        const removeData = sandbox.spy(DynamoDB, "removeData");
        await plugin.serverlessStorage.removeItems('key', 'table-name');
        removeData.restore();
        sandbox.assert.calledOnce(removeData);
    }).timeout(TIMEOUT);

    it('should be able to check if data exists in dynamoDB', async () => {
        const existsKey = sandbox.spy(DynamoDB, "existsKey");
        await plugin.serverlessStorage.hasData('key', 'table-name');
        existsKey.restore();
        sandbox.assert.calledOnce(existsKey);
    }).timeout(TIMEOUT);

    it('should be able to check if data exists in dynamoDB (legacy)', async () => {
        const existsKey = sandbox.spy(DynamoDB, "existsKey");
        await plugin.serverlessStorage.hasItem('key', 'table-name');
        existsKey.restore();
        sandbox.assert.calledOnce(existsKey);
    }).timeout(TIMEOUT);

    it('should be able to check if data exists in dynamoDB (legacy - check multiple data)', async () => {
        const existsKey = sandbox.spy(DynamoDB, "existsKey");
        await plugin.serverlessStorage.hasItems('key', 'table-name');
        existsKey.restore();
        sandbox.assert.calledOnce(existsKey);
    }).timeout(TIMEOUT);

});
