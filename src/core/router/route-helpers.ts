import { Router } from 'vanilla-routing';

import { authService } from '../../features/auth/AuthService';
import { Spinner } from '../../shared/components/Spinner/Spinner';
import { DOMHelper } from '../../shared/utils/createElement';
import { setPageLoading } from '../store/authSlice';
import { store } from '../store/Store';

const TOPIC_ID_INDEX = 2;
const BASE_TIME_LOADING = 400;

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

  // Пока выглядит как костыль
  const spinner = new Spinner();
  const main = document.querySelector('.main-content');
  if (main) {
    DOMHelper.showSpinner(main as HTMLElement, spinner.getElement());
    store.dispatch(setPageLoading(true));

    setTimeout(() => {
      DOMHelper.clearChildren(main as HTMLElement);
      main.appendChild(render());
      store.dispatch(setPageLoading(false));
    }, BASE_TIME_LOADING);

    return emptyPage();
  }

  return render();
}
