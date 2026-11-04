import { defineConfig } from '@playwright/test';

const referencia = process.env.MODO_REFERENCIA === 'true';
const puerto = referencia ? 3001 : 3000;
const modo = referencia ? 'referencia' : 'original';
const baseURL = `http://127.0.0.1:${puerto}`;

export default defineConfig({
  testDir: './tests',
  // /api/reiniciar cambia un estado global: ni archivos ni proyectos deben competir.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  outputDir: `test-results/${modo}`,
  reporter: [
    ['list'],
    ['html', { outputFolder: `playwright-report/${modo}`, open: 'never' }],
    ['json', { outputFile: `resultados/${modo}.json` }],
    ['junit', { outputFile: `resultados/${modo}.xml` }],
  ],
  use: {
    baseURL,
    locale: 'es-CO',
    viewport: { width: 1280, height: 960 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'api', testMatch: '**/api/*.spec.js' },
    { name: 'chromium', testMatch: '**/ui/*.spec.js', use: { browserName: 'chromium' } },
  ],
  webServer: {
    command: 'node server.js',
    cwd: '../app',
    url: baseURL,
    env: { PORT: String(puerto), MODO_REFERENCIA: String(referencia) },
    // Un servidor nuevo evita confundir el original con la referencia.
    reuseExistingServer: false,
    timeout: 30_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
