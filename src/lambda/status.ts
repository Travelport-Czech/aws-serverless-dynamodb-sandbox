import { createApiResponse } from '@/createApiResponse'
import { LambdaApiResult } from '@/LambdaApiResult'
import { Handler } from 'aws-lambda'
import 'source-map-support/register'

export const status: Handler = async (): Promise<LambdaApiResult> => {
  return createApiResponse({ result: 'Success' })
}
