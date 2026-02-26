import './styles/main.css';
import { Router } from './core/router/Router';
import { createRoutes } from './core/router/routes';
import { Layout } from './shared/layout/layout';

const root = document.querySelector<HTMLElement>('#app');
if (!root) throw new Error('#app not found');

const layout = new Layout();
root.replaceChildren(layout.getElement());

Router.init(createRoutes(layout));
