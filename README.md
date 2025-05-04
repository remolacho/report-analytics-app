# Reportería Conversacional - Frontend

Una aplicación moderna de análisis de datos basada en chat que permite a los usuarios interactuar con sus datos a través de una interfaz conversacional intuitiva.

## Características Principales

- 💬 Chat interactivo para consultas de datos
- 📊 Visualización dinámica de datos (tablas, gráficos)
- 📁 Subida de archivos mediante drag & drop
- ⬇️ Descarga de reportes generados
- 🔄 Persistencia de conversaciones
- 📱 Diseño responsivo y moderno

## Tecnologías Utilizadas

- React 18
- React Router DOM
- SCSS para estilos
- Vite (bundler)
- Chart.js (para visualizaciones)
- React Dropzone (para subida de archivos)

## Estructura del Proyecto

```
src/
├── components/        # Componentes reutilizables
│   ├── ChatBox/      # Componente principal del chat
│   ├── Message/      # Tipos de mensajes
│   └── FileDropzone/ # Componente de subida de archivos
├── layouts/          # Diseños base de la aplicación
├── pages/           # Vistas principales
├── router/          # Configuración de rutas
├── scss/            # Estilos globales
└── App.tsx          # Punto de entrada de la aplicación
```

## Requisitos Previos

- Node.js (versión 14.0.0 o superior)
- npm (incluido con Node.js)

## Instalación

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd report-analytics-app
```

2. Instala las dependencias:
```bash
npm install
```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Tipos de Mensajes Soportados

La aplicación maneja varios tipos de mensajes:
- `text`: Mensajes de texto simples
- `html`: Contenido HTML embebido (tablas, etc.)
- `image`: Imágenes y gráficos
- `chart_data`: Datos para gráficos interactivos
- `download`: Enlaces de descarga para archivos

## Próximas Características

- Integración con backend Rails
- Persistencia de conversaciones
- Exportación de conversaciones
- Temas personalizables
- Más tipos de visualizaciones

## Licencia

Este proyecto está bajo la Licencia MIT.
