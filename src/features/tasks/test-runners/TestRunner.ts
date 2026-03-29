import type { CheckResult } from '../tasks.types';

export const ZERO = 0;
export const ONE = 1;
export const DELAY_TEST_INPUT_INDEX = 0;
export const DELAY_TEST_TOLERANCE_MS = 50;

export class TestRunner {
  static createCheckResult(results: CheckResult['results']): CheckResult {
    const allPassed = results.every((r) => r.passed);
    return {
      allPassed,
      results,
      message: allPassed ? 'Тесты пройдены' : 'Тесты не пройдены',
    };
  }

  static createErrorResult(error: unknown): CheckResult {
    return {
      allPassed: false,
      results: [],
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
