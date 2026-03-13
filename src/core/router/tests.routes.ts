import { Layout } from '../../shared/layout/layout';

import { createStubPage, protectedPage } from './route-helpers';

export function testsRoutes(layout: Layout) {
  return [
    {
      pathname: '/topic/:topicId/tests',
      element: () =>
        protectedPage(() => {
          layout.getHeader().setTitle('Тесты');
          return createStubPage('Tests');
        }),
    },
  ];
}
