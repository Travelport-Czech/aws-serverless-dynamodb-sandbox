export interface LambdaApiResult {
  readonly statusCode: number
  readonly body: string
  readonly headers: { readonly [key: string]: string | boolean }
}
