import middy, { HandlerLambda } from 'middy'
import createError from 'http-errors'
import { createApiResponse } from '@/utils/createApiResponse'

declare global {
  interface Error {
    statusCode?: number
  }
}

export const errorHandlerMiddleware: middy.Middleware<never> = () => {
  const onError = (handler: HandlerLambda, next: any): void => {
    if (handler.error.statusCode && handler.error.message) {
      console.log(handler.error)
    } else {
      console.log(handler.error)
      handler.error = new createError.InternalServerError(handler.error.message)
    }

    handler.response = createApiResponse({
      result: 'Error',
      statusCode: handler.error.statusCode,
      message: handler.error.message
    })

    return next()
  }

  return { onError }
}
