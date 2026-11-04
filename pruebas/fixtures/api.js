import { test as base, expect } from './resenas.js';
import { ClienteResenas } from '../services/ClienteResenas.js';
import { usuarioDePrueba } from '../data/usuarios.js';

export const test = base.extend({
  cliente: async ({ request }, use) => {
    const cliente = new ClienteResenas(request);
    await cliente.iniciarSesion(usuarioDePrueba);
    await use(cliente);
  },

  clienteAnonimo: async ({ playwright, baseURL }, use) => {
    // Este contexto no comparte las cookies del cliente que inició sesión.
    const contexto = await playwright.request.newContext({ baseURL });
    try { await use(new ClienteResenas(contexto)); } finally { await contexto.dispose(); }
  },
});

export { expect };
