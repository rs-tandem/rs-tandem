import { Router } from 'vanilla-routing';

import { authService } from '../../features/auth/AuthService';
import { TasksPage } from '../../features/tasks/ui/TasksPage';
import { Layout } from '../../shared/layout/layout';

import { getTopicId, protectedPage } from './route-helpers';

export function tasksRoutes(layout: Layout) {
  return [
    {
      pathname: '/topic/:topicId/tasks',
      element: () =>
        protectedPage(() => {
          if (!authService.isAuthenticated()) {
            Router.replace('/auth');
          }

          const topicId = getTopicId();
          layout.getHeader().setTitle('Задачи');
          return new TasksPage(topicId).getElement();
        }),
    },
  ];
}
