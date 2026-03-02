export class DOMHelper {
  static createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string,
    textContent?: string,
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (textContent) {
      element.textContent = textContent;
    }

    return element;
  }

  static scrollToBottom(element: HTMLElement): void {
    const currentElement = element;
    currentElement.scrollTop = currentElement.scrollHeight;
  }

  static clearChildren(element: HTMLElement): void {
    while (element.firstChild) {
      element.firstChild.remove();
    }
  }
}
