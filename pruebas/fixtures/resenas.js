import { test as base, expect } from '@playwright/test';
import { PaginaLogin } from '../pages/PaginaLogin.js';
import { PaginaResenas } from '../pages/PaginaResenas.js';
import { ClientePractica } from '../services/ClientePractica.js';
import { usuarioDePrueba } from '../data/usuarios.js';

export const test = base.extend({
  datosLimpios: [async ({ request }, use) => {
    const cliente = new ClientePractica(request);
    // Cada caso arranca con los datos originales de seed.json.
    await cliente.reiniciar();
    // finally deja los datos limpios incluso si la prueba falla.
    try { await use(); } finally { await cliente.reiniciar(); }
  }, { auto: true }],

  resenas: async ({ page }, use) => {
    // El login es preparación; no es lo que estamos probando en esta historia.
    const login = new PaginaLogin(page);
    await login.ir();
    await login.iniciarSesion(usuarioDePrueba);
    const resenas = new PaginaResenas(page);
    await resenas.abrir();
    // use entrega la pantalla ya preparada al caso que la pidió.
    await use(resenas);
  },
});

export { expect };
