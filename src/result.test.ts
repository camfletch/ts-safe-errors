import { describe, it, expect } from "vitest";
import { Result, ok, error, wrapErrorResult } from "./result";

describe("results", () => {
  it("correctly returns an ok result", () => {
    const result = ok(5);

    expect(result).toEqual({
      isOk: true,
      isError: false,
      value: 5,
    });
  });

  it("correctly returns an error result", () => {
    const result = error({ reason: "DB Connection Failed" });

    expect(result).toEqual({
      isOk: false,
      isError: true,
      error: {
        reason: "DB Connection Failed",
      },
    });
  });

  it("correctly wraps an underlying error", () => {
    const innerResult = error({ reason: "DB Connection Failed" });
    const outerResult = wrapErrorResult(innerResult, {
      explanation: "Could not find user",
    });

    expect(outerResult).toEqual({
      isOk: false,
      isError: true,
      error: {
        explanation: "Could not find user",
      },
      innerErrorResult: {
        isOk: false,
        isError: true,
        error: {
          reason: "DB Connection Failed",
        },
      },
    });
  });

  it("correctly wraps an underlying error", () => {
    const innerResult = error({ reason: "DB Connection Failed" });
    const middleResult = wrapErrorResult(innerResult, {
      explanation: "Could not find user",
    });
    const outerResult = wrapErrorResult(middleResult, {
      message: "Could not process webhook",
    });

    if (outerResult.isOk) {
      throw new Error("Received unexpected ok result");
    }

    expect(outerResult).toEqual({
      isOk: false,
      isError: true,
      error: {
        message: "Could not process webhook",
      },
      innerErrorResult: {
        isOk: false,
        isError: true,
        error: {
          explanation: "Could not find user",
        },
        innerErrorResult: {
          isOk: false,
          isError: true,
          error: {
            reason: "DB Connection Failed",
          },
        },
      },
    });
  });
});
