import type { Topic } from './topics.types';

export const TOPICS: Topic[] = [
  {
    id: 'core-js',
    title: 'Основы JavaScript',
    imageUrl: new URL('../../assets/img/js.svg', import.meta.url).toString(),
  },
  {
    id: 'closures',
    title: 'Замыкания',
    imageUrl: new URL(
      '../../assets/img/closures.svg',
      import.meta.url,
    ).toString(),
  },
  {
    id: 'asynchrony',
    title: 'Асинхронность',
    imageUrl: new URL('../../assets/img/async.png', import.meta.url).toString(),
  },
  {
    id: 'data-structures',
    title: 'Структуры данных',
    imageUrl: new URL('../../assets/img/tree.png', import.meta.url).toString(),
  },
];
