# Self-Assessment: RS Tandem Project

**Студент:** S-Arashu  
**Репозиторий:** [rs-tandem/rs-tandem](https://github.com/rs-tandem/rs-tandem)  
**Доска проекта:** [RS Tandem Project Board](https://github.com/orgs/rs-tandem/projects/1)
**Ссылка на PR:** [Self-Assessment link](https://github.com/rs-tandem/rs-tandem/pull/80)

---

## 1. Таблица реализованных фич

[Настройка Firebase проекта, config.ts — подключение initializeApp, getAuth, переменные окружения через import.meta.env] (https://github.com/orgs/rs-tandem/projects/1/views/1?pane=issue&itemId=157906301&issue=rs-tandem%7Crs-tandem%7C3) (+10 баллов, Architecture: API Layer — изоляция слоя работы с внешним сервисом).

[Авторизация по email/паролю — registerUser, loginUser, getErrorMessage с переводом кодов ошибок Firebase на русский] (https://github.com/rs-tandem/rs-tandem/pull/31) (+15 баллов, Backend & Data: BaaS Auth — работа с Firebase Authentication).

[AuthService — класс-синглтон, onAuthStateChanged, подписка/отписка, isAuthenticated(), паттерн результата { success, error }] (https://github.com/rs-tandem/rs-tandem/pull/31) (+10 баллов, Architecture: Design Patterns — Singleton + Observer).

[Google OAuth — signInWithGoogle, GoogleAuthProvider, signInWithPopup] (https://github.com/rs-tandem/rs-tandem/pull/31) (+10 баллов, Backend & Data: BaaS Auth (OAuth provider)).

[AuthPage — UI страницы входа/регистрации, переключение режимов, валидация, PasswordStrength компонент, восстановление пароля] (https://github.com/rs-tandem/rs-tandem/pull/31) (+25 баллов, My Components: Complex Component — сложный интерактивный компонент).

[ProtectedPage — функция высшего порядка для защиты маршрутов] (https://github.com/rs-tandem/rs-tandem/blob/develop/src/core/router/route-helpers.ts) (+10 баллов, Architecture: Design Patterns — HOF, Guard pattern).

[Самописный Markdown-парсер: блоки кода, заголовки, списки, жирный, инлайн-код — через регулярки и DOM-узлы без библиотек] (https://github.com/rs-tandem/rs-tandem/blob/develop/src/features/ai/AiPage.ts) (+20 баллов, My Components: Custom Algorithm — нетривиальный алгоритм).

[AiService — инициализация Firebase AI, системный промпт под каждую тему, startChat с историей] (https://github.com/rs-tandem/rs-tandem/pull/56) (+15 баллов, AI Integration: LLM Setup — подключение и настройка языковой модели).

[Стриминг ответа через sendMessageStream + асинхронный итератор Symbol.asyncIterator, цикл while(true) с iterator.next()] (https://github.com/rs-tandem/rs-tandem/blob/develop/src/features/ai/AiPage.ts) (+20 баллов, AI Integration: Streaming LLM — потоковая передача ответа).

[AiPage — полноценный UI чата: пузыри сообщений, аватарка, анимация "печатает...", поле ввода с автореcайзом, кнопки] (https://github.com/rs-tandem/rs-tandem/blob/develop/src/features/ai/AiPage.ts) (+25 баллов, My Components: Complex Component — сложный интерактивный компонент).

[История чата в localStorage с ключом по теме, загрузка при входе, сброс через "Новый чат"] (https://github.com/rs-tandem/rs-tandem/blob/develop/src/features/ai/AiPage.ts) (+10 баллов, UI & Interaction: Persistence — сохранение состояния между сессиями).

[Системный промпт под каждую тему (buildSystemPrompt), маппинг topicId → описание темы, передача в systemInstruction] (https://github.com/rs-tandem/rs-tandem/blob/develop/src/features/ai/AiService.ts) (+10 баллов, AI Integration: Prompt Engineering — настройка поведения модели).

ИТОГО ** 180/250 баллов**

---

## 2. Описание моей работы

### Процесс разработки

Моя работа над проектом началась с фундаментальной настройки окружения. Согласно чек-листам **Week 1** и **Week 2**, я развернула проект с использованием современного стека: **TypeScript**, **Vite** для быстрой сборки и **Firebase**.

### Инструменты и технологии

- **Язык:** TypeScript (строгая типизация для всех сервисов и компонентов).
- **Сборка и тулинг:** Vite, ESLint, Prettier.
- **Бэкенд (BaaS):** Firebase Authentication (для входа пользователей) и Firestore (для хранения данных).
- **Тестирование:** Vitest для покрытия критической логики тестами.
- **CI/CD:** Настройка GitHub Actions для автоматического деплоя на Netlify.

### Сложности и решения

1.  **Безопасность и CORS:** При деплое возникли проблемы с Mixed Content (HTTP запросы с HTTPS сайта) и CORS при обращении к внешнему API для задач. Решение потребовало настройки проксирования и тщательной проверки правил безопасности Firebase (Firestore Rules).
2.  **Роутинг в SPA:** Локально маршруты работали корректно, но на продакшене (Netlify) при обновлении страницы выдавалась ошибка 404. Проблема была решена созданием файла `_redirects` для корректной обработки всех путей через `index.html`.
3.  **Управление состоянием:** Для режима ИИ и авторизации потребовалось создать единые сервисы-синглтоны (`AuthService`, `AiService`), чтобы состояние пользователя и история переписки сохранялись при переходе между страницами.

### Что сделано с нуля

Лично мной были спроектированы и написаны:

- Архитектура приложения (структура папок, разделение на слои: View, Service, Config).
- Логика взаимодействия с Firebase (обертки над SDK для упрощения использования в компонентах).
- Алгоритм отправки запросов к AI с сохранением контекста диалога.
- Конфигурация CI/CD пайплайнов.

---

## 3. Личные Feature Components

Для демонстрации на презентации я выбрала два ключевых компонента, которые разрабатывала самостоятельно (логика, верстка, интеграция).

### 🔹 Feature Component 1: Система авторизации (Auth Module)

Это комплексное решение, включающее формы входа, регистрации и входа через Google.

- **Что внутри:**
  - Компонент `AuthPage`: динамическое переключение между режимами входа/регистрации, валидация полей в реальном времени, обработка состояний загрузки и ошибок.
  - Сервис `AuthService`: паттерн Singleton для управления сессией пользователя, подписка на изменения состояния аутентификации в реальном времени.
  - Интеграция с Firebase Auth: безопасное хранение токенов, обработка специфических ошибок (например, "пользователь уже существует").
- **Почему это важно:** Это "дверь" в приложение. Без надежной авторизации невозможна персонализация и сохранение прогресса пользователя.

### 🔹 Feature Component 2: Режим ИИ (AI Chat Interface)

Интерактивный чат, позволяющий пользователю получать помощь от нейросети в процессе обучения.

- **Что внутри:**
  - Компонент `AiChatPage`: рендеринг списка сообщений ("пузыри" для пользователя и ИИ), авто-скролл к новому сообщению, блокировка ввода во время ожидания ответа.
  - Сервис `AiService`: формирование контекстного запроса (отправка всей истории переписки для связности диалога), парсинг ответов API, обработка сетевых ошибок.
  - UX-фишки: индикатор "ИИ печатает...", очистка поля ввода после отправки.
- **Почему это важно:** Демонстрирует работу с асинхронными запросами, сложным состоянием (массив сообщений) и интеграцию со сторонним API.

---

_Документ подготовлен студентом S-Arashu для финальной защиты проекта RS Tandem._
