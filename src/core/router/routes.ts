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

        layout.renderPage(page);
        return page;
      },
    },
  ];
}
