# Prueba LDP Frontend

Aplicacion frontend para gestion y comparacion de jugadores.

## Stack

- React 19 + TypeScript
- Vite
- React Query
- Zustand
- Tailwind CSS
- Vitest

## Requisitos

- Node.js 20+
- npm 10+

## Instalacion

```bash
npm install
```

## Uso rapido

```bash
# Desarrollo
npm run dev

# Build de produccion
npm run build

# Vista previa del build
npm run preview

# Lint
npm run lint

# Tests (watch)
npm run test

# Tests (una sola corrida)
npm run test:run
```

## Estructura principal

- `src/pages`: vistas principales
- `src/components`: componentes de UI
- `src/hooks`: logica reutilizable
- `src/services`: llamadas HTTP y servicios
- `src/store`: estado global
- `src/tests`: pruebas unitarias

## Nota

Si en PowerShell falla la ejecucion de scripts, usa:

```bash
cmd /c npm run dev
```
