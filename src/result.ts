type OkResult<TValue> = {
  value: TValue;
  isOk: true;
  isError: false;
};

type ErrorResult<TError> = {
  error: TError;
  isOk: false;
  isError: true;
};

type WrappedErrorResult<TError, TInnerError> = ErrorResult<TError> & {
  innerErrorResult: ErrorResult<TInnerError>;
};

export type Result<TValue, TError> = OkResult<TValue> | ErrorResult<TError>;

export function ok<TValue>(value: TValue): OkResult<TValue> {
  return {
    isOk: true,
    isError: false,
    value,
  };
}

export function error<TError>(error: TError): ErrorResult<TError> {
  return {
    isOk: false,
    isError: true,
    error,
  };
}

export function wrapErrorResult<TError, TInnerError>(
  innerErrorResult: ErrorResult<TInnerError>,
  error: TError
): WrappedErrorResult<TError, TInnerError> {
  return {
    isOk: false,
    isError: true,
    error,
    innerErrorResult,
  };
}
