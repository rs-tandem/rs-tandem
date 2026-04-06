# Interview Prep

Interview Prep — веб-приложение для подготовки к техническому собеседованию по JavaScript. Оно объединяет три формата тренировки в одном месте: тесты с вопросами, практические задачи с проверкой кода, и AI-интервьюер на базе Google Gemini, который задаёт вопросы и разбирает ответы в диалоге.

## Технический стек

**Язык:** TypeScript — строгая типизация везде, без единого any (это правило ESLint). Это помогало команде не ломать чужой код при мёрже.
**Сборка:** Vite — быстрый dev-сервер и сборка в production.
**Фреймворк:** никакого. Ванильный TypeScript с самописными классами вместо React/Vue. Каждая страница — класс с методом getElement(), который возвращает DOM-элемент. Это осознанное архитектурное решение.
**Роутинг:** библиотека vanilla-routing — SPA без перезагрузки страницы.
**Авторизация:** Firebase Authentication — вход по email/паролю и через Google OAuth.
**База данных:** Firestore — хранение прогресса пользователя (какие задачи решил).
**AI:** Firebase AI (Google Gemini 2.5 Flash Lite) — потоковая передача ответов (streaming), системный промпт под каждую тему, история чата в localStorage.
**State management:** Redux Toolkit — стор для состояния авторизации и вопросов.
**Утилиты:** Lodash (глубокое сравнение объектов в test-runner'ах).
**Качество кода:** ESLint (конфиг airbnb-extended + TypeScript-правила), Prettier, Husky (pre-commit и pre-push хуки), commitlint (Conventional Commits), validate-branch-name.
**Тесты:** Vitest + jsdom.

## Демо-видео

## Участники

- [YekaterinaAlex](https://github.com/YekaterinaAlex) / [Дневник](https://github.com/rs-tandem/rs-tandem/tree/main/development-notes/YekaterinaAlex)
- [S-Arashu](https://github.com/S-Arashu) / [Дневник](https://github.com/rs-tandem/rs-tandem/tree/main/development-notes/S-Arashu)
- [Pavel](https://github.com/oreopk) / [Дневник](https://github.com/rs-tandem/rs-tandem/tree/main/development-notes/oreopk)

## Доска

[Ссылка на доску](https://github.com/orgs/rs-tandem/projects/1/views/1)
[Скриншот доски](https://drive.google.com/file/d/1Wd6XGGR8F_sdN6JpTDbheItEhYAU14Fh/view?usp=sharing)

## Лучшие PR

[PR 1](https://github.com/rs-tandem/rs-tandem/pull/20)
[PR 2](https://github.com/rs-tandem/rs-tandem/pull/32)
[PR 3](https://github.com/rs-tandem/rs-tandem/pull/30)
[PR 4](https://github.com/rs-tandem/rs-tandem/pull/51)

## Meeting Notes

[Meeting Notes](https://github.com/rs-tandem/rs-tandem/tree/main/meeting-notes)

## Деплой

[interview-prep-rs-tandem.netlify.app](https://interview-prep-rs-tandem.netlify.app/)

## Meeting notes

[First](https://github.com/rs-tandem/rs-tandem/blob/main/meeting-notes/Meeting-Notes-02-14.md)
[Second](https://github.com/rs-tandem/rs-tandem/blob/main/meeting-notes/Meeting-Notes-03-02.md)

## Видео для Week 5 Checkpoint

[Week-5-Checkpoint](https://drive.google.com/file/d/1nGJthx2yY11uIZzwxrPgs23ofnwyweQq/view?usp=sharing)
