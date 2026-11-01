import { test as base, expect } from '@playwright/test';
import { PaginaLogin } from '../pages/PaginaLogin.js';
import { PaginaResenas } from '../pages/PaginaResenas.js';
import { ClientePractica } from '../services/ClientePractica.js';
import { usuarioDePrueba } from '../data/usuarios.js';

export const test = base.extend({
  datosLimpios: [async ({ request }, use) => {
    const cliente = new ClientePractica(request);
    await cliente.reiniciar();
    try { await use(); } finally { await cliente.reiniciar(); }
  }, { auto: true }],

  resenas: async ({ page }, use) => {
    const login = new PaginaLogin(page);
    await login.ir();
    await login.iniciarSesion(usuarioDePrueba);
    const resenas = new PaginaResenas(page);
    await resenas.abrir();
    await use(resenas);
  },
});

export { expect };
