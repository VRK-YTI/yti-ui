import getApiError from './get-api-errors';

describe('getApiError', () => {
  it('should handle Internal Server Error', () => {
    const error500 = {
      status: 500,
      data: {
        timestamp: '2023-10-30T10:42:13.106+00:00',
        status: 500,
        error: 'Internal Server Error',
        path: '/datamodel-api/v2/model/profile/foo',
      },
    };
    const result = getApiError(error500);
    expect(result).toStrictEqual(['500: Internal Server Error']);
  });

  it('should handle validation error', () => {
    const validationError = {
      status: 400,
      data: {
        status: 'BAD_REQUEST',
        timestamp: '31-10-2023 09:27:58',
        message: 'Object validation failed',
        details: [
          {
            field: 'identifier',
            rejectedValue: 'bar',
            message: 'should-have-value',
          },
        ],
      },
    };
    const result = getApiError(validationError);
    expect(result).toStrictEqual([
      'VALIDATION ERROR: Field: IDENTIFIER | Error: should-have-value',
    ]);
  });

  it('should handle unknown errors', () => {
    const validationError = {
      status: 123,
      data: {
        foobar: 4,
      },
    };
    const result = getApiError(validationError);
    expect(result).toStrictEqual(['GENERAL_ERROR: Unexpected error occured']);
  });
});
