import { Layout } from '../../shared/layout/layout';
import { DOMHelper } from '../../shared/utils/createElement';

export function createRoutes(layout: Layout) {
  return [
    {
      pathname: '/',
      element: () => {
        const page = DOMHelper.createElement('section', 'page');
        page.append(DOMHelper.createElement('h1', '', 'Main Page'));
        layout.renderPage(page);
        return page;
      },
    },
    {
      pathname: '/about',
      element: () => {
        const page = DOMHelper.createElement('section', 'page');
        page.append(DOMHelper.createElement('h1', '', 'About Page'));
        layout.renderPage(page);
        return page;
      },
    },
    {
      pathname: '*',
      element: () => {
        const page = DOMHelper.createElement('section', 'page');
        page.append(DOMHelper.createElement('h1', '', '404 Not Found'));

        const link = DOMHelper.createElement('a', '', 'Home');
        link.setAttribute('href', '/');
        link.setAttribute('data-vanilla-route-link', 'spa');

        page.append(link);
        layout.renderPage(page);
        return page;
      },
    },
  ];
}
