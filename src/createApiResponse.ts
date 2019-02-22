import { LambdaApiResult } from 'src/LambdaApiResult'

interface ApiResponseParams {
  readonly result: 'Success' | 'Error'
  readonly message: string
  readonly context?: any
}

export const createApiResponse = (apiResponseParams: ApiResponseParams): LambdaApiResult => {
  const headers = {
    'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    'content-type': 'application/json'
  }

  return {
    body: JSON.stringify({
      ...apiResponseParams
    }),
    headers,
    statusCode: 200
  }
}
