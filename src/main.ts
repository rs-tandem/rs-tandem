import './styles/main.css';
import { Button, Input } from './shared/components';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `Hi app`;

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const greyButton = new Button('Регистрация', 'grey');
  const orangeButton = new Button('Войти!', 'orange');
  const yellowButton = new Button('Начнем подтотовку!', 'yellow');
  const yellowButton2 = new Button('Начнем подтотовку!', 'yellow');
  const input = new Input('E-mail', 'text');
  const input2 = new Input('E-mail', 'text');
  app.append(
    greyButton.getElement(),
    orangeButton.getElement(),
    yellowButton.getElement(),
    input.getWrapperElement(),
    yellowButton2.getElement(),
    input2.getWrapperElement(),
  );
  input2.setError(true);
  yellowButton2.setDisabled(true);
}
