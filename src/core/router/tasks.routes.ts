import { Layout } from '../../shared/layout/layout';

import { createStubPage, protectedPage } from './route-helpers';

export function tasksRoutes(layout: Layout) {
  return [
    {
      pathname: '/topic/:topicId/tasks',
      element: () =>
        protectedPage(() => {
          layout.getHeader().setTitle('Задачи');
          return createStubPage('Tasks Page');
        }),
    },
  ];
}
