import { BrowserRoute, Router } from 'vanilla-routing';

import { AuthPage } from '../../features/auth/AuthPage';
import { authService } from '../../features/auth/AuthService';
import { TopicsPage } from '../../features/topics/TopicsPage';
import { Layout } from '../../shared/layout/layout';
import { DOMHelper } from '../../shared/utils/createElement';

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
