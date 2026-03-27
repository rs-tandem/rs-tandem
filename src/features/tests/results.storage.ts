export interface TestResult {
  topicId: string;
  correctAnswers: number;
  totalQuestions: number;
  scorePercent: number;
  completedAt: string;
}
const RESULTS_STORAGE_KEY = 'test-results';
const EMPTY_RESULTS: TestResult[] = [];

export function getStoredResults(): TestResult[] {
  const raw = localStorage.getItem(RESULTS_STORAGE_KEY);

  if (!raw) {
    return EMPTY_RESULTS;
  }

  try {
    return JSON.parse(raw) as TestResult[];
  } catch {
    return EMPTY_RESULTS;
  }
}

export function saveTestResult(result: TestResult): void {
  const results = getStoredResults();
  results.unshift(result);
  localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results));
}

export function clearStoredResults(): void {
  localStorage.removeItem(RESULTS_STORAGE_KEY);
}
