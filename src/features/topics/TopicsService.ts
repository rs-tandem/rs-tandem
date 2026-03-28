import type { Topic } from './topics.types';

export const TOPICS: Topic[] = [
  {
    id: 'basics',
    title: 'Основы JavaScript',
    imageUrl: new URL('../../assets/img/js.svg', import.meta.url).toString(),
  },
  {
    id: 'closure',
    title: 'Замыкания',
    imageUrl: new URL(
      '../../assets/img/closures.svg',
      import.meta.url,
    ).toString(),
  },
  {
    id: 'async',
    title: 'Асинхронность',
    imageUrl: new URL('../../assets/img/async.png', import.meta.url).toString(),
  },
  {
    id: 'structures',
    title: 'Структуры данных',
    imageUrl: new URL('../../assets/img/tree.png', import.meta.url).toString(),
  },
];
