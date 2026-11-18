/* Método Synesis · la oferta, en un solo sitio.
   La leen el recurso de la llamada (/llamada/) y «Lo que hablamos» (/info/).
   Si cambia el precio, las cuotas o los bonos, se cambia AQUÍ y cambia en las dos.
   Decisiones: LAN-6 (programa único 497 €) y OPT-11 (cuotas propias 40/35/25 %). */
window.OFERTA = {
  nombre: '3 meses de acompañamiento 1:1 con Paloma',
  precio: 497,
  /* [nombre, detalle, valor en €] */
  incluye: [
    ['Diagnóstico inicial', 'Un cuestionario por adulto + la 1.ª sesión'],
    ['6 sesiones 1 a 1 con Paloma', '3 el primer mes, 2 el segundo y 1 el tercero. Con la pareja, si quiere.', 414],
    ['Un plan después de cada sesión', 'Para saber qué hacer hasta la siguiente'],
    ['Tu área personal', 'Con tu evolución, paso a paso']
  ],
  bonos: [
    {ico: 'chat', n: 'Seguimiento por WhatsApp', d: 'Audio y texto. Respuesta en 24 h laborables.', badge: '3 meses + mes 4', valor: 120},
    {ico: 'play', n: 'Formación en vídeo', d: 'Para entender qué pasa en cada situación.', badge: '15 meses', valor: 197},
    {ico: 'mano', n: '6 recursos interactivos', lista: ['Semáforo emocional', 'Un momento para ti', 'Plan de regulación', 'Viaje a tu infancia', 'La carta que nadie te escribió', 'El reloj del niño'], valor: 90}
  ],
  /* siRechaza: solo si Klarna no lo aprueba (en la llamada va en las notas de Paloma) */
  pagos: [
    {id: 'unico', nombre: 'Pago único', precio: '497', det: 'De una vez', wa: 'pago único'},
    {id: 'klarna', nombre: '3 plazos sin intereses', precio: '3 × 165,67', det: 'Con Klarna', wa: 'Klarna en 3 plazos'},
    {id: 'propias', nombre: '3 plazos con nosotros', precio: '198,80 + 173,95 + 124,25', det: 'Si Klarna no te lo aprueba', wa: '3 plazos con vosotros', siRechaza: true}
  ],
  cuotaKlarna: '165,67',
  cuotasPropias: '198,80 € + 173,95 € + 124,25 €',
  sesionExtra: 69,
  /* semanas con sesión dentro de las 12 (3 el 1.er mes, 2 el 2.º, 1 el 3.º) */
  sesionesEn: [1, 2, 4, 6, 8, 11],
  whatsapp: '34644623164'
};
window.OFERTA.valorTotal = () =>
  OFERTA.incluye.reduce((a, x) => a + (x[2] || 0), 0) + OFERTA.bonos.reduce((a, x) => a + x.valor, 0);
window.OFERTA.valorBonos = () => OFERTA.bonos.reduce((a, x) => a + x.valor, 0);
