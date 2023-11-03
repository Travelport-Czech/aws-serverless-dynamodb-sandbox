# AWS Serverless DynamoDB Sandbox

Example of the simple AWS serverless application with DynamoDB, Typescript and tests running in local environment.

## Contains

* Basic lambda in typescript (see src/lambda/status.ts)
* Working with DynamoDB (see src/lambda/index.ts)
* [ZOD validation library](https://zod.dev/)
* Local environment (run `npm run offline`)
* Serverless with configuration in typescript (see serverless.ts)
* Tests on offline environment and local database (run `npm run test:e2e`, see src/handlers/index.test.offline.ts)
* Acceptance tests on AWS (run `AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... npm run test:acceptance`, see tests/acceptance/basic.test.ts)
* Simple custom authorizer, allows add multiple access tokens and define custom allowed endpoints (see src/lambda/authorizer.ts) 

## Prepare development enviroment

Authenticating to GitHub Packages
see [there](https://help.github.com/en/github/managing-packages-with-github-packages/configuring-npm-for-use-with-github-packages#authenticating-to-github-packages)

* Clone project
* Install dependencies
```bash
> npm ci
```
* Install local database
```bash
> npx sls dynamodb install
``` 
* Run offline
```bash
> npm run offline
```
* Send POST request to
```
http://localhost:3000

data:

{
    "value": "my value" 
}
```

### Deploy

Run:
```
> AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... npm run serverless -- deploy --stage prod
```

### Todo
* Add apiId to all resources to allow run test:acceptance parallel in one account
