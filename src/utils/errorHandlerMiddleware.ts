import middy, { HandlerLambda } from 'middy'
import createError from 'http-errors'

declare global {
    interface Error {
        statusCode?: number;
    }
}

export const errorHandlerMiddleware: middy.Middleware<never> = opts => {
    const onError = (handler: HandlerLambda, next: any): void => {
        if (handler.error.statusCode && handler.error.message) {
            console.log(handler.error)
        } else {
            handler.error = new createError.InternalServerError(handler.error.message)
        }

        handler.response = {
            statusCode: handler.error.statusCode,
            headers: {},
            body: JSON.stringify({ error: handler.error.message }),
        }

        return next()
    };

    return { onError }
};
