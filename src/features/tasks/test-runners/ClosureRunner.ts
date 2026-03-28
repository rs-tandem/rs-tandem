import { isEqual } from 'lodash';

import type { TestCase, CheckResult } from '../tasks.types';

import { TestRunner } from './TestRunner';

export class ClosureRunner extends TestRunner {
  static run(code: string, tests: TestCase[]): CheckResult {
    const results: CheckResult['results'] = [];
    try {
      tests.forEach((test) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-implied-eval
          const testFunction = new Function(`
            ${code}
            return ${test.input};
          `);

          const actual = testFunction();
          const passed = isEqual(actual, test.output);
          results.push({
            input: test.input,
            expected: test.output,
            actual,
            passed,
          });
        } catch (error) {
          results.push({
            input: test.input,
            expected: test.output,
            actual: undefined,
            passed: false,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      });
      return this.createCheckResult(results);
    } catch (error) {
      return this.createErrorResult(error);
    }
  }
}
