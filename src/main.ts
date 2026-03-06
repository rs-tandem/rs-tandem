import './styles/main.css';

import { Router } from 'vanilla-routing';

import { onAuthChange } from './core/firebase/auth';
import { initRoutes } from './core/router/routes';
import { authService } from './features/auth/AuthService';
import { Layout } from './shared/layout/layout';

const root = document.querySelector<HTMLElement>('#app');
if (!root) throw new Error('#app not found');

const layout = new Layout();
document.body.replaceChildren(layout.getElement());

let routesInitialized = false;

onAuthChange((user) => {
  authService.setUser(user);
  layout.getHeader().updateAuthState();

  if (!routesInitialized) {
    routesInitialized = true;
    initRoutes(layout);
  } else if (!authService.isAuthenticated()) {
    Router.go('/auth');
  } else {
    Router.go('/');
  }

  authService.init();
});
