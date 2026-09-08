import { Injectable, signal } from '@angular/core';

export type SupportedLang = 'en' | 'te';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'college_compass_lang';
  
  // Current active language signal
  currentLang = signal<SupportedLang>(this.getInitialLang());

  // Dictionary of translations
  private translations: Record<SupportedLang, Record<string, string>> = {
    en: {
      'app.title': 'College Compass',
      'app.tagline': 'Final Year Project Web Dashboard',
      
      // Sidebar Navigation
      'nav.map': 'Campus Map',
      'nav.overview': 'Overview',
      'nav.buildings': 'Buildings',
      'nav.qr': 'QR Gates',
      'nav.ar': 'AR Live Camera',
      'nav.admin': 'Admin Console',
      'nav.signout': 'Sign Out',
      
      // Top Headers
      'header.map': 'Campus Navigation Map',
      'header.overview': 'Dashboard Overview',
      'header.buildings': 'Buildings Directory',
      'header.qr': 'QR Gate Stations',
      'header.admin': 'Admin Console',
      'header.live_conn': 'Live Connection',
      'header.seed': 'Seed Sample Data',
      'header.interactive_map': 'Interactive Map',
      'header.last_sync': 'Last Sync: Just now',
      'header.map_sub': 'Live GPS tracker, high-accuracy pedestrian straight-line path routing & building search',
      
      // Stats Overview
      'stats.buildings': 'Campus Buildings',
      'stats.rooms': 'Navigable Rooms',
      'stats.qr': 'QR Gateways',
      'stats.active_nodes': 'Walkway Nodes',
      'stats.view_all': 'View Directory',
      'stats.registered': 'Registered on campus',
      'stats.mapped': 'Mapped with GPS & Floor plans',
      'stats.active_gates': 'Entry & Corridor QR Stations',
      
      // Actions & Buttons
      'btn.add_room': 'Add New Room',
      'btn.add_building': 'Add New Building',
      'btn.generate_qr': 'Generate QR Gate',
      'btn.fullscreen': 'Fullscreen Map',
      'btn.view_dashboard': 'View in Dashboard',
      'btn.search': 'Search',
      'btn.filter': 'Filter',
      'btn.edit': 'Edit',
      'btn.delete': 'Delete',
      'btn.save': 'Save Changes',
      'btn.cancel': 'Cancel',
      'btn.close': 'Close',
      'btn.open_map_editor': 'Open Fullscreen Map Editor',
      
      // Table & Details Labels
      'label.room_num': 'Room No',
      'label.room_name': 'Room Name',
      'label.type': 'Type',
      'label.building': 'Building',
      'label.floor': 'Floor',
      'label.status': 'Status',
      'label.actions': 'Actions',
      'label.available': 'Available / Free',
      'label.occupied': 'Occupied',
      'label.search_rooms': 'Search rooms, labs or faculties...',
      'label.all_types': 'All Types',
      'label.all_buildings': 'All Buildings',
      'label.all_floors': 'All Floors',
      
      // Login
      'login.welcome': 'Welcome Back',
      'login.sub': 'Please sign in with your student or admin Google account.',
      'login.google_btn': 'Sign in with Google',
      'login.auth': 'Authenticating...',
      'login.footer': 'College Compass © 2026. Secure Admin Console.',
      
      // Languages
      'lang.en': 'English',
      'lang.te': 'తెలుగు'
    },
    te: {
      'app.title': 'కాలేజ్ కంపాస్',
      'app.tagline': 'కళాశాల ప్రాజెక్ట్ వెబ్ డాష్‌బోర్డ్',
      
      // Sidebar Navigation
      'nav.map': 'క్యాంపస్ మ్యాప్',
      'nav.overview': 'అవలోకనం',
      'nav.buildings': 'భవనాలు',
      'nav.qr': 'క్యూఆర్ గేట్లు',
      'nav.ar': 'ఏఆర్ లైవ్ కెమెరా',
      'nav.admin': 'అడ్మిన్ కన్సోల్',
      'nav.signout': 'లాగ్ అవుట్',
      
      // Top Headers
      'header.map': 'క్యాంపస్ నావిగేషన్ మ్యాప్',
      'header.overview': 'డాష్‌బోర్డ్ అవలోకనం',
      'header.buildings': 'భవనాల డైరెక్టరీ',
      'header.qr': 'క్యూఆర్ గేట్ స్టేషన్లు',
      'header.admin': 'అడ్మిన్ కన్సోల్',
      'header.live_conn': 'లైవ్ కనెక్ట్ అయ్యింది',
      'header.seed': 'నమూనా డేటా నింపండి',
      'header.interactive_map': 'ఇంటరాక్టివ్ మ్యాప్',
      'header.last_sync': 'చివరి సింక్: ఇప్పుడే',
      'header.map_sub': 'లైవ్ జీపీఎస్ ట్రాకర్, ఖచ్చితమైన నడక మార్గం & భవనాల శోధన',
      
      // Stats Overview
      'stats.buildings': 'కళాశాల భవనాలు',
      'stats.rooms': 'గదులు & ల్యాబ్‌లు',
      'stats.qr': 'క్యూఆర్ గేట్‌వేలు',
      'stats.active_nodes': 'వాక్‌వే పాయింట్లు',
      'stats.view_all': 'జాబితా చూడండి',
      'stats.registered': 'క్యాంపస్‌లో నమోదు చేయబడినవి',
      'stats.mapped': 'జీపీఎస్ & ఫ్లోర్ ప్లాన్స్‌తో మ్యాప్ చేయబడినవి',
      'stats.active_gates': 'ప్రవేశ & కారిడార్ క్యూఆర్ స్టేషన్లు',
      
      // Actions & Buttons
      'btn.add_room': 'కొత్త గదిని జోడించండి',
      'btn.add_building': 'కొత్త భవనం జోడించండి',
      'btn.generate_qr': 'క్యూఆర్ గేట్ సృష్టించండి',
      'btn.fullscreen': 'పూర్తి స్క్రీన్ మ్యాప్',
      'btn.view_dashboard': 'డాష్‌బోర్డ్‌లో చూడండి',
      'btn.search': 'వెతకండి',
      'btn.filter': 'ఫిల్టర్',
      'btn.edit': 'సవరించు',
      'btn.delete': 'తొలగించు',
      'btn.save': 'సేవ్ చేయండి',
      'btn.cancel': 'రద్దు చేయండి',
      'btn.close': 'మూసివేయి',
      'btn.open_map_editor': 'మ్యాప్ ఎడిటర్‌ను తెరవండి',
      
      // Table & Details Labels
      'label.room_num': 'గది సంఖ్య',
      'label.room_name': 'గది పేరు',
      'label.type': 'రకం',
      'label.building': 'భవనం',
      'label.floor': 'అంతస్తు',
      'label.status': 'స్థితి',
      'label.actions': 'చర్యలు',
      'label.available': 'ఖాళీగా ఉంది',
      'label.occupied': 'ఆక్రమించబడింది',
      'label.search_rooms': 'గదులు, ల్యాబ్‌లు లేదా ఫ్యాకల్టీని వెతకండి...',
      'label.all_types': 'అన్ని రకాలు',
      'label.all_buildings': 'అన్ని భవనాలు',
      'label.all_floors': 'అన్ని అంతస్తులు',
      
      // Login
      'login.welcome': 'తిరిగి స్వాగతం',
      'login.sub': 'దయచేసి మీ విద్యార్థి లేదా అడ్మిన్ గూగుల్ ఖాతాతో లాగిన్ అవ్వండి.',
      'login.google_btn': 'గూగుల్‌తో సైన్ ఇన్ అవ్వండి',
      'login.auth': 'ధృవీకరిస్తోంది...',
      'login.footer': 'కాలేజ్ కంపాస్ © 2026. సురక్షిత అడ్మిన్ కన్సోల్.',
      
      // Languages
      'lang.en': 'English',
      'lang.te': 'తెలుగు'
    }
  };

  constructor() {
    // Listen for storage events from other tabs / iframes
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === this.STORAGE_KEY && (event.newValue === 'en' || event.newValue === 'te')) {
          this.currentLang.set(event.newValue as SupportedLang);
        }
      });
      window.addEventListener('college_compass_lang_changed', (event: any) => {
        if (event.detail && (event.detail === 'en' || event.detail === 'te')) {
          this.currentLang.set(event.detail as SupportedLang);
        }
      });
    }
  }

  private getInitialLang(): SupportedLang {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved === 'te' || saved === 'en') {
        return saved;
      }
    }
    return 'en';
  }

  /**
   * Translate a key with optional fallback.
   */
  t(key: string, fallback?: string): string {
    const lang = this.currentLang();
    const translation = this.translations[lang]?.[key];
    if (translation) return translation;
    return fallback || this.translations['en']?.[key] || key;
  }

  /**
   * Set language explicitly
   */
  setLanguage(lang: SupportedLang): void {
    this.currentLang.set(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, lang);
      window.dispatchEvent(new CustomEvent('college_compass_lang_changed', { detail: lang }));
    }
  }

  /**
   * Toggle between English and Telugu
   */
  toggleLanguage(): void {
    const next = this.currentLang() === 'en' ? 'te' : 'en';
    this.setLanguage(next);
  }

  /**
   * Helper to check if currently Telugu
   */
  isTelugu(): boolean {
    return this.currentLang() === 'te';
  }
}
