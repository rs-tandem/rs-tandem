import { BrowserRoute } from 'vanilla-routing';

import { Layout } from '../../shared/layout/layout';
import { DOMHelper } from '../../shared/utils/createElement';

export function initRoutes(layout: Layout): void {
  const routes = [
    {
      pathname: '/',
      element: () => {
        layout.getHeader().setTitle('Interview', 'Prep');
        const page = DOMHelper.createElement('section', 'page');
        page.append(DOMHelper.createElement('h1', '', 'Main Page'));

        return page;
      },
    },
    {
      pathname: '/tasks',
      element: () => {
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
