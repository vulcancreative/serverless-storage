<!--
title: 'AWS TypeScript Example'
description: 'This template demonstrates how to deploy a TypeScript function running on AWS Lambda using Serverless Framework.'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
priority: 1
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->


# Serverless Storage

Serverless storage is key value storage, using DynamoDB as the backend for data storing, and 
S3 to store files.

## Usage

### Deployment

In order to deploy the example, you need to run the following command:

```
$ serverless deploy --stage dev
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-typescript to stage dev (us-east-1)

Serverless Storage: Database storage already exists
Serverless Storage: File storage already exists

✔ Service deployed to stack vulcan-storage-test-dev (84s)

functions:
  insert: vulcan-storage-test-dev-insert (7.9 kB)
  check: vulcan-storage-test-dev-check (7.9 kB)
  get: vulcan-storage-test-dev-get (7.9 kB)

Update available. Run "npm install -g serverless@^3.15.2" to update
```

### Invocation

After successful deployment, you can invoke the deployed function by using the following command:

```bash
serverless invoke --function insert --data '{"a":"bar"}' --stage dev
```

Which should result in response similar to the following:

```json
{
    "message": "Go Serverless v1.0!",
    "input": {
        "a": "bar"
    }
}
```

To get the data, you can use the following command:
```bash
serverless invoke --function get --stage dev
```

```json
{
    "message": "Hello Data exists",
    "data": {
        "a": "bar"
    },
    "input": {}
}
```

### Local development

You can invoke your function locally by using the following command:

```bash
serverless invoke local --function insert --data '{"a":"bar"}' --stage dev
```

Which should result in response similar to the following:

```json
{
    "message": "Go Serverless v1.0!",
    "input": {
        "a": "bar"
    }
}
```
