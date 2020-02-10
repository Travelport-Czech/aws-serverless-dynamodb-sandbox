export interface ArnParams {
  readonly awsAccountId: string
  readonly awsRegion: string
  readonly restApiId: string
  readonly stage: string
  readonly method: string
}

export const parseArn = (arn: string): ArnParams => {
  try {
    const tmp = arn.split(':')
    const apiGatewayArnTmp = tmp[5].split('/')
    const awsAccountId = tmp[4]
    const awsRegion = tmp[3]
    const restApiId = apiGatewayArnTmp[0]
    const stage = apiGatewayArnTmp[1]
    const method = apiGatewayArnTmp[2] + '/' + apiGatewayArnTmp[3]

    return {
      awsAccountId,
      awsRegion,
      restApiId,
      stage,
      method
    }
  } catch (err) {
    throw new Error(`Invalid ARN '${arn}'`)
  }
}
