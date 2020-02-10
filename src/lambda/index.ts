import { createApiResponse } from '@/createApiResponse'
import * as itemRepository from '@/database/itemRepository'
import { Item } from '@/Item'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { v1 } from 'uuid'
import { ValidString } from '@travelport-czech/valid-objects-ts'
import middy from 'middy'
import createError from 'http-errors'
import { errorHandlerMiddleware } from '@/utils/errorHandlerMiddleware'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    throw new createError.UnprocessableEntity('Input is not object')
  }
  const input: unknown = JSON.parse(event.body)
  if (typeof input !== 'object' || !input) {
    throw new createError.UnprocessableEntity('Input is not object')
  }
  const parsedInput = input as {
    value?: unknown
  }
  if (!parsedInput.value) {
    throw new createError.UnprocessableEntity('Missing attribute value.')
  }

  let value
  try {
    value = new ValidString(parsedInput.value)
  } catch (err) {
    throw new createError.UnprocessableEntity(err.message)
  }

  // add item to db
  await itemRepository.addItem('newUser', '2018-12-24', v1(), value.toString(), '2018-12-24 12:00:00')

  // read items
  const items1 = await itemRepository.getAllItemsByUser('newUser')

  // const items2 = await itemRepository.getItemsByUserAndDate('newUser', '2018-12-24')

  // delete item
  await itemRepository.deleteItem('defaultUser', '2017-10-01', '00000000-0000-0000-0000-000000000001')

  const items = items1.map((item: Item) => {
    return {
      id: item.id.toString()
    }
  })

  return createApiResponse({
    result: 'Success',
    context: { items }
  })
}

export const index = middy(handler)
  .use(errorHandlerMiddleware())
