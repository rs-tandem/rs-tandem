import { BrowserRoute } from 'vanilla-routing';

import { Layout } from '../../shared/layout/layout';

import { createRoutes } from './routes.config';

export function initRoutes(layout: Layout): void {
  // BrowserRoute(routes, {target: layout.getContentElement(),});
  BrowserRoute(createRoutes(layout));
}
