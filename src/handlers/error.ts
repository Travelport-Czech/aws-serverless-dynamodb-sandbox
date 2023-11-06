import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import middy from '@middy/core';
import { defaultMiddlewares } from '@app/handlers/defaultMiddlewares';

const handler: APIGatewayProxyHandler =
  async (): Promise<APIGatewayProxyResult> => {
    throw new Error('Test error');
  };

export const error = middy(handler).use(defaultMiddlewares);
