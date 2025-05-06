/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API_URL: string
  // Aquí puedes agregar más variables de entorno según las necesites
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
