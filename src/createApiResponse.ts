import { LambdaApiResult } from '@/LambdaApiResult'

export const createApiResponse = ({
  result,
  message = undefined,
  context = undefined,
  statusCode = 200
}: {
  readonly result: 'Success' | 'Error'
  readonly message?: string
  readonly context?: unknown
  readonly statusCode?: number
}): LambdaApiResult => {
  const headers = {
    'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    'content-type': 'application/json'
  }

  const body = {
    result,
    message,
    context
  }

  // remove undefined fields
  Object.keys(body).forEach(key => {
    if (body[key] === undefined) {
      delete body[key]
    }
  })

  return {
    body: JSON.stringify(body),
    headers,
    statusCode
  }
}
