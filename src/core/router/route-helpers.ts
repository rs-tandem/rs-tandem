import { Router } from 'vanilla-routing';

import { authService } from '../../features/auth/AuthService';
import { DOMHelper } from '../../shared/utils/createElement';

const TOPIC_ID_INDEX = 2;

export function getTopicId(): string {
  const segments = window.location.pathname.split('/');
  return segments[TOPIC_ID_INDEX] ?? '';
}

export function emptyPage(): HTMLElement {
  return DOMHelper.createElement('div');
}

export function createStubPage(title: string): HTMLElement {
  const page = DOMHelper.createElement('section', 'page');
  page.append(DOMHelper.createElement('h1', '', title));
  return page;
}

export function protectedPage(render: () => HTMLElement): HTMLElement {
  if (!authService.isAuthenticated()) {
    Router.replace('/auth');
    return emptyPage();
  }

  return render();
}
