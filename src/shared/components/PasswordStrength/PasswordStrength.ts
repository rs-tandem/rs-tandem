import { DOMHelper } from '../../utils/createElement';
import './PasswordStrength.css';

type StrengthLevel = 'weak' | 'medium' | 'strong';

interface StrengthResult {
  level: StrengthLevel;
  label: string;
  score: number;
}

function evaluatePassword(password: string): StrengthResult {
  if (!password) {
    return { level: 'weak', label: '', score: 0 };
  }

  let score = 0;
  const passwordLength = 8;
  const goodScore = 3;

  if (password.length >= passwordLength) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;

  if (score <= 1) return { level: 'weak', label: 'Слабый', score: 1 };
  if (score <= goodScore)
    return { level: 'medium', label: 'Средний', score: 2 };
  return { level: 'strong', label: 'Сильный', score: 3 };
}

export class PasswordStrength {
  private readonly wrapper: HTMLElement;

  private readonly segments: HTMLElement[];

  private readonly label: HTMLElement;

  constructor() {
    this.wrapper = DOMHelper.createElement('div', 'password-strength');

    const bar = DOMHelper.createElement('div', 'password-strength__bar');
    this.segments = Array.from({ length: 3 }, () => {
      const seg = DOMHelper.createElement('div', 'password-strength__segment');
      bar.appendChild(seg);
      return seg;
    });

    this.label = DOMHelper.createElement('span', 'password-strength__label');

    this.wrapper.append(bar, this.label);
    this.wrapper.style.display = 'none';
  }

  public update(password: string): void {
    const result = evaluatePassword(password);

    if (!password) {
      this.wrapper.style.display = 'none';
      return;
    }

    this.wrapper.style.display = 'flex';

    this.segments.forEach((seg, index) => {
      seg.classList.remove('weak', 'medium', 'strong');
      if (index < result.score) {
        seg.classList.add(result.level);
      }
    });

    this.label.textContent = result.label;
    this.label.className = `password-strength__label password-strength__label--${result.level}`;
  }

  public getElement(): HTMLElement {
    return this.wrapper;
  }
}
