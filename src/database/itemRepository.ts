import { getDocumentClient } from '@/database/getDocumentClient'
import { AppError } from '@/errors/AppError'
import { AppLogicError } from '@/errors/AppLogicError'
import { Item } from '@/Item'
import { DynamoDB } from 'aws-sdk'

const documentClient = getDocumentClient()
const tableName: string | undefined = process.env.DB_TABLE_NAME_ITEMS

if (!tableName) {
  throw new AppLogicError('Missing table name')
}

export const getItemsByUserAndDate = async (userId: string, date: string): Promise<Item[]> => {
  const params: DynamoDB.DocumentClient.QueryInput = {
    ExpressionAttributeNames: {
      '#id': 'id',
      '#userId': 'userId'
    },
    ExpressionAttributeValues: {
      ':id': date,
      ':userId': userId
    },
    KeyConditionExpression: '#userId = :userId and begins_with(#id, :id)',
    TableName: tableName
  }

  const data = await documentClient.query(params).promise()
  if (!data || !data.Items || data.Count === 0) {
    return []
  }

  // tslint:disable-next-line:prefer-type-cast
  return data.Items as Item[]
}

export const getItemById = async (userId: string, date: string, id: string): Promise<Item> => {
  const params: DynamoDB.DocumentClient.QueryInput = {
    ExpressionAttributeNames: {
      '#id': 'id',
      '#userId': 'userId'
    },
    ExpressionAttributeValues: {
      ':id': `${date}#${id}`,
      ':userId': userId
    },
    KeyConditionExpression: '#userId = :userId and #id = :id',
    TableName: tableName
  }

  const data = await documentClient.query(params).promise()
  if (!data || !data.Items || data.Count === 0) {
    throw new AppError('Item not found.')
  }

  // tslint:disable-next-line:prefer-type-cast
  return data.Items[0] as Item
}

export const deleteWatcher = async (userId: string, date: string, id: string): Promise<void> => {
  const params: DynamoDB.DocumentClient.DeleteItemInput = {
    Key: {
      id: `${date}#${id}`,
      userId
    },
    TableName: tableName
  }

  await documentClient.delete(params).promise()
}

export const addItem = async (
  userId: string,
  date: string,
  id: string,
  value: string,
  created: string
): Promise<void> => {
  const data = {
    created,
    id: `${date}#${id}`,
    userId,
    value
  }
  const params: DynamoDB.DocumentClient.PutItemInput = {
    Item: data,
    TableName: tableName
  }
  await documentClient.put(params).promise()
}

export const getAllItemsByUser = async (userId: string): Promise<Item[]> => {
  const params: DynamoDB.DocumentClient.QueryInput = {
    ExpressionAttributeNames: {
      '#userId': 'userId'
    },
    ExpressionAttributeValues: {
      ':userId': userId
    },
    KeyConditionExpression: '#userId = :userId',
    TableName: tableName
  }

  const data = await documentClient.query(params).promise()
  if (!data || !data.Items || data.Count === 0) {
    return []
  }

  // tslint:disable-next-line:prefer-type-cast
  return data.Items as Item[]
}
