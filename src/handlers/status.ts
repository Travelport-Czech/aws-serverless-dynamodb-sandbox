import { createApiResponse } from '@app/utils/createApiResponse';
import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import middy from '@middy/core';
import { defaultMiddlewares } from '@app/handlers/defaultMiddlewares';

const handler: APIGatewayProxyHandler =
  async (): Promise<APIGatewayProxyResult> => {
    return createApiResponse(200, { message: 'Hello, API is ready.' });
  };

export const status = middy(handler).use(defaultMiddlewares);
