# El Rincón del Café: pruebas de reseñas

## Requisitos

- Node.js 24 y npm.
- Git.

## Instalación

```bash
git clone https://github.com/Isaac-Chaves-G/taller-playwright-resenas.git
cd taller-playwright-resenas
npm run instalar
```

## Iniciar la aplicación

```bash
npm start --prefix app
```

Abrir [http://localhost:3000](http://localhost:3000).

## Ejecutar las pruebas

Detener la aplicación iniciada manualmente antes de ejecutar las pruebas. Playwright la inicia y la cierra automáticamente.

```bash
npm test
```

Para ejecutar con el modo de referencia:

```bash
npm run test:referencia
```

Para abrir el reporte de la última ejecución:

```bash
npx --prefix pruebas playwright show-report pruebas/playwright-report/original
```
