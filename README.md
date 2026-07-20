# AWS DynamoDB Sandbox

Example AWS application built with SST v4, TypeScript, API Gateway, Lambda,
and DynamoDB.

## Architecture

- SST v4 infrastructure in `sst.config.ts` and `infra/`
- API Gateway REST API with three routes:
  - `GET /status`
  - `GET /error`
  - `POST /task`
- Lambda request authorizer for `POST /task`
- The task Lambda can only call `PutItem` on its DynamoDB table
- Access token stored as an SST secret
- Node.js 22 Lambda runtime with source maps, X-Ray tracing, and one-month log
  retention

Production resources are protected and retained. Resources in other stages are
removed by `sst remove`.

## Prerequisites

- Node.js 22
- npm
- AWS credentials supported by the AWS SDK

Install dependencies:

```bash
npm ci
```

## Configure a stage

Set the authorizer token without committing it:

```bash
npx sst secret set AccessToken <token> --stage <stage>
```

Use a separate token for each stage.

## Development

Start SST development mode:

```bash
npm run dev -- --stage <stage>
```

SST provisions an isolated API and DynamoDB table for the selected stage and
runs Lambda changes in development mode.

## Tests

Run unit tests:

```bash
npm test
```

Run type checking and linting:

```bash
npm run lint
```

Run end-to-end tests against an active or deployed SST stage:

```bash
npx sst shell --stage <stage> -- npm run test:e2e
```

`sst shell` exposes the linked API URL and access token to the tests.

## Deploy

Deploy a disposable stage first:

```bash
npm run deploy -- --stage migration-test
```

Deploy production only after the migration-test stage passes:

```bash
npm run deploy -- --stage production
```

For the production cutover:

1. Record the existing API endpoint and confirm whether the Serverless
   Framework `items` table contains data.
2. Deploy and test the `migration-test` SST stage.
3. Set the production secret and deploy the `production` SST stage.
4. Copy required records from the old table to the new `ItemsTableName`
   output.
5. Switch clients to the new `ApiEndpoint` output and run the end-to-end tests.
6. Remove the old stack only after the new API and data are verified.

Remove a non-production stage:

```bash
npm run remove -- --stage migration-test
```

The previous Serverless Framework stack is not adopted automatically. This
keeps the SST deployment reversible and prevents an accidental deletion of the
existing table during migration.
