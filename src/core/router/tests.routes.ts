import { TestsPage } from '../../features/tests/TestPage';
import { Layout } from '../../shared/layout/layout';

import { getTopicId, protectedPage } from './route-helpers';

export function testsRoutes(layout: Layout) {
  return [
    {
      pathname: '/topic/:topicId/tests',
      element: () =>
        protectedPage(() => {
          layout.getHeader().setTitle('Тесты');
          return new TestsPage(getTopicId()).getElement();
        }),
    },
  ];
}
