import { DynamoDB } from 'aws-sdk'
const isOffline: string | undefined = process.env.IS_OFFLINE

export const getDocumentClient = (): DynamoDB.DocumentClient => {
  if (isOffline) {
    return new DynamoDB.DocumentClient({
      endpoint: 'http://localhost:3001',
      region: 'localhost',
      accessKeyId: 'DEFAULT_ACCESS_KEY',
      secretAccessKey: 'DEFAULT_SECRET',
    })
  }

  return new DynamoDB.DocumentClient()
}
