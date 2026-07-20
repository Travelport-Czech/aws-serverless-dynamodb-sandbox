import { randomUUID } from 'node:crypto';

import { createApiResponse } from '@app/utils/createApiResponse';
import * as itemRepository from '@app/database/taskRepository';
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import middy from '@middy/core';
import { z } from 'zod';
import { defaultMiddlewares } from '@app/handlers/defaultMiddlewares';
import { TaskDatabase } from '@app/schemas/taskDatabaseSchema';

const inputSchema = z.strictObject({
  description: z.string().min(1).max(1000),
});

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const inputParseResult = inputSchema.safeParse(event.body);

  if (!inputParseResult.success) {
    return createApiResponse(422, inputParseResult.error.issues);
  }

  if (!event.requestContext.authorizer) {
    return createApiResponse(401, 'Unauthorized');
  }

  const principalId = event.requestContext.authorizer.principalId;

  const task: TaskDatabase = {
    type: 'Task',
    id: randomUUID(),
    created: new Date().toISOString(),
    attributes: {
      description: inputParseResult.data.description,
    },
  };

  await itemRepository.addTask(principalId, task);

  return createApiResponse(201, {
    result: 'success',
    message: 'Task created successfully',
    data: task,
  });
};

export const addTask = middy(handler).use(defaultMiddlewares);
