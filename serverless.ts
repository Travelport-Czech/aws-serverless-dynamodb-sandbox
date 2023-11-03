import * as process from 'process';

import type { AWS } from '@serverless/typescript';

import { getConfig } from './config';

const config = getConfig();

const getTestBucket = (): any => {
  if (!config.isOffline) {
    console.error(
      `Serverless is not running in offline mode! Stage: ${config.stage}`,
    );
    return {};
  }

  return {
    TestBucket: {
      Type: 'AWS::S3::Bucket',
      Properties: {
        BucketName: config.s3.deploymentBucket,
      },
    },
  };
};

const serverlessConfiguration: AWS = {
  service: 'sandbox',
  useDotenv: true,
  plugins: [
    'serverless-s3-local',
    'serverless-esbuild',
    'serverless-export-outputs',
    'serverless-dynamodb',
    'serverless-offline',
  ],
  package: {
    individually: true,
    patterns: ['!./**'],
  },
  provider: {
    deploymentBucket: config.s3.deploymentBucket,
    name: 'aws',
    runtime: 'nodejs16.x',
    region: config.region,
    stage: config.stage,
    versionFunctions: false,
    logs: {
      restApi: true,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamoDb:Query',
          'dynamoDb:Scan',
          'dynamoDb:PutItem',
          'dynamoDb:DeleteItem',
        ],
        Resource: 'arn:aws:dynamodb:*:*:*',
      },
      {
        Effect: 'Allow',
        Action: ['s3:*Object', 's3:listObjectsV2', 's3:ListBucket'],
        Resource: `*`,
      },
    ],
    environment: {
      STAGE: config.stage,
    },
  },
  custom: {
    s3: {
      host: '0.0.0.0',
      port: config.s3.port,
      directory: '/tmp/serverless',
    },
    esbuild: {
      bundle: true,
      minify: false,
      target: 'node16',
      sourcemap: 'inline',
      packager: 'pnpm',
      concurrency: 1,
      loader: {
        '.md': 'text',
      },
    },
    dynamodb: {
      stages: ['offline'],
      start: {
        port: config.dynamoDb.port,
        inMemory: true,
        migrate: true,
        seed: true,
        sharedDb: true,
      },
    },
    exportOutputs: {
      include: ['ServiceEndpoint'],
      output: {
        file: './outputs.json',
        format: 'json',
      },
    },
  },
  functions: {
    authorizer: {
      handler: 'src/handlers/authorizer.authorizer',
    },
    status: {
      handler: 'src/handlers/status.status',
      events: [
        {
          http: {
            path: '/status',
            method: 'get',
            cors: true,
          },
        },
      ],
    },
    index: {
      memorySize: 1024,
      timeout: 10,
      handler: 'src/handlers/index.index',
      events: [
        {
          http: {
            path: '/',
            method: 'post',
            cors: true,
            authorizer: {
              name: 'authorizer',
              resultTtlInSeconds: 0,
              identitySource: 'method.request.header.Authorization',
              type: 'request',
            },
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      ...getTestBucket(),
      ApiGatewayRestApi: {
        Type: 'AWS::ApiGateway::RestApi',
      },
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },

      ItemsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: config.dynamoDb.tableName,
          AttributeDefinitions: [
            {
              AttributeName: 'userId',
              AttributeType: 'S',
            },
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'userId',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'id',
              KeyType: 'RANGE',
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
