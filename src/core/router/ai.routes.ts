import { Layout } from '../../shared/layout/layout';

import { createStubPage, protectedPage } from './route-helpers';

export function aiRoutes(layout: Layout) {
  return [
    {
      pathname: '/topic/:topicId/ai',
      element: () =>
        protectedPage(() => {
          layout.getHeader().setTitle('Режим ИИ');
          return createStubPage('AI Mode Page');
        }),
    },
  ];
}
