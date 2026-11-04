export const escenario = {
  promedioInicial: 4,
  cantidadInicial: 4,
  idPendiente: 4,
  idPublicadaCinco: 2,
  idPublicadaCuatro: 1,
  idPublicadaTres: 3,
  idsPublicadas: [1, 2, 3],
  idsTodas: [1, 2, 3, 4],
  calificacionesDisponibles: ['', '1', '2', '3', '4', '5'],
  etiquetasOpciones: ['Selecciona', '1', '2', '3', '4', '5'],
  promedioSinCinco: 3.5,
  promedioTodasPublicadas: 3.25,
  promedioRedondeado: 3.33,
  promedioUnica: 5,
  promedioSinPublicadas: 0,
  promedioTrasOcultarCuatro: 4,
  errorCalificacion: 'La calificación es obligatoria (de 1 a 5)',
  mensajeEnvio: 'Reseña enviada',
  estadoPendiente: '[pendiente]',
  estadoPublicada: '[publicada]',
  estadoOculta: '[oculta]',
  nuevaResena: { calificacion: 5, nombre: 'Cliente HU-07', comentario: 'Muy buen café de prueba' },
};

export const calificacionesValidas = [1, 2, 3, 4, 5].map((calificacion) => ({
  id: String(calificacion).padStart(2, '0'),
  datos: { calificacion, nombre: `Cliente ${calificacion}`, comentario: `Reseña con ${calificacion} estrellas` },
}));

// Particiones inválidas y vecinos de los límites 1 y 5.
export const calificacionesInvalidas = [
  { id: '01', nombre: 'ausente', cuerpo: {} },
  { id: '02', nombre: 'vacía', cuerpo: { calificacion: '' } },
  { id: '03', nombre: 'nula', cuerpo: { calificacion: null } },
  { id: '04', nombre: 'cero, vecino inferior', cuerpo: { calificacion: 0 } },
  { id: '05', nombre: 'negativa', cuerpo: { calificacion: -1 } },
  { id: '06', nombre: 'seis, vecino superior', cuerpo: { calificacion: 6 } },
  { id: '07', nombre: 'muy alta', cuerpo: { calificacion: 100 } },
  { id: '08', nombre: 'decimal dentro del rango', cuerpo: { calificacion: 2.5 } },
  { id: '09', nombre: 'decimal bajo el mínimo', cuerpo: { calificacion: 0.5 } },
  { id: '10', nombre: 'decimal sobre el máximo', cuerpo: { calificacion: 5.5 } },
  { id: '11', nombre: 'texto no numérico', cuerpo: { calificacion: 'excelente' } },
  { id: '12', nombre: 'espacios', cuerpo: { calificacion: '   ' } },
];

export const contrato = {
  creado: 201, correcto: 200, invalido: 400, noEncontrado: 404, noAutorizado: 401,
  estadoPendiente: 'pendiente', estadoPublicada: 'publicada', estadoOculta: 'oculta',
  errorAutenticacion: 'Inicia sesión primero', errorInexistente: 'La reseña no existe',
  idInexistente: 99999,
  calificacionTexto: { calificacion: '4' },
  soloCalificacion: { calificacion: 3 },
};
