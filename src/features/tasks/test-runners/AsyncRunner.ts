import { isEqual } from 'lodash';

import type { TestCase, CheckResult, TestOutput } from '../tasks.types';

import {
  TestRunner,
  ZERO,
  ONE,
  DELAY_TEST_INPUT_INDEX,
  DELAY_TEST_TOLERANCE_MS,
} from './TestRunner';

export class AsyncRunner extends TestRunner {
  static async run(code: string, tests: TestCase[]): Promise<CheckResult> {
    try {
      const userFunction = new Function(`return ${code}`)();
      const results = await this.executeAsyncTests(userFunction, tests);
      return this.createCheckResult(results);
    } catch (error) {
      return this.createErrorResult(error);
    }
  }

  private static async processAsyncTestResult(
    promise: Promise<unknown>,
    test: TestCase,
  ): Promise<CheckResult['results'][number]> {
    switch (test.type) {
      case 'delay':
        return this.processDelayTest(promise, test);
      case 'reject':
        return this.processRejectTest(promise, test);
      default:
        return this.processStandardTest(promise, test);
    }
  }

  private static async processDelayTest(
    promise: Promise<unknown>,
    test: TestCase,
  ): Promise<CheckResult['results'][number]> {
    const start = Date.now();
    await promise;
    const duration = Date.now() - start;
    const expectedMs = test.input[DELAY_TEST_INPUT_INDEX] as number;
    const passed = Math.abs(duration - expectedMs) < DELAY_TEST_TOLERANCE_MS;

    return {
      input: test.input,
      expected: `${expectedMs}ms`,
      actual: `${duration}ms`,
      passed,
    };
  }

  private static async processRejectTest(
    promise: Promise<unknown>,
    test: TestCase,
  ): Promise<CheckResult['results'][number]> {
    try {
      await promise;
      return {
        input: test.input,
        expected: test.output,
        actual: 'resolved',
        passed: false,
        error: 'Должен reject',
      };
    } catch (error) {
      const passed = error === test.output;
      return {
        input: test.input,
        expected: test.output,
        actual: error as TestOutput,
        passed,
      };
    }
  }

  private static async processStandardTest(
    promise: Promise<unknown>,
    test: TestCase,
  ): Promise<CheckResult['results'][number]> {
    const actual = await promise;
    const passed = isEqual(actual, test.output);

    return {
      input: test.input,
      expected: test.output,
      actual: actual as TestOutput,
      passed,
    };
  }

  private static async executeAsyncTests(
    userFunction: Function,
    tests: TestCase[],
  ): Promise<CheckResult['results']> {
    return Promise.all(
      tests.map(async (test) => {
        try {
          let promiseArg: unknown;

          if (typeof test.input[ZERO] === 'string') {
            const inputString = test.input[ZERO];
            const ms = test.input[ONE];

            const evaluator = new Function(`
              ${userFunction.toString()}
              return ${inputString};
            `);

            promiseArg = evaluator();
            const result = userFunction(promiseArg, ms);

            if (!(result instanceof Promise)) {
              return {
                input: test.input,
                expected: test.output,
                actual: result,
                passed: false,
                error: 'Функция должна возвращать Promise',
              };
            }

            return await this.processAsyncTestResult(result, test);
          }

          const parsedInput = [new Function(`return ${test.input}`)()];
          const result = userFunction(...parsedInput);

          if (!(result instanceof Promise)) {
            return {
              input: test.input,
              expected: test.output,
              actual: result,
              passed: false,
              error: 'Функция должна возвращать Promise',
            };
          }

          return await this.processAsyncTestResult(result, test);
        } catch (error) {
          return {
            input: test.input,
            expected: test.output,
            actual: undefined,
            passed: false,
            error: error instanceof Error ? error.message : String(error),
          };
        }
      }),
    );
  }
}
