import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import inputOutputLogger from '@middy/input-output-logger';

export const defaultMiddlewares = [
  inputOutputLogger(),
  cors(),
  jsonBodyParser(),
  httpErrorHandler({ fallbackMessage: 'Internal error' }),
];
