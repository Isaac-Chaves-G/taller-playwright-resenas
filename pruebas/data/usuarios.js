// Cuenta de práctica. Las variables de entorno permiten usar otra de las cuentas.
export const usuarioDePrueba = {
  correo: process.env.CAFE_CORREO || 'estudiante1@cafe.test',
  contrasena: process.env.CAFE_CLAVE || 'Cafe2026',
};
