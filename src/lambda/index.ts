import { AuthorizedApiLambdaEvent } from '@/AuthorizedApiLambdaEvent'
import { createApiResponse } from '@/createApiResponse'
import * as itemRepository from '@/database/itemRepository'
import { AppError } from '@/errors/AppError'
import { Item } from '@/Item'
import { LambdaApiResult } from '@/LambdaApiResult'
import { Handler } from 'aws-lambda'
import 'source-map-support/register'
import { v1 } from 'uuid'
import { ValidString } from '@travelport-czech/valid-objects-ts'

export const index: Handler = async (event: AuthorizedApiLambdaEvent): Promise<LambdaApiResult> => {
  try {
    const input: unknown = JSON.parse(event.body)
    if (typeof input !== 'object' || !input) {
      throw new AppError('Input is not object')
    }
    const parsedInput = input as {
      value?: unknown
    }
    if (!parsedInput.value) {
      throw new AppError('Missing attribute value.')
    }
    const value = new ValidString(parsedInput.value)

    // add item to db
    await itemRepository.addItem('newUser', '2018-12-24', v1(), value.toString(), '2018-12-24 12:00:00')

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
      result: 'Success',
      context: { items }
    })
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log('Error', err)
    if (err instanceof AppError) {
      return createApiResponse({
        result: 'Error',
        message: err.message
      })
    }
    throw err
  }
}
