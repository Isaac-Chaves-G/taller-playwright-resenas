import { test, expect } from '../../fixtures/resenas.js';
import { escenario as e, contrato as c, calificacionesValidas, calificacionesInvalidas } from '../../data/resenas.js';

test('API-01 El promedio inicial excluye pendientes @bug @HU07', async ({ cliente }) => {
  const respuesta = await cliente.consultar();
  expect(respuesta.status()).toBe(c.correcto);
  const datos = await respuesta.json();
  expect(datos.resenas).toHaveLength(e.cantidadInicial);
  expect(datos.promedio).toBe(e.promedioInicial);
});

test('API-02 Ocultar la pendiente mantiene el promedio de publicadas @acceptanceTest @HU07', async ({ cliente }) => {
  const cambio = await cliente.ocultar(e.idPendiente);
  expect(cambio.status()).toBe(c.correcto);
  expect((await cambio.json()).estado).toBe(c.estadoOculta);
  expect((await (await cliente.consultar()).json()).promedio).toBe(e.promedioInicial);
});

test('API-03 Publicar la pendiente recalcula con todas publicadas @acceptanceTest @HU07', async ({ cliente }) => {
  const cambio = await cliente.publicar(e.idPendiente);
  expect(cambio.status()).toBe(c.correcto);
  expect((await cambio.json()).estado).toBe(c.estadoPublicada);
  expect((await (await cliente.consultar()).json()).promedio).toBe(e.promedioTodasPublicadas);
});

test('API-04 Ocultar una publicada con pendientes deja solo las otras publicadas @bug @HU07', async ({ cliente }) => {
  await cliente.ocultar(e.idPublicadaCinco);
  expect((await (await cliente.consultar()).json()).promedio).toBe(e.promedioSinCinco);
});

test('API-05 Una nueva pendiente no afecta el promedio @bug @HU07', async ({ cliente }) => {
  const creada = await cliente.crear(e.nuevaResena);
  expect(creada.status()).toBe(c.creado);
  expect((await creada.json()).estado).toBe(c.estadoPendiente);
  expect((await (await cliente.consultar()).json()).promedio).toBe(e.promedioInicial);
});

test('API-06 Sin publicadas y con una pendiente el promedio es cero @bug @HU07', async ({ cliente }) => {
  for (const id of e.idsPublicadas) await cliente.ocultar(id);
  expect((await (await cliente.consultar()).json()).promedio).toBe(e.promedioSinPublicadas);
});

test('API-07 Todas ocultas dan cero @acceptanceTest @HU07', async ({ cliente }) => {
  for (const id of e.idsTodas) await cliente.ocultar(id);
  const datos = await (await cliente.consultar()).json();
  expect(datos.promedio).toBe(e.promedioSinPublicadas);
  expect(datos.resenas.every((r) => r.estado === c.estadoOculta)).toBe(true);
});

test('API-08 Una sola publicada conserva su calificación @acceptanceTest @HU07', async ({ cliente }) => {
  for (const id of [e.idPendiente, e.idPublicadaCuatro, e.idPublicadaTres]) await cliente.ocultar(id);
  expect((await (await cliente.consultar()).json()).promedio).toBe(e.promedioUnica);
});

test('API-09 El promedio periódico se presenta a dos decimales @acceptanceTest @HU07', async ({ cliente }) => {
  await cliente.publicar(e.idPendiente);
  await cliente.ocultar(e.idPublicadaTres);
  expect((await (await cliente.consultar()).json()).promedio).toBe(e.promedioRedondeado);
});

test('API-10 Una oculta vuelve a contribuir al publicarla @acceptanceTest @HU07', async ({ cliente }) => {
  await cliente.ocultar(e.idPendiente);
  await cliente.ocultar(e.idPublicadaCinco);
  expect((await (await cliente.consultar()).json()).promedio).toBe(e.promedioSinCinco);
  await cliente.publicar(e.idPublicadaCinco);
  const datos = await (await cliente.consultar()).json();
  expect(datos.promedio).toBe(e.promedioInicial);
  expect(datos.resenas.find((r) => r.id === e.idPublicadaCinco).estado).toBe(c.estadoPublicada);
});

test('API-11 Ocultar dos veces es idempotente @acceptanceTest @HU07', async ({ cliente }) => {
  await cliente.ocultar(e.idPendiente);
  await cliente.ocultar(e.idPublicadaCinco);
  const antes = await (await cliente.consultar()).json();
  const respuesta = await cliente.ocultar(e.idPublicadaCinco);
  expect(respuesta.status()).toBe(c.correcto);
  expect(await (await cliente.consultar()).json()).toEqual(antes);
});

test('API-12 Publicar dos veces es idempotente @acceptanceTest @HU07', async ({ cliente }) => {
  await cliente.publicar(e.idPendiente);
  const antes = await (await cliente.consultar()).json();
  const respuesta = await cliente.publicar(e.idPendiente);
  expect(respuesta.status()).toBe(c.correcto);
  expect(await (await cliente.consultar()).json()).toEqual(antes);
});

for (const caso of calificacionesValidas) {
  test(`API-13-${caso.id} Acepta el entero ${caso.datos.calificacion} @acceptanceTest @HU07`, async ({ cliente }) => {
    const respuesta = await cliente.crear(caso.datos);
    expect(respuesta.status()).toBe(c.creado);
    const creada = await respuesta.json();
    expect(creada).toMatchObject({ ...caso.datos, estado: c.estadoPendiente });
    const datos = await (await cliente.consultar()).json();
    expect(datos.resenas).toHaveLength(e.cantidadInicial + 1);
    expect(datos.resenas).toContainEqual(creada);
  });
}

for (const caso of calificacionesInvalidas) {
  test(`API-14-${caso.id} Rechaza calificación ${caso.nombre} sin cambiar el estado @acceptanceTest @HU07`, async ({ cliente }) => {
    const antes = await (await cliente.consultar()).json();
    const respuesta = await cliente.crear(caso.cuerpo);
    expect(respuesta.status()).toBe(c.invalido);
    expect(await respuesta.json()).toEqual({ error: e.errorCalificacion });
    expect(await (await cliente.consultar()).json()).toEqual(antes);
  });
}

test('API-15 Acepta el número enviado como texto por el formulario @acceptanceTest @HU07', async ({ cliente }) => {
  const respuesta = await cliente.crear(c.calificacionTexto);
  expect(respuesta.status()).toBe(c.creado);
  expect((await respuesta.json()).calificacion).toBe(Number(c.calificacionTexto.calificacion));
});

test('API-16 Nombre y comentario vacíos son opcionales @acceptanceTest @HU07', async ({ cliente }) => {
  const respuesta = await cliente.crear(c.soloCalificacion);
  expect(respuesta.status()).toBe(c.creado);
  expect(await respuesta.json()).toMatchObject({ ...c.soloCalificacion, nombre: '', comentario: '', estado: c.estadoPendiente });
});

for (const accion of ['publicar', 'ocultar']) {
  test(`API-17-${accion} Una reseña inexistente devuelve 404 sin modificar datos @HU07`, async ({ cliente }) => {
    const antes = await (await cliente.consultar()).json();
    const respuesta = await cliente[accion](c.idInexistente);
    expect(respuesta.status()).toBe(c.noEncontrado);
    expect(await respuesta.json()).toEqual({ error: c.errorInexistente });
    expect(await (await cliente.consultar()).json()).toEqual(antes);
  });
}

for (const accion of ['consultar', 'crear', 'publicar', 'ocultar']) {
  test(`API-18-${accion} Protege reseñas sin sesión @HU07`, async ({ cliente, clienteAnonimo }) => {
    const antes = await (await cliente.consultar()).json();
    const argumento = accion === 'crear' ? e.nuevaResena : e.idPendiente;
    const respuesta = await clienteAnonimo[accion](argumento);
    expect(respuesta.status()).toBe(c.noAutorizado);
    expect(await respuesta.json()).toEqual({ error: c.errorAutenticacion });
    expect(await (await cliente.consultar()).json()).toEqual(antes);
  });
}
