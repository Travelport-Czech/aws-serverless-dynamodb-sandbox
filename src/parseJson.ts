import { InvalidJsonError } from 'src/errors/InvalidJsonError'

export const parseJson = (data: string | undefined | null): any => {
  if (!data) {
    throw new InvalidJsonError()
  }
  try {
    // tslint:disable-next-line:prefer-type-cast
    return JSON.parse(data)
  } catch (e) {
    throw new InvalidJsonError()
  }
}
