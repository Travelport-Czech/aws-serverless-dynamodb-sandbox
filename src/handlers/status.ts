import { createApiResponse } from '@/utils/createApiResponse';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

export const status: APIGatewayProxyHandler =
  async (): Promise<APIGatewayProxyResult> => {
    return createApiResponse(200, { message: 'Hello, API is ready.' });
  };
