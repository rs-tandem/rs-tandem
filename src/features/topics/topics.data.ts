export interface TopicItem {
  id: string;
  title: string;
}

export const TOPIC_ITEMS: TopicItem[] = [
  { id: 'basics', title: 'Основы JavaScript' },
  { id: 'closure', title: 'Замыкания' },
  { id: 'async', title: 'Асинхронность' },
  { id: 'structures', title: 'Структуры данных' },
];

export function getTopicTitleById(topicId: string): string {
  return TOPIC_ITEMS.find((topic) => topic.id === topicId)?.title || 'Тема';
}
