export function replaceErrors(key: string, value: any): any {
  if (value instanceof Error) {
    const error: Record<string, any> = {};

    Object.getOwnPropertyNames(value).forEach((key: string) => {
      if (key !== 'stack' &&
        key !== 'status'
      ) {
        error[key] = (value as Record<string, any>)[key];
      }
    });

    return error;
  }

  return value;
}

export function getPureError(error: Error): Error {
  return JSON.parse(JSON.stringify(error, replaceErrors));
}
