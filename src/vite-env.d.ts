/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Декларация типов для CSS файлов
declare module '*.css' {
  const content: string;
  export default content;
}

// Декларация типов для других ресурсов (на будущее)
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}
