import { test as base, expect } from '@playwright/test';
import { PaginaLogin } from '../pages/PaginaLogin.js';
import { PaginaResenas } from '../pages/PaginaResenas.js';
import { ClienteResenas } from '../services/ClienteResenas.js';
import { usuarioDePrueba } from '../data/usuarios.js';

export const test = base.extend({
  datosLimpios: [async ({ request }, use) => {
    const cliente = new ClienteResenas(request);
    await cliente.reiniciar();
    try { await use(); } finally { await cliente.reiniciar(); }
  }, { auto: true }],

  cliente: async ({ request }, use) => {
    const cliente = new ClienteResenas(request);
    await cliente.iniciarSesion(usuarioDePrueba);
    await use(cliente);
  },

  clienteAnonimo: async ({ playwright, baseURL }, use) => {
    const contexto = await playwright.request.newContext({ baseURL });
    try { await use(new ClienteResenas(contexto)); } finally { await contexto.dispose(); }
  },

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
