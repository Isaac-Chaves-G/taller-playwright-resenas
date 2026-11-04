export class PaginaLogin {
  constructor(page) {
    this.page = page;
    this.correo = page.getByLabel('Correo', { exact: true });
    this.contrasena = page.getByLabel('Contraseña', { exact: true });
    this.botonIngresar = page.getByRole('button', { name: 'Iniciar sesión', exact: true });
    this.menuResenas = page.getByRole('button', { name: 'Reseñas', exact: true });
  }

  async ir() { await this.page.goto('/'); }

  async iniciarSesion({ correo, contrasena }) {
    await this.correo.fill(correo);
    await this.contrasena.fill(contrasena);
    await this.botonIngresar.click();
    // El menú aparece cuando el inicio de sesión ya terminó.
    await this.menuResenas.waitFor({ state: 'visible' });
  }
}
