import { describe, it, expect } from "vitest";
import { Result, ok, error, wrapErrorResult } from "./result";

describe("results", () => {
  it("correctly returns an ok result", () => {
    const result = ok(5);

    if (result.isError) {
      throw new Error("Received unexpected error result");
    }

    expect(result.value).toBe(5);
  });

  it("correctly returns an error result", () => {
    const result = error({ reason: "DB Connection Failed" });

    if (result.isOk) {
      throw new Error("Received unexpected ok result");
    }

    expect(result.error).toEqual({
      reason: "DB Connection Failed",
    });
  });

  it("correctly wraps an underlying error", () => {
    const innerResult = error({ reason: "DB Connection Failed" });
    const outerResult = wrapErrorResult(innerResult, {
      explanation: "Could not find user",
    });

    if (outerResult.isOk) {
      throw new Error("Received unexpected ok result");
    }

    expect(outerResult.error).toEqual({
      explanation: "Could not find user",
    });
    expect(outerResult.innerErrorResult.error).toEqual({
      reason: "DB Connection Failed",
    });
  });
});
