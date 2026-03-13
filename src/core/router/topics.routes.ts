import { TopicModePage } from '../../features/topicModes/ui/TopicModePage';
import { TopicsPage } from '../../features/topics/ui/TopicsPage';
import { Layout } from '../../shared/layout/layout';

import { getTopicId, protectedPage } from './route-helpers';

export function topicsRoutes(layout: Layout) {
  return [
    {
      pathname: '/',
      element: () =>
        protectedPage(() => {
          layout.getHeader().setTitle('Interview', 'Prep');
          return new TopicsPage().getElement();
        }),
    },
    {
      pathname: '/topic/:topicId',
      element: () =>
        protectedPage(() => {
          layout.getHeader().setTitle('Interview', 'Prep');
          return new TopicModePage(getTopicId()).getElement();
        }),
    },
  ];
}
