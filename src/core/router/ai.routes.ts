import { AiPage } from '../../features/ai/AiPage';
import { Layout } from '../../shared/layout/layout';

import { getTopicId, protectedPage } from './route-helpers';

export function aiRoutes(layout: Layout) {
  return [
    {
      pathname: '/topic/:topicId/ai',
      element: () =>
        protectedPage(() => {
          layout.getHeader().setTitle('Режим ИИ');
          const topicId = getTopicId();
          return new AiPage(topicId).getElement();
        }),
    },
  ];
}
