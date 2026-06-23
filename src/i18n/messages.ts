/**
 * Agape — message catalog (i18n).
 *
 * Single source of truth for every user-visible string. Each key has
 * an English and Spanish translation. The Spanish translations are
 * drafts — every Spanish string is marked `data-translation="draft"`
 * in the rendered HTML so a reviewer (the client, or a Spanish-
 * speaking reviewer) can find them and swap in the official copy at
 * handoff.
 *
 * Why a single catalog vs per-section files:
 *   - Translation review is a single grep: `grep data-translation`
 *   - The orchestrator can scan for unfinished translations as a
 *     build-time gate (TODO at handoff)
 *   - Less plumbing than per-section message bundles
 *
 * Variable interpolation:
 *   - Strings can contain `{name}`-style placeholders. Pass a vars
 *     object to `t(key, vars)` to substitute.
 *
 * Locale detection:
 *   - /<company>/tier-N/         → 'en'
 *   - /<company>/tier-N/es/      → 'es'
 *   - Anything else              → 'en' (default)
 *
 * Adding a new locale:
 *   - Add a new key to MESSAGES with the same set of keys as 'en'
 *   - Add the locale code to Locale type
 *   - Add a path-prefix match in detectLocale()
 *   - Add a link to the Navbar's language toggle
 */

export type Locale = 'en' | 'es';

export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Detect the locale from a pathname. The check is intentionally
 * permissive: if `/es/` appears anywhere in the path it's ES,
 * otherwise default to English. The multi-tenant routing means paths
 * can take shapes like `/agape/tier-2/es/` for ES pages and
 * `/agape/tier-2/` for EN pages.
 */
export function detectLocale(pathname: string): Locale {
  if (/\/es(\/|$)/.test(pathname)) return 'es';
  return DEFAULT_LOCALE;
}

type StringMap = Record<string, string>;

const en: StringMap = {
  // ── Navbar ───────────────────────────────────────────────────────
  'nav.brandLabel': 'Agape Counseling Services — back to top',
  'nav.about': 'About',
  'nav.services': 'Services',
  'nav.faq': 'FAQ',
  'nav.contact': 'Contact',
  'nav.legal': 'Legal',
  'nav.newsletter': 'Insights',
  'nav.callCta': 'Call Agape Counseling Services at (609) 242-0086',
  'nav.callCtaShort': 'Call',
  'nav.callCtaFull': '(609) 242-0086',
  'nav.lang.en': 'EN',
  'nav.lang.es': 'ES',
  'nav.lang.toggleToEnglish': 'Switch to English',
  'nav.lang.toggleToSpanish': 'Cambiar a español',

  // ── Hero ─────────────────────────────────────────────────────────
  'hero.eyebrow': 'Outpatient substance use disorder counseling',
  'hero.headline': 'We can help you find a path forward.',
  'hero.subhead':
    'Talk with a licensed clinician in Lanoka Harbor, NJ. Bilingual. Medicaid accepted. No wait list.',
  'hero.ctaCall': 'Call (609) 242-0086',
  'hero.ctaMessage': 'Or send us a message',
  'hero.stat.sameWeek.label': 'Same-week appointments',
  'hero.stat.sameWeek.value': 'No wait list.',
  'hero.stat.bilingual.label': 'Bilingual services',
  'hero.stat.bilingual.value': 'English & Spanish.',
  'hero.stat.medicaid.label': 'Medicaid accepted',
  'hero.stat.medicaid.value': 'Plus uninsured options.',
  'hero.stat.confidential.label': 'Confidential',
  'hero.stat.confidential.value': '42 CFR Part 2 protected.',

  // ── Access banner ────────────────────────────────────────────────
  'access.heading': 'Access information',
  'access.body':
    'We are now offering {bilingual}, with the addition of taking {medicaid}, {noWait}, and options for uninsured individuals.',
  'access.body.bilingual': 'bilingual services',
  'access.body.medicaid': 'Medicaid',
  'access.body.noWait': 'no wait time',
  'access.prompt':
    'Give us a call today for more information: {phone}',

  // ── Services grid ────────────────────────────────────────────────
  'services.heading': 'Services',
  'services.subhead':
    'Outpatient care for substance use disorder and related concerns. Confidential, evidence-based, individualized.',
  'services.ctaAsk': 'Ask about {service}',
  'service.iop.name': 'Intensive Outpatient Program (IOP)',
  'service.iop.summary':
    'Three evenings a week plus a weekly individual session. For people who need structured support without an inpatient stay.',
  'service.individual.name': 'Individualized Counseling',
  'service.individual.summary':
    'One-on-one sessions with a licensed clinician. Tailored to your goals — recovery, anger management, co-occurring concerns.',
  'service.anger.name': 'Anger Management',
  'service.anger.summary':
    'State-approved group and individual sessions. Trigger identification, healthy communication, court / referral paperwork handled.',
  'service.reiki.name': 'Reiki & Meditation',
  'service.reiki.summary':
    'Complementary practices that pair with clinical care. Stress reduction, mindfulness, and gentle body-based grounding.',

  // ── About / Mission ──────────────────────────────────────────────
  'about.eyebrow': 'About Agape',
  'about.heading': 'Counseling rooted in Ocean County since the 1990s.',
  'about.p1':
    'Agape Counseling Services is a certified 501(c)(3) nonprofit founded in the 1990s.',
  'about.p2': 'We serve Ocean County, NJ from our Lanoka Harbor location.',
  'about.p3':
    'Our team helps people struggling with substance use disorder find and keep recovery through evidence-based outpatient care.',
  'about.ein': 'Agape is a 501(c)(3) nonprofit organization. EIN on file.',

  // ── Testimonials ─────────────────────────────────────────────────
  'testimonials.heading': 'What people say',
  'testimonials.intro':
    'With consent. Real first names only, no identifying details. Every testimonial we publish is backed by a signed 42 CFR Part 2 authorization on file.',
  'testimonials.sampleBadge': 'Sample',
  'testimonials.sampleTitle': 'Demo sample — redacted',

  // ── FAQ ──────────────────────────────────────────────────────────
  'faq.heading': 'Frequently asked questions',
  'faq.intro':
    'Quick answers to the questions our intake team hears most often. Don\u2019t see yours? Call us at (609) 242-0086.',
  'faq.q.medicaid': 'Do you accept Medicaid?',
  'faq.a.medicaid':
    'Yes. We accept Medicaid and most major insurance plans. We also offer options for uninsured individuals and same-week intake. Call (609) 242-0086 to confirm your specific plan and to schedule an intake.',
  'faq.q.iopLength': 'How long is the IOP program?',
  'faq.a.iopLength':
    'The Intensive Outpatient Program runs three evenings per week with a weekly 30-minute individual session. Length depends on clinical need; most participants complete the program in 8\u201312 weeks. We will work with you on the timeline that fits your recovery.',
  'faq.q.evenings': 'Do you offer evening hours?',
  'faq.a.evenings':
    'Yes. We are open Monday through Friday, 9:00 AM to 9:00 PM, and our IOP groups typically meet in the evening so people can attend around work or family schedules. Weekend sessions are by appointment.',
  'faq.q.bilingual': 'Do you offer services in Spanish?',
  'faq.a.bilingual':
    'Yes — we offer bilingual services. Call us at (609) 242-0086 and let us know you would prefer Spanish; we will match you with a Spanish-speaking clinician.',
  'faq.q.firstSession': 'Is the first session free?',
  'faq.a.firstSession':
    'Your first contact is a free, confidential phone call with our intake team — no commitment, no charge. If you decide to move forward, we schedule a clinical assessment at our standard rate. Many insurance plans cover the assessment. Call (609) 242-0086 to start.',
  'faq.q.adolescents': 'Do you see adolescents?',
  'faq.a.adolescents':
    'Our primary programs serve adults. If you are looking for adolescent substance use services, call us at (609) 242-0086 and we will refer you to an appropriate partner program in Ocean County.',
  'faq.q.transportation': 'Do you provide transportation?',
  'faq.a.transportation':
    'We do not provide transportation directly, but our office is on U.S. Route 9 in Lanoka Harbor with easy access from Ocean County. Call (609) 242-0086 if transportation is a barrier — we will help you think through options including public transit, family support, and community resources.',
  'faq.q.angerManagement': 'Is your anger management program state-approved?',
  'faq.a.angerManagement':
    'Yes. Our anger management program is state-approved and includes trigger identification, healthy communication, and optional reiki and mindfulness components. Call (609) 242-0086 for current group availability and court / referral paperwork.',
  'faq.q.impairedDriving': 'Do you work with NJ DOT referrals for impaired driving?',
  'faq.a.impairedDriving':
    'Yes — we are an NJ DOT\u2013approved provider for impaired-driver counseling. Call (609) 242-0086 with your referral paperwork in hand; we will explain the steps, schedule your intake, and confirm the program length required by your case.',
  'faq.q.waitList': 'Is there a wait list?',
  'faq.a.waitList':
    'No. We offer same-week intake for most programs. Call (609) 242-0086 today — if we cannot see you this week, we will tell you on the phone and help you find a faster path to care.',

  // ── Newsletter ───────────────────────────────────────────────────
  'newsletter.heading': 'Insights from our clinicians',
  'newsletter.body':
    'Recovery, family support, and navigating Ocean County resources — once a month, no spam. Unsubscribe anytime.',
  'newsletter.emailLabel': 'Email address',
  'newsletter.emailPlaceholder': 'you@example.com',
  'newsletter.submit': 'Subscribe',
  'newsletter.submitting': 'Subscribing...',
  'newsletter.consent':
    'I agree to receive monthly insights from Agape Counseling Services. I understand this is not for clinical or emergency communication — for help now, call {phone} or {crisisLine}.',
  'newsletter.successTitle': 'You\u2019re subscribed.',
  'newsletter.successBody':
    'Look out for a welcome email with our next insights. If you don\u2019t see it within an hour, check your spam folder or email us at {email}.',

  // ── Contact ──────────────────────────────────────────────────────
  'contact.heading': 'Get in touch',
  'contact.subhead': 'Send a message and we will reply within one business day.',
  'contact.eyebrow': 'Visit or call',
  'contact.subheadOffice': 'We are in Lanoka Harbor.',
  'contact.office': 'Office',
  'contact.phoneLabel': 'Phone',
  'contact.emailLabel': 'Email',
  'contact.hoursLabel': 'Hours',
  'contact.callBtn': 'Call {phone}',
  'contact.viewLargerMap': 'View larger map',
  'contact.formHeading': 'Send a message',
  'contact.formSubhead': 'We typically reply within one business day.',
  'contact.field.name': 'Name',
  'contact.field.email': 'Email',
  'contact.field.phone': 'Phone',
  'contact.field.phonePlaceholder': '(609) 555-0100',
  'contact.field.preferred': 'Preferred contact method',
  'contact.field.preferredEmail': 'Email',
  'contact.field.preferredPhone': 'Phone',
  'contact.field.message': 'How can we help?',
  'contact.field.messagePlaceholder': 'I\u2019d like to learn more about...',
  'contact.field.messageHelper':
    'Please don\u2019t include medical, substance-use, or other sensitive health information. For emergencies, call {911} or {988}.',
  'contact.consent':
    'I understand that this form is not monitored 24/7, is not for emergency clinical situations, and is not a secure channel for sensitive medical information. If you are having an emergency, please call 911 or your local emergency services immediately.',
  'contact.submit': 'Send message',
  'contact.submitting': 'Sending...',
  'contact.helper.afterSubmit': 'We typically reply within one business day.',
  'contact.successTitle': 'Thanks!',
  'contact.successBody':
    'We received your message and will reply within one business day. If you need to reach us sooner, call {phone}.',
  'contact.errorBody':
    'Please call us at {phone} or email {email}.',
  'contact.networkErrorBody': 'Please call us at {phone}.',

  // ── Crisis resources ─────────────────────────────────────────────
  'crisis.heading': 'If you are in crisis',
  'crisis.body':
    'This site is not monitored 24/7. If you or someone you know is in crisis, call or text one of the lines below — they are free, confidential, and available right now.',
  'crisis.988.label': '988 Suicide & Crisis Lifeline',
  'crisis.988.detail': 'Call or text 988. Available 24/7, free, confidential.',
  'crisis.hopeline.label': 'NJ Hopeline',
  'crisis.hopeline.detail':
    '1-855-654-6735. New Jersey-based, free, confidential. Available 24/7.',
  'crisis.text.label': 'Crisis Text Line',
  'crisis.text.detail': 'Text HOME to 741741. Available 24/7 in the US and Canada.',
  'crisis.lgbtq.label': 'Trevor Project (LGBTQ+ youth)',
  'crisis.lgbtq.detail': '1-866-488-7386. Available 24/7.',
  'crisis.911.label': 'Emergency',
  'crisis.911.detail': 'Call 911 for immediate emergency help.',

  // ── Footer ───────────────────────────────────────────────────────
  'footer.hours.heading': 'Hours',
  'footer.hours.weekday': 'Mon\u2013Fri 9:00 AM \u2013 9:00 PM',
  'footer.hours.weekend': 'Sat\u2013Sun by appointment only',
  'footer.contact.heading': 'Contact',
  'footer.connect.heading': 'Connect',
  'footer.connect.facebook': 'Facebook',
  'footer.connect.googleReviews': 'Google reviews',
  'footer.legal.part2': '42 CFR Part 2 Notice',
  'footer.legal.part2Body':
    'Agape Counseling Services is required by {part2} to protect the confidentiality of substance use disorder treatment records. Information that you provide through this website is {not} a substitute for clinical care and does not establish a treatment relationship. If you are seeking treatment, please call us at {phone}.',
  'footer.legal.privacy': 'Privacy notice',
  'footer.legal.privacyP1':
    'This site does not use tracking cookies. We do not sell or share your information with third parties for marketing.',
  'footer.legal.privacyP2':
    'Form submissions are sent via {web3formsLink} and stored per that provider\u2019s privacy policy. Please do not submit medical, substance-use, or other sensitive health information through this form — it is for general inquiries only.',
  'footer.legal.privacyP3':
    'We use Cloudflare Web Analytics to count visits. This service is cookieless, does not profile visitors, and does not share data with third parties.',
  'footer.legal.privacyEffective': 'Effective date: {date}.',
  'footer.legal.privacyContact': 'Privacy questions: {email}.',
  'footer.legal.disclaimers': 'Disclaimers',
  'footer.legal.einLabel': 'EIN on file.',
  'footer.legal.disclaimerClinicians':
    'Outpatient counseling services are provided by licensed clinicians.',
  'footer.legal.disclaimerNoRelationship':
    'This website does not establish a clinician\u2013patient relationship.',
  'footer.legal.disclaimerNoAdvice':
    'This website does not provide medical advice, diagnosis, or treatment.',
  'footer.legal.disclaimerCopyright':
    '© {year} Agape Counseling Services. All rights reserved.',
  'footer.legal.accessibility': 'Accessibility',
  'footer.legal.accessibilityBody':
    'Agape is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.',
  'footer.legal.accessibilityContact':
    'If you encounter an accessibility barrier, please contact us at {phone} or {email}.',
  'footer.legal.accessibilityConformance':
    'This site targets WCAG 2.1 AA conformance.',
  'footer.builtWith': 'Built on the open web. Source available under MIT.',
  'footer.builtWithStack': 'Astro 4 · Tailwind 3 · DaisyUI 4 · GitHub Pages',
};

const es: StringMap = {
  // ── Navbar ───────────────────────────────────────────────────────
  'nav.brandLabel': 'Agape Counseling Services — volver al inicio',
  'nav.about': 'Acerca de',
  'nav.services': 'Servicios',
  'nav.faq': 'Preguntas',
  'nav.contact': 'Contacto',
  'nav.legal': 'Legal',
  'nav.newsletter': 'Reflexiones',
  'nav.callCta': 'Llamar a Agape Counseling Services al (609) 242-0086',
  'nav.callCtaShort': 'Llamar',
  'nav.callCtaFull': '(609) 242-0086',
  'nav.lang.en': 'EN',
  'nav.lang.es': 'ES',
  'nav.lang.toggleToEnglish': 'Cambiar a inglés',
  'nav.lang.toggleToSpanish': 'Switch to English',

  // ── Hero ─────────────────────────────────────────────────────────
  'hero.eyebrow': 'Tratamiento ambulatorio para trastornos por uso de sustancias',
  'hero.headline': 'Podemos ayudarle a encontrar un camino a seguir.',
  'hero.subhead':
    'Hable con un clínico con licencia en Lanoka Harbor, NJ. Bilingüe. Aceptamos Medicaid. Sin lista de espera.',
  'hero.ctaCall': 'Llamar al (609) 242-0086',
  'hero.ctaMessage': 'O envíenos un mensaje',
  'hero.stat.sameWeek.label': 'Citas esta misma semana',
  'hero.stat.sameWeek.value': 'Sin lista de espera.',
  'hero.stat.bilingual.label': 'Servicios bilingües',
  'hero.stat.bilingual.value': 'Inglés y español.',
  'hero.stat.medicaid.label': 'Aceptamos Medicaid',
  'hero.stat.medicaid.value': 'Y opciones sin seguro.',
  'hero.stat.confidential.label': 'Confidencial',
  'hero.stat.confidential.value': 'Protegido por 42 CFR Parte 2.',

  // ── Access banner ────────────────────────────────────────────────
  'access.heading': 'Información de acceso',
  'access.body':
    'Ahora ofrecemos {bilingual}, y aceptamos {medicaid}, {noWait}, y opciones para personas sin seguro.',
  'access.body.bilingual': 'servicios bilingües',
  'access.body.medicaid': 'Medicaid',
  'access.body.noWait': 'sin tiempo de espera',
  'access.prompt': 'Llámenos hoy para más información: {phone}',

  // ── Services grid ────────────────────────────────────────────────
  'services.heading': 'Servicios',
  'services.subhead':
    'Atención ambulatoria para trastornos por uso de sustancias y preocupaciones relacionadas. Confidencial, basada en evidencia, individualizada.',
  'services.ctaAsk': 'Preguntar sobre {service}',
  'service.iop.name': 'Programa Ambulatorio Intensivo (IOP)',
  'service.iop.summary':
    'Tres tardes por semana más una sesión individual semanal. Para personas que necesitan apoyo estructurado sin internación.',
  'service.individual.name': 'Asesoramiento Individualizado',
  'service.individual.summary':
    'Sesiones uno a uno con un clínico con licencia. Adaptado a sus metas — recuperación, manejo de la ira, preocupaciones concurrentes.',
  'service.anger.name': 'Manejo de la Ira',
  'service.anger.summary':
    'Sesiones grupales e individuales aprobadas por el estado. Identificación de detonantes, comunicación saludable, documentación para tribunales / referencias.',
  'service.reiki.name': 'Reiki y Meditación',
  'service.reiki.summary':
    'Prácticas complementarias que acompañan la atención clínica. Reducción del estrés, atención plena y conexión suave con el cuerpo.',

  // ── About / Mission ──────────────────────────────────────────────
  'about.eyebrow': 'Acerca de Agape',
  'about.heading': 'Asesoramiento con raíces en el condado de Ocean desde los años 90.',
  'about.p1':
    'Agape Counseling Services es una organización sin fines de lucro 501(c)(3) certificada, fundada en los años 90.',
  'about.p2': 'Servimos al condado de Ocean, NJ desde nuestra oficina en Lanoka Harbor.',
  'about.p3':
    'Nuestro equipo ayuda a personas que enfrentan un trastorno por uso de sustancias a encontrar y mantener la recuperación mediante atención ambulatoria basada en evidencia.',
  'about.ein': 'Agape es una organización sin fines de lucro 501(c)(3). EIN registrado.',

  // ── Testimonials ─────────────────────────────────────────────────
  'testimonials.heading': 'Lo que dicen las personas',
  'testimonials.intro':
    'Con consentimiento. Solo nombres de pila, sin detalles de identificación. Cada testimonio publicado cuenta con una autorización firmada bajo 42 CFR Parte 2.',
  'testimonials.sampleBadge': 'Muestra',
  'testimonials.sampleTitle': 'Muestra de demostración — redactada',

  // ── FAQ ──────────────────────────────────────────────────────────
  'faq.heading': 'Preguntas frecuentes',
  'faq.intro':
    'Respuestas rápidas a las preguntas que nuestro equipo de admisión escucha con más frecuencia. ¿No ve la suya? Llámenos al (609) 242-0086.',
  'faq.q.medicaid': '¿Aceptan Medicaid?',
  'faq.a.medicaid':
    'Sí. Aceptamos Medicaid y la mayoría de los seguros principales. También ofrecemos opciones para personas sin seguro e ingreso esta misma semana. Llame al (609) 242-0086 para confirmar su plan específico y agendar una admisión.',
  'faq.q.iopLength': '¿Cuánto dura el programa IOP?',
  'faq.a.iopLength':
    'El Programa Ambulatorio Intensivo se reúne tres tardes por semana con una sesión individual semanal de 30 minutos. La duración depende de la necesidad clínica; la mayoría completa el programa en 8 a 12 semanas. Trabajaremos con usted en el cronograma que se ajuste a su recuperación.',
  'faq.q.evenings': '¿Ofrecen horario nocturno?',
  'faq.a.evenings':
    'Sí. Abrimos de lunes a viernes, de 9:00 AM a 9:00 PM, y nuestros grupos IOP suelen reunirse por la tarde para que las personas puedan asistir fuera del horario laboral o familiar. Las sesiones de fin de semana son con cita previa.',
  'faq.q.bilingual': '¿Ofrecen servicios en español?',
  'faq.a.bilingual':
    'Sí — ofrecemos servicios bilingües. Llámenos al (609) 242-0086 y díganos que prefiere español; le asignaremos un clínico hispanohablante.',
  'faq.q.firstSession': '¿La primera sesión es gratuita?',
  'faq.a.firstSession':
    'Su primer contacto es una llamada telefónica gratuita y confidencial con nuestro equipo de admisión — sin compromiso ni costo. Si decide continuar, agendamos una evaluación clínica a nuestra tarifa estándar. Muchos planes de seguro cubren la evaluación. Llame al (609) 242-0086 para comenzar.',
  'faq.q.adolescents': '¿Atienden a adolescentes?',
  'faq.a.adolescents':
    'Nuestros programas principales atienden adultos. Si busca servicios para adolescentes con trastorno por uso de sustancias, llámenos al (609) 242-0086 y le referiremos a un programa asociado apropiado en el condado de Ocean.',
  'faq.q.transportation': '¿Ofrecen transporte?',
  'faq.a.transportation':
    'No ofrecemos transporte directamente, pero nuestra oficina está en la Ruta 9 de EE. UU. en Lanoka Harbor, con fácil acceso desde el condado de Ocean. Llame al (609) 242-0086 si el transporte es una barrera — le ayudaremos a evaluar opciones como transporte público, apoyo familiar y recursos comunitarios.',
  'faq.q.angerManagement': '¿Su programa de manejo de la ira está aprobado por el estado?',
  'faq.a.angerManagement':
    'Sí. Nuestro programa de manejo de la ira está aprobado por el estado e incluye identificación de detonantes, comunicación saludable y componentes opcionales de reiki y atención plena. Llame al (609) 242-0086 para conocer la disponibilidad actual de grupos y la documentación para tribunales / referencias.',
  'faq.q.impairedDriving': '¿Trabajan con referencias del NJ DOT para conducción bajo los efectos del alcohol?',
  'faq.a.impairedDriving':
    'Sí — somos un proveedor aprobado por el NJ DOT para asesoramiento de conductores bajo influencia. Llame al (609) 242-0086 con la documentación de su referencia; le explicaremos los pasos, agendaremos su admisión y confirmaremos la duración del programa requerida por su caso.',
  'faq.q.waitList': '¿Hay lista de espera?',
  'faq.a.waitList':
    'No. Ofrecemos admisión esta misma semana para la mayoría de los programas. Llame hoy al (609) 242-0086 — si no podemos atenderle esta semana, se lo diremos por teléfono y le ayudaremos a encontrar un camino más rápido a la atención.',

  // ── Newsletter ───────────────────────────────────────────────────
  'newsletter.heading': 'Reflexiones de nuestros clínicos',
  'newsletter.body':
    'Recuperación, apoyo familiar y cómo navegar los recursos del condado de Ocean — una vez al mes, sin spam. Cancele cuando quiera.',
  'newsletter.emailLabel': 'Correo electrónico',
  'newsletter.emailPlaceholder': 'usted@ejemplo.com',
  'newsletter.submit': 'Suscribirse',
  'newsletter.submitting': 'Suscribiendo...',
  'newsletter.consent':
    'Acepto recibir reflexiones mensuales de Agape Counseling Services. Entiendo que esto no es para comunicación clínica ni de emergencia — para ayuda inmediata, llame al {phone} o al {crisisLine}.',
  'newsletter.successTitle': '¡Suscripción confirmada!',
  'newsletter.successBody':
    'Esté atento a un correo de bienvenida con nuestras próximas reflexiones. Si no lo ve en una hora, revise su carpeta de spam o escríbanos a {email}.',

  // ── Contact ──────────────────────────────────────────────────────
  'contact.heading': 'Contáctenos',
  'contact.subhead':
    'Envíenos un mensaje y le responderemos dentro de un día hábil.',
  'contact.eyebrow': 'Visítenos o llámenos',
  'contact.subheadOffice': 'Estamos en Lanoka Harbor.',
  'contact.office': 'Oficina',
  'contact.phoneLabel': 'Teléfono',
  'contact.emailLabel': 'Correo electrónico',
  'contact.hoursLabel': 'Horario',
  'contact.callBtn': 'Llamar al {phone}',
  'contact.viewLargerMap': 'Ver mapa más grande',
  'contact.formHeading': 'Enviar un mensaje',
  'contact.formSubhead': 'Normalmente respondemos dentro de un día hábil.',
  'contact.field.name': 'Nombre',
  'contact.field.email': 'Correo electrónico',
  'contact.field.phone': 'Teléfono',
  'contact.field.phonePlaceholder': '(609) 555-0100',
  'contact.field.preferred': 'Método de contacto preferido',
  'contact.field.preferredEmail': 'Correo',
  'contact.field.preferredPhone': 'Teléfono',
  'contact.field.message': '¿Cómo podemos ayudarle?',
  'contact.field.messagePlaceholder': 'Me gustaría saber más sobre...',
  'contact.field.messageHelper':
    'Por favor no incluya información médica, de uso de sustancias ni otra información de salud sensible. En caso de emergencia, llame al {911} o al {988}.',
  'contact.consent':
    'Entiendo que este formulario no se supervisa 24/7, no es para situaciones clínicas de emergencia y no es un canal seguro para información médica sensible. Si tiene una emergencia, llame al 911 o a los servicios de emergencia locales de inmediato.',
  'contact.submit': 'Enviar mensaje',
  'contact.submitting': 'Enviando...',
  'contact.helper.afterSubmit':
    'Normalmente respondemos dentro de un día hábil.',
  'contact.successTitle': '¡Gracias!',
  'contact.successBody':
    'Recibimos su mensaje y le responderemos dentro de un día hábil. Si necesita contactarnos antes, llame al {phone}.',
  'contact.errorBody': 'Por favor llámenos al {phone} o escríbanos a {email}.',
  'contact.networkErrorBody': 'Por favor llámenos al {phone}.',

  // ── Crisis resources ─────────────────────────────────────────────
  'crisis.heading': 'Si está en crisis',
  'crisis.body':
    'Este sitio no se supervisa 24/7. Si usted o alguien que conoce está en crisis, llame o envíe un mensaje de texto a una de las líneas siguientes — son gratuitas, confidenciales y están disponibles ahora mismo.',
  'crisis.988.label': 'Línea 988 de Suicidio y Crisis',
  'crisis.988.detail':
    'Llame o envíe un mensaje de texto al 988. Disponible 24/7, gratuito y confidencial.',
  'crisis.hopeline.label': 'NJ Hopeline',
  'crisis.hopeline.detail':
    '1-855-654-6735. Con base en Nueva Jersey, gratuito y confidencial. Disponible 24/7.',
  'crisis.text.label': 'Línea de Texto de Crisis',
  'crisis.text.detail':
    'Envíe HOME al 741741. Disponible 24/7 en EE. UU. y Canadá.',
  'crisis.lgbtq.label': 'Trevor Project (jóvenes LGBTQ+)',
  'crisis.lgbtq.detail': '1-866-488-7386. Disponible 24/7.',
  'crisis.911.label': 'Emergencia',
  'crisis.911.detail': 'Llame al 911 para ayuda inmediata de emergencia.',

  // ── Footer ───────────────────────────────────────────────────────
  'footer.hours.heading': 'Horario',
  'footer.hours.weekday': 'Lun\u2013Vie 9:00 AM \u2013 9:00 PM',
  'footer.hours.weekend': 'Sáb\u2013Dom solo con cita previa',
  'footer.contact.heading': 'Contacto',
  'footer.connect.heading': 'Conectar',
  'footer.connect.facebook': 'Facebook',
  'footer.connect.googleReviews': 'Reseñas de Google',
  'footer.legal.part2': 'Aviso 42 CFR Parte 2',
  'footer.legal.part2Body':
    'Agape Counseling Services está obligada por {part2} a proteger la confidencialidad de los registros de tratamiento por trastorno por uso de sustancias. La información que usted proporcione a través de este sitio web {not} sustituye la atención clínica ni establece una relación de tratamiento. Si busca tratamiento, llámenos al {phone}.',
  'footer.legal.privacy': 'Aviso de privacidad',
  'footer.legal.privacyP1':
    'Este sitio no utiliza cookies de seguimiento. No vendemos ni compartimos su información con terceros con fines de marketing.',
  'footer.legal.privacyP2':
    'Los envíos del formulario se envían a través de {web3formsLink} y se almacenan según la política de privacidad de ese proveedor. Por favor no envíe información médica, de uso de sustancias ni otra información de salud sensible a través de este formulario — es solo para consultas generales.',
  'footer.legal.privacyP3':
    'Usamos Cloudflare Web Analytics para contar las visitas. Este servicio no utiliza cookies, no perfila a los visitantes y no comparte datos con terceros.',
  'footer.legal.privacyEffective': 'Fecha de vigencia: {date}.',
  'footer.legal.privacyContact': 'Preguntas sobre privacidad: {email}.',
  'footer.legal.disclaimers': 'Avisos',
  'footer.legal.einLabel': 'EIN registrado.',
  'footer.legal.disclaimerClinicians':
    'Los servicios de asesoramiento ambulatorio son brindados por clínicos con licencia.',
  'footer.legal.disclaimerNoRelationship':
    'Este sitio web no establece una relación clínico\u2013paciente.',
  'footer.legal.disclaimerNoAdvice':
    'Este sitio web no proporciona consejo médico, diagnóstico ni tratamiento.',
  'footer.legal.disclaimerCopyright':
    '© {year} Agape Counseling Services. Todos los derechos reservados.',
  'footer.legal.accessibility': 'Accesibilidad',
  'footer.legal.accessibilityBody':
    'Agape está comprometida con garantizar la accesibilidad digital para personas con discapacidades. Mejoramos continuamente la experiencia del usuario para todos y aplicamos los estándares de accesibilidad relevantes.',
  'footer.legal.accessibilityContact':
    'Si encuentra una barrera de accesibilidad, contáctenos al {phone} o al {email}.',
  'footer.legal.accessibilityConformance':
    'Este sitio apunta a la conformidad con WCAG 2.1 AA.',
  'footer.builtWith':
    'Construido en la web abierta. Código fuente disponible bajo MIT.',
  'footer.builtWithStack':
    'Astro 4 · Tailwind 3 · DaisyUI 4 · GitHub Pages',
};

export const MESSAGES: Record<Locale, StringMap> = { en, es };

/**
 * Translation function. Looks up a key in the locale's catalog,
 * falling back to English if missing, then to the key itself if the
 * key is unknown in both.
 *
 * Variables are substituted via `{name}` placeholders:
 *   t('es', 'access.body', { bilingual: 'servicios bilingües', ... })
 */
export function t(locale: Locale, key: string, vars?: Record<string, string>): string {
  const catalog = MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];
  let template = catalog[key] ?? MESSAGES[DEFAULT_LOCALE][key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      template = template.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
  }
  return template;
}

/**
 * Convenience: returns a `t` function bound to a locale. Use this in
 * components:
 *
 *   const translate = useTranslations(detectLocale(Astro.url.pathname));
 *   <h1>{translate('hero.headline')}</h1>
 */
export function useTranslations(locale: Locale) {
  return (key: string, vars?: Record<string, string>) => t(locale, key, vars);
}
