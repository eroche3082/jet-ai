import { SupportedLanguage } from "./i18n";

// The translations object contains all the translations for the application
// Organized by language code and then by key
// This allows for easy lookup of translations

// Common UI elements and navigation
const commonTranslations = {
  en: {
    // Navigation
    home: "Home",
    destinations: "Destinations",
    blog: "Travel Blog",
    features: "AI Features",
    community: "Travel Community",
    login: "Log In",
    signup: "Sign Up",
    logout: "Sign Out",
    dashboard: "Dashboard",
    membership: "Membership",
    itineraries: "My Itineraries",
    profile: "Profile",
    settings: "Settings",
    
    // Actions
    search: "Search",
    book: "Book Now",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    submit: "Submit",
    
    // AI Assistant
    assistant_greeting: "Welcome to JET AI, your personal travel companion. How can I help you today?",
    assistant_placeholder: "Ask me anything about travel...",
    assistant_thinking: "Thinking...",
    assistant_error: "Sorry, I'm having trouble connecting. Please try again.",
    
    // Footer
    about_us: "About Us",
    contact: "Contact",
    privacy_policy: "Privacy Policy",
    terms_of_service: "Terms of Service",
    copyright: "© 2025 JET AI. All rights reserved.",
    
    // General
    loading: "Loading...",
    error: "An error occurred. Please try again.",
    no_results: "No results found.",
    welcome_back: "Welcome back",
    language: "Language",
  },
  
  es: {
    // Navigation
    home: "Inicio",
    destinations: "Destinos",
    blog: "Blog de Viajes",
    features: "Funciones IA",
    community: "Comunidad de Viajeros",
    login: "Iniciar Sesión",
    signup: "Registrarse",
    logout: "Cerrar Sesión",
    dashboard: "Panel de Control",
    membership: "Membresía",
    itineraries: "Mis Itinerarios",
    profile: "Perfil",
    settings: "Configuración",
    
    // Actions
    search: "Buscar",
    book: "Reservar Ahora",
    save: "Guardar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    back: "Atrás",
    next: "Siguiente",
    submit: "Enviar",
    
    // AI Assistant
    assistant_greeting: "Bienvenido a JET AI, tu compañero de viaje personal. ¿En qué puedo ayudarte hoy?",
    assistant_placeholder: "Pregúntame cualquier cosa sobre viajes...",
    assistant_thinking: "Pensando...",
    assistant_error: "Lo siento, estoy teniendo problemas para conectarme. Por favor, inténtalo de nuevo.",
    
    // Footer
    about_us: "Sobre Nosotros",
    contact: "Contacto",
    privacy_policy: "Política de Privacidad",
    terms_of_service: "Términos de Servicio",
    copyright: "© 2025 JET AI. Todos los derechos reservados.",
    
    // General
    loading: "Cargando...",
    error: "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
    no_results: "No se encontraron resultados.",
    welcome_back: "Bienvenido de nuevo",
    language: "Idioma",
  },
  
  fr: {
    // Navigation
    home: "Accueil",
    destinations: "Destinations",
    blog: "Blog de Voyage",
    features: "Fonctionnalités IA",
    community: "Communauté de Voyageurs",
    login: "Connexion",
    signup: "S'inscrire",
    logout: "Déconnexion",
    dashboard: "Tableau de Bord",
    membership: "Adhésion",
    itineraries: "Mes Itinéraires",
    profile: "Profil",
    settings: "Paramètres",
    
    // Actions
    search: "Rechercher",
    book: "Réserver Maintenant",
    save: "Enregistrer",
    cancel: "Annuler",
    confirm: "Confirmer",
    back: "Retour",
    next: "Suivant",
    submit: "Soumettre",
    
    // AI Assistant
    assistant_greeting: "Bienvenue sur JET AI, votre compagnon de voyage personnel. Comment puis-je vous aider aujourd'hui?",
    assistant_placeholder: "Posez-moi n'importe quelle question sur les voyages...",
    assistant_thinking: "Réflexion en cours...",
    assistant_error: "Désolé, j'ai des difficultés à me connecter. Veuillez réessayer.",
    
    // Footer
    about_us: "À Propos de Nous",
    contact: "Contact",
    privacy_policy: "Politique de Confidentialité",
    terms_of_service: "Conditions d'Utilisation",
    copyright: "© 2025 JET AI. Tous droits réservés.",
    
    // General
    loading: "Chargement...",
    error: "Une erreur s'est produite. Veuillez réessayer.",
    no_results: "Aucun résultat trouvé.",
    welcome_back: "Bon retour",
    language: "Langue",
  },
  
  pt: {
    // Navigation
    home: "Início",
    destinations: "Destinos",
    blog: "Blog de Viagem",
    features: "Recursos de IA",
    community: "Comunidade de Viajantes",
    login: "Entrar",
    signup: "Cadastrar",
    logout: "Sair",
    dashboard: "Painel de Controle",
    membership: "Assinatura",
    itineraries: "Meus Roteiros",
    profile: "Perfil",
    settings: "Configurações",
    
    // Actions
    search: "Pesquisar",
    book: "Reservar Agora",
    save: "Salvar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    back: "Voltar",
    next: "Próximo",
    submit: "Enviar",
    
    // AI Assistant
    assistant_greeting: "Bem-vindo ao JET AI, seu companheiro de viagem pessoal. Como posso ajudá-lo hoje?",
    assistant_placeholder: "Pergunte-me qualquer coisa sobre viagens...",
    assistant_thinking: "Pensando...",
    assistant_error: "Desculpe, estou tendo problemas para me conectar. Por favor, tente novamente.",
    
    // Footer
    about_us: "Sobre Nós",
    contact: "Contato",
    privacy_policy: "Política de Privacidade",
    terms_of_service: "Termos de Serviço",
    copyright: "© 2025 JET AI. Todos os direitos reservados.",
    
    // General
    loading: "Carregando...",
    error: "Ocorreu um erro. Por favor, tente novamente.",
    no_results: "Nenhum resultado encontrado.",
    welcome_back: "Bem-vindo de volta",
    language: "Idioma",
  },
  
  de: {
    // Navigation
    home: "Startseite",
    destinations: "Reiseziele",
    blog: "Reiseblog",
    features: "KI-Funktionen",
    community: "Reisegemeinschaft",
    login: "Anmelden",
    signup: "Registrieren",
    logout: "Abmelden",
    dashboard: "Dashboard",
    membership: "Mitgliedschaft",
    itineraries: "Meine Reiserouten",
    profile: "Profil",
    settings: "Einstellungen",
    
    // Actions
    search: "Suchen",
    book: "Jetzt Buchen",
    save: "Speichern",
    cancel: "Abbrechen",
    confirm: "Bestätigen",
    back: "Zurück",
    next: "Weiter",
    submit: "Absenden",
    
    // AI Assistant
    assistant_greeting: "Willkommen bei JET AI, Ihrem persönlichen Reisebegleiter. Wie kann ich Ihnen heute helfen?",
    assistant_placeholder: "Fragen Sie mich alles über das Reisen...",
    assistant_thinking: "Denke nach...",
    assistant_error: "Entschuldigung, ich habe Probleme bei der Verbindung. Bitte versuchen Sie es erneut.",
    
    // Footer
    about_us: "Über Uns",
    contact: "Kontakt",
    privacy_policy: "Datenschutzrichtlinie",
    terms_of_service: "Nutzungsbedingungen",
    copyright: "© 2025 JET AI. Alle Rechte vorbehalten.",
    
    // General
    loading: "Wird geladen...",
    error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    no_results: "Keine Ergebnisse gefunden.",
    welcome_back: "Willkommen zurück",
    language: "Sprache",
  },
  
  it: {
    // Navigation
    home: "Home",
    destinations: "Destinazioni",
    blog: "Blog di Viaggio",
    features: "Funzionalità IA",
    community: "Comunità di Viaggiatori",
    login: "Accedi",
    signup: "Registrati",
    logout: "Esci",
    dashboard: "Dashboard",
    membership: "Abbonamento",
    itineraries: "I Miei Itinerari",
    profile: "Profilo",
    settings: "Impostazioni",
    
    // Actions
    search: "Cerca",
    book: "Prenota Ora",
    save: "Salva",
    cancel: "Annulla",
    confirm: "Conferma",
    back: "Indietro",
    next: "Avanti",
    submit: "Invia",
    
    // AI Assistant
    assistant_greeting: "Benvenuto su JET AI, il tuo compagno di viaggio personale. Come posso aiutarti oggi?",
    assistant_placeholder: "Chiedimi qualsiasi cosa sui viaggi...",
    assistant_thinking: "Sto pensando...",
    assistant_error: "Mi dispiace, sto avendo problemi di connessione. Riprova, per favore.",
    
    // Footer
    about_us: "Chi Siamo",
    contact: "Contatti",
    privacy_policy: "Informativa sulla Privacy",
    terms_of_service: "Termini di Servizio",
    copyright: "© 2025 JET AI. Tutti i diritti riservati.",
    
    // General
    loading: "Caricamento...",
    error: "Si è verificato un errore. Riprova, per favore.",
    no_results: "Nessun risultato trovato.",
    welcome_back: "Bentornato",
    language: "Lingua",
  }
};

// Translations for safety, security, and community features
const safetyTranslations = {
  en: {
    safety_mode: "Safety Mode",
    emergency_mode: "Emergency Mode",
    safety_features: "Safety Features",
    emergency_contact: "Emergency Contact",
    local_emergency_numbers: "Local Emergency Numbers",
    safety_tips: "Safety Tips",
    geotracking: "GeoTracking",
    share_location: "Share Location",
    safe_zones: "Safe Zones",
    caution_zones: "Caution Zones",
    daily_checkin: "Daily Check-in",
    enable_max_safety: "Enable Maximum Safety Mode",
    travel_buddy: "Travel Buddy",
    women_safety: "Women Safety Features",
    solo_traveler: "Solo Traveler",
    travel_alert: "Travel Alert",
    health_safety: "Health & Safety"
  },
  es: {
    safety_mode: "Modo de Seguridad",
    emergency_mode: "Modo de Emergencia",
    safety_features: "Características de Seguridad",
    emergency_contact: "Contacto de Emergencia",
    local_emergency_numbers: "Números de Emergencia Locales",
    safety_tips: "Consejos de Seguridad",
    geotracking: "Seguimiento Geográfico",
    share_location: "Compartir Ubicación",
    safe_zones: "Zonas Seguras",
    caution_zones: "Zonas de Precaución",
    daily_checkin: "Registro Diario",
    enable_max_safety: "Activar Modo de Seguridad Máxima",
    travel_buddy: "Compañero de Viaje",
    women_safety: "Funciones de Seguridad para Mujeres",
    solo_traveler: "Viajero Solitario",
    travel_alert: "Alerta de Viaje",
    health_safety: "Salud y Seguridad"
  },
  fr: {
    safety_mode: "Mode Sécurité",
    emergency_mode: "Mode Urgence",
    safety_features: "Fonctionnalités de Sécurité",
    emergency_contact: "Contact d'Urgence",
    local_emergency_numbers: "Numéros d'Urgence Locaux",
    safety_tips: "Conseils de Sécurité",
    geotracking: "Géolocalisation",
    share_location: "Partager la Localisation",
    safe_zones: "Zones Sûres",
    caution_zones: "Zones de Prudence",
    daily_checkin: "Enregistrement Quotidien",
    enable_max_safety: "Activer le Mode Sécurité Maximum",
    travel_buddy: "Compagnon de Voyage",
    women_safety: "Fonctionnalités de Sécurité pour les Femmes",
    solo_traveler: "Voyageur Solo",
    travel_alert: "Alerte de Voyage",
    health_safety: "Santé et Sécurité"
  },
  pt: {
    safety_mode: "Modo de Segurança",
    emergency_mode: "Modo de Emergência",
    safety_features: "Recursos de Segurança",
    emergency_contact: "Contato de Emergência",
    local_emergency_numbers: "Números de Emergência Locais",
    safety_tips: "Dicas de Segurança",
    geotracking: "Rastreamento Geográfico",
    share_location: "Compartilhar Localização",
    safe_zones: "Zonas Seguras",
    caution_zones: "Zonas de Cautela",
    daily_checkin: "Check-in Diário",
    enable_max_safety: "Ativar Modo de Segurança Máxima",
    travel_buddy: "Companheiro de Viagem",
    women_safety: "Recursos de Segurança para Mulheres",
    solo_traveler: "Viajante Solitário",
    travel_alert: "Alerta de Viagem",
    health_safety: "Saúde e Segurança"
  },
  de: {
    safety_mode: "Sicherheitsmodus",
    emergency_mode: "Notfallmodus",
    safety_features: "Sicherheitsfunktionen",
    emergency_contact: "Notfallkontakt",
    local_emergency_numbers: "Lokale Notfallnummern",
    safety_tips: "Sicherheitstipps",
    geotracking: "Geo-Tracking",
    share_location: "Standort teilen",
    safe_zones: "Sichere Zonen",
    caution_zones: "Vorsichtszonen",
    daily_checkin: "Tägliches Check-in",
    enable_max_safety: "Maximalen Sicherheitsmodus aktivieren",
    travel_buddy: "Reisebegleiter",
    women_safety: "Sicherheitsfunktionen für Frauen",
    solo_traveler: "Alleinreisender",
    travel_alert: "Reisewarnung",
    health_safety: "Gesundheit und Sicherheit"
  },
  it: {
    safety_mode: "Modalità Sicurezza",
    emergency_mode: "Modalità Emergenza",
    safety_features: "Funzionalità di Sicurezza",
    emergency_contact: "Contatto di Emergenza",
    local_emergency_numbers: "Numeri di Emergenza Locali",
    safety_tips: "Consigli di Sicurezza",
    geotracking: "Geolocalizzazione",
    share_location: "Condividi Posizione",
    safe_zones: "Zone Sicure",
    caution_zones: "Zone di Cautela",
    daily_checkin: "Check-in Giornaliero",
    enable_max_safety: "Attiva Modalità Sicurezza Massima",
    travel_buddy: "Compagno di Viaggio",
    women_safety: "Funzionalità di Sicurezza per Donne",
    solo_traveler: "Viaggiatore Solitario",
    travel_alert: "Avviso di Viaggio",
    health_safety: "Salute e Sicurezza"
  }
};

// Membership and payments related translations
const membershipTranslations = {
  en: {
    plans: "Membership Plans",
    free_plan: "Free Plan",
    premium_plan: "Premium Plan",
    enterprise_plan: "Enterprise Plan",
    monthly: "Monthly",
    yearly: "Yearly",
    subscribe: "Subscribe",
    payment_method: "Payment Method",
    credit_card: "Credit Card",
    paypal: "PayPal",
    billing: "Billing",
    invoice: "Invoice",
    subscription: "Subscription",
    cancel_subscription: "Cancel Subscription",
    upgrade: "Upgrade",
    downgrade: "Downgrade",
    payment_success: "Payment Successful",
    payment_failed: "Payment Failed",
    current_plan: "Current Plan",
    expiration_date: "Expiration Date",
    benefits: "Benefits",
    rewards: "Rewards Points",
    redeem: "Redeem",
    qr_payment: "QR Payment",
    scan_to_pay: "Scan to Pay",
    wallet: "Digital Wallet",
    wallet_balance: "Wallet Balance"
  },
  es: {
    plans: "Planes de Membresía",
    free_plan: "Plan Gratuito",
    premium_plan: "Plan Premium",
    enterprise_plan: "Plan Empresarial",
    monthly: "Mensual",
    yearly: "Anual",
    subscribe: "Suscribirse",
    payment_method: "Método de Pago",
    credit_card: "Tarjeta de Crédito",
    paypal: "PayPal",
    billing: "Facturación",
    invoice: "Factura",
    subscription: "Suscripción",
    cancel_subscription: "Cancelar Suscripción",
    upgrade: "Mejorar",
    downgrade: "Reducir",
    payment_success: "Pago Exitoso",
    payment_failed: "Pago Fallido",
    current_plan: "Plan Actual",
    expiration_date: "Fecha de Vencimiento",
    benefits: "Beneficios",
    rewards: "Puntos de Recompensa",
    redeem: "Canjear",
    qr_payment: "Pago QR",
    scan_to_pay: "Escanear para Pagar",
    wallet: "Monedero Digital",
    wallet_balance: "Saldo del Monedero"
  },
  fr: {
    plans: "Plans d'Adhésion",
    free_plan: "Plan Gratuit",
    premium_plan: "Plan Premium",
    enterprise_plan: "Plan Entreprise",
    monthly: "Mensuel",
    yearly: "Annuel",
    subscribe: "S'abonner",
    payment_method: "Moyen de Paiement",
    credit_card: "Carte de Crédit",
    paypal: "PayPal",
    billing: "Facturation",
    invoice: "Facture",
    subscription: "Abonnement",
    cancel_subscription: "Annuler l'Abonnement",
    upgrade: "Mettre à Niveau",
    downgrade: "Rétrograder",
    payment_success: "Paiement Réussi",
    payment_failed: "Paiement Échoué",
    current_plan: "Plan Actuel",
    expiration_date: "Date d'Expiration",
    benefits: "Avantages",
    rewards: "Points de Récompense",
    redeem: "Échanger",
    qr_payment: "Paiement QR",
    scan_to_pay: "Scanner pour Payer",
    wallet: "Portefeuille Numérique",
    wallet_balance: "Solde du Portefeuille"
  },
  pt: {
    plans: "Planos de Assinatura",
    free_plan: "Plano Gratuito",
    premium_plan: "Plano Premium",
    enterprise_plan: "Plano Empresarial",
    monthly: "Mensal",
    yearly: "Anual",
    subscribe: "Assinar",
    payment_method: "Método de Pagamento",
    credit_card: "Cartão de Crédito",
    paypal: "PayPal",
    billing: "Faturamento",
    invoice: "Fatura",
    subscription: "Assinatura",
    cancel_subscription: "Cancelar Assinatura",
    upgrade: "Atualizar",
    downgrade: "Reduzir",
    payment_success: "Pagamento Bem-sucedido",
    payment_failed: "Falha no Pagamento",
    current_plan: "Plano Atual",
    expiration_date: "Data de Expiração",
    benefits: "Benefícios",
    rewards: "Pontos de Recompensa",
    redeem: "Resgatar",
    qr_payment: "Pagamento QR",
    scan_to_pay: "Digitalizar para Pagar",
    wallet: "Carteira Digital",
    wallet_balance: "Saldo da Carteira"
  },
  de: {
    plans: "Mitgliedschaftspläne",
    free_plan: "Kostenloser Plan",
    premium_plan: "Premium-Plan",
    enterprise_plan: "Unternehmensplan",
    monthly: "Monatlich",
    yearly: "Jährlich",
    subscribe: "Abonnieren",
    payment_method: "Zahlungsmethode",
    credit_card: "Kreditkarte",
    paypal: "PayPal",
    billing: "Abrechnung",
    invoice: "Rechnung",
    subscription: "Abonnement",
    cancel_subscription: "Abonnement kündigen",
    upgrade: "Upgrade",
    downgrade: "Downgrade",
    payment_success: "Zahlung erfolgreich",
    payment_failed: "Zahlung fehlgeschlagen",
    current_plan: "Aktueller Plan",
    expiration_date: "Ablaufdatum",
    benefits: "Vorteile",
    rewards: "Belohnungspunkte",
    redeem: "Einlösen",
    qr_payment: "QR-Zahlung",
    scan_to_pay: "Zum Bezahlen scannen",
    wallet: "Digitale Brieftasche",
    wallet_balance: "Kontostand"
  },
  it: {
    plans: "Piani di Abbonamento",
    free_plan: "Piano Gratuito",
    premium_plan: "Piano Premium",
    enterprise_plan: "Piano Aziendale",
    monthly: "Mensile",
    yearly: "Annuale",
    subscribe: "Abbonati",
    payment_method: "Metodo di Pagamento",
    credit_card: "Carta di Credito",
    paypal: "PayPal",
    billing: "Fatturazione",
    invoice: "Fattura",
    subscription: "Abbonamento",
    cancel_subscription: "Annulla Abbonamento",
    upgrade: "Aggiorna",
    downgrade: "Declassa",
    payment_success: "Pagamento Riuscito",
    payment_failed: "Pagamento Fallito",
    current_plan: "Piano Attuale",
    expiration_date: "Data di Scadenza",
    benefits: "Vantaggi",
    rewards: "Punti Premio",
    redeem: "Riscatta",
    qr_payment: "Pagamento QR",
    scan_to_pay: "Scansiona per Pagare",
    wallet: "Portafoglio Digitale",
    wallet_balance: "Saldo Portafoglio"
  }
};

// Define a type for our translations objects
type TranslationRecord = Record<string, string>;

// Combined translations with proper type safety
const translations: Record<SupportedLanguage, TranslationRecord> = {
  en: { ...commonTranslations.en, ...safetyTranslations.en, ...membershipTranslations.en },
  es: { ...commonTranslations.es, ...safetyTranslations.es, ...membershipTranslations.es },
  fr: { ...commonTranslations.fr, ...safetyTranslations.fr, ...membershipTranslations.fr },
  pt: { ...commonTranslations.pt, ...safetyTranslations.pt, ...membershipTranslations.pt },
  de: { ...commonTranslations.de, ...safetyTranslations.de, ...membershipTranslations.de },
  it: { ...commonTranslations.it, ...safetyTranslations.it, ...membershipTranslations.it },
};

// Translation function - ENGLISH ONLY VERSION
export function t(key: string, language: SupportedLanguage = 'en'): string {
  // Force English language regardless of the language parameter
  // This ensures all content is displayed in English throughout the application
  
  // Check if key exists in English translations
  if (!Object.prototype.hasOwnProperty.call(translations.en, key)) {
    console.warn(`Translation key "${key}" not found in English translations. Returning key.`);
    return key;
  }
  
  return translations.en[key];
}

export default translations;