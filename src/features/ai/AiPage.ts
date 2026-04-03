/* eslint-disable class-methods-use-this */
import { Router } from 'vanilla-routing';

import { Button } from '../../shared/components';
import { DOMHelper } from '../../shared/utils/createElement';

import type { ChatMessage } from './AiService';
import { aiService } from './AiService';

import './ai-page.css';

const INPUT_ROWS = 1;
const MAX_TEXTAREA_HEIGHT = 120;
const BACKTICK_OFFSET = 1;
const BOLD_MARKER_LENGTH = 2;

const TOPIC_DISPLAY_NAMES: Record<string, string> = {
  'core-js': 'Основы JavaScript',
  closures: 'Замыкания',
  asynchrony: 'Асинхронность',
  'data-structures': 'Структуры данных',
};

export class AiPage {
  private readonly element: HTMLElement;

  private messagesContainer: HTMLElement | null = null;

  private inputField: HTMLTextAreaElement | null = null;

  private sendButton: Button | null = null;

  private isLoading = false;

  private chatHistory: ChatMessage[] = [];

  private loadHistory(topicId: string): ChatMessage[] {
    const key = `ai-chat-history-${topicId}`;
    const saved = localStorage.getItem(key);
    if (!saved) return [];

    try {
      const history = JSON.parse(saved);
      return Array.isArray(history) ? history : [];
    } catch {
      localStorage.removeItem(key);
      return [];
    }
  }

  private saveHistory(): void {
    const key = `ai-chat-history-${this.topicId}`;
    localStorage.setItem(key, JSON.stringify(this.chatHistory));
  }

  private typingIndicatorEl: HTMLElement | null = null;

  constructor(private readonly topicId: string) {
    this.element = DOMHelper.createElement('section', 'ai-page');
    this.render();
    this.initAi();
  }

  private render(): void {
    this.messagesContainer = DOMHelper.createElement(
      'div',
      'ai-page__messages custom-scroll',
    );

    const header = this.createHeader();
    const inputArea = this.createInputArea();

    this.element.append(header, this.messagesContainer, inputArea);
  }

  private createHeader(): HTMLElement {
    const topicName =
      TOPIC_DISPLAY_NAMES[this.topicId] ?? 'Подготовка к интервью';

    const header = DOMHelper.createElement('div', 'ai-page__header');

    const backBtn = new Button('← Назад', 'grey', () =>
      Router.go(`/topic/${this.topicId}`),
    );

    const newChatBtn = new Button('Новый чат', 'grey', () =>
      this.restartChat(),
    );

    const titleBlock = this.createTitleBlock(topicName);

    header.append(backBtn.getElement(), titleBlock, newChatBtn.getElement());
    return header;
  }

  private createTitleBlock(topicName: string): HTMLElement {
    const titleBlock = DOMHelper.createElement('div', 'ai-page__title-block');
    const titleIcon = DOMHelper.createElement(
      'div',
      'ai-page__title-icon',
      '🤖',
    );
    const titleText = DOMHelper.createElement('div', 'ai-page__title-text');

    const titleMain = DOMHelper.createElement(
      'h2',
      'ai-page__title-main',
      'ИИ-интервьюер',
    );
    const titleSub = DOMHelper.createElement(
      'span',
      'ai-page__title-sub',
      topicName,
    );

    titleText.append(titleMain, titleSub);
    titleBlock.append(titleIcon, titleText);
    return titleBlock;
  }

  private createInputArea(): HTMLElement {
    const inputArea = DOMHelper.createElement('div', 'ai-page__input-area');
    const inputWrapper = DOMHelper.createElement(
      'div',
      'ai-page__input-wrapper',
    );

    this.inputField = DOMHelper.createElement('textarea', 'ai-page__input');
    this.inputField.placeholder = 'Напиши свой ответ или задай вопрос...';
    this.inputField.rows = INPUT_ROWS;

    this.inputField.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        this.handleSend();
      }
    });

    this.inputField.addEventListener('input', () => {
      this.autoResizeTextarea();
    });

    this.sendButton = new Button('Отправить', 'orange', () =>
      this.handleSend(),
    );

    const hint = DOMHelper.createElement(
      'span',
      'ai-page__hint',
      'Ctrl+Enter для отправки',
    );

    inputWrapper.append(this.inputField, hint);
    inputArea.append(inputWrapper, this.sendButton.getElement());
    return inputArea;
  }

  private async initAi(): Promise<void> {
    this.showTypingIndicator();
    this.setInputDisabled(true);
    const intervalMax = 100;
    const intervalMin = 50;

    try {
      this.chatHistory = this.loadHistory(this.topicId);

      await aiService.init(this.topicId, this.chatHistory);

      this.removeTypingIndicator();

      if (this.chatHistory.length > 0) {
        this.chatHistory.forEach((msg) => this.renderMessageWithoutScroll(msg));

        setTimeout(() => {
          this.scrollToBottom();
          setTimeout(() => this.scrollToBottom(), intervalMax);
        }, intervalMin);
      } else {
        const greeting = await aiService.sendMessage(
          'Начни сессию подготовки к интервью. Поприветствуй меня и задай первый вопрос.',
        );

        this.addMessage({ role: 'model', text: greeting });
        this.chatHistory.push({ role: 'model', text: greeting });
        this.saveHistory();
      }
    } catch (error) {
      this.removeTypingIndicator();
      this.addErrorMessage(
        'Не удалось подключиться к ИИ. Проверь настройки Firebase AI в консоли.',
      );
      // eslint-disable-next-line no-console
      console.error('AI init error:', error);
    } finally {
      this.setInputDisabled(false);
    }
  }

  private renderMessageWithoutScroll(message: ChatMessage): void {
    if (!this.messagesContainer) return;

    const wrapper = DOMHelper.createElement(
      'div',
      `ai-page__message ai-page__message--${message.role}`,
    );

    if (message.role === 'model') {
      const avatar = DOMHelper.createElement('div', 'ai-page__avatar', '🤖');
      const bubble = DOMHelper.createElement(
        'div',
        'ai-page__bubble ai-page__bubble--model',
      );
      bubble.append(...this.parseMarkdown(message.text));
      wrapper.append(avatar, bubble);
    } else {
      const bubble = DOMHelper.createElement(
        'div',
        'ai-page__bubble ai-page__bubble--user',
      );
      bubble.textContent = message.text;
      wrapper.append(bubble);
    }

    this.messagesContainer.append(wrapper);
  }

  private async handleSend(): Promise<void> {
    if (this.isLoading || !this.inputField) return;

    const text = this.inputField.value.trim();
    if (!text) return;

    this.inputField.value = '';
    this.autoResizeTextarea();
    this.addMessage({ role: 'user', text });

    this.chatHistory.push({ role: 'user', text });
    this.saveHistory();

    this.isLoading = true;
    this.setInputDisabled(true);
    this.showTypingIndicator();

    try {
      const streamBubble = this.createStreamBubble();

      let fullText = '';

      await aiService.sendMessageStream(
        text,
        (chunk) => {
          this.removeTypingIndicator();
          fullText += chunk;
          DOMHelper.clearChildren(streamBubble);
          streamBubble.append(...this.parseMarkdown(fullText));
          DOMHelper.scrollToBottom(this.messagesContainer!);
        },
        (completeText) => {
          this.chatHistory.push({ role: 'model', text: completeText });
          this.saveHistory();
        },
      );
    } catch (error) {
      this.removeTypingIndicator();
      const message =
        error instanceof Error ? error.message : 'Ошибка при получении ответа.';
      this.addErrorMessage(message);
    } finally {
      this.isLoading = false;
      this.setInputDisabled(false);
      this.inputField?.focus();
    }
  }

  private createStreamBubble(): HTMLElement {
    if (!this.messagesContainer) return DOMHelper.createElement('div', '');

    const wrapper = DOMHelper.createElement(
      'div',
      'ai-page__message ai-page__message--model',
    );
    const avatar = DOMHelper.createElement('div', 'ai-page__avatar', '🤖');
    const bubble = DOMHelper.createElement(
      'div',
      'ai-page__bubble ai-page__bubble--model',
    );

    wrapper.append(avatar, bubble);
    this.messagesContainer.append(wrapper);
    DOMHelper.scrollToBottom(this.messagesContainer);

    return bubble;
  }

  private addMessage(message: ChatMessage): void {
    if (!this.messagesContainer) return;

    const wrapper = DOMHelper.createElement(
      'div',
      `ai-page__message ai-page__message--${message.role}`,
    );

    if (message.role === 'model') {
      const avatar = DOMHelper.createElement('div', 'ai-page__avatar', '🤖');
      const bubble = DOMHelper.createElement(
        'div',
        'ai-page__bubble ai-page__bubble--model',
      );
      bubble.append(...this.parseMarkdown(message.text));
      wrapper.append(avatar, bubble);
    } else {
      const bubble = DOMHelper.createElement(
        'div',
        'ai-page__bubble ai-page__bubble--user',
      );
      bubble.textContent = message.text;
      wrapper.append(bubble);
    }

    this.messagesContainer.append(wrapper);

    this.scrollToBottom();
  }

  private parseMarkdown(text: string): Node[] {
    const nodes: Node[] = [];
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    // eslint-disable-next-line no-cond-assign
    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        nodes.push(
          ...this.parseInlineMarkdown(text.slice(lastIndex, match.index)),
        );
      }

      const lang = match[1] ?? '';
      const code = match[2]?.trim() ?? '';
      nodes.push(this.createCodeBlock(lang, code));

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      nodes.push(...this.parseInlineMarkdown(text.slice(lastIndex)));
    }

    return nodes;
  }

  private parseInlineMarkdown(text: string): Node[] {
    const nodes: Node[] = [];

    const lines = text.split('\n');

    lines.forEach((line, lineIndex) => {
      const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
      if (headingMatch) {
        const level = headingMatch[1]!.length;
        const heading = document.createElement(`h${level}`);
        heading.className = `ai-page__heading ai-page__h${level}`;
        heading.textContent = headingMatch[2] ?? '';
        nodes.push(heading);

        if (lineIndex < lines.length - 1) {
          nodes.push(document.createElement('br'));
        }
        return;
      }

      const listMatch = line.match(/^[-*•]\s+(.+)/);
      if (listMatch) {
        const li = DOMHelper.createElement('div', 'ai-page__list-item');
        const bullet = DOMHelper.createElement('span', 'ai-page__bullet', '•');
        const content = DOMHelper.createElement('span', '');

        content.append(...this.parseInlineBoldAndCode(listMatch[1] ?? ''));
        li.append(bullet, content);
        nodes.push(li);
        if (lineIndex < lines.length - 1) {
          nodes.push(document.createElement('br'));
        }
        return;
      }

      const orderedMatch = line.match(/^(\d+)\.\s+(.+)/);
      if (orderedMatch) {
        const li = DOMHelper.createElement('div', 'ai-page__list-item');
        const num = DOMHelper.createElement(
          'span',
          'ai-page__bullet',
          `${orderedMatch[1]}.`,
        );
        const content = DOMHelper.createElement('span', '');
        content.append(...this.parseInlineBoldAndCode(orderedMatch[2] ?? ''));
        li.append(num, content);
        nodes.push(li);
        if (lineIndex < lines.length - 1) {
          nodes.push(document.createElement('br'));
        }
        return;
      }

      if (line.match(/^[-*]{3,}$/)) {
        nodes.push(document.createElement('hr'));
        return;
      }

      if (line) {
        nodes.push(...this.parseInlineBoldAndCode(line));
      }

      if (lineIndex < lines.length - 1) {
        nodes.push(document.createElement('br'));
      }
    });

    return nodes;
  }

  private parseInlineBoldAndCode(text: string): Node[] {
    const nodes: Node[] = [];
    const minLength = 2;
    const minLengthBold = 4;

    text.split(/(`[^`]+`)/).forEach((part) => {
      if (
        part.startsWith('`') &&
        part.endsWith('`') &&
        part.length > minLength
      ) {
        const code = DOMHelper.createElement('code', 'ai-page__inline-code');
        code.textContent = part.slice(BACKTICK_OFFSET, -BACKTICK_OFFSET);
        nodes.push(code);
        return;
      }

      part.split(/(\*\*[^*]+\*\*)/).forEach((boldPart) => {
        if (
          boldPart.startsWith('**') &&
          boldPart.endsWith('**') &&
          boldPart.length > minLengthBold
        ) {
          const strong = document.createElement('strong');
          strong.textContent = boldPart.slice(
            BOLD_MARKER_LENGTH,
            -BOLD_MARKER_LENGTH,
          );
          nodes.push(strong);
          return;
        }

        if (boldPart) {
          nodes.push(document.createTextNode(boldPart));
        }
      });
    });

    return nodes;
  }

  private createCodeBlock(lang: string, code: string): HTMLElement {
    const wrapper = DOMHelper.createElement('div', 'ai-page__code-block');

    if (lang) {
      wrapper.append(
        DOMHelper.createElement('span', 'ai-page__code-lang', lang),
      );
    }

    const pre = document.createElement('pre');
    const codeEl = document.createElement('code');
    codeEl.textContent = code;
    pre.append(codeEl);
    wrapper.append(pre);

    return wrapper;
  }

  private showTypingIndicator(): void {
    if (!this.messagesContainer) return;

    if (this.typingIndicatorEl) return;

    const indicator = DOMHelper.createElement(
      'div',
      'ai-page__message ai-page__message--model ai-page__typing',
    );

    const avatar = DOMHelper.createElement('div', 'ai-page__avatar', '🤖');
    const bubble = DOMHelper.createElement(
      'div',
      'ai-page__bubble ai-page__bubble--model',
    );
    const dots = DOMHelper.createElement('div', 'ai-page__dots');

    dots.append(
      document.createElement('span'),
      document.createElement('span'),
      document.createElement('span'),
    );

    bubble.append(dots);
    indicator.append(avatar, bubble);
    this.messagesContainer.append(indicator);

    this.typingIndicatorEl = indicator;
    DOMHelper.scrollToBottom(this.messagesContainer);
  }

  private removeTypingIndicator(): void {
    this.typingIndicatorEl?.remove();
    this.typingIndicatorEl = null;
  }

  private addErrorMessage(text: string): void {
    if (!this.messagesContainer) return;

    const errorEl = DOMHelper.createElement('div', 'ai-page__error-msg', text);
    this.messagesContainer.append(errorEl);
    DOMHelper.scrollToBottom(this.messagesContainer);
  }

  private setInputDisabled(disabled: boolean): void {
    if (this.inputField) {
      this.inputField.disabled = disabled;
    }
    this.sendButton?.setDisabled(disabled);
  }

  private autoResizeTextarea(): void {
    if (!this.inputField) return;
    this.inputField.style.height = 'auto';
    this.inputField.style.height = `${Math.min(this.inputField.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }

  private scrollToBottom(): void {
    if (!this.messagesContainer) return;
    const container = this.messagesContainer;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    container.offsetHeight;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'auto',
    });
  }

  private async restartChat(): Promise<void> {
    if (!this.messagesContainer) return;
    DOMHelper.clearChildren(this.messagesContainer);
    this.chatHistory = [];
    this.saveHistory();

    aiService.reset();
    await this.initAi();
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
