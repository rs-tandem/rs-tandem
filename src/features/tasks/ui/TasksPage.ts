import { Router } from 'vanilla-routing';

import { Button } from '../../../shared/components';
import { DOMHelper } from '../../../shared/utils/createElement';
import type { Challenge, CheckResult } from '../tasks.types';
import { ChallengeService } from '../TasksService';

import './tasks-page.css';

const ZERO = 0;

export class TasksPage {
  private readonly element: HTMLElement;

  private currentChallenge: Challenge | null = null;

  private codeEditor: HTMLTextAreaElement | null = null;

  private resultsContainer: HTMLElement | null = null;

  private leftPanel: HTMLElement | null = null;

  private rightPanel: HTMLElement | null = null;

  private solution: { solution: string; explanation: string } | null = null;

  private isLoading = false;

  constructor(private readonly topicId: string) {
    this.element = DOMHelper.createElement('section', 'tasks-page');
    this.render();
    this.loadRandomChallengeByTopic();
  }

  private render(): void {
    const header = DOMHelper.createElement('div', 'tasks-page__header');

    const backBtn = new Button('Назад', 'grey', () =>
      Router.go(`/topic/${this.topicId}`),
    );

    const newTaskBtn = new Button('Next Random Task', 'blue', () =>
      this.loadRandomChallengeByTopic(),
    );

    header.append(backBtn.getElement(), newTaskBtn.getElement());

    const content = DOMHelper.createElement('div', 'tasks-page__content');
    this.leftPanel = this.createLeftPanel();
    this.rightPanel = this.createRightPanel();

    content.append(this.leftPanel, this.rightPanel);
    this.element.append(header, content);
  }

  private createLeftPanel(): HTMLElement {
    const panel = DOMHelper.createElement('div', 'tasks-page__panel');

    if (this.currentChallenge) {
      const taskInfo = this.createTaskInfo();
      panel.append(taskInfo);
    }
    return panel;
  }

  private createTaskInfo(): HTMLElement {
    const taskInfo = DOMHelper.createElement('div', 'tasks-page__task-info');

    const difficultyBadge = DOMHelper.createElement(
      'div',
      `tasks-page__difficulty tasks-page__difficulty--${this.currentChallenge!.difficulty}`,
      this.currentChallenge!.difficulty,
    );

    const taskTitle = DOMHelper.createElement(
      'h2',
      'tasks-page__task-title',
      this.currentChallenge!.title,
    );
    const taskDescription = DOMHelper.createElement(
      'p',
      'tasks-page__task-description',
      this.currentChallenge!.description,
    );
    const examplesSection = this.createExamplesSection();

    taskInfo.append(
      difficultyBadge,
      taskTitle,
      taskDescription,
      examplesSection,
    );

    return taskInfo;
  }

  private createExamplesSection(): HTMLElement {
    const examplesSection = DOMHelper.createElement('p', 'examples-section');

    if (
      this.currentChallenge &&
      this.currentChallenge?.examples.length > ZERO
    ) {
      this.currentChallenge.examples.forEach((example) => {
        const exampleItem = DOMHelper.createElement(
          'div',
          'tasks-page__example',
        );

        const inputSpan = DOMHelper.createElement(
          'span',
          'tasks-page__example-input',
          `Input: ${JSON.stringify(example.input)}`,
        );

        const outputSpan = DOMHelper.createElement(
          'span',
          'tasks-page__example-output',
          `Result: ${JSON.stringify(example.output)}`,
        );

        exampleItem.append(inputSpan, outputSpan);
        examplesSection.append(exampleItem);
      });
    }

    return examplesSection;
  }

  private createRightPanel(): HTMLElement {
    const panel = DOMHelper.createElement('div', 'tasks-page__panel');

    this.codeEditor = DOMHelper.createElement('textarea', 'tasks-page__editor');
    this.codeEditor.spellcheck = false;

    if (this.currentChallenge) {
      this.codeEditor.value = `function ${this.currentChallenge.functionName}() {\n  \n}`;
    }
    const buttonsContainer = DOMHelper.createElement(
      'div',
      'tasks-page__buttons',
    );

    const startTestsBtn = new Button('Запустить тесты', 'green', () =>
      this.runTests(),
    );
    const showSolutionBtn = new Button('Показать решение', 'grey', () =>
      this.showSolution(),
    );

    buttonsContainer.append(
      startTestsBtn.getElement(),
      showSolutionBtn.getElement(),
    );

    this.resultsContainer = DOMHelper.createElement(
      'div',
      'tasks-page__results',
    );

    panel.append(this.codeEditor, buttonsContainer, this.resultsContainer);

    return panel;
  }

  private async loadRandomChallengeByTopic(): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      this.currentChallenge = await ChallengeService.getRandomChallengeByTopic(
        this.topicId,
      );
      this.updateTaskDisplay();
    } catch {
      /* empty */
    } finally {
      this.isLoading = false;
    }
  }

  private updateTaskDisplay(): void {
    if (!this.currentChallenge || !this.leftPanel || !this.rightPanel) return;

    DOMHelper.clearChildren(this.leftPanel);
    const taskInfo = this.createTaskInfo();
    this.leftPanel.append(taskInfo);

    if (this.codeEditor) {
      this.codeEditor.value = `function ${this.currentChallenge.functionName}() {\n  \n}`;
    }

    if (this.resultsContainer) {
      DOMHelper.clearChildren(this.resultsContainer);
      this.resultsContainer.className = 'tasks-page__results';
    }
  }

  private async runTests(): Promise<void> {
    if (!this.currentChallenge || !this.codeEditor || !this.resultsContainer)
      return;

    this.currentChallenge.tests = (
      await ChallengeService.getTestsForChallenge(this.currentChallenge.id)
    ).tests;
    const code = this.codeEditor.value.trim();

    const result = ChallengeService.runCode(code, this.currentChallenge.tests);

    // const resultTests = await ChallengeService.checkSolution(
    //   this.currentChallenge.id,
    //   this.codeEditor.value,
    // );

    this.showResults(result);
  }

  private showResults(result: CheckResult): void {
    if (!this.resultsContainer) return;

    DOMHelper.clearChildren(this.resultsContainer);
    const summary = DOMHelper.createElement(
      'div',
      'tasks-page__results-summary',
      result.message,
    );

    this.resultsContainer.append(summary);

    if (result.results.length > ZERO) {
      const testsList = DOMHelper.createElement(
        'div',
        'tasks-page__tests-list',
      );
      result.results.forEach((test) => {
        const testItem = DOMHelper.createElement(
          'div',
          `tasks-page__test-item ${test.passed ? 'tasks-page__test-item--passed' : 'tasks-page__test-item--failed'}`,
        );
        const testDetails = DOMHelper.createElement(
          'div',
          'tasks-page__test-details',
        );

        const inputLine = DOMHelper.createElement(
          'div',
          '',
          `Input ${JSON.stringify(test.input)}`,
        );
        const expectedLine = DOMHelper.createElement(
          'div',
          '',
          `Expected ${JSON.stringify(test.expected)}`,
        );
        const actualLine = DOMHelper.createElement(
          'div',
          '',
          `Result ${JSON.stringify(test.actual)}`,
        );

        testDetails.append(inputLine, expectedLine, actualLine);

        if (test.error) {
          const error = DOMHelper.createElement(
            'div',
            'tasks-page__test-error',
            test.error,
          );
          testDetails.append(error);
        }

        testItem.append(testDetails);
        testsList.append(testItem);
      });

      this.resultsContainer.append(testsList);
    }
  }

  private async showSolution(): Promise<void> {
    if (!this.currentChallenge || !this.codeEditor) return;
    this.solution = await ChallengeService.getSolution(
      this.currentChallenge.id,
    );
    this.codeEditor.value = this.solution.solution;
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
