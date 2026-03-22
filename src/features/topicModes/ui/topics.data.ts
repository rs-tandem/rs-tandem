import asyncIcon from '../../../assets/img/async.png';
import closuresIcon from '../../../assets/img/closures.svg';
import jsIcon from '../../../assets/img/js.svg';
import treeIcon from '../../../assets/img/tree.png';
import type { Topic } from '../../topics/topics.types';

export const TOPICS: Topic[] = [
  {
    id: 'core-js',
    title: 'Основы JavaScript',
    imageUrl: jsIcon,
  },
  {
    id: 'closures',
    title: 'Замыкания',
    imageUrl: closuresIcon,
  },
  {
    id: 'asynchrony',
    title: 'Асинхронность',
    imageUrl: asyncIcon,
  },
  {
    id: 'data-structures',
    title: 'Структуры данных',
    imageUrl: treeIcon,
  },
];

// #FIXME убрать, нигде не используется
export function getTopicTitleById(topicId: string): string {
  const topic = TOPICS.find((item) => item.id === topicId);
  return topic?.title ?? 'Тема';
}
