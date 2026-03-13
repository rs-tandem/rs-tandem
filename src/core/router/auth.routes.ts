import { Router } from 'vanilla-routing';

import { AuthPage } from '../../features/auth/AuthPage';
import { authService } from '../../features/auth/AuthService';
import { Layout } from '../../shared/layout/layout';

import { emptyPage } from './route-helpers';

export function authRoutes(_layout: Layout) {
  return [
    {
      pathname: '/auth',
      element: () => {
        if (authService.isAuthenticated()) {
          Router.replace('/');
          return emptyPage();
        }

        return new AuthPage().getElement();
      },
    },
  ];
}
