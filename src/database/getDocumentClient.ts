import { DynamoDB } from 'aws-sdk'
const isOffline: string | undefined = process.env.IS_OFFLINE

export const getDocumentClient = (): DynamoDB.DocumentClient => {
  if (isOffline === 'true') {
    return new DynamoDB.DocumentClient({
      // tslint:disable-next-line:no-http-string
      endpoint: 'http://localhost:3001',
      region: 'localhost'
    })
  }

  return new DynamoDB.DocumentClient()
}
