export class PaginaResenas {
  constructor(page) {
    this.page = page;
    this.menu = page.getByRole('button', { name: 'Reseñas', exact: true });
    this.titulo = page.getByRole('heading', { name: 'Reseñas', exact: true });
    this.calificacion = page.getByRole('combobox', { name: 'Calificación', exact: true });
    this.opciones = this.calificacion.getByRole('option');
    this.nombre = page.getByLabel('Nombre', { exact: true });
    this.comentario = page.getByLabel('Comentario', { exact: true });
    this.enviar = page.getByRole('button', { name: 'Enviar reseña', exact: true });
    this.promedio = page.getByTestId('promedio');
    this.resenas = page.getByRole('listitem');
    this.mensaje = page.getByRole('status');
  }

  // Cada reseña tiene su propio id para elegir sus botones sin confundir filas.
  fila(id) { return this.page.getByTestId(`resena-${id}`); }

  async abrir() {
    // Escuchamos antes del clic para no perder la respuesta si llega rápido.
    const carga = this.page.waitForResponse((r) => r.url().endsWith('/api/resenas') && r.request().method() === 'GET');
    await this.menu.click();
    await carga;
    await this.titulo.waitFor({ state: 'visible' });
  }

  async enviarResena({ calificacion, nombre = '', comentario = '' }) {
    await this.calificacion.selectOption(calificacion === undefined ? '' : String(calificacion));
    await this.nombre.fill(nombre);
    await this.comentario.fill(comentario);
    const respuesta = this.page.waitForResponse((r) => r.url().endsWith('/api/resenas') && r.request().method() === 'POST');
    await this.enviar.click();
    const r = await respuesta;
    // Un envío rechazado no devuelve el id de una nueva reseña.
    if (!r.ok()) return null;
    return (await r.json()).id;
  }

  async cambiarEstado(id, accion) {
    const actualizacion = this.page.waitForResponse((r) => r.url().endsWith('/api/resenas') && r.request().method() === 'GET');
    await this.fila(id).getByRole('button', { name: accion, exact: true }).click();
    await actualizacion;
    // La respuesta puede llegar antes de que la pantalla muestre el nuevo estado.
    const estado = accion === 'Publicar' ? '[publicada]' : '[oculta]';
    await this.fila(id).filter({ hasText: estado }).waitFor();
  }

  async ocultar(id) { await this.cambiarEstado(id, 'Ocultar'); }
  async publicar(id) { await this.cambiarEstado(id, 'Publicar'); }

  async recargar() {
    await this.page.reload();
    await this.abrir();
  }
}
