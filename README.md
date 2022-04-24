#Serverless Storage

Serverless storage is key value storage, using DynamoDB as the backend for data storing, and
S3 to store files.

## Usage

Saving data
```js
import { serverlessStorage } from "@vulcancreative/serverless-storage";

const test = await serverlessStorage.putData(myKey, myValue, myTable);
```

Delete data
```js
const data = await serverlessStorage.removeData(myKey, myTable)
```

Check if key exists:
```js
await serverlessStorage.hasData(myKey, myTable)
```

Get item:
```js
const data = await serverlessStorage.getData(myKey, myTable)
```

# Example Project
Example implementation for this project can be found [here](https://github.com/vulcancreative/serverless-storage-test)
