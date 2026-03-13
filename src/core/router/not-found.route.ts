import { Layout } from '../../shared/layout/layout';

import { createStubPage } from './route-helpers';

export function notFoundRoute(layout: Layout) {
  return {
    pathname: '*',
    element: () => {
      layout.getHeader().setTitle('Ошибка');
      return createStubPage('404 Not Found');
    },
  };
}
