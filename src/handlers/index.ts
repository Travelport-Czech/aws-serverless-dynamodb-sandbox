import { createApiResponse } from '@/utils/createApiResponse';
import * as itemRepository from '@/database/itemRepository';
import { Item } from '@/Item';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { v1 } from 'uuid';
import middy from '@middy/core';
import { z } from 'zod';
import { defaultMiddlewares } from '@/handlers/defaultMiddlewares';

const inputSchema = z.strictObject({
  value: z.string().min(1).max(200),
});

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const inputParseResult = inputSchema.safeParse(event.body);

  if (!inputParseResult.success) {
    return createApiResponse(422, inputParseResult.error.issues);
  }

  // add item to db
  await itemRepository.addItem(
    'newUser',
    '2018-12-24',
    v1(),
    inputParseResult.data.value,
    '2018-12-24 12:00:00',
  );

  // read items
  const items1 = await itemRepository.getAllItemsByUser('newUser');

  // const items2 = await itemRepository.getItemsByUserAndDate('newUser', '2018-12-24')

  // delete item
  await itemRepository.deleteItem(
    'defaultUser',
    '2017-10-01',
    '00000000-0000-0000-0000-000000000001',
  );

  const items = items1.map((item: Item) => {
    return {
      id: item.id.toString(),
    };
  });

  return createApiResponse(200, { context: { items } });
};

export const index = middy(handler).use(defaultMiddlewares);
