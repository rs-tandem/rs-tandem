import { isEqual } from 'lodash';

import type { Challenge, CheckResult, TestCase } from './tasks.types';

const API_BASE_URL = 'http://5.129.197.181/api/challenges';

export class ChallengeService {
  static async getRandomChallenge(): Promise<Challenge> {
    const response = await fetch(`${API_BASE_URL}/random`);
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    return response.json();
  }

  static async getRandomChallengeByTopic(topicId: string): Promise<Challenge> {
    const response = await fetch(`${API_BASE_URL}/topic/${topicId}/random`);
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    return response.json();
  }

  static async getChallengesByTopic(topicId: string): Promise<Challenge[]> {
    const response = await fetch(`${API_BASE_URL}/topic/${topicId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    return response.json();
  }

  static async getChallengesByTopicAndDifficulty(
    topicId: string,
    difficulty: string,
  ): Promise<Challenge[]> {
    const response = await fetch(
      `${API_BASE_URL}/topic/${topicId}/difficulty/${difficulty}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    return response.json();
  }

  static async getChallengeById(id: number): Promise<Challenge> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    return response.json();
  }

  static async getTestsForChallenge(
    id: number,
  ): Promise<{ tests: Challenge['tests'] }> {
    const response = await fetch(`${API_BASE_URL}/${id}/tests`);
    if (!response.ok) {
      throw new Error('Failed');
    }
    return response.json();
  }

  static async checkSolution(id: number, code: string): Promise<CheckResult> {
    const response = await fetch(`${API_BASE_URL}/${id}/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    if (!response.ok) {
      throw new Error('Failed');
    }
    return response.json();
  }

  static async getSolution(
    id: number,
  ): Promise<{ solution: string; explanation: string }> {
    const response = await fetch(`${API_BASE_URL}/${id}/solution`);
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    return response.json();
  }

  static async getChallengesGrouped(): Promise<
    Record<string, { id: number; title: string; difficulty: string }[]>
  > {
    try {
      const response = await fetch(`${API_BASE_URL}/menuChallenges`);
      const data = await response.json();
      return data;
    } catch {
      return {};
    }
  }

  static runBasicJsCode(code: string, tests: TestCase[]): CheckResult {
    const results: CheckResult['results'] = [];
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
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

      const allPassed = results.every((r) => r.passed);
      return {
        allPassed,
        results,
        message: allPassed ? 'Тесты пройдены' : 'Тесты не пройдены',
      };
    } catch (error) {
      return {
        allPassed: false,
        results: [],
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  static runClosureCode(code: string, tests: TestCase[]): CheckResult {
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

      const allPassed = results.every((r) => r.passed);
      return {
        allPassed,
        results,
        message: allPassed ? 'Тесты пройдены' : 'Тесты не пройдены',
      };
    } catch (error) {
      return {
        allPassed: false,
        results: [],
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
