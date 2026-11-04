// Adaptador HTTP: las rutas de API no son selectores de pantalla.
export class ClienteResenas {
  constructor(request) { this.request = request; }
  async reiniciar() {
    const respuesta = await this.request.post('/api/reiniciar');
    if (!respuesta.ok()) throw new Error(`No se pudo reiniciar: HTTP ${respuesta.status()}`);
  }
  async iniciarSesion(credenciales) {
    const respuesta = await this.request.post('/api/login', { data: credenciales });
    if (!respuesta.ok()) throw new Error(`No se pudo preparar la sesión: HTTP ${respuesta.status()}`);
  }
  async consultar() { return this.request.get('/api/resenas'); }
  async crear(datos) { return this.request.post('/api/resenas', { data: datos }); }
  async publicar(id) { return this.request.post(`/api/resenas/${id}/publicar`); }
  async ocultar(id) { return this.request.post(`/api/resenas/${id}/ocultar`); }
  async consultarSesion() { return this.request.get('/api/sesion'); }
}
