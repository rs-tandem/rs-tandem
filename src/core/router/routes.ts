import { BrowserRoute } from 'vanilla-routing';

const routes = [
  {
    pathname: '/',
    element: () => {
      const div = document.createElement('div');
      div.innerHTML = '<h1>Main Page</h1>';
      return div;
    },
  },
  {
    pathname: '/about',
    element: () => {
      const div = document.createElement('div');
      div.innerHTML = '<h1>About Page</h1>';
      return div;
    },
  },
  {
    pathname: '*',
    element: () => {
      const link = document.createElement('a');
      link.setAttribute('data-vanilla-route-link', 'spa');
      link.setAttribute('href', '/');
      link.textContent = 'Home';
      return link;
    },
  },
];

BrowserRoute(routes);

export const Router = routes;
