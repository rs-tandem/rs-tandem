import type {
  CheckAnswerPayload,
  CheckAnswerResponse,
  Question,
} from './tests.types';

const API_URL = import.meta.env.VITE_IP_BACKEND;

export async function getRandomQuestionByTopic(
  topicId: string,
): Promise<Question> {
  const response = await fetch(
    `${API_URL}/api/questions/topic/${topicId}/random`,
  );

  if (!response.ok) {
    throw new Error(`Failed to load question: ${response.status}`);
  }
  return (await response.json()) as Question;
}

export async function checkAnswer(
  payload: CheckAnswerPayload,
): Promise<CheckAnswerResponse> {
  const response = await fetch(`${API_URL}/api/check-answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to check answer: ${response.status}`);
  }

  return (await response.json()) as CheckAnswerResponse;
}
