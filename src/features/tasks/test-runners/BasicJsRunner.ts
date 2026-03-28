import { isEqual } from 'lodash';

import type { TestCase, CheckResult } from '../tasks.types';

import { TestRunner } from './TestRunner';

export class BasicJsRunner extends TestRunner {
  static run(code: string, tests: TestCase[]): CheckResult {
    const results: CheckResult['results'] = [];
    try {
      const userFunction = new Function(`return ${code}`)();
      tests.forEach((test) => {
        try {
          const actual = userFunction(...test.input);
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
