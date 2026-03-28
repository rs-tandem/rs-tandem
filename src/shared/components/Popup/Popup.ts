import { DOMHelper } from '../../utils/createElement';
import { Button, type ButtonType } from '../Button/Button';
import './Popup.css';

export interface PopupOptions {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
  confirmButtonType?: ButtonType;
  cancelButtonType?: ButtonType;
}

export class Popup {
  private overlay: HTMLElement;

  private popupElement: HTMLElement;

  private options: PopupOptions;

  constructor(options: PopupOptions) {
    this.options = {
      confirmText: 'OK',
      cancelText: 'Отмена',
      showCancel: false,
      confirmButtonType: 'green',
      cancelButtonType: 'grey',
      ...options,
    };

    this.overlay = this.createOverlay();
    this.popupElement = this.createPopup();
  }

  private createOverlay(): HTMLElement {
    const overlay = DOMHelper.createElement('div', 'popup-overlay');
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.close();
        this.options.onCancel?.();
      }
    });

    return overlay;
  }

  private createPopup(): HTMLElement {
    const popup = DOMHelper.createElement('div', 'popup');
    const message = DOMHelper.createElement(
      'p',
      'popup-message',
      this.options.message,
    );
    popup.appendChild(message);
    const buttonsContainer = DOMHelper.createElement('div', 'popup-buttons');
    if (this.options.showCancel) {
      const cancelButton = new Button(
        this.options.cancelText!,
        this.options.cancelButtonType,
        () => {
          this.close();
          this.options.onCancel?.();
        },
      );
      buttonsContainer.appendChild(cancelButton.getElement());
    }
    const confirmButton = new Button(
      this.options.confirmText!,
      this.options.confirmButtonType,
      () => {
        this.close();
        this.options.onConfirm?.();
      },
    );
    buttonsContainer.appendChild(confirmButton.getElement());
    popup.appendChild(buttonsContainer);
    return popup;
  }

  show(): void {
    this.overlay.appendChild(this.popupElement);
    document.body.appendChild(this.overlay);
  }

  close(): void {
    this.overlay.remove();
  }
}
