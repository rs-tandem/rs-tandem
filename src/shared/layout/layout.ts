import { DOMHelper } from '../utils/createElement';

import { Header } from './Header/header';

export class Layout {
  private readonly root: HTMLElement;

  private readonly content: HTMLElement;

  constructor() {
    this.root = DOMHelper.createElement('div', 'layout');
    this.content = DOMHelper.createElement('main', 'main-content');

    const header = new Header();
    this.root.append(header.getElement(), this.content);
  }

  public getElement(): HTMLElement {
    return this.root;
  }

  public getContentElement(): HTMLElement {
    return this.content;
  }
}
