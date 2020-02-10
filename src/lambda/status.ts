import { createApiResponse } from '@/utils/createApiResponse'
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

export const status: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  return createApiResponse({ result: 'Success' })
}
