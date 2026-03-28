import { isEqual } from 'lodash';

import type { TestCase, CheckResult, TestOutput } from '../tasks.types';

import { TestRunner, ZERO } from './TestRunner';

export class StructuresRunner extends TestRunner {
  static run(code: string, tests: TestCase[]): CheckResult {
    try {
      const instance = this.createStructureInstance(code);
      const results = this.executeStructureTests(instance, tests);
      return this.createCheckResult(results);
    } catch (error) {
      return this.createErrorResult(error);
    }
  }

  private static createStructureInstance(code: string): unknown {
    const StructureClass = new Function(`return ${code}`)();
    return new StructureClass();
  }

  private static executeStructureTests(
    instance: unknown,
    tests: TestCase[],
  ): CheckResult['results'] {
    const results: CheckResult['results'] = [];
    tests.forEach((test) => {
      const result = this.executeSingleStructureTest(instance, test);
      results.push(result);
    });
    return results;
  }

  private static executeSingleStructureTest(
    instance: unknown,
    test: TestCase,
  ): CheckResult['results'][typeof ZERO] {
    try {
      let actual: TestOutput;
      const obj = instance as Record<string, unknown>;
      if (test.methodCall) {
        const { name, args, hasReturn } = test.methodCall;

        if (hasReturn) {
          actual = (obj[name] as Function)(...args);
        } else {
          (obj[name] as Function)(...args);
          actual = undefined;
        }
      } else {
        return {
          input: test.input,
          expected: test.output,
          actual: undefined,
          passed: false,
          error: 'Ошибка сервера, нет теста',
        };
      }

      let stateError = '';
      if (test.afterState && test.afterState.length > ZERO) {
        test.afterState.forEach((check) => {
          if (!stateError) {
            const stateValue = (obj[check.method] as Function)();
            if (!isEqual(stateValue, check.expected)) {
              stateError = `Ожидалось ${check.method}: ${JSON.stringify(check.expected)}, получено: ${JSON.stringify(stateValue)}`;
            }
          }
        });
      }
      const expected = test.output === null ? undefined : test.output;
      const passed = isEqual(actual, expected);

      return {
        input: test.input,
        expected: test.output,
        actual,
        passed,
        ...(stateError && { error: stateError }),
      };
    } catch (error) {
      return {
        input: test.input,
        expected: test.output,
        actual: undefined,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
