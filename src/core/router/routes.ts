import { BrowserRoute, Router } from 'vanilla-routing';

import { AuthPage } from '../../features/auth/AuthPage';
import { authService } from '../../features/auth/AuthService';
import { TopicModePage } from '../../features/topicModes/ui/TopicModePage';
import { TopicsPage } from '../../features/topics/ui/TopicsPage';
import { Layout } from '../../shared/layout/layout';
import { DOMHelper } from '../../shared/utils/createElement';

const TOPIC_ID_INDEX = 2;

function getTopicId(): string {
  const segments = window.location.pathname.split('/');
  return segments[TOPIC_ID_INDEX] ?? '';
}

export function initRoutes(layout: Layout): void {
  const routes = [
    {
      pathname: '/',
      element: () => {
        if (!authService.isAuthenticated()) {
          Router.replace('auth');
          return DOMHelper.createElement('div');
        }
        layout.getHeader().setTitle('Interview', 'Prep');
        const page = new TopicsPage().getElement();
        return page;
      },
    },
    {
      pathname: '/auth',
      element: () => {
        if (authService.isAuthenticated()) {
          Router.replace('/');
          return DOMHelper.createElement('div');
        }

        const authPage = new AuthPage();
        const page = authPage.getElement();

        return page;
      },
    },
    {
      pathname: '/tasks',
      element: () => {
        if (!authService.isAuthenticated()) {
          Router.replace('/auth');
          return DOMHelper.createElement('div');
        }

        layout.getHeader().setTitle('Задания');
        const page = DOMHelper.createElement('section', 'page');
        page.append(DOMHelper.createElement('h1', '', 'Tasks Page'));

        return page;
      },
    },
    {
      pathname: '/topic/:topicId',
      element: () => {
        const topicId = getTopicId();

        layout.getHeader().setTitle('Interview', 'Prep');
        return new TopicModePage(topicId).getElement();
      },
    },
    {
      pathname: '*',
      element: () => {
        layout.getHeader().setTitle('Ошибка');
        const page = DOMHelper.createElement('section', 'page');
        page.append(DOMHelper.createElement('h1', '', '404 Not Found'));

        return page;
      },
    },
  ];
  // BrowserRoute(routes, {target: layout.getContentElement(),});
  BrowserRoute(routes);
}
