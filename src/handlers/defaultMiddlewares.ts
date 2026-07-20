import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';

export const defaultMiddlewares = [
  cors(),
  jsonBodyParser(),
  httpErrorHandler({ fallbackMessage: 'Internal error' }),
];
