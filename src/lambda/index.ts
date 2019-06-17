import { AuthorizedApiLambdaEvent } from '@/AuthorizedApiLambdaEvent'
import { createApiResponse } from '@/createApiResponse'
import * as itemRepository from '@/database/itemRepository'
import { AppError } from '@/errors/AppError'
import { Item } from '@/Item'
import { LambdaApiResult } from '@/LambdaApiResult'
import { parseJson } from '@/parseJson'
import { Handler } from 'aws-lambda'
import 'source-map-support/register'
import { v1 } from 'uuid'

export const index: Handler = async (event: AuthorizedApiLambdaEvent): Promise<LambdaApiResult> => {
  try {
    const input = parseJson(event.body)
    if (!input.hasOwnProperty('value')) {
      return createApiResponse({
        message: 'Missing attribute value.',
        result: 'Error'
      })
    }

    if (typeof input.value !== 'string') {
      return createApiResponse({
        message: 'Attribute value is not string.',
        result: 'Error'
      })
    }

    // add item to db
    await itemRepository.addItem('newUser', '2018-12-24', v1(), input.value, '2018-12-24 12:00:00')

    // read items
    const items1 = await itemRepository.getAllItemsByUser('newUser')

    // const items2 = await itemRepository.getItemsByUserAndDate('newUser', '2018-12-24')

    // delete item
    await itemRepository.deleteWatcher('defaultUser', '2017-10-01', '00000000-0000-0000-0000-000000000001')

    const items = items1.map((item: Item) => {
      return {
        id: item.id.toString()
      }
    })

    return createApiResponse({
      context: { items },
      message: 'Done.',
      result: 'Success'
    })
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log('Error', err)
    if (err instanceof AppError) {
      return createApiResponse({
        message: err.message,
        result: 'Error'
      })
    }
    throw err
  }
}
