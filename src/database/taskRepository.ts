import { getConfig } from '@config';
import {
  TaskDatabase,
  taskDatabaseSchema,
} from '@app/schemas/taskDatabaseSchema';
import { DeleteCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { createDynamoDbDocumentClient } from '@app/database/createDynamoDbDocumentClient';

const tableName = getConfig().dynamoDb.tableName;

const createTaskFromDatabaseRecord = (record: {
  [key: string]: unknown;
}): TaskDatabase => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { principalId, ...recordWithoutPrincipalId } = record;
  return taskDatabaseSchema.parse(recordWithoutPrincipalId);
};

export const getTask = async (
  principalId: string,
  id: string,
): Promise<TaskDatabase> => {
  const queryCommand = new QueryCommand({
    TableName: tableName,
    ExpressionAttributeNames: {
      '#id': 'id',
      '#principalId': 'principalId',
    },
    ExpressionAttributeValues: {
      ':id': id,
      ':principalId': principalId,
    },
    KeyConditionExpression: '#principalId = :principalId and #id = :id',
  });

  const data = await createDynamoDbDocumentClient().send(queryCommand);

  if (!data || !data.Items || data.Count === 0) {
    throw new Error('Item not found.');
  }

  return createTaskFromDatabaseRecord(data.Items[0]);
};

export const deleteTask = async (
  principalId: string,
  id: string,
): Promise<void> => {
  const deleteCommand = new DeleteCommand({
    TableName: tableName,
    Key: {
      id,
      principalId,
    },
  });
  await createDynamoDbDocumentClient().send(deleteCommand);
};

export const addTask = async (
  principalId: string,
  task: TaskDatabase,
): Promise<void> => {
  const putCommand = new PutCommand({
    Item: {
      ...task,
      principalId,
    },
    TableName: tableName,
  });
  await createDynamoDbDocumentClient().send(putCommand);
};

export const getAllTasks = async (
  principalId: string,
): Promise<TaskDatabase[]> => {
  const queryCommand = new QueryCommand({
    TableName: tableName,
    ExpressionAttributeNames: {
      '#principalId': 'principalId',
    },
    ExpressionAttributeValues: {
      ':principalId': principalId,
    },
    KeyConditionExpression: '#principalId = :principalId',
  });

  const data = await createDynamoDbDocumentClient().send(queryCommand);
  console.log('data', data);
  if (!data || !data.Items || data.Count === 0) {
    return [];
  }

  return data.Items.map(createTaskFromDatabaseRecord);
};
