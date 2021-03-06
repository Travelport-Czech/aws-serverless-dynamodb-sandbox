import { CustomAuthorizerEvent, CustomAuthorizerHandler, CustomAuthorizerResult } from 'aws-lambda'
import { passwordsAreSame } from '@/utils/passwordsAreSame'
import { generateAllowPolicy, generateDenyPolicy } from '@/utils/policyFactory'

interface Credential {
  readonly name: string
  readonly description: string
  readonly accessToken: string
  readonly allowedMethods: string[]
}

const credentialsList: Credential[] = [
  {
    name: 'Test Access',
    description: 'Access for testing',
    accessToken: 'token',
    allowedMethods: ['POST/']
  }
]

export const authorizer: CustomAuthorizerHandler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  const actualToken = event.authorizationToken ? event.authorizationToken : ''

  const result = credentialsList.filter(item => {
    return passwordsAreSame(item.accessToken, actualToken)
  })

  if (result.length !== 1) {
    generateDenyPolicy('', event.methodArn)
  }

  return generateAllowPolicy(event.methodArn, result[0].name, result[0].allowedMethods)
}
