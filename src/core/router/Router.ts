import { BrowserRoute } from 'vanilla-routing';

export interface Route {
  pathname: string;
  element: () => HTMLElement;
}

export class Router {
  public static init(routes: Route[]): void {
    BrowserRoute(routes);
  }

  // Programmatic navigation (for buttons, logo click, etc.)
  public static navigate(path: string): void {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}
