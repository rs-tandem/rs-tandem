import { BrowserRoute } from 'vanilla-routing';

import { Layout } from '../../shared/layout/layout';
import { DOMHelper } from '../../shared/utils/createElement';

export function initRoutes(_layout: Layout): void {
  const routes = [
    {
      pathname: '/',
      element: () => {
        const page = DOMHelper.createElement('section', 'page');
        page.append(DOMHelper.createElement('h1', '', 'Main Page'));

        return page;
      },
    },
    {
      pathname: '/about',
      element: () => {
        const page = DOMHelper.createElement('section', 'page');
        page.append(DOMHelper.createElement('h1', '', 'About Page'));

        return page;
      },
    },
    {
      pathname: '*',
      element: () => {
        const page = DOMHelper.createElement('section', 'page');
        page.append(DOMHelper.createElement('h1', '', '404 Not Found'));

        return page;
      },
    },
  ];
  // BrowserRoute(routes, {target: layout.getContentElement(),});
  BrowserRoute(routes);
}
