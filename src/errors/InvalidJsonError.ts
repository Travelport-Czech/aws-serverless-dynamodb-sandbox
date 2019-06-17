import { AppError } from '@/errors/AppError'

export class InvalidJsonError extends AppError {
  constructor() {
    super('Invalid JSON.')
  }
}
