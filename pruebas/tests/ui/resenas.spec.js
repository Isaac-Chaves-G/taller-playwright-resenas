import { test, expect } from '../../fixtures/resenas.js';
import { escenario as e, calificacionesValidas } from '../../data/resenas.js';

test('UI-01 Solo las publicadas forman el promedio inicial @bug @HU07 @smoketest', async ({ resenas }) => {
  await expect(resenas.resenas).toHaveCount(e.cantidadInicial);
  await expect(resenas.fila(e.idPendiente)).toContainText(e.estadoPendiente);
  await expect(resenas.promedio).toHaveText(String(e.promedioInicial));
});

test('UI-02 La calificación es obligatoria y ofrece únicamente 1 a 5 @acceptanceTest @HU07', async ({ resenas }) => {
  await expect(resenas.opciones).toHaveText(e.etiquetasOpciones);
  await expect(resenas.calificacion).toHaveValue(e.calificacionesDisponibles[0]);
  await resenas.enviarResena({});
  await expect(resenas.mensaje).toHaveText(e.errorCalificacion);
  await expect(resenas.resenas).toHaveCount(e.cantidadInicial);
});

for (const caso of calificacionesValidas) {
  test(`UI-03-${caso.id} Acepta calificación ${caso.datos.calificacion} y crea una pendiente @acceptanceTest @HU07`, async ({ resenas }) => {
    const id = await resenas.enviarResena(caso.datos);
    await expect(resenas.mensaje).toHaveText(e.mensajeEnvio);
    await expect(resenas.fila(id)).toContainText(`${caso.datos.calificacion} ★`);
    await expect(resenas.fila(id)).toContainText(caso.datos.nombre);
    await expect(resenas.fila(id)).toContainText(caso.datos.comentario);
    await expect(resenas.fila(id)).toContainText(e.estadoPendiente);
    await expect(resenas.resenas).toHaveCount(e.cantidadInicial + 1);
  });
}

test('UI-04 Una nueva pendiente no cambia el promedio publicado @bug @HU07', async ({ resenas }) => {
  const id = await resenas.enviarResena(e.nuevaResena);
  await expect(resenas.fila(id)).toContainText(e.estadoPendiente);
  await expect(resenas.promedio).toHaveText(String(e.promedioInicial));
});

test('UI-05 Ocultar una publicada excluye también las pendientes del cálculo @bug @HU07', async ({ resenas }) => {
  await resenas.ocultar(e.idPublicadaCinco);
  await expect(resenas.fila(e.idPublicadaCinco)).toContainText(e.estadoOculta);
  await expect(resenas.promedio).toHaveText(String(e.promedioSinCinco));
});

test('UI-06 Ocultar una publicada actualiza el promedio sin pendientes @acceptanceTest @HU07', async ({ resenas }) => {
  await resenas.ocultar(e.idPendiente);
  await resenas.ocultar(e.idPublicadaCinco);
  await expect(resenas.promedio).toHaveText(String(e.promedioSinCinco));
  await expect(resenas.fila(e.idPublicadaCinco)).toContainText(e.estadoOculta);
});

test('UI-07 Publicar la pendiente incorpora su calificación @acceptanceTest @HU07', async ({ resenas }) => {
  await resenas.publicar(e.idPendiente);
  await expect(resenas.fila(e.idPendiente)).toContainText(e.estadoPublicada);
  await expect(resenas.promedio).toHaveText(String(e.promedioTodasPublicadas));
});

test('UI-08 Volver a publicar una oculta la reintegra al promedio @acceptanceTest @HU07', async ({ resenas }) => {
  await resenas.ocultar(e.idPendiente);
  await resenas.ocultar(e.idPublicadaCinco);
  await expect(resenas.promedio).toHaveText(String(e.promedioSinCinco));
  await resenas.publicar(e.idPublicadaCinco);
  await expect(resenas.fila(e.idPublicadaCinco)).toContainText(e.estadoPublicada);
  await expect(resenas.promedio).toHaveText(String(e.promedioInicial));
});

test('UI-09 Todas ocultas dejan el promedio en cero @acceptanceTest @HU07', async ({ resenas }) => {
  for (const id of e.idsTodas) await resenas.ocultar(id);
  await expect(resenas.promedio).toHaveText(String(e.promedioSinPublicadas));
  for (const id of e.idsTodas) await expect(resenas.fila(id)).toContainText(e.estadoOculta);
});

test('UI-10 Recargar conserva estados y promedio en la sesión @acceptanceTest @HU07', async ({ resenas }) => {
  await resenas.ocultar(e.idPendiente);
  await resenas.ocultar(e.idPublicadaCuatro);
  await resenas.recargar();
  await expect(resenas.fila(e.idPublicadaCuatro)).toContainText(e.estadoOculta);
  await expect(resenas.promedio).toHaveText(String(e.promedioTrasOcultarCuatro));
});

test('UI-11 Publicar dos veces no duplica la reseña @acceptanceTest @HU07', async ({ resenas }) => {
  await resenas.publicar(e.idPendiente);
  await resenas.publicar(e.idPendiente);
  await expect(resenas.resenas).toHaveCount(e.cantidadInicial);
  await expect(resenas.promedio).toHaveText(String(e.promedioTodasPublicadas));
});
