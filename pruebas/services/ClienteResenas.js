import { ClientePractica } from './ClientePractica.js';

// Reutiliza reinicio y sesión, y agrega las operaciones propias de reseñas.
export class ClienteResenas extends ClientePractica {
  async consultar() { return this.request.get('/api/resenas'); }
  async crear(datos) { return this.request.post('/api/resenas', { data: datos }); }
  async publicar(id) { return this.request.post(`/api/resenas/${id}/publicar`); }
  async ocultar(id) { return this.request.post(`/api/resenas/${id}/ocultar`); }
  async consultarSesion() { return this.request.get('/api/sesion'); }
}
