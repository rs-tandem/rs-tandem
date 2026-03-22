export interface TestCase {
  input: unknown[];
  output: unknown;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  functionName: string;
  examples: TestCase[];
  tests: TestCase[];
  solution: string;
  solutionExplanation: string;
  testRunner?: string;
}

export interface CheckResult {
  allPassed: boolean;
  results: TestResult[];
  message?: string;
}

export interface TestResult {
  testNumber?: number;
  input: unknown[];
  expected: unknown;
  actual: unknown;
  passed: boolean;
  error?: string;
}
