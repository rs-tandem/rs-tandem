import { DOMHelper } from '../utils/createElement';

import { Header } from './header';

export class Layout {
  private readonly root: HTMLElement;

  private readonly content: HTMLElement;

  constructor() {
    this.root = DOMHelper.createElement('div', 'layout');
    this.content = DOMHelper.createElement('main', 'main-content');

    const header = new Header();
    this.root.append(header.getElement(), this.content);
  }

  public renderPage(page: HTMLElement): void {
    this.content.replaceChildren(page);
  }

  public getElement(): HTMLElement {
    return this.root;
  }
}
