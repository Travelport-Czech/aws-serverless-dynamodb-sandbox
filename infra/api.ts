/// <reference path="./../.sst/platform/config.d.ts" />

import { itemsTable } from './database';
import { defaultFunctionProps, xrayPermissions } from './functions';

export const accessToken = new sst.Secret('AccessToken');

export const api = new sst.aws.ApiGatewayV1('Api', {
  accessLog: {
    retention: '1 month',
  },
  transform: {
    api: {
      name: `${$app.stage}-${$app.name}-api`,
    },
    stage: {
      xrayTracingEnabled: true,
    },
  },
});

const authorizer = api.addAuthorizer({
  name: `${$app.name}-${$app.stage}-authorizer`,
  requestFunction: {
    name: `${$app.name}-${$app.stage}-authorizer`,
    handler: 'src/handlers/authorizer.authorizer',
    description: 'Authorizes access to protected sandbox routes',
    ...defaultFunctionProps,
    link: [accessToken],
    memory: '256 MB',
  },
  identitySource: 'method.request.header.Authorization',
  ttl: 0,
});

api.route('GET /status', {
  name: `${$app.name}-${$app.stage}-status`,
  handler: 'src/handlers/status.status',
  description: 'Service status check',
  ...defaultFunctionProps,
  memory: '256 MB',
});

api.route('GET /error', {
  name: `${$app.name}-${$app.stage}-error`,
  handler: 'src/handlers/error.error',
  description: 'Error middleware demonstration',
  ...defaultFunctionProps,
  memory: '256 MB',
});

api.route(
  'POST /task',
  {
    name: `${$app.name}-${$app.stage}-add-task`,
    handler: 'src/handlers/addTask.addTask',
    description: 'Creates a task in DynamoDB',
    ...defaultFunctionProps,
    environment: {
      ...defaultFunctionProps.environment,
      ITEMS_TABLE_NAME: itemsTable.name,
    },
    memory: '1024 MB',
    permissions: [
      xrayPermissions,
      {
        actions: ['dynamodb:PutItem'],
        resources: [itemsTable.arn],
      },
    ],
    timeout: '10 seconds',
  },
  {
    auth: {
      custom: authorizer.id,
    },
  },
);

api.deploy();
