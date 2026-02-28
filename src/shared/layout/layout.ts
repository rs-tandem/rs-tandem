import { DOMHelper } from '../utils/createElement';

import { Header } from './Header/header';

export class Layout {
  private readonly root: HTMLElement;

  private readonly content: HTMLElement;

  private readonly header: Header;

  constructor() {
    this.root = DOMHelper.createElement('div', 'layout');
    this.content = DOMHelper.createElement('main', 'main-content');

    this.header = new Header();
    this.root.append(this.header.getElement(), this.content);
  }

  public getElement(): HTMLElement {
    return this.root;
  }

  public getContentElement(): HTMLElement {
    return this.content;
  }

  public getHeader(): Header {
    return this.header;
  }
}
