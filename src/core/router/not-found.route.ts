import { NotFoundPage } from '../../features/error/NotFoundPage';
import { Layout } from '../../shared/layout/layout';

export function notFoundRoute(layout: Layout) {
  return {
    pathname: '*',
    element: () => {
      layout.getHeader().setTitle('Ошибка', '404');
      return new NotFoundPage().getElement();
    },
  };
}
