import { Layout } from '../../shared/layout/layout';

import { aiRoutes } from './ai.routes';
import { authRoutes } from './auth.routes';
import { notFoundRoute } from './not-found.route';
import { tasksRoutes } from './tasks.routes';
import { testsRoutes } from './tests.routes';
import { topicsRoutes } from './topics.routes';

export function createRoutes(layout: Layout) {
  return [
    ...authRoutes(layout),
    ...topicsRoutes(layout),
    ...testsRoutes(layout),
    ...tasksRoutes(layout),
    ...aiRoutes(layout),
    notFoundRoute(layout),
  ];
}
