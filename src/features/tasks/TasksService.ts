import type { Challenge, CheckResult } from './tasks.types';
import { AsyncRunner } from './test-runners/AsyncRunner';
import { BasicJsRunner } from './test-runners/BasicJsRunner';
import { ClosureRunner } from './test-runners/ClosureRunner';
import { StructuresRunner } from './test-runners/StructuresRunner';

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
  ): Promise<{ solution: string; solutionExplanation: string }> {
    const response = await fetch(`${API_BASE_URL}/${id}/solution`);
    if (!response.ok) {
      throw new Error('Failed to fetch solution');
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

  static runBasicJsCode(code: string, tests: Challenge['tests']): CheckResult {
    return BasicJsRunner.run(code, tests);
  }

  static runClosureCode(code: string, tests: Challenge['tests']): CheckResult {
    return ClosureRunner.run(code, tests);
  }

  static async runAsyncCode(
    code: string,
    tests: Challenge['tests'],
  ): Promise<CheckResult> {
    return AsyncRunner.run(code, tests);
  }

  static runStructuresCode(
    code: string,
    tests: Challenge['tests'],
  ): CheckResult {
    return StructuresRunner.run(code, tests);
  }
}
