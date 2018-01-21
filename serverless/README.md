<!--
title: AWS Serverless REST API with DynamoDB and offline support example in NodeJS
description: This example demonstrates how to run a service locally, using the 'serverless-offline' plugin. It provides a REST API to manage Solutions stored in DynamoDB.
layout: Doc
-->

# Serverless REST API with DynamoDB and offline support

This example demonstrates how to run a service locally, using the
[serverless-offline](https://github.com/dherault/serverless-offline) plugin. It
provides a REST API to manage Solutions stored in a DynamoDB, similar to the
[aws-node-rest-api-with-dynamodb](https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb)
example. A local DynamoDB instance is provided by the
[serverless-dynamodb-local](https://github.com/99xt/serverless-dynamodb-local)
plugin.

## Use-case

Test your service locally, without having to deploy it first.

## Setup

```bash
npm install
serverless dynamodb install
serverless offline start
serverless dynamodb migrate (this imports schema)
```

## Run service offline

```bash
serverless offline start
```

## Usage

A solution will be retrieved from DynamoDb if it already exists, otherwise it will be generated, saved in the DB and returned.

### Example request
```http://localhost:3000/solutions/3-5-4```

In this request the three numbers use a dash as a delimiter:`3-5-4` represents `<jug 1 amount>-<jug 2 amount>-<target amount>`.


Example Result:

```{"id":"3-5-4","winner":2,"results":["Round 1: Step 9 - Target 4 achieved! hash: { jugs: [0, 4], nextAction: \"fill\", nextJug: \"jug 1\" }","Round 2: Step 7 - Target 4 achieved! hash: { jugs: [3, 4], nextAction: \"pour\", nextJug: \"jug 1\" }"],"createdAt":1516566697170,"stepList":[["{ jugs: [3, 0], nextAction: \"pour\", nextJug: \"jug 1\" }","{ jugs: [0, 3], nextAction: \"fill\", nextJug: \"jug 1\" }","{ jugs: [3, 3], nextAction: \"pour\", nextJug: \"jug 1\" }","{ jugs: [1, 5], nextAction: \"empty\", nextJug: \"jug 2\" }","{ jugs: [1, 0], nextAction: \"pour\", nextJug: \"jug 1\" }","{ jugs: [0, 1], nextAction: \"fill\", nextJug: \"jug 1\" }","{ jugs: [3, 1], nextAction: \"pour\", nextJug: \"jug 1\" }"],["{ jugs: [0, 5], nextAction: \"pour\", nextJug: \"jug 2\" }","{ jugs: [3, 2], nextAction: \"empty\", nextJug: \"jug 1\" }","{ jugs: [0, 2], nextAction: \"pour\", nextJug: \"jug 2\" }","{ jugs: [2, 0], nextAction: \"fill\", nextJug: \"jug 2\" }","{ jugs: [2, 5], nextAction: \"pour\", nextJug: \"jug 2\" }"]]}```