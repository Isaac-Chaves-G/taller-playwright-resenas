import { defineConfig } from '@playwright/test';

const referencia = process.env.MODO_REFERENCIA === 'true';
const puerto = referencia ? 3001 : 3000;
const modo = referencia ? 'referencia' : 'original';
const baseURL = `http://127.0.0.1:${puerto}`;

export default defineConfig({
  testDir: './tests',
  // El reinicio afecta a todos los usuarios: ejecutamos un caso a la vez.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  // Guardamos por separado los resultados del original y los de referencia.
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
    // Playwright arranca la app antes de probar y la cierra al terminar.
    command: 'node server.js',
    cwd: '../app',
    url: baseURL,
    env: { PORT: String(puerto), MODO_REFERENCIA: String(referencia) },
    // Así no usamos por error un servidor que quedó abierto en otro modo.
    reuseExistingServer: false,
    timeout: 30_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
