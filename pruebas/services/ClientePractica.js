// Reinicio y login que comparten las pruebas de interfaz y de API.
export class ClientePractica {
  constructor(request) { this.request = request; }
  async reiniciar() {
    const respuesta = await this.request.post('/api/reiniciar');
    if (!respuesta.ok()) throw new Error(`No se pudo reiniciar: HTTP ${respuesta.status()}`);
  }
  async iniciarSesion(credenciales) {
    const respuesta = await this.request.post('/api/login', { data: credenciales });
    if (!respuesta.ok()) throw new Error(`No se pudo preparar la sesión: HTTP ${respuesta.status()}`);
  }
}
