import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const cli = require.resolve('@playwright/test/cli');
// El otro proceso activa la referencia solo para esta ejecución.
const resultado = spawnSync(process.execPath, [cli, 'test', ...process.argv.slice(2)], {
  stdio: 'inherit', env: { ...process.env, MODO_REFERENCIA: 'true' },
});
if (resultado.error) throw resultado.error;
process.exit(resultado.status ?? 1);
