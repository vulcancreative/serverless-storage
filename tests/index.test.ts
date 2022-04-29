import sinon from 'sinon';
import { describe, beforeEach, afterEach, it} from "mocha";

import ServerlessStorage from '../src/index';
// import {ServerlessInstance, ServerlessOptions} from "../src/types";
import DynamoDB from "../src/aws/dynamodb";
// import Operations from "../src/operations";
// import * as assert from "assert";

const plugin = ServerlessStorage;
const TIMEOUT = 10000;
// const provider = {
//     getCredentials: () => {
//         return {
//             credentials: ''
//         }
//     },
//     getRegion: () => {
//         return 'us-west-2'
//     },
//     getStage: () => {
//         return 'dev'
//     },
//     sdk: {
//         APIGateway: {},
//         ApiGatewayV2: {},
//         Route53: {},
//         CloudFormation: {},
//         ACM: {},
//         config: {
//             update: null,
//         },
//     }
// }

// const serverless: ServerlessInstance = {
//     providers: {
//         aws: provider
//     },
//     service: {
//         service: 'test',
//         custom: {
//             serverlessStorage: {
//                 tableName: "test-table",
//                 kmsKey: "somestring",
//                 defaultRegion: "us-west-2",
//             }
//         },
//         provider: {
//             stage: 'test',
//             stackName: 'test-stack',
//             compiledCloudFormationTemplate: {
//                 Outputs: {}
//             },
//             apiGateway: {
//                 restApiId: 'test-rest-api-id',
//                 websocketApiId: 'test-websocket-api-id',
//             },
//         },
//     },
//     cli: {
//         log: () => {
//         },
//         consoleLog: () => {
//         }
//     },
// };

// const serverlessOptions: ServerlessOptions = {
//     stage : 'test'
// }

describe('test', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(() => {
        console.log("ok");
        // const serverlessStorageTest: Operations = new ServerlessStorage(serverless, serverlessOptions);

        // const serverlessStorageStub = sinon.createStubInstance(serverlessStorageTest);

        // sandbox.stub(Operations, "putData").returns(Promise.resolve("ok"));

        // const exists = await DynamoDB.existsTable(tableName);
        // if (exists) return true;
        //
        // await DynamoDB.create(tableName);
        // await DynamoDB.waitForCreate(tableName);

        sandbox.stub(DynamoDB, "existsTable").returns(Promise.resolve(true));
        sandbox.stub(DynamoDB, "create").returns(Promise.resolve(true));
        sandbox.stub(DynamoDB, "waitForCreate").returns(Promise.resolve(true));



        // sandbox.stub(plugin, 'serverlessStorage').returns(serverlessStorageStub);
        // sandbox.stub(serverlessStorageTest, 'putData').returns(Promise.resolve("ok"));

        // sandbox.stub(plugin, 'getTableNamesFromStack').returns(Promise.resolve([
        //     'test-table-name'
        // ]));
        // sandbox.stub(plugin, 'createGlobalTable').returns(Promise.resolve());
        // sandbox.stub(plugin, 'createUpdateCfnStack').returns(Promise.resolve());
    });
    afterEach(() => {
        sandbox.restore();
    });

    it('should properly put data in in dynamoDB', async () => {
        const waitCreate = sandbox.spy(DynamoDB, "waitCreate");
        // const putData = sandbox.spy(DynamoDB, "putData");
        plugin.serverlessStorage.putData('table-name', 'key', 'value');
        // sandbox.assert.calledOnce(plugin.serverlessStorage.putData);
        // const mySpy = sinon.spy(DynamoDB, "waitCreate");
        waitCreate.restore();
        // putData.restore();
        // sandbox.assert.calledOnce(putData);
        sandbox.assert.calledOnce(waitCreate);
        // assert.equal(test, 'ok');
    }).timeout(TIMEOUT);

});
