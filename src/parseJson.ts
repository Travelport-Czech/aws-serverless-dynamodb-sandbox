import { InvalidJsonError } from '@/errors/InvalidJsonError'
import { UnknownNestedObject } from '@/UnknownNestedObject'

export const parseJson = (data: string | undefined | null): UnknownNestedObject => {
  if (!data) {
    throw new InvalidJsonError()
  }
  try {
    // tslint:disable-next-line:no-unsafe-any
    return JSON.parse(data)
  } catch (e) {
    throw new InvalidJsonError()
  }
}
