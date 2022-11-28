# Diehard Front and Backend Demo

This project contains a React Front End, and Serverless Backend API to provide solutions for the classic Diehard 3 water jugs problem.

[Playable demo](https://react-diehard.s3.amazonaws.com/index.html)
[Tutorial blog post](https://jeremycummins.substack.com/p/microservices-tutorial)

Features:
* Runs on AWS S3 and API Gateway/Lambda - no "server" required
* Stores data in DynamoDB (for demonstration purposes)
* Supports numbers up to 2 decimal places

## Setup

This project uses yarn as the package manager. Install yarn if not installed:
```bash
npm install --global yarn
```

From project root:
```bash
yarn
```

Install dependencies for the React app (frontend):
```bash
cd ./front
yarn
```

Install dependencies for the Serverless service (backend):
```bash
cd ../serverless
yarn
serverless dynamodb install
```

## Run offline

With the serverless-dynamodb-local plugin, this project can run a local instance of DynamoDB and Lambda functions for local development.

From project root:

```bash
yarn start
```
This will start serverless offline, providing a local API, and the React frontend. This should automatically open http://localhost:3006/ in a browser.


## Deploy the microservice

Deploying will create or update the Lambda GET and DELETE functions defined in ./serverless/serverless.yml and set up the DynamoDB table in your AWS account.

Go into the serverless folder and run the deploy command:

```bash
cd ./serverless
serverless deploy
```

When you run the deploy command, it will give you the GET and DELETE function endpoints. Example output:

```
Deploying solutions to stage dev (us-east-1)

✔ Service deployed to stack solutions-dev (104s)

endpoints:
  GET - https://5nnnwdo6nc.execute-api.us-east-1.amazonaws.com/dev/solutions/{id}
  DELETE - https://5nnnwdo6nc.execute-api.us-east-1.amazonaws.com/dev/solutions
functions:
  get: solutions-dev-get (75 MB)
  delete: solutions-dev-delete (75 MB)
```

In ./front/src/App.js, on line 9, replace the BASE_URL with the GET endpoint minus the variable "{id}" at the end of the URL. 
