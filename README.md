[![Serverless Storage, for Framework](https://raw.githubusercontent.com/vulcancreative/serverless-storage/94f9538eb2269d637b1bc1f461ff4216100e54f3/assets/docs/readme/readme-image.png)](https://serverless.com/framework)
# Serverless Storage

`serverlessStorage` is a backend key/value library (similar to `localStorage` or `sessionStorage`), 
which uses a combination of DynamoDB and S3 to store data blobs, greatly simplifying database connectivity in 
a serverless environment.

## Installation

To install this plugin, you can use serverless plugin install, or you can use yarn or npm.

### With Serverless
```bash
serverless plugin install -n @vulcancreative/serverless-storage
```

Make sure you have `serverless-storage` in your plugin list:
```yaml
plugins:
  - "@vulcancreative/serverless-storage"

```

### With Yarn

```bash
yarn add --dev @vulcancreative/serverless-storage
```

then you need to manually add the plugin to your serverless.yml file:
```yaml
plugins:
  - "@vulcancreative/serverless-storage"
```

### With npm

```bash
npm install --save-dev @vulcancreative/serverless-storage
```

then you need to manually add the plugin to your serverless.yml file:
```yaml
plugins:
  - "@vulcancreative/serverless-storage"
```

## Configuration

Put these variables in your `serverless.yml` file:

```yaml
provider:
  environment:
    STORAGE_DEFAULT_REGION: us-east-1 # update this with the region you want
    STORAGE_BUCKET_NAME: "${self:custom.serverlessStorage.bucketName}"
    STORAGE_TABLE_NAME: "${self:custom.serverlessStorage.bucketName}"
  iam:
    role:
      statements:
        - Effect: "Allow"
          Action:
            - "dynamodb:CreateTable"
            - "dynamodb:DeleteItem"
            - "dynamodb:DeleteTable"
            - "dynamodb:DescribeTable"
            - "dynamodb:GetItem"
            - "dynamodb:PutItem"
            - "dynamodb:Query"
            - "iam:PassRole"
            - "kms:CreateGrant"
            - "kms:Decrypt"
            - "kms:DescribeKey"
            - "kms:Encrypt"
            - "kms:GenerateDataKey"
            - "kms:RevokeGrant"
            - "s3:*"
          Resource: "*"

custom:
  serverlessStorage:
    bucketName: '' # update this with the name of your bucket
    tableName: '' # update this with the name of your table
```


## Basic Usage

Saving data
```js
import { serverlessStorage } from "@vulcancreative/serverless-storage";

const myTable = process.env.STORAGE_TABLE_NAME;
//user part is partition key
//my-user-id is sort key
const myKey = "user:my-user-id";
const myValue = event;

const test = await serverlessStorage.putData(myKey, myValue, myTable);
```

Delete data
```js
const myTable = process.env.STORAGE_TABLE_NAME;
const myKey = "user:my-user-id";
const data = await serverlessStorage.removeData(myKey, myTable)
```

Check if key exists:
```js
const myTable = process.env.STORAGE_TABLE_NAME;
const myKey = "user:my-user-id";
await serverlessStorage.hasData(myKey, myTable)
```

Get item:
```js
const myTable = process.env.STORAGE_TABLE_NAME;
const myKey = "user:my-user-id";
const data = await serverlessStorage.getData(myKey, myTable)
```

## Example Project
Example implementation for this project can be found [here](https://github.com/vulcancreative/serverless-storage-test)


## Sponsors

Financing of this project's development is primarily sponsored by [Vulcan
Creative, a boutique digital product firm](https://vulcanca.com) and
[Kilo, Social Media for the Antisocial](https://kilo.ai).
