import { ApiRequestError } from '../api/client';

export function mapFieldErrors(
  error: unknown
): Record<string, string> {
  if (!(error instanceof ApiRequestError) || !error.errors?.length) {
    return {};
  }

  return error.errors.reduce<Record<string, string>>((acc, item) => {
    if (!acc[item.field]) {
      acc[item.field] = item.message;
    }
    return acc;
  }, {});
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
