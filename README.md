# AWS Serverless DynamoDB Sandbox

## Contains

* Basic lambda in typescript (see src/lambda/status.ts)
* Working with DynamoDB (see src/lambda/index.ts)
* Local environment (run `npm run offline`)
* E2E tests on offline environment and local database (run `npm run test:e2e`, see tests/e2e/apiIndex.test.ts)
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
