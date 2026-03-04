import './styles/main.css';

import { initRoutes } from './core/router/routes';
import { Layout } from './shared/layout/layout';

const root = document.querySelector<HTMLElement>('#app');
if (!root) throw new Error('#app not found');

const layout = new Layout();
document.body.replaceChildren(layout.getElement());

initRoutes(layout);
