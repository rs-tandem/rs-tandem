import { describe, it, expect } from 'vitest';

import type { TestCase } from '../features/tasks/tasks.types';
import { ChallengeService } from '../features/tasks/TasksService';
import { TasksPage } from '../features/tasks/ui/TasksPage';

const ZERO = 0;
const ONE = 1;
const TWO = 2;
const THREE = 3;

describe('runCode', () => {
  it('проверка тестов basic-js sum_numbers', () => {
    const code = `function sum(a, b) { return a + b; }`;
    const tests: TestCase[] = [
      { input: [TWO, THREE], output: 5 },
      { input: [ZERO, ZERO], output: ZERO },
    ];

    const result = ChallengeService.runBasicJsCode(code, tests);

    expect(result.allPassed).toBe(true);
    expect(result.results).toHaveLength(TWO);
    expect(result.results[ZERO]!.passed).toBe(true);
    expect(result.results[ONE]!.passed).toBe(true);
  });

  it('если написать некорректный код', () => {
    const code = `function sum(a, b) { return a + ; }`;
    const tests: TestCase[] = [{ input: [ONE, TWO], output: 3 }];

    const result = ChallengeService.runBasicJsCode(code, tests);

    expect(result.allPassed).toBe(false);
    expect(result.results).toHaveLength(ZERO);
    expect(result.message).toBeDefined();
  });

  it('проверка неверных тестов', () => {
    const code = `function sum(a, b) { return a - b; }`;
    const tests: TestCase[] = [{ input: [ONE, TWO], output: 3 }];

    const result = ChallengeService.runBasicJsCode(code, tests);

    expect(result.allPassed).toBe(false);
    expect(result.results[ZERO]!.passed).toBe(false);
    expect(result.results[ZERO]!.expected).toBe(THREE);
    expect(result.results[ZERO]!.actual).toBe(-ONE);
  });
});

describe('TasksPage', () => {
  it('должен проверить, что TasksPage существует в коде', () => {
    expect(TasksPage).toBeDefined();
  });
});
