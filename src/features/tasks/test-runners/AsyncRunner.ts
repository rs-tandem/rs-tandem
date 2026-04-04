import { isEqual } from 'lodash';

import type {
  TestCase,
  CheckResult,
  TestOutput,
  TestResult,
} from '../tasks.types';

import { TestRunner, DELAY_TEST_INPUT_INDEX } from './TestRunner';

const DELAY_TEST_TOLERANCE_MS = 50;
const TIMEOUT_MS = 10000;

export class AsyncRunner extends TestRunner {
  static async run(code: string, tests: TestCase[]): Promise<CheckResult> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
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
  ): Promise<TestResult> {
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
  ): Promise<TestResult> {
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
  ): Promise<TestResult> {
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
  ): Promise<TestResult> {
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
    userFunction: (...args: unknown[]) => unknown,
    tests: TestCase[],
  ): Promise<CheckResult['results']> {
    return Promise.all(
      tests.map(async (test) => {
        try {
          const inputString = test.input[0];
          const restArgs = test.input.slice(1);

          const result = userFunction(
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            new Function(`
          ${userFunction.toString()}
          return ${inputString};
        `)(),
            ...restArgs,
          );

          if (!(result instanceof Promise)) {
            return {
              input: test.input,
              expected: test.output,
              actual: result as TestOutput,
              passed: false,
              error: 'Функция должна возвращать Promise',
            };
          }

          const timeoutPromise = new Promise<TestResult>((_, reject) => {
            setTimeout(
              () => reject(new Error('Тест завис >10 секунд')),
              TIMEOUT_MS,
            );
          });

          const finalResult = await Promise.race([
            this.processAsyncTestResult(result, test),
            timeoutPromise,
          ]);
          return finalResult;
          // return await this.processAsyncTestResult(result, test);
        } catch (error) {
          return {
            input: test.input,
            expected: test.output,
            actual: undefined as TestOutput,
            passed: false,
            error: error instanceof Error ? error.message : String(error),
          };
        }
      }),
    );
  }
}
