export type TestInput = (string | number)[];
export type TestOutput = string | number | boolean | null | undefined;

export interface TestCase {
  input: (string | number)[];
  output: string | number | boolean | null;
  type?: 'method' | 'function' | 'assert' | 'delay' | 'reject';
  methodCall?: {
    type: 'method';
    name: string;
    args: (string | number)[];
    hasReturn: boolean;
  };
  afterState?: {
    method: string;
    expected: undefined;
  }[];
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
  input: TestInput;
  expected: TestOutput;
  actual: string | number | boolean | null | undefined;
  passed: boolean;
  error?: string;
}
