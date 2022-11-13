# Diehard Front and Backend Demo

This project contains a React Front End, and Serverless Backend API to provide solutions for the classic Diehard 3 water jugs problem.

[Playable demo](https://react-diehard.s3.amazonaws.com/index.html)

Features:
* Runs on AWS S3 and API Gateway/Lambda - no "server" required
* Stores data in DynamoDB (for demonstration purposes)
* Supports numbers up to 2 decimal places

## Setup

Install yarn if not installed:
```bash
npm install --global yarn
```

Follow instructions in `./serverless/README.md`

Install dependencies for the React app:
```bash
cd front
yarn
```

Then from project root:
```bash
yarn
```

## Run service offline

From project root:

```bash
yarn start
```
This will start serverless offline, providing a local API, and the React frontend. This should automatically open http://localhost:3006/ in a browser.
