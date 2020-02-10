import { CustomAuthorizerResult } from 'aws-lambda'
import { parseArn } from '@/utils/parseArn'

const createPolicy = (principalId: string, apiArnList: string[], effect: 'Allow' | 'Deny'): CustomAuthorizerResult => {
  return {
    policyDocument: {
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: apiArnList
        }
      ],
      Version: '2012-10-17'
    },
    principalId
  }
}

export const generateAllowPolicy = (arn: string, principalId: string, allowedUrl: string[]): CustomAuthorizerResult => {
  const parsedArn = parseArn(arn)
  const apiArnList = allowedUrl.map(current => {
    return (
      'arn:aws:execute-api:' +
      parsedArn.awsRegion +
      ':' +
      parsedArn.awsAccountId +
      ':' +
      parsedArn.restApiId +
      '/' +
      parsedArn.stage +
      '/' +
      current
    )
  })

  return createPolicy(principalId, apiArnList, 'Allow')
}

export const generateDenyPolicy = (principalId: string, resource: string): CustomAuthorizerResult => {
  return createPolicy(principalId, [resource], 'Deny')
}
