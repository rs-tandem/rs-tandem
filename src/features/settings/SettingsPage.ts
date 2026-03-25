import { DOMHelper } from '../../shared/utils/createElement';
import './settings-page.css';

const SOUND_STORAGE_KEY = 'sound-enabled';

export class SettingsPage {
  private readonly element: HTMLElement;

  constructor() {
    this.element = DOMHelper.createElement('section', 'settings-page');
    this.render();
  }

  private render(): void {
    const wrapper = DOMHelper.createElement('div', 'settings-page__wrapper');

    const left = DOMHelper.createElement('div', 'settings-page__left');
    const right = DOMHelper.createElement('div', 'settings-page__right');

    const soundRow = DOMHelper.createElement('div', 'settings-page__row');
    const soundLabel = DOMHelper.createElement(
      'label',
      'settings-page__label',
      'Звук',
    );

    const isSoundEnabled = localStorage.getItem(SOUND_STORAGE_KEY) !== 'off';

    const soundToggle = DOMHelper.createElement(
      'button',
      'settings-page__toggle',
      isSoundEnabled ? 'ON' : 'OFF',
    );
    soundToggle.setAttribute('type', 'button');
    soundToggle.setAttribute('aria-pressed', String(isSoundEnabled));

    soundToggle.addEventListener('click', () => {
      const currentValue = localStorage.getItem(SOUND_STORAGE_KEY) !== 'off';
      const nextValue = !currentValue;

      localStorage.setItem(SOUND_STORAGE_KEY, nextValue ? 'on' : 'off');

      soundToggle.textContent = nextValue ? 'ON' : 'OFF';
      soundToggle.setAttribute('aria-pressed', String(nextValue));
      soundToggle.classList.toggle(
        'settings-page__toggle--active',
        isSoundEnabled,
      );
    });
    const mascot = DOMHelper.createElement('img', 'settings-page__image');
    mascot.src = new URL(
      '../../assets/img/mascot_settings.png',
      import.meta.url,
    ).toString();
    mascot.alt = 'Mascot';

    left.append(mascot);
    soundRow.append(soundLabel, soundToggle);
    right.append(soundRow);
    wrapper.append(left, right);
    this.element.append(wrapper);
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
