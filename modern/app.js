/* Modern reader for the original GDS lesson files. No lesson text is duplicated here. */
const MODES = {
  classroom: { label: 'Classroom', icon: '◫', prefix: 'LSN' },
  agency: { label: 'Agency', icon: '⌘', prefix: 'AM' },
  review: { label: 'Review', icon: '✓', prefix: 'Q' }
};
const LESSON_THEMES = [
  [1, 4, '✈', 'Availability', 'availability'],
  [5, 7, '✦', 'Selling', 'selling'],
  [8, 12, '◫', 'PNR', 'pnr'],
  [13, 15, '⊕', 'Optional elements', 'optional'],
  [16, 20, '↻', 'PNR operations', 'pnr-operations'],
  [21, 23, '◇', 'Fares', 'fares'],
  [24, 27, '€', 'Pricing', 'pricing'],
  [28, 30, '⚙', 'Utils', 'utils'],
  [31, 35, '⌂', 'Hotels', 'hotel'],
  [36, 40, '▱', 'Cars and Miscellaneous', 'cars']
];
// A small library of theme-tinted illustrations shown beside each step. Every shape uses
// currentColor, so wrapping one in an element with a theme's accent color (see styles.css)
// recolors it automatically — one drawing per topic, ten palettes for free.
function illustrationBadge(inner) {
  return `<svg viewBox="0 0 200 200" role="img" aria-hidden="true" focusable="false"><circle cx="100" cy="100" r="96" fill="currentColor" opacity=".12"/><circle cx="100" cy="100" r="72" fill="currentColor" opacity=".09"/>${inner}</svg>`;
}
const ILLUSTRATIONS = {
  flight: illustrationBadge('<path d="M45 128c40-58 66-78 96-78 6 0 8 5 4 9l-24 24 10 34-14 6-16-28-18 18 4 16-10 6-10-20-20-10 6-10 16 4 18-18-28-16 6-14 34 10z" fill="currentColor"/><path d="M52 146c22-4 44-13 62-31" stroke="currentColor" stroke-width="4" stroke-dasharray="2 9" stroke-linecap="round" fill="none" opacity=".55"/>'),
  ticket: illustrationBadge('<rect x="46" y="70" width="108" height="62" rx="10" fill="currentColor"/><path d="M100 82v6m0 12v6m0 12v6m0 12v6" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/><path d="m62 100 9 9 15-17" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="118" y="93" width="24" height="6" rx="3" fill="#fff" opacity=".85"/><rect x="118" y="105" width="17" height="6" rx="3" fill="#fff" opacity=".6"/>'),
  booking: illustrationBadge('<rect x="56" y="52" width="88" height="104" rx="12" fill="currentColor"/><rect x="72" y="76" width="56" height="7" rx="3.5" fill="#fff" opacity=".9"/><rect x="72" y="92" width="56" height="7" rx="3.5" fill="#fff" opacity=".6"/><rect x="72" y="108" width="34" height="7" rx="3.5" fill="#fff" opacity=".6"/><circle cx="118" cy="132" r="16" fill="#fff"/><path d="m111 132 5 5 10-11" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>'),
  document: illustrationBadge('<rect x="50" y="62" width="100" height="76" rx="10" fill="currentColor"/><circle cx="76" cy="90" r="14" fill="#fff" opacity=".92"/><rect x="100" y="82" width="36" height="6" rx="3" fill="#fff" opacity=".85"/><rect x="100" y="94" width="28" height="6" rx="3" fill="#fff" opacity=".6"/><rect x="62" y="114" width="76" height="6" rx="3" fill="#fff" opacity=".5"/><rect x="62" y="124" width="50" height="6" rx="3" fill="#fff" opacity=".5"/>'),
  terminal: illustrationBadge('<rect x="48" y="58" width="104" height="72" rx="9" fill="currentColor"/><rect x="60" y="70" width="80" height="48" rx="3" fill="#132038"/><rect x="68" y="80" width="36" height="5" rx="2.5" fill="#fff" opacity=".9"/><rect x="68" y="90" width="52" height="5" rx="2.5" fill="#fff" opacity=".6"/><rect x="68" y="100" width="20" height="5" rx="2.5" fill="#fff" opacity=".9"/><rect x="86" y="134" width="28" height="8" rx="3" fill="currentColor"/><rect x="70" y="142" width="60" height="7" rx="3.5" fill="currentColor" opacity=".7"/>'),
  tag: illustrationBadge('<path d="M62 58h46l40 40-52 52-40-40V58z" fill="currentColor"/><circle cx="78" cy="74" r="8" fill="#fff" opacity=".9"/><text x="100" y="112" text-anchor="middle" font-size="30" font-weight="700" fill="#fff" font-family="ui-sans-serif,system-ui">€</text>'),
  coins: illustrationBadge('<circle cx="82" cy="118" r="30" fill="currentColor"/><circle cx="120" cy="90" r="30" fill="currentColor" opacity=".8"/><text x="120" y="99" text-anchor="middle" font-size="26" font-weight="700" fill="#fff" font-family="ui-sans-serif,system-ui">$</text>'),
  gear: illustrationBadge('<path d="M100 58a11 11 0 0 1 11 9l1 9 11 5 8-6a11 11 0 0 1 14 1l4 4a11 11 0 0 1 1 14l-6 8 5 11 9 1a11 11 0 0 1 9 11v6a11 11 0 0 1-9 11l-9 1-5 11 6 8a11 11 0 0 1-1 14l-4 4a11 11 0 0 1-14 1l-8-6-11 5-1 9a11 11 0 0 1-11 9h-6a11 11 0 0 1-11-9l-1-9-11-5-8 6a11 11 0 0 1-14-1l-4-4a11 11 0 0 1-1-14l6-8-5-11-9-1a11 11 0 0 1-9-11v-6a11 11 0 0 1 9-11l9-1 5-11-6-8a11 11 0 0 1 1-14l4-4a11 11 0 0 1 14-1l8 6 11-5 1-9a11 11 0 0 1 11-9z" fill="currentColor"/><circle cx="100" cy="100" r="23" fill="#fff"/>'),
  hotel: illustrationBadge('<rect x="52" y="112" width="96" height="14" rx="4" fill="currentColor"/><path d="M60 112V90a10 10 0 0 1 10-10h14a10 10 0 0 1 10 10v22" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round"/><circle cx="79" cy="100" r="4.5" fill="#fff"/><rect x="104" y="70" width="44" height="42" rx="6" fill="currentColor" opacity=".85"/><rect x="112" y="80" width="10" height="10" rx="2" fill="#fff" opacity=".9"/><rect x="128" y="80" width="10" height="10" rx="2" fill="#fff" opacity=".9"/><rect x="112" y="96" width="10" height="10" rx="2" fill="#fff" opacity=".9"/><rect x="128" y="96" width="10" height="10" rx="2" fill="#fff" opacity=".9"/>'),
  car: illustrationBadge('<path d="M46 122c0-6 4-11 10-12l8-20c3-8 11-13 20-13h32c9 0 17 5 20 13l8 20c6 1 10 6 10 12v14a6 6 0 0 1-6 6h-8a14 14 0 0 1-28 0H88a14 14 0 0 1-28 0h-8a6 6 0 0 1-6-6v-14Z" fill="currentColor"/><path d="M70 100l6-14a8 8 0 0 1 7-5h34a8 8 0 0 1 7 5l6 14Z" fill="#fff" opacity=".85"/><circle cx="74" cy="140" r="9" fill="#22314a"/><circle cx="126" cy="140" r="9" fill="#22314a"/>'),
  passenger: illustrationBadge('<circle cx="100" cy="82" r="24" fill="currentColor"/><path d="M56 152c4-26 22-40 44-40s40 14 44 40a6 6 0 0 1-6 7H62a6 6 0 0 1-6-7Z" fill="currentColor"/>'),
  family: illustrationBadge('<circle cx="80" cy="78" r="21" fill="currentColor"/><path d="M44 144c3-22 18-34 36-34s33 12 36 34a5 5 0 0 1-5 6H49a5 5 0 0 1-5-6Z" fill="currentColor"/><circle cx="134" cy="94" r="15" fill="currentColor" opacity=".75"/><path d="M112 146c2-16 12-25 26-25s24 9 26 25a4 4 0 0 1-4 5h-44a4 4 0 0 1-4-5Z" fill="currentColor" opacity=".75"/>'),
  phone: illustrationBadge('<path d="M74 54c6-2 12 1 14 7l5 13c2 5 0 10-4 13l-8 6c5 14 15 24 29 29l6-8c3-4 8-6 13-4l13 5c6 2 9 8 7 14l-3 9c-2 6-8 10-14 9-38-6-66-34-72-72-1-6 3-12 9-14z" fill="currentColor"/>'),
  calendar: illustrationBadge('<rect x="52" y="62" width="96" height="86" rx="10" fill="currentColor"/><rect x="52" y="62" width="96" height="24" rx="10" fill="currentColor"/><rect x="70" y="52" width="8" height="20" rx="4" fill="currentColor"/><rect x="122" y="52" width="8" height="20" rx="4" fill="currentColor"/><rect x="66" y="98" width="16" height="14" rx="3" fill="#fff" opacity=".55"/><rect x="92" y="98" width="16" height="14" rx="3" fill="#fff" opacity=".55"/><rect x="118" y="98" width="16" height="14" rx="3" fill="#fff" opacity=".95"/><rect x="66" y="120" width="16" height="14" rx="3" fill="#fff" opacity=".55"/><rect x="92" y="120" width="16" height="14" rx="3" fill="#fff" opacity=".55"/>'),
  seat: illustrationBadge('<path d="M70 70a10 10 0 0 1 20 0v34h20V70a10 10 0 0 1 20 0v50h6a8 8 0 0 1 8 8v6H56v-6a8 8 0 0 1 8-8h6z" fill="currentColor"/><rect x="66" y="132" width="68" height="10" rx="5" fill="currentColor" opacity=".7"/>'),
  luggage: illustrationBadge('<rect x="54" y="82" width="92" height="66" rx="12" fill="currentColor"/><path d="M82 82V68a8 8 0 0 1 8-8h20a8 8 0 0 1 8 8v14" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/><rect x="70" y="98" width="8" height="34" rx="4" fill="#fff" opacity=".55"/><rect x="96" y="98" width="8" height="34" rx="4" fill="#fff" opacity=".55"/><rect x="122" y="98" width="8" height="34" rx="4" fill="#fff" opacity=".55"/>'),
  search: illustrationBadge('<circle cx="90" cy="90" r="30" fill="none" stroke="currentColor" stroke-width="12"/><path d="M112 112l28 28" stroke="currentColor" stroke-width="13" stroke-linecap="round"/>'),
  globe: illustrationBadge('<circle cx="100" cy="100" r="46" fill="currentColor"/><ellipse cx="100" cy="100" rx="46" ry="18" fill="none" stroke="#fff" stroke-width="3.5" opacity=".55"/><ellipse cx="100" cy="100" rx="18" ry="46" fill="none" stroke="#fff" stroke-width="3.5" opacity=".55"/><path d="M54 100h92" stroke="#fff" stroke-width="3.5" opacity=".55"/>')
};
// One safe default illustration per lesson group, guaranteeing every step gets something
// relevant even when no more specific keyword below matches.
const THEME_ILLUSTRATION = {
  availability: 'flight', selling: 'ticket', pnr: 'booking', optional: 'document',
  'pnr-operations': 'terminal', fares: 'tag', pricing: 'coins', utils: 'gear',
  hotel: 'hotel', cars: 'car'
};
// Finer-grained illustrations chosen when the step's own text mentions a more specific
// topic than its lesson group, checked in this order (first match wins).
const ILLUSTRATION_KEYWORDS = [
  ['family', ['CHILD', 'INFANT', ' CHD ', ' INF ', 'MINOR', 'UMNR']],
  ['phone', ['PHONE', 'TELEPHONE', 'CONTACT']],
  ['hotel', ['HOTEL', 'ROOM', 'CHAIN CODE']],
  ['car', ['RENTAL CAR', 'CAR RENTAL', 'DRIVER']],
  ['luggage', ['BAGGAGE', 'LUGGAGE']],
  ['seat', ['SEAT']],
  ['calendar', ['DEPARTURE DATE', 'TIME LIMIT', 'CALENDAR', 'SCHEDULE CHANGE']],
  ['coins', ['PRICE', 'PAYMENT', 'CASH', 'CHEQUE', 'CREDIT CARD', 'FARE CALCULATION']],
  ['tag', ['FARE', 'DISCOUNT']],
  ['document', ['REMARK', 'OSI', 'SSR', 'SPECIAL SERVICE']],
  ['passenger', ['PASSENGER', 'SURNAME', 'TRAVELER', 'TRAVELLER']],
  ['globe', ['CITY', 'AIRPORT', 'COUNTRY']],
  ['search', ['DISPLAY', 'RETRIEVE', 'QUEUE']]
];
function pickIllustration(screen, theme) {
  const haystack = ' ' + [...screen.text, ...screen.answers].join(' ').toUpperCase() + ' ';
  for (const [id, keywords] of ILLUSTRATION_KEYWORDS) {
    if (keywords.some(keyword => haystack.includes(keyword))) return id;
  }
  return THEME_ILLUSTRATION[theme.kind] || 'flight';
}
const SOURCE = location.pathname.includes('/modern/') ? '../orion/GDS/' : './orion/GDS/';
const app = document.querySelector('#app');
const nav = document.querySelector('#mode-nav');
const crumb = document.querySelector('#breadcrumb');
const searchDialog = document.querySelector('#search-dialog');
const searchInput = document.querySelector('#search-input');
const searchResults = document.querySelector('#search-results');
const lookupDialog = document.querySelector('#lookup-dialog');
const lookupInput = document.querySelector('#lookup-input');
const lookupResults = document.querySelector('#lookup-results');
const progressDialog = document.querySelector('#progress-dialog');
const progressDetails = document.querySelector('#progress-details');
let contents = [];
let activeMode = null;
let activeLesson = null;
let searchIndex = null;
let codeIndex = null;
let session = null;

// --- Interface translation (Spanish / English) --------------------------------------
// The app's chrome (navigation, buttons, messages) is bilingual; the lesson content
// itself (titles, instructions, terminal output, accepted answers — everything that
// comes from decodeLegacy()/the original .DAT files) is intentionally left in English
// always, since it is real GDS command syntax, not interface text.
const STRINGS = {
  'lang.switchLabel': { es: 'Idioma', en: 'Language' },
  'sidebar.nav': { es: 'Navegación principal', en: 'Main navigation' },
  'sidebar.open': { es: 'Abrir menú', en: 'Open menu' },
  'sidebar.close': { es: 'Cerrar menú', en: 'Close menu' },
  'brand.home': { es: 'Ir al inicio', en: 'Go to home' },
  'nav.home': { es: 'Inicio', en: 'Home' },
  'progress.title': { es: 'Tu progreso', en: 'Your progress' },
  'progress.count': { es: '{count} de 120 lecciones', en: '{count} of 120 lessons' },
  'progress.reset': { es: 'Restablecer progreso', en: 'Reset progress' },
  'progress.resetConfirm': { es: '¿Quieres borrar el progreso guardado en este dispositivo?', en: 'Do you want to erase the progress saved on this device?' },
  'progress.dialogTitle': { es: 'Resumen de progreso', en: 'Progress summary' },
  'progress.intro': { es: 'Consulta tus lecciones superadas en este dispositivo.', en: 'Check the lessons you have passed on this device.' },
  'progress.modeComplete': { es: 'Modo completado', en: 'Mode completed' },
  'progress.pending': { es: '{count} lección pendiente|{count} lecciones pendientes', en: '{count} lesson left|{count} lessons left' },
  'search.open': { es: 'Buscar una orden', en: 'Search a command' },
  'search.title': { es: 'Buscador de órdenes', en: 'Command finder' },
  'search.description': { es: 'Busca por orden, código o concepto dentro de los contenidos del curso.', en: 'Search by command, code, or concept across the course content.' },
  'search.placeholder': { es: 'Ej.: disponibilidad, DAC, Bangkok…', en: 'E.g.: availability, DAC, Bangkok…' },
  'search.preparing': { es: 'Preparando las órdenes de tus lecciones completadas…', en: 'Preparing the commands from your completed lessons…' },
  'search.hint': { es: 'Escribe un término para buscar entre las órdenes de tus lecciones completadas.', en: 'Type a term to search the commands from your completed lessons.' },
  'search.empty': { es: 'Busca por ejemplo <strong>DAC</strong>, <strong>hotel</strong> o <strong>Bangkok</strong> en las lecciones superadas.', en: 'Search for example <strong>DAC</strong>, <strong>hotel</strong>, or <strong>Bangkok</strong> in your passed lessons.' },
  'search.noResults': { es: 'No se ha encontrado ninguna orden con esos términos.', en: 'No command was found matching those terms.' },
  'lookup.open': { es: 'Código rápido', en: 'Quick code' },
  'lookup.openTitle': { es: 'Consultar un código de ciudad o aeropuerto', en: 'Look up a city or airport code' },
  'lookup.title': { es: 'Código de ciudad o aeropuerto', en: 'City or airport code' },
  'lookup.description': { es: 'Escribe el nombre de una ciudad o un código de 3 letras para consultarlo, igual que harías con DAN o DAC.', en: 'Type a city name or a 3-letter code to look it up, just like you would with DAN or DAC.' },
  'lookup.placeholder': { es: 'Ej.: Nice, NCE, Dubái…', en: 'E.g.: Nice, NCE, Dubai…' },
  'lookup.hint': { es: 'Escribe para buscar.', en: 'Type to search.' },
  'lookup.noResults': { es: 'No se ha encontrado ningún código con ese texto.', en: 'No code was found matching that text.' },
  'common.close': { es: 'Cerrar', en: 'Close' },
  'home.eyebrow': { es: 'Formación GDS', en: 'GDS Training' },
  'home.title': { es: 'Tu terminal de práctica, ahora en cualquier dispositivo.', en: 'Your practice terminal, now on every device.' },
  'home.lead': { es: 'La misma formación del simulador original, reimaginada como una experiencia clara, guiada y con tu progreso guardado en este dispositivo.', en: 'The same training as the original simulator, reimagined as a clear, guided experience that keeps your progress saved on this device.' },
  'home.pillLessons': { es: '✈ 120 lecciones', en: '✈ 120 lessons' },
  'home.pillProgress': { es: '◫ Progreso personal', en: '◫ Personal progress' },
  'home.pillSearch': { es: '⌕ Búsqueda de órdenes', en: '⌕ Command search' },
  'home.imageAlt': { es: 'Avión y ruta de aprendizaje sobre un globo', en: 'A plane and a learning route over a globe' },
  'home.viewLessons': { es: 'Ver las 40 lecciones', en: 'View the 40 lessons' },
  'mode.classroom.desc': { es: 'Aprende cada operación paso a paso, con explicación y práctica guiada.', en: 'Learn every operation step by step, with explanation and guided practice.' },
  'mode.agency.desc': { es: 'Practica situaciones de agencia en un terminal guiado.', en: 'Practice agency scenarios in a guided terminal.' },
  'mode.review.desc': { es: 'Pon a prueba tus conocimientos con 10 preguntas por lección.', en: 'Test your knowledge with 10 questions per lesson.' },
  'theme.availability': { es: 'Disponibilidad', en: 'Availability' },
  'theme.selling': { es: 'Venta', en: 'Selling' },
  'theme.pnr': { es: 'PNR', en: 'PNR' },
  'theme.optional': { es: 'Elementos opcionales', en: 'Optional elements' },
  'theme.pnr-operations': { es: 'Operaciones de PNR', en: 'PNR operations' },
  'theme.fares': { es: 'Tarifas', en: 'Fares' },
  'theme.pricing': { es: 'Tarificación', en: 'Pricing' },
  'theme.utils': { es: 'Utilidades', en: 'Utils' },
  'theme.hotel': { es: 'Hoteles', en: 'Hotels' },
  'theme.cars': { es: 'Coches y varios', en: 'Cars and miscellaneous' },
  'lessons.back': { es: '← Inicio', en: '← Home' },
  'lessons.status.done': { es: 'Completada', en: 'Completed' },
  'lessons.status.inProgress': { es: 'En curso · Paso {step}', en: 'In progress · Step {step}' },
  'lessons.status.review': { es: 'Examen · 10 preguntas', en: 'Test · 10 questions' },
  'lessons.status.practice': { es: 'Práctica guiada', en: 'Guided practice' },
  'lesson.preparing': { es: 'Preparando la lección…', en: 'Preparing the lesson…' },
  'lesson.loadError': { es: 'No se pudo cargar la lección {number}.', en: 'Could not load lesson {number}.' },
  'lesson.fallbackTitle': { es: 'Lección {number}', en: 'Lesson {number}' },
  'lesson.crumb': { es: 'Lección {number}', en: 'Lesson {number}' },
  'lesson.question': { es: 'Pregunta {current} de 10', en: 'Question {current} of 10' },
  'lesson.step': { es: 'Paso {current} / {total}', en: 'Step {current} / {total}' },
  'lesson.restart': { es: '↺ Reiniciar lección', en: '↺ Restart lesson' },
  'lesson.restartTitle': { es: 'Volver al paso 1', en: 'Go back to step 1' },
  'lesson.restartConfirm': { es: '¿Reiniciar esta lección desde el paso 1?', en: 'Restart this lesson from step 1?' },
  'lesson.resumeNotice': { es: 'Retomamos la lección en el paso {step}.', en: 'Picking up the lesson at step {step}.' },
  'lesson.hint': { es: 'Las mayúsculas y los espacios no afectan a la respuesta.', en: 'Capital letters and spaces do not affect the answer.' },
  'lesson.solutionTitle': { es: 'Ver solución con contraseña', en: 'View solution with password' },
  'lesson.leave': { es: 'Salir de la lección', en: 'Leave the lesson' },
  'lesson.continue': { es: 'Continuar', en: 'Continue' },
  'lesson.answerLabel': { es: 'Introduce la orden', en: 'Enter the command' },
  'lesson.answerPlaceholder': { es: 'Introduce la orden…', en: 'Enter the command…' },
  'lesson.check': { es: 'Comprobar', en: 'Check' },
  'lesson.back': { es: '← Atrás', en: '← Back' },
  'lesson.terminalLabel': { es: '▣ Respuesta del sistema', en: '▣ System response' },
  'lesson.correct': { es: 'Correcto. Continuamos.', en: 'Correct. Moving on.' },
  'lesson.incorrectReview': { es: 'No es correcto. La respuesta esperada era {answer}.', en: 'That is not correct. The expected answer was {answer}.' },
  'lesson.nextQuestion': { es: 'Siguiente pregunta', en: 'Next question' },
  'lesson.incorrect': { es: 'Aún no es la orden correcta. Revisa la explicación y vuelve a intentarlo.', en: 'That is not the right command yet. Review the explanation and try again.' },
  'finish.title': { es: 'Lección finalizada', en: 'Lesson finished' },
  'finish.noErrors': { es: 'Sin errores', en: 'No mistakes' },
  'finish.wrongAnswers': { es: '{count} respuesta incorrecta|{count} respuestas incorrectas', en: '{count} incorrect answer|{count} incorrect answers' },
  'finish.practiceDone': { es: 'Práctica completada', en: 'Practice completed' },
  'finish.passedLead': { es: 'Tu progreso ha quedado registrado en este dispositivo.', en: 'Your progress has been saved on this device.' },
  'finish.failedLead': { es: 'Para completar una lección Review debes acertar las diez preguntas. Aquí tienes las soluciones que conviene repasar.', en: 'To complete a Review lesson you need to get all ten questions right. Here are the answers worth reviewing.' },
  'finish.backToLessons': { es: 'Volver a las lecciones', en: 'Back to the lessons' },
  'solution.prompt': { es: 'Introduce la contraseña de la solución.', en: 'Enter the solution password.' },
  'solution.wrongPassword': { es: 'Contraseña incorrecta.', en: 'Incorrect password.' },
  'solution.reveal': { es: 'Solución: {answer}', en: 'Solution: {answer}' },
  'error.loadIndex': { es: 'No se ha podido cargar el índice de lecciones. Comprueba que la carpeta <code>orion/GDS</code> esté disponible junto a esta aplicación.', en: 'The lesson index could not be loaded. Make sure the <code>orion/GDS</code> folder is available next to this application.' },
  'common.cancel': { es: 'Cancelar', en: 'Cancel' },
  'profile.gateTitle': { es: 'Antes de empezar', en: 'Before you start' },
  'profile.gateIntro': { es: 'Introduce tus datos para continuar. Se guardan únicamente en este dispositivo (no se envían a ningún servidor) y se usarán para identificarte en tu informe de progreso. No podrás modificarlos después, salvo si restableces tu progreso.', en: 'Enter your details to continue. They are saved only on this device (nothing is sent to any server) and are used to identify you in your progress report. You won’t be able to change them afterwards, unless you reset your progress.' },
  'profile.updateTitle': { es: 'Actualizar tus datos', en: 'Update your details' },
  'profile.firstName': { es: 'Nombre', en: 'First name' },
  'profile.lastName': { es: 'Apellidos', en: 'Last name(s)' },
  'profile.idNumber': { es: 'DNI / Pasaporte', en: 'National ID / Passport' },
  'profile.email': { es: 'Email oficial de la universidad', en: 'Official university email' },
  'profile.save': { es: 'Guardar y continuar', en: 'Save and continue' },
  'profile.update': { es: 'Guardar cambios', en: 'Save changes' },
  'profile.resetAsk': { es: '¿Quieres actualizar tus datos personales antes de continuar?', en: 'Do you want to update your personal details before continuing?' },
  'profile.errorRequired': { es: 'Completa todos los campos.', en: 'Fill in all fields.' },
  'profile.errorEmail': { es: 'Introduce un email válido.', en: 'Enter a valid email address.' },
  'profile.errorId': { es: 'Introduce un documento de identificación válido.', en: 'Enter a valid ID document.' },
  'report.button': { es: 'Ver informe', en: 'View report' },
  'report.title': { es: 'Informe de progreso', en: 'Progress report' },
  'report.generatedOn': { es: 'Generado el {date}', en: 'Generated on {date}' },
  'report.student': { es: 'Estudiante', en: 'Student' },
  'report.idLabel': { es: 'Identificación', en: 'ID' },
  'report.emailLabel': { es: 'Email', en: 'Email' },
  'report.modeCompleted': { es: '{completed} de 40 lecciones completadas', en: '{completed} of 40 lessons completed' },
  'report.noneCompleted': { es: 'Sin lecciones completadas en este modo.', en: 'No lessons completed in this mode.' },
  'report.print': { es: 'Imprimir / Guardar como PDF', en: 'Print / Save as PDF' },
  'report.download': { es: 'Descargar (.html)', en: 'Download (.html)' },
  'report.noProfile': { es: 'Sin datos personales registrados.', en: 'No personal details on record.' }
};
const LANG_KEY = 'gds-training-lang';
function getLang() { return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'es'; }
let lang = getLang();
function t(key, vars) {
  const entry = STRINGS[key];
  let str = entry ? (entry[lang] || entry.es) : key;
  if (vars) Object.keys(vars).forEach(name => { str = str.split(`{${name}}`).join(vars[name]); });
  return str;
}
// Some counted phrases need a singular/plural form per language ("1 lección pendiente"
// vs "3 lecciones pendientes"); the dictionary stores both forms separated by "|".
function plural(key, count) {
  const entry = STRINGS[key];
  const template = entry ? (entry[lang] || entry.es) : key;
  const forms = template.split('|');
  const form = count === 1 && forms.length > 1 ? forms[0] : (forms[1] || forms[0]);
  return form.split('{count}').join(count);
}
// The mandatory profile gate is often the very first screen a student ever sees, before
// they've had any chance to find the language switcher, so its text is always shown in
// both languages at once rather than following the current `lang` toggle like the rest
// of the UI. `bi(key)` looks up both translations regardless of `lang`.
function bi(key, vars) {
  const entry = STRINGS[key];
  if (!entry) return key;
  const fill = str => (vars ? Object.keys(vars).reduce((acc, name) => acc.split(`{${name}}`).join(vars[name]), str) : str);
  const es = fill(entry.es);
  const en = fill(entry.en || entry.es);
  return es === en ? es : `${es} / ${en}`;
}
function applyStaticI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.dataset.i18nAttr.split(';').forEach(pair => {
      const [attr, key] = pair.split(':');
      if (attr && key) el.setAttribute(attr, t(key));
    });
  });
}
function renderLangSwitch() {
  document.querySelectorAll('.lang-option').forEach(button => button.classList.toggle('active', button.dataset.lang === lang));
}
function refreshOpenDialogs() {
  if (progressDialog.open) renderProgressDetails();
  if (searchDialog.open) { if (searchIndex) renderSearch(searchInput.value); else searchResults.innerHTML = `<p class="loading">${t('search.preparing')}</p>`; }
  if (lookupDialog.open) renderLookup(lookupInput.value);
}
function refreshCurrentView() {
  updateProgress();
  if (gateActive) { renderGate(gateOptions); return; }
  renderNav();
  if (session) renderScreen();
  else if (activeMode) showLessons(activeMode);
  else showHome();
  refreshOpenDialogs();
}
function setLang(value) {
  lang = value === 'en' ? 'en' : 'es';
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  applyStaticI18n();
  renderLangSwitch();
  refreshCurrentView();
}
document.documentElement.lang = lang;

function storage() { return JSON.parse(localStorage.getItem('gds-training-progress') || '{}'); }
function save(data) { localStorage.setItem('gds-training-progress', JSON.stringify(data)); searchIndex = null; updateProgress(); }
function progressKey(mode, number) { return `${mode}-${number}`; }
function isDone(mode, number) { return Boolean(storage()[progressKey(mode, number)]); }
function updateProgress() {
  const count = Object.keys(storage()).length;
  document.querySelector('#progress-label').textContent = t('progress.count', { count });
  document.querySelector('#progress-bar').style.width = `${(count / 120) * 100}%`;
}
function completedIn(mode) { return contents.filter(item => isDone(mode, item.number)).length; }
function positions() { return JSON.parse(localStorage.getItem('gds-training-position') || '{}'); }
function savePosition(mode, number, index) {
  const data = positions();
  data[progressKey(mode, number)] = index;
  localStorage.setItem('gds-training-position', JSON.stringify(data));
}
function clearPosition(mode, number) {
  const data = positions();
  delete data[progressKey(mode, number)];
  localStorage.setItem('gds-training-position', JSON.stringify(data));
}
function savedPosition(mode, number) {
  const value = positions()[progressKey(mode, number)];
  return typeof value === 'number' ? value : 0;
}
// A separate, stricter normalizer for answer-checking: unlike normal() (used by
// search, which still needs single spaces between terms), this strips ALL
// whitespace so any extra or misplaced space truly never affects an answer.
function normalAnswer(value) {
  const stripped = String(value).toUpperCase().replace(/\s+/g, '');
  // A purely numeric answer is a selected line/value (e.g. "3"); leading zeros
  // ('03') don't change what was selected, so compare them as numbers.
  return /^\d+$/.test(stripped) ? String(Number(stripped)) : stripped;
}
function renderProgressDetails() {
  progressDetails.innerHTML = `<p class="lead">${t('progress.intro')}</p>${Object.entries(MODES).map(([id, mode]) => {
    const completed = completedIn(id);
    const status = completed === 40 ? t('progress.modeComplete') : plural('progress.pending', 40 - completed);
    return `<div class="progress-detail"><span class="symbol">${mode.icon}</span><span><strong>${mode.label}</strong><small>${status}</small></span><span>${completed} / 40</span></div>`;
  }).join('')}<div class="report-action"><button class="primary-button" id="open-report" type="button">${t('report.button')}</button></div>`;
  const reportButton = document.querySelector('#open-report');
  if (reportButton) reportButton.addEventListener('click', openReport);
}
function openProgress() {
  renderProgressDetails();
  progressDialog.showModal();
}
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[c]); }
function normal(value) { return value.toUpperCase().replace(/\s+/g, ' ').trim(); }
function normalPassword(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
}
function lessonTheme(number) {
  const match = LESSON_THEMES.find(([from, to]) => number >= from && number <= to) || LESSON_THEMES[0];
  return { icon: match[2], label: match[3], kind: match[4] };
}
function solutionPassword(title, lessonNumber, pageNumber) {
  const firstTitleWord = title.trim().split(/\s+/)[0];
  return normalPassword(String(lessonNumber) + firstTitleWord + String(pageNumber));
}
function showSolution(title, lessonNumber, pageNumber, answers) {
  const entered = prompt(t('solution.prompt'));
  if (entered === null) return;
  if (normalPassword(entered) !== solutionPassword(title, lessonNumber, pageNumber)) {
    alert(t('solution.wrongPassword'));
    return;
  }
  alert(t('solution.reveal', { answer: answers[0] }));
}

// --- Student profile gate ------------------------------------------------------------
// A one-time, locked identity capture: name, ID document, and university email. It is
// asked once, before the very first lesson (nothing to complete yet, nothing saved yet),
// stored locally only, and afterwards shown read-only in the progress report — the only
// way to change it again is to reset progress, which explicitly offers to update it.
const PROFILE_KEY = 'gds-training-profile';
function getProfile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY)); } catch (_) { return null; }
}
function hasProfile() { return Boolean(getProfile()); }
function saveProfile(profile) { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }
function shouldGateForProfile() { return !hasProfile() && Object.keys(storage()).length === 0; }
function validateProfile(formData) {
  const firstName = String(formData.get('firstName') || '').trim();
  const lastName = String(formData.get('lastName') || '').trim();
  const idNumber = String(formData.get('idNumber') || '').trim();
  const email = String(formData.get('email') || '').trim();
  if (!firstName || !lastName || !idNumber || !email) return { error: bi('profile.errorRequired') };
  if (idNumber.replace(/\s+/g, '').length < 5) return { error: bi('profile.errorId') };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: bi('profile.errorEmail') };
  return { profile: { firstName, lastName, idNumber, email, savedAt: new Date().toISOString() } };
}
let gateActive = false;
let gateOptions = null;
// Renders the mandatory (or, after a progress reset, optional) profile form in place of
// the normal screen. `onDone` runs after a successful save (or Cancel, update-mode only)
// and defaults to showHome — reset-progress passes its own so the user lands back where
// resetting makes sense rather than always at the home screen.
function renderGate(options) {
  gateOptions = options || {};
  const prefill = gateOptions.prefill || {};
  const isUpdate = Boolean(gateOptions.isUpdate);
  const onDone = gateOptions.onDone || showHome;
  gateActive = true;
  nav.innerHTML = '';
  const heading = isUpdate ? bi('profile.updateTitle') : bi('profile.gateTitle');
  crumb.textContent = heading;
  app.innerHTML = `<section class="profile-gate"><div class="profile-card"><div class="eyebrow">${bi('home.eyebrow')}</div><h1>${heading}</h1><p class="lead">${bi('profile.gateIntro')}</p><form id="profile-form" class="profile-form" novalidate>
    <label>${bi('profile.firstName')}<input name="firstName" required autocomplete="given-name" value="${escapeHtml(prefill.firstName || '')}" /></label>
    <label>${bi('profile.lastName')}<input name="lastName" required autocomplete="family-name" value="${escapeHtml(prefill.lastName || '')}" /></label>
    <label>${bi('profile.idNumber')}<input name="idNumber" required autocomplete="off" value="${escapeHtml(prefill.idNumber || '')}" /></label>
    <label>${bi('profile.email')}<input name="email" type="email" required autocomplete="email" value="${escapeHtml(prefill.email || '')}" /></label>
    <div id="profile-error" class="notice bad" hidden></div>
    <div class="profile-actions">${isUpdate ? `<button type="button" class="secondary-button" id="profile-cancel">${bi('common.cancel')}</button>` : '<span></span>'}<button class="primary-button" type="submit">${isUpdate ? bi('profile.update') : bi('profile.save')}</button></div>
  </form></div></section>`;
  document.querySelector('#profile-form').addEventListener('submit', event => {
    event.preventDefault();
    const result = validateProfile(new FormData(event.target));
    const errorBox = document.querySelector('#profile-error');
    if (result.error) { errorBox.textContent = result.error; errorBox.hidden = false; return; }
    saveProfile(result.profile);
    gateActive = false;
    renderNav();
    onDone();
  });
  const cancelButton = document.querySelector('#profile-cancel');
  if (cancelButton) cancelButton.addEventListener('click', () => { gateActive = false; renderNav(); onDone(); });
}

// --- Progress report -----------------------------------------------------------------
// A self-contained HTML document (own inline styles, no dependency on the app's own
// assets) so it can be opened as a standalone tab, viewed, printed to PDF, or downloaded
// as a plain .html file — all from the report page itself.
const REPORT_CSS = ':root{color-scheme:light;--navy:#071a33;--blue:#1b63d9;--ink:#142238;--muted:#65738a;--line:#dce3ee;}*{box-sizing:border-box;}body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--ink);background:#f4f7fb;}.report-toolbar{position:sticky;top:0;background:#fff;border-bottom:1px solid var(--line);padding:12px 24px;display:flex;gap:10px;justify-content:flex-end;}.report-toolbar button{padding:9px 14px;border:1px solid var(--line);border-radius:8px;background:#fff;color:#29415f;font:inherit;font-size:14px;cursor:pointer;}.report-toolbar button:hover{border-color:#8db5f5;}.report-page{max-width:760px;margin:0 auto;padding:40px 28px 60px;}.report-header h1{margin:0 0 6px;font-size:28px;letter-spacing:-.02em;color:var(--navy);}.report-meta{margin:0 0 28px;color:var(--muted);font-size:13px;}.report-student{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:0 0 32px;padding:18px 20px;border:1px solid var(--line);border-radius:12px;background:#fff;}.report-student dt{margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);}.report-student dd{margin:0;font-weight:650;}.report-mode{margin:0 0 26px;padding:18px 20px;border:1px solid var(--line);border-radius:12px;background:#fff;}.report-mode h2{margin:0 0 4px;font-size:17px;}.report-count{margin:0 0 12px;color:var(--blue);font-size:13px;font-weight:650;}.report-list{margin:0;padding-left:20px;display:grid;gap:6px;font-size:14px;}.report-empty{margin:0;color:var(--muted);font-size:14px;}@media print{.report-toolbar{display:none;}body{background:#fff;}.report-mode,.report-student{border:none;box-shadow:none;}}';
function buildReportHtml() {
  const profile = getProfile();
  const dateStr = new Date().toLocaleString(lang === 'en' ? 'en-GB' : 'es-ES');
  const studentBlock = profile
    ? `<dl class="report-student"><div><dt>${t('report.student')}</dt><dd>${escapeHtml(profile.firstName)} ${escapeHtml(profile.lastName)}</dd></div><div><dt>${t('report.idLabel')}</dt><dd>${escapeHtml(profile.idNumber)}</dd></div><div><dt>${t('report.emailLabel')}</dt><dd>${escapeHtml(profile.email)}</dd></div></dl>`
    : `<p class="report-empty">${t('report.noProfile')}</p>`;
  const sections = Object.entries(MODES).map(([id, mode]) => {
    const done = contents.filter(item => isDone(id, item.number));
    const rows = done.length
      ? `<ol class="report-list">${done.map(item => `<li>${t('lesson.crumb', { number: item.number })} — ${escapeHtml(item.title)}</li>`).join('')}</ol>`
      : `<p class="report-empty">${t('report.noneCompleted')}</p>`;
    return `<section class="report-mode"><h2>${mode.label}</h2><p class="report-count">${t('report.modeCompleted', { completed: done.length })}</p>${rows}</section>`;
  }).join('');
  const printLabel = escapeHtml(t('report.print'));
  const downloadLabel = escapeHtml(t('report.download'));
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${escapeHtml(t('report.title'))}</title><style>${REPORT_CSS}</style></head><body>
<div class="report-toolbar"><button type="button" onclick="window.print()">${printLabel}</button><button type="button" id="download-html">${downloadLabel}</button></div>
<main class="report-page">
<div class="report-header"><h1>${t('report.title')}</h1><p class="report-meta">${t('report.generatedOn', { date: dateStr })}</p></div>
${studentBlock}
${sections}
</main>
<script>document.querySelector('#download-html').addEventListener('click', () => { const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'informe-progreso.html'; a.click(); });<\/script>
</body></html>`;
}
function openReport() {
  const url = URL.createObjectURL(new Blob([buildReportHtml()], { type: 'text/html' }));
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function parseDirectory(text) {
  return text.split(/\r?\n/).flatMap(line => {
    const match = line.match(/^\s*(\d+)\s+(.+?)\s{2,}(\d+)\s+(.+)$/);
    if (match) return [
      { number: Number(match[1]), title: match[2].trim() },
      { number: Number(match[3]), title: match[4].trim() }
    ];
    const single = line.match(/^\s*(\d+)\s+(.+?)\s*$/);
    return single ? [{ number: Number(single[1]), title: single[2].trim() }] : [];
  }).sort((a, b) => a.number - b.number);
}
function sourceFile(mode, number, part) { return `${MODES[mode].prefix}${number}${part || ''}.DAT`; }
function decodeLegacy(value) {
  // DOS used ^ as a cursor marker with no visible meaning; \n/\" are escaped literals
  // in the source, and <PgDn> is a paging hint the modern, always-scrolling UI doesn't need.
  // Markers like [ ~ { } ! are NOT stripped here anymore: they carry real structure
  // (bullet points, field diagrams) that formatInstructionHtml() below interprets.
  // The original DAT files (never edited) name the legacy system "AMADEUS"; the app
  // layer rebrands every mention to "GDS" wherever it is displayed (including inside
  // compound words like AMADEUSPRO -> GDSPRO), matching the rest of the GDS Training rebrand.
  return value.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/<PgDn>/gi, '').replace(/AMADEUS/gi, 'GDS');
}
// A flat, fully-cleaned rendering of a text line, for contexts that show plain text
// rather than the structured instruction layout (search results, the review summary).
function plainText(line) {
  return line.replace(/^\s*\[\s*/, '').replace(/[\^~\[\]!{}]/g, ' ').replace(/\s+/g, ' ').trim();
}

// --- Instruction formatting -------------------------------------------------------
// The original lessons encode more structure than plain sentences: a leading "[" marks
// a bullet point, "CODE   description" runs are little glossaries, and "term~~~~{ }~~~~term"
// is DOS line-art pairing two field names. classifyLine() recognizes these per source
// line; groupBlocks() merges consecutive lines of the same kind into one block (a
// paragraph, a list, a glossary, a labelled example, or a simplified field diagram) so
// the lesson reads as formatted text instead of one flat block of terminal-like prose.
function cleanupTokens(text) {
  return text.replace(/\^/g, '').replace(/[~{}!\[\]]/g, ' ').replace(/\s+/g, ' ').trim();
}
function classifyLine(raw) {
  if (!raw.trim()) return { kind: 'blank' };
  const bulletMatch = raw.match(/^\s*\[\s*(.*)$/);
  if (bulletMatch) {
    const content = cleanupTokens(bulletMatch[1]);
    return content ? { kind: 'bullet', content } : { kind: 'blank' };
  }
  const pairMatch = raw.match(/^\s*(.+?)\s*~{2,}\{\s*\}~{2,}\s*(.+?)\s*$/);
  if (pairMatch) return { kind: 'legend', left: cleanupTokens(pairMatch[1]), right: cleanupTokens(pairMatch[2]) };
  if (/[~{}]/.test(raw)) {
    const content = cleanupTokens(raw);
    return content ? { kind: 'legend', text: content } : { kind: 'blank' };
  }
  const defMatch = raw.match(/^\s*([A-Z][A-Z0-9/]{0,7})\^?\s{3,}(\S.*?)(?:\s{3,}([A-Z][A-Z0-9/]{0,7})\^?\s{3,}(\S.*))?$/);
  if (defMatch) {
    const pairs = [{ code: defMatch[1], desc: cleanupTokens(defMatch[2]) }];
    if (defMatch[3]) pairs.push({ code: defMatch[3], desc: cleanupTokens(defMatch[4]) });
    return { kind: 'definition', pairs };
  }
  const indent = raw.match(/^ */)[0].length;
  const trimmed = cleanupTokens(raw);
  if (!trimmed) return { kind: 'blank' };
  if (indent >= 12 && trimmed.length <= 44 && !/[a-z]{4,}/.test(trimmed)) {
    return { kind: 'example', content: trimmed };
  }
  return { kind: 'prose', content: trimmed };
}
function groupBlocks(rawLines) {
  const blocks = [];
  let current = null;
  let blankPending = false;
  for (const raw of rawLines) {
    const line = classifyLine(raw);
    if (line.kind === 'blank') { blankPending = true; continue; }
    const canMerge = current && current.kind === line.kind && !(blankPending && line.kind === 'prose');
    if (canMerge) {
      if (line.kind === 'bullet') current.items.push(line.content);
      else if (line.kind === 'legend') current.items.push(line.left ? { left: line.left, right: line.right } : { text: line.text });
      else if (line.kind === 'definition') current.pairs.push(...line.pairs);
      else if (line.kind === 'example') current.lines.push(line.content);
      else if (line.kind === 'prose') current.text += ' ' + line.content;
    } else {
      if (current) blocks.push(current);
      if (line.kind === 'bullet') current = { kind: 'bullet', items: [line.content] };
      else if (line.kind === 'legend') current = { kind: 'legend', items: [line.left ? { left: line.left, right: line.right } : { text: line.text }] };
      else if (line.kind === 'definition') current = { kind: 'definition', pairs: [...line.pairs] };
      else if (line.kind === 'example') current = { kind: 'example', lines: [line.content] };
      else if (line.kind === 'prose') current = { kind: 'prose', text: line.content };
    }
    blankPending = false;
  }
  if (current) blocks.push(current);
  return blocks;
}
const KEYWORD_RE = /\b[A-Z][A-Z0-9]{1,9}\b/g;
function boldKeywords(escapedText) {
  return escapedText.replace(KEYWORD_RE, match => `<strong class="kw">${match}</strong>`);
}
function renderInstructionBlock(block) {
  switch (block.kind) {
    case 'prose':
      return `<p>${boldKeywords(escapeHtml(block.text.trim()))}</p>`;
    case 'bullet': {
      const compact = block.items.length >= 4 && block.items.every(i => i.length <= 60) ? ' columns' : '';
      return `<ul class="instruction-list${compact}">${block.items.map(i => `<li>${boldKeywords(escapeHtml(i))}</li>`).join('')}</ul>`;
    }
    case 'definition':
      return `<dl class="instruction-legend">${block.pairs.map(p => `<div class="legend-row"><dt>${escapeHtml(p.code)}</dt><dd>${boldKeywords(escapeHtml(p.desc))}</dd></div>`).join('')}</dl>`;
    case 'legend':
      return `<div class="instruction-diagram">${block.items.map(it => it.left
        ? `<div class="diagram-pair"><span>${escapeHtml(it.left)}</span><span class="arrow" aria-hidden="true">→</span><span>${escapeHtml(it.right)}</span></div>`
        : `<div class="diagram-note">${escapeHtml(it.text)}</div>`).join('')}</div>`;
    case 'example':
      return `<pre class="instruction-example">${escapeHtml(block.lines.join('\n'))}</pre>`;
    default:
      return '';
  }
}
function formatInstructionHtml(kicker, rawLines) {
  const blocks = groupBlocks(rawLines);
  const kickerHtml = kicker && kicker.trim() ? `<div class="instruction-kicker">${escapeHtml(kicker.trim())}</div>` : '';
  return kickerHtml + blocks.map(renderInstructionBlock).join('');
}
// -----------------------------------------------------------------------------------

function parseLesson(text) {
  const screens = new Map();
  const matcher = /scr\("(\d+)",(\d+),"((?:\\.|[^"\\])*)"\)/g;
  const terminalTypes = new Set([1, 6, 7, 8, 11, 12, 61, 78, 88]);
  for (const match of text.matchAll(matcher)) {
    const key = Number(match[1]);
    if (!screens.has(key)) screens.set(key, { id: key, title: [], text: [], output: [], hasSegmentDetail: false, answers: [], clear: false, end: false });
    const screen = screens.get(key), type = Number(match[2]), value = decodeLegacy(match[3]);
    if (type === 22) screen.title.push(value);
    else if (terminalTypes.has(type)) {
      screen.output.push(value);
      if (type === 6) screen.hasSegmentDetail = true;
    }
    else if (type === 2) screen.text.push(value);
    else if (type === 3 || (type === 4 && !/^Press\s+(?:PgDn\s+)?to proceed\.?$/i.test(value.trim()))) screen.text.push(value);
    else if (type === 5) screen.answers.push(value);
    else if (type === 0 && normal(value) === 'CLS') screen.clear = true;
    else if (type === 9) screen.end = true;
  }
  return [...screens.values()].sort((a, b) => a.id - b.id);
}
async function loadContents() {
  const response = await fetch(`${SOURCE}DIR.DSP`);
  if (!response.ok) throw new Error('No se pudo cargar DIR.DSP');
  contents = parseDirectory(await response.text());
}
// A handful of original .DAT screens ask the student to type a specific full entry in
// their instruction text, but the accepted-answer field in the same file only records
// a short fragment of it (a data-entry mistake in the source material). The original,
// read-only .DAT files are never edited, so those cases are corrected here instead,
// keyed by mode, lesson number, file part ('' = base, 'B', 'C'…) and the DAT's own
// internal screen id.
const ANSWER_FIXES = {
  'classroom-14--9': ['OSIB 1CHD AGED 9/P3']
};
function applyAnswerFix(mode, number, part, screen) {
  const fix = ANSWER_FIXES[`${mode}-${number}-${part}-${screen.id}`];
  if (fix) screen.answers = fix;
  return screen;
}
async function loadLesson(mode, number) {
  // Some lessons are split by the original DOS engine across several files
  // (base, B, C, …), each one a self-contained continuation of the previous.
  const parts = ['', 'B', 'C'];
  let screens = [];
  for (const part of parts) {
    const response = await fetch(`${SOURCE}${sourceFile(mode, number, part)}`);
    if (!response.ok) {
      if (part === '') throw new Error(t('lesson.loadError', { number }));
      break;
    }
    const parsed = parseLesson(await response.text()).map(screen => applyAnswerFix(mode, number, part, screen));
    screens = screens.concat(parsed);
  }
  return screens;
}
function renderNav() {
  nav.innerHTML = Object.entries(MODES).map(([id, mode]) => `<button data-mode="${id}" class="${activeMode === id ? 'active' : ''}"><span class="mode-icon">${mode.icon}</span>${mode.label}</button>`).join('');
  nav.querySelectorAll('button').forEach(button => button.addEventListener('click', () => { showLessons(button.dataset.mode); closeSidebar(); }));
}
function showHome() {
  activeMode = null; activeLesson = null; session = null; renderNav(); crumb.textContent = t('nav.home');
  app.innerHTML = `<section class="home-hero"><div><div class="eyebrow">${t('home.eyebrow')}</div><h1>${t('home.title')}</h1><p class="lead">${t('home.lead')}</p><div class="hero-pills"><span>${t('home.pillLessons')}</span><span>${t('home.pillProgress')}</span><span>${t('home.pillSearch')}</span></div></div><img src="modern/assets/travel-training.svg" alt="${t('home.imageAlt')}" /></section><section class="mode-grid">${Object.entries(MODES).map(([id, mode]) => `<article class="mode-card mode-${id}"><div class="mode-symbol">${mode.icon}</div><h2>${mode.label}</h2><p>${t('mode.' + id + '.desc')}</p><button class="primary-button" data-mode="${id}">${t('home.viewLessons')} <span aria-hidden="true">→</span></button></article>`).join('')}</section>`;
  app.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => showLessons(button.dataset.mode)));
}
function showLessons(mode) {
  activeMode = mode; activeLesson = null; session = null; renderNav();
  const info = MODES[mode]; crumb.textContent = info.label;
  app.innerHTML = `<div class="lesson-top"><div><div class="eyebrow">${info.label}</div><h1>${info.label}</h1><p>${t('mode.' + mode + '.desc')}</p></div><button class="secondary-button" id="home-button">${t('lessons.back')}</button></div><section class="lesson-list">${(() => { const pos = positions(); return contents.map(item => {
    const theme = lessonTheme(item.number);
    const done = isDone(mode, item.number);
    const savedIndex = pos[progressKey(mode, item.number)];
    const inProgress = !done && savedIndex !== undefined;
    const status = done ? t('lessons.status.done') : inProgress ? t('lessons.status.inProgress', { step: savedIndex + 1 }) : mode === 'review' ? t('lessons.status.review') : t('lessons.status.practice');
    return `<button class="lesson-card theme-${theme.kind} ${done ? 'done' : ''} ${inProgress ? 'in-progress' : ''}" data-lesson="${item.number}"><span class="lesson-number">${done ? '✓' : inProgress ? '●' : item.number}</span><span class="lesson-emblem" aria-hidden="true">${theme.icon}</span><span><small class="lesson-category">${t('theme.' + theme.kind)}</small><strong>${escapeHtml(item.title)}</strong><small class="lesson-status">${status}</small></span></button>`;
  }); })().join('')}</section>`;
  document.querySelector('#home-button').addEventListener('click', showHome);
  app.querySelectorAll('[data-lesson]').forEach(button => button.addEventListener('click', () => startLesson(mode, Number(button.dataset.lesson))));
}
async function startLesson(mode, number) {
  activeMode = mode; activeLesson = number; crumb.textContent = `${MODES[mode].label} · ${t('lesson.crumb', { number })}`;
  app.innerHTML = `<p class="loading">${t('lesson.preparing')}</p>`;
  try {
    const screens = await loadLesson(mode, number);
    const resumeIndex = Math.min(savedPosition(mode, number), Math.max(screens.length - 1, 0));
    session = { mode, number, screens, index: resumeIndex, wrong: [], errorInQuestion: false, justResumed: resumeIndex > 0 };
    renderScreen();
  } catch (error) { app.innerHTML = `<p class="notice bad">${escapeHtml(error.message)}</p>`; }
}
function currentScreen() { return session.screens[session.index]; }
function usefulAnswers(screen) { return screen.answers.filter(answer => normalAnswer(answer) !== 'PD'); }
function terminalForCurrentScreen() {
  let terminal = [];
  for (let index = 0; index <= session.index; index += 1) {
    const screen = session.screens[index];
    // CLS is executed after the contents of its screen have been read.
    if (index > 0 && session.screens[index - 1].clear) terminal = [];
    // A new system response replaces the previous terminal display.
    if (screen.output.length) {
      // Type 12 is a layout marker in the legacy player, not the visible header.
      // The DOS terminal supplies this standard PNR header for compact segment displays.
      terminal = screen.hasSegmentDetail && !screen.output.some(line => /^RP\//.test(line.trim()))
        ? ['RP/FRALH0999/', ...screen.output]
        : screen.output;
    }
  }
  return terminal;
}
function renderScreen() {
  const screen = currentScreen();
  if (!screen) return finishLesson();
  // Re-set on every render (not just when the lesson is first opened) so a language
  // switch made mid-lesson also updates the breadcrumb, not just the stage below it.
  crumb.textContent = `${MODES[session.mode].label} · ${t('lesson.crumb', { number: session.number })}`;
  savePosition(session.mode, session.number, session.index);
  const showResumeNotice = Boolean(session.justResumed);
  session.justResumed = false;
  const title = contents.find(item => item.number === session.number)?.title || t('lesson.fallbackTitle', { number: session.number });
  const theme = lessonTheme(session.number);
  const answers = usefulAnswers(screen);
  const isPager = screen.answers.some(answer => normalAnswer(answer) === 'PD') && !answers.length;
  const instructionHtml = formatInstructionHtml(screen.title.join(' '), screen.text);
  const terminal = terminalForCurrentScreen();
  const illustration = ILLUSTRATIONS[pickIllustration(screen, theme)];
  const canGoBack = session.mode === 'classroom' || session.mode === 'agency';
  const backButton = canGoBack && session.index > 0 ? `<button class="secondary-button" id="back">${t('lesson.back')}</button>` : '';
  const continueControls = `<div class="stage-actions">${backButton}<span></span><button class="primary-button" id="continue">${t('lesson.continue')}</button></div>`;
  const answerControls = `<div class="stage-actions">${backButton}<p class="hint">${t('lesson.hint')}</p><div class="answer-actions"><button class="solution-button" id="lookup-quick" title="${t('lookup.openTitle')}">⌗</button><button class="solution-button" id="solution" title="${t('lesson.solutionTitle')}">S</button><button class="secondary-button" id="leave">${t('lesson.leave')}</button></div></div>`;
  app.innerHTML = `<article class="lesson-stage"><header class="stage-heading"><div><div class="eyebrow">${MODES[session.mode].label} · ${t('lesson.crumb', { number: session.number })}</div><h2>${escapeHtml(title)}</h2><p>${session.mode === 'review' ? t('lesson.question', { current: Math.min(session.index + 1, 10) }) : t('lessons.status.practice')}</p></div><div class="stage-heading-actions"><span class="step">${t('lesson.step', { current: session.index + 1, total: session.screens.length })}</span>${session.index > 0 ? `<button class="text-button" id="restart-lesson" title="${t('lesson.restartTitle')}">${t('lesson.restart')}</button>` : ''}</div></header><div class="lesson-body"><div class="lesson-main">${showResumeNotice ? `<p class="notice good">${t('lesson.resumeNotice', { step: session.index + 1 })}</p>` : ''}<pre class="terminal">${escapeHtml(terminal.join('\n'))}</pre><div class="instruction">${instructionHtml}</div>${isPager ? continueControls : answers.length ? `<form id="answer-form"><div class="command-row"><input id="command-input" aria-label="${t('lesson.answerLabel')}" placeholder="${t('lesson.answerPlaceholder')}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" autofocus /><button class="primary-button">${t('lesson.check')}</button></div></form><div id="feedback"></div>${answerControls}` : continueControls}</div><div class="step-illustration theme-${theme.kind}" aria-hidden="true">${illustration}</div></div></article>`;
  const continueButton = document.querySelector('#continue');
  if (continueButton) continueButton.addEventListener('click', nextScreen);
  const backButtonElement = document.querySelector('#back');
  if (backButtonElement) backButtonElement.addEventListener('click', previousScreen);
  const leave = document.querySelector('#leave');
  if (leave) leave.addEventListener('click', () => showLessons(session.mode));
  const restart = document.querySelector('#restart-lesson');
  if (restart) restart.addEventListener('click', () => {
    if (!confirm(t('lesson.restartConfirm'))) return;
    session.index = 0;
    session.wrong = [];
    clearPosition(session.mode, session.number);
    renderScreen();
  });
  const solution = document.querySelector('#solution');
  if (solution) solution.addEventListener('click', () => showSolution(title, session.number, session.index + 1, answers));
  const lookupQuick = document.querySelector('#lookup-quick');
  if (lookupQuick) lookupQuick.addEventListener('click', openLookup);
  const form = document.querySelector('#answer-form');
  if (form) form.addEventListener('submit', event => { event.preventDefault(); submitAnswer(answers); });
  const stageTitle = document.querySelector('.stage-heading > div');
  stageTitle.classList.add('stage-title', 'theme-' + theme.kind);
  stageTitle.dataset.icon = theme.icon;
  if (terminal.length) {
    const label = document.createElement('div');
    label.className = 'terminal-label';
    label.textContent = t('lesson.terminalLabel');
    document.querySelector('.terminal').before(label);
  }
}
function submitAnswer(answers) {
  const input = document.querySelector('#command-input');
  const feedback = document.querySelector('#feedback');
  if (!normalAnswer(input.value)) return;
  const correct = answers.some(answer => normalAnswer(answer) === normalAnswer(input.value));
  if (correct) {
    feedback.innerHTML = `<div class="notice good">${t('lesson.correct')}</div>`;
    input.disabled = true;
    setTimeout(nextScreen, 500);
  } else if (session.mode === 'review') {
    session.wrong.push({ question: currentScreen().text.map(plainText).join(' '), answer: answers[0] });
    feedback.innerHTML = `<div class="notice bad">${t('lesson.incorrectReview', { answer: `<strong>${escapeHtml(answers[0])}</strong>` })}</div><div class="stage-actions"><span></span><button class="primary-button" id="next-question">${t('lesson.nextQuestion')}</button></div>`;
    input.disabled = true;
    document.querySelector('#next-question').addEventListener('click', nextScreen);
  } else {
    feedback.innerHTML = `<div class="notice bad">${t('lesson.incorrect')}</div>`;
    input.select();
  }
}
function nextScreen() { session.index += 1; renderScreen(); }
function previousScreen() {
  if (session.index > 0) { session.index -= 1; renderScreen(); }
}
function finishLesson() {
  clearPosition(session.mode, session.number);
  const review = session.mode === 'review';
  const passed = !review || session.wrong.length === 0;
  const correctAnswers = 10 - session.wrong.length;
  if (passed) { const data = storage(); data[progressKey(session.mode, session.number)] = true; save(data); }
  const resultTitle = review ? (passed ? t('finish.noErrors') : plural('finish.wrongAnswers', session.wrong.length)) : t('finish.practiceDone');
  const leadText = passed ? t('finish.passedLead') : t('finish.failedLead');
  app.innerHTML = `<article class="lesson-stage final"><div class="eyebrow">${t('finish.title')}</div><span class="result-number">${review ? `${correctAnswers}/10` : '✓'}</span><h2>${resultTitle}</h2><p class="lead">${leadText}</p>${session.wrong.length ? `<div class="solution-list">${session.wrong.map(item => `<div class="solution"><strong>${escapeHtml(item.question)}</strong><code>${escapeHtml(item.answer)}</code></div>`).join('')}</div>` : ''}<p><button class="primary-button" id="back-lessons">${t('finish.backToLessons')}</button></p></article>`;
  document.querySelector('#back-lessons').addEventListener('click', () => showLessons(session.mode));
}
async function buildSearchIndex() {
  if (searchIndex) return searchIndex;
  searchResults.innerHTML = `<p class="loading">${t('search.preparing')}</p>`;
  const entries = [];
  await Promise.all(Object.keys(MODES).flatMap(mode => contents.map(async item => {
    if (!isDone(mode, item.number)) return;
    try {
      const screens = await loadLesson(mode, item.number);
      screens.forEach(screen => usefulAnswers(screen).forEach(command => entries.push({ mode, number: item.number, title: item.title, command, context: screen.text.map(plainText).join(' ') })));
    } catch (_) { /* A missing optional legacy file does not stop the finder. */ }
  })));
  searchIndex = entries;
  return entries;
}
async function openSearch() {
  searchDialog.showModal(); searchInput.value = ''; searchInput.focus(); searchResults.innerHTML = `<p class="loading">${t('search.hint')}</p>`;
  await buildSearchIndex();
}
function renderSearch(query) {
  if (!query.trim()) { searchResults.innerHTML = `<p class="loading">${t('search.empty')}</p>`; return; }
  const terms = normal(query).split(' ');
  const matches = searchIndex.filter(item => terms.every(term => normal(`${item.command} ${item.context} ${item.title}`).includes(term))).slice(0, 30);
  searchResults.innerHTML = matches.length ? matches.map(item => `<button class="search-result" data-mode="${item.mode}" data-lesson="${item.number}"><strong><code>${escapeHtml(item.command)}</code> · ${escapeHtml(item.title)}</strong><span>${escapeHtml(item.context.slice(0, 170))}</span></button>`).join('') : `<p class="loading">${t('search.noResults')}</p>`;
  searchResults.querySelectorAll('button').forEach(button => button.addEventListener('click', () => { searchDialog.close(); startLesson(button.dataset.mode, Number(button.dataset.lesson)); }));
}

// --- Quick city/airport code lookup ---------------------------------------------------
// The original DOS software could resolve a DAN/DAC lookup for any city or airport at any
// moment, backed by a live reference table. That table — AMCDE.DAT, ~130 common cities
// keyed by code — is still bundled under orion/GDS/ (never edited) but the modern reader
// never fetched it, so a handful of exercises that name a less common city (Nice, Dubai…)
// without ever showing its code left the student with no way to look it up themselves.
// This restores that lookup as a small helper, reachable from the topbar and from inside
// any exercise, by reading that same original file — no lesson content is duplicated here.
// AMCDE.DAT only lists ~130 common cities and does not include this one, which a couple
// of exercises still reference by its (now unusual) metropolitan-area code. Added here in
// the app layer only, so the lookup tool can resolve it too, without touching the
// original reference file.
const EXTRA_CODES = [
  { code: 'YMQ', info: 'MONTREAL/QC/CANADA (metropolitan-area code; the airport itself is YUL)' }
];
async function loadCodeIndex() {
  if (codeIndex) return codeIndex;
  const entries = [];
  try {
    const response = await fetch(`${SOURCE}AMCDE.DAT`);
    if (response.ok) {
      const matcher = /scr\("([^"]+)",90,"((?:\\.|[^"\\])*)"\)/g;
      for (const match of (await response.text()).matchAll(matcher)) {
        const code = match[1];
        const value = decodeLegacy(match[2]);
        // Each line repeats its own code and a one-letter type marker before the actual
        // city/region/country text (e.g. "ABQ C  ALBUQUERQUE/NM/USA"); strip that prefix
        // generically (by shape, not by re-matching the code) since a couple of rows in
        // the original file have a typo'd leading code that no longer matches its own key.
        const info = value.replace(/^\S+\s*[A-Z]?\s*/, '').trim();
        entries.push({ code, info: info || value });
      }
    }
  } catch (_) { /* Falls through to just the extra codes below. */ }
  codeIndex = entries.concat(EXTRA_CODES);
  return codeIndex;
}
async function openLookup() {
  lookupDialog.showModal(); lookupInput.value = ''; lookupInput.focus(); lookupResults.innerHTML = `<p class="loading">${t('lookup.hint')}</p>`;
  await loadCodeIndex();
}
function renderLookup(query) {
  if (!query.trim()) { lookupResults.innerHTML = `<p class="loading">${t('lookup.hint')}</p>`; return; }
  const term = normal(query);
  const exact = codeIndex.filter(entry => entry.code === term.replace(/\s+/g, ''));
  const byName = codeIndex.filter(entry => !exact.includes(entry) && entry.info.toUpperCase().includes(term));
  const matches = [...exact, ...byName].slice(0, 12);
  lookupResults.innerHTML = matches.length
    ? matches.map(entry => `<div class="search-result"><strong><code>${escapeHtml(entry.code)}</code></strong><span>${escapeHtml(entry.info)}</span></div>`).join('')
    : `<p class="loading">${t('lookup.noResults')}</p>`;
}
document.querySelector('#search-button').addEventListener('click', openSearch);
document.querySelector('#lookup-button').addEventListener('click', openLookup);
document.querySelector('#progress-button').addEventListener('click', openProgress);
searchInput.addEventListener('input', event => { if (searchIndex) renderSearch(event.target.value); });
lookupInput.addEventListener('input', event => { if (codeIndex) renderLookup(event.target.value); });
// The mobile drawer used to be opened and closed by the same #menu-button toggle, but
// once open the drawer's own z-index sits above the topbar and covers that button, so
// there was no way left to dismiss it. It now closes via a close button inside the
// drawer, via a tap on the dimmed backdrop behind it, or by picking a section from it.
const sidebarEl = document.querySelector('.sidebar');
const sidebarBackdrop = document.querySelector('#sidebar-backdrop');
function openSidebar() { sidebarEl.classList.add('open'); sidebarBackdrop.classList.add('open'); }
function closeSidebar() { sidebarEl.classList.remove('open'); sidebarBackdrop.classList.remove('open'); }
document.querySelector('#menu-button').addEventListener('click', openSidebar);
document.querySelector('#close-sidebar').addEventListener('click', closeSidebar);
sidebarBackdrop.addEventListener('click', closeSidebar);
document.querySelector('#progress-button').addEventListener('click', () => { closeSidebar(); });
document.querySelector('#reset-progress').addEventListener('click', () => {
  if (!confirm(t('progress.resetConfirm'))) return;
  localStorage.removeItem('gds-training-progress');
  localStorage.removeItem('gds-training-position');
  updateProgress();
  const modeToReturnTo = activeMode;
  const landBack = () => { if (modeToReturnTo) showLessons(modeToReturnTo); else showHome(); };
  if (hasProfile() && confirm(t('profile.resetAsk'))) {
    renderGate({ prefill: getProfile(), isUpdate: true, onDone: landBack });
  } else {
    landBack();
  }
});
document.querySelectorAll('.lang-option').forEach(button => button.addEventListener('click', () => setLang(button.dataset.lang)));
applyStaticI18n();
renderLangSwitch();
// The service worker used to be disabled on localhost to dodge cache-testing headaches
// during development; now that installability is the point, it registers everywhere
// (including localhost, so "Install app" and offline lessons work from Live Server too).
if ('serviceWorker' in navigator && !location.pathname.includes('/modern/')) navigator.serviceWorker.register('./service-worker.js');
loadContents().then(() => { updateProgress(); if (shouldGateForProfile()) renderGate(); else showHome(); }).catch(() => { app.innerHTML = `<p class="notice bad">${t('error.loadIndex')}</p>`; });
