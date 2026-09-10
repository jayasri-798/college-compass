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
      'stats.rooms': 'Mapped Rooms',
      'stats.qr': 'QR Entry Nodes',
      'stats.active_nodes': 'Walkway Nodes',
      'stats.view_all': 'View Directory',
      'stats.registered': 'Active mapping in database',
      'stats.mapped': 'Classes, labs, and admin coordinates.',
      'stats.active_gates': 'QR gates deployed for navigation.',
      
      // Interactive Banner
      'banner.badge': 'New Interactive Feature',
      'banner.title': '2D Interactive Campus Map with Live Navigation',
      'banner.desc': 'Explore campus buildings, track your live walking position with pulsing GPS radar, and calculate walking routes and ETAs to any department.',
      
      // Actions & Buttons
      'btn.add_room': 'Add Room',
      'btn.add_building': 'Add Building',
      'btn.generate_qr': 'Add QR Node',
      'btn.add_floor': 'Add Floor',
      'btn.fullscreen': 'Fullscreen',
      'btn.open_fullscreen': 'Open Fullscreen Map',
      'btn.view_dashboard': 'View in Dashboard',
      'btn.search': 'Search',
      'btn.filter': 'Filter',
      'btn.edit': 'Edit',
      'btn.delete': 'Delete',
      'btn.save': 'Save Changes',
      'btn.save_room': 'Save Room',
      'btn.save_bldg': 'Save Building',
      'btn.save_qr': 'Save Node',
      'btn.save_floor': 'Save Floor',
      'btn.save_node': 'Save Node',
      'btn.cancel': 'Cancel',
      'btn.close': 'Close',
      'btn.download': '📥 Download',
      'btn.print': '🖨️ Print Label',
      'btn.open_map_editor': 'Open Fullscreen Map Editor',
      
      // Rooms Section
      'rooms.title': 'Campus Rooms Directory',
      'rooms.desc': 'Configure layout coordinates and entry-gate linkages.',
      'rooms.empty': 'No matching campus rooms found for query.',
      'label.search_rooms': 'Search rooms, buildings...',
      
      // Room Filter options
      'filter.all_types': 'All Room Types',
      'filter.classrooms': 'Classrooms',
      'filter.labs': 'Laboratories',
      'filter.offices': 'Offices',
      'filter.seminars': 'Seminar Halls',
      
      // Table & Details Labels
      'label.room_num': 'Room No.',
      'label.room_name': 'Room Name',
      'label.type': 'Room Type',
      'label.building': 'Building',
      'label.floor': 'Floor',
      'label.status': 'Occupancy Status',
      'label.coords': 'Floor Coordinates (X, Y)',
      'label.linked_qr': 'Linked QR Gate',
      'label.actions': 'Actions',
      'label.free': 'Free',
      'label.occupied': 'Occupied',
      'label.no_gate': 'No Gate Linked',
      
      // Buildings Section
      'buildings.title': 'Campus Buildings Directory',
      'buildings.desc': 'Manage core structures, physical blocks, and global GPS coordinates.',
      'buildings.empty': 'No buildings found in the database.',
      'bldg.code': 'Building Code',
      'bldg.name': 'Building Name',
      'bldg.floors': 'Total Floors',
      'bldg.lat': 'Global Latitude',
      'bldg.lng': 'Global Longitude',
      'bldg.floors_suffix': 'Floors',
      
      // QR Section
      'qr.title': 'QR Entry Nodes',
      'qr.desc': 'Configure entry QR codes linked to target navigation rooms and gates.',
      'qr.empty': 'No QR Entry Nodes configured in database.',
      'qr.node_id': 'Node ID',
      'qr.loc_name': 'Location Name',
      'qr.target_room': 'Target Room ID',
      'qr.target_bldg': 'Target Building / Floor',
      'qr.date': 'Registered Date',
      'qr.print_title': 'Printable QR Station Signs',
      'qr.print_desc': 'Print and mount these QR placards at campus gates to trigger instant navigation.',
      'qr.target_prefix': 'Target: Room',
      
      // Common & Status
      'loading.map_data': 'Fetching College Map Structure...',
      'stats.active': 'Active',
      'label.building_na': 'Building N/A',
      'label.delete': 'Delete',
      'qr.campus_gate': 'Campus Gate',
      'qr.generating': 'Generating...',

      // Admin Operations Section
      'admin.db_title': 'Database Operations Center',
      'admin.db_desc': 'Perform administrative actions, database seeding, and campus structure management.',
      'admin.seed_btn': 'Seed Sample Database Data',
      'admin.manage_rooms': 'Manage Rooms',
      'admin.manage_rooms_desc': 'Add or delete physical college rooms',
      'admin.manage_bldgs': 'Manage Buildings',
      'admin.manage_bldgs_desc': 'Add or delete campus blocks',
      'admin.manage_floors': 'Manage Floors',
      'admin.manage_floors_desc': 'Add or delete building floors',
      'admin.manage_qr': 'Manage QR Entry Gates',
      'admin.manage_qr_desc': 'Add or delete scanner entry points',
      'admin.no_rooms': 'No rooms configured.',
      'admin.no_bldgs': 'No buildings configured.',
      'admin.no_floors': 'No floors configured for selected building.',
      'admin.no_qr_gates': 'No QR gates configured.',
      'admin.cad_title': 'Visual Blueprint & Coordinate Calibration',
      'admin.cad_desc': 'Interactive CAD tools for building floorplans, waypoint nodes, and satellite road connectors.',
      'admin.mapper_title': 'Interactive 2D Floor Plan Mapper',
      'admin.mapper_desc': 'Filter by building & floor, click anywhere on the plan to place a new room pin instantly.',
      'admin.no_floors_opt': 'No Floors Configured',
      'admin.placeholder_floorplan': 'Paste Floor Plan Image URL...',
      'btn.save_plan': 'Save Plan',
      'admin.legend_classroom': 'Classroom',
      'admin.legend_lab': 'Lab',
      'admin.legend_office': 'Office',
      'admin.legend_seminar': 'Seminar',
      'admin.tip_click_pin': '✨ Click on map to place pin',

      'admin.planner_title': 'Campus Road & Waypoint Map Planner',
      'admin.planner_desc': 'Visually add waypoint nodes, connect road segments, and set your college satellite background.',
      'admin.mode_nodes': '📍 Place Nodes',
      'admin.mode_roads': '2. 🛣️ Connect Roads',
      'admin.placeholder_campusmap': 'Paste Campus Map URL...',
      'admin.save_map_bg': 'Save Map Background',
      'admin.instr_nodes': '👉 Node Placement Mode: Click anywhere on the satellite map below to place a waypoint. Enter its ID, label, and whether it\'s a building.',
      'admin.instr_roads': '👉 Road Connection Mode: Click Node A (turns green), then click Node B to draw a road line between them. Click lines/trash to delete.',
      'admin.view_2d': '🗺️ 2D Road Editor',
      'admin.view_ar': '🕶️ AR Live 3D View',
      'admin.view_split': '🔲 Split-Screen (2D + AR)',
      'admin.preview_gate_select': 'Starting Gate Station:',
      'admin.fullscreen_preview': 'Full Screen',
      'admin.reload_preview': 'Reload Simulator',

      'admin.live_2d_badge': 'Live 2D Editor',
      'admin.places_manager_title': 'Interactive 2D Campus Map & Live Places Manager',
      'admin.places_manager_desc': 'Add campus landmarks, drag-and-drop pins to calibrate exact GPS coordinates, configure icons/colors, and test Dijkstra turn-by-turn routes.',
      'admin.guide_1': '1. Click "Click Map to Add Place" to drop pins',
      'admin.guide_2': '2. Drag pins to adjust exact GPS coordinates',
      'admin.guide_3': '3. Click any pin to edit details or delete',
      'admin.guide_4': '4. Changes automatically sync to student navigation',

      // Modal Forms
      'modal.add_room': 'Add Campus Room',
      'modal.room_num': 'Room Number',
      'modal.room_name': 'Room Name',
      'modal.building_block': 'Building (Block)',
      'modal.floor': 'Floor',
      'modal.type': 'Room Type',
      'modal.coord_x': 'Floor Coordinate X (px)',
      'modal.coord_y': 'Floor Coordinate Y (px)',
      'modal.linked_qr': 'Linked QR Gate ID (Optional)',
      'modal.current_subject': 'Current Subject / Class',
      'modal.occupied_by': 'Occupied By',
      'modal.room_is_free': 'Room is currently Free',

      'modal.add_bldg': 'Add Campus Building',
      'modal.bldg_code': 'Building Code',
      'modal.bldg_name': 'Building Name',
      'modal.total_floors': 'Total Floors',
      'modal.gps_lat': 'GPS Latitude',
      'modal.gps_lng': 'GPS Longitude',

      'modal.add_qr': 'Add QR Entry Node',
      'modal.qr_code_id': 'QR Code ID',
      'modal.location_name': 'Location Name',
      'modal.target_room_id': 'Target Room ID',
      'modal.target_bldg_id': 'Target Building ID',
      'modal.target_floor_id': 'Target Floor ID',

      'modal.add_floor': 'Add Building Floor',
      'modal.floor_id': 'Floor ID',
      'modal.floor_name': 'Floor Name',
      'modal.floor_level': 'Floor Level (Numeric)',
      'modal.floor_plan_url': 'Floor Plan Image URL (Optional)',

      'modal.add_waypoint': 'Add Waypoint Node',
      'modal.waypoint_id': 'Node ID (Alphanumeric, Unique)',
      'modal.waypoint_label': 'Display Label',
      'modal.waypoint_x': 'Coordinate X (px)',
      'modal.waypoint_y': 'Coordinate Y (px)',
      'modal.maps_to_bldg': 'Maps to a Building Block',
      'modal.target_bldg': 'Target Building Block',
      'modal.select_bldg': '-- Select Building --',
      
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
      'stats.rooms': 'నమోదైన గదులు',
      'stats.qr': 'క్యూఆర్ ప్రవేశ పాయింట్లు',
      'stats.active_nodes': 'వాక్‌వే పాయింట్లు',
      'stats.view_all': 'జాబితా చూడండి',
      'stats.registered': 'డేటాబేస్‌లో నమోదు చేయబడినవి',
      'stats.mapped': 'తరగతులు, ల్యాబ్‌లు మరియు అడ్మిన్ పాయింట్లు.',
      'stats.active_gates': 'నావిగేషన్ కోసం అమర్చిన క్యూఆర్ గేట్లు.',
      
      // Interactive Banner
      'banner.badge': 'కొత్త ఇంటరాక్టివ్ ఫీచర్',
      'banner.title': 'లైవ్ నావిగేషన్‌తో కూడిన 2D క్యాంపస్ మ్యాప్',
      'banner.desc': 'క్యాంపస్ భవనాలను అన్వేషించండి, పల్సింగ్ జీపీఎస్ రాడార్‌తో మీ లైవ్ వాకింగ్ స్థానాన్ని ట్రాక్ చేయండి మరియు ఏ విభాగానికైనా నడక మార్గాలు మరియు సమయాన్ని లెక్కించండి.',
      
      // Actions & Buttons
      'btn.add_room': 'గదిని జోడించండి',
      'btn.add_building': 'భవనం జోడించండి',
      'btn.generate_qr': 'క్యూఆర్ నోడ్ జోడించండి',
      'btn.add_floor': 'అంతస్తు జోడించండి',
      'btn.fullscreen': 'పూర్తి స్క్రీన్',
      'btn.open_fullscreen': 'పూర్తి స్క్రీన్ మ్యాప్ తెరవండి',
      'btn.view_dashboard': 'డాష్‌బోర్డ్‌లో చూడండి',
      'btn.search': 'వెతకండి',
      'btn.filter': 'ఫిల్టర్',
      'btn.edit': 'సవరించు',
      'btn.delete': 'తొలగించు',
      'btn.save': 'మార్పులు సేవ్ చేయండి',
      'btn.save_room': 'గదిని సేవ్ చేయండి',
      'btn.save_bldg': 'భవనాన్ని సేవ్ చేయండి',
      'btn.save_qr': 'నోడ్ సేవ్ చేయండి',
      'btn.save_floor': 'అంతస్తు సేవ్ చేయండి',
      'btn.save_node': 'నోడ్ సేవ్ చేయండి',
      'btn.cancel': 'రద్దు చేయండి',
      'btn.close': 'మూసివేయి',
      'btn.download': '📥 డౌన్‌లోడ్',
      'btn.print': '🖨️ లేబుల్ ప్రింట్ చేయండి',
      'btn.open_map_editor': 'మ్యాప్ ఎడిటర్‌ను తెరవండి',
      
      // Rooms Section
      'rooms.title': 'క్యాంపస్ గదుల డైరెక్టరీ',
      'rooms.desc': 'లేఅవుట్ కోఆర్డినేట్లు మరియు ప్రవేశ ద్వారాల లింకేజీలను నిర్వహించండి.',
      'rooms.empty': 'మీరు వెతికిన వివరాలకు సరిపోలిన గదులు కనుగొనబడలేదు.',
      'label.search_rooms': 'గదులు, భవనాలను వెతకండి...',
      
      // Room Filter options
      'filter.all_types': 'అన్ని గదుల రకాలు',
      'filter.classrooms': 'తరగతి గదులు (క్లాస్‌రూమ్స్)',
      'filter.labs': 'ప్రయోగశాలలు (ల్యాబ్స్)',
      'filter.offices': 'కార్యాలయాలు (ఆఫీసెస్)',
      'filter.seminars': 'సెమినార్ హాళ్లు',
      
      // Table & Details Labels
      'label.room_num': 'గది సంఖ్య',
      'label.room_name': 'గది పేరు',
      'label.type': 'గది రకం',
      'label.building': 'భవనం',
      'label.floor': 'అంతస్తు',
      'label.status': 'గది లభ్యత స్థితి',
      'label.coords': 'ఫ్లోర్ కోఆర్డినేట్లు (X, Y)',
      'label.linked_qr': 'లింక్ చేయబడిన క్యూఆర్ గేట్',
      'label.actions': 'చర్యలు',
      'label.free': 'ఖాళీగా ఉంది',
      'label.occupied': 'తరగతి జరుగుతోంది',
      'label.no_gate': 'గేట్ లింక్ చేయలేదు',
      
      // Buildings Section
      'buildings.title': 'క్యాంపస్ భవనాల డైరెక్టరీ',
      'buildings.desc': 'ప్రధాన నిర్మాణాలు, భవన బ్లాక్‌లు మరియు గ్లోబల్ జీపీఎస్ కోఆర్డినేట్లను నిర్వహించండి.',
      'buildings.empty': 'డేటాబేస్‌లో భవనాలు ఏవీ కనుగొనబడలేదు.',
      'bldg.code': 'భవనం కోడ్',
      'bldg.name': 'భవనం పేరు',
      'bldg.floors': 'మొత్తం అంతస్తులు',
      'bldg.lat': 'గ్లోబల్ లాటిట్యూడ్',
      'bldg.lng': 'గ్లోబల్ లాంగిట్యూడ్',
      'bldg.floors_suffix': 'అంతస్తులు',
      
      // QR Section
      'qr.title': 'క్యూఆర్ ప్రవేశ పాయింట్లు',
      'qr.desc': 'టార్గెట్ నావిగేషన్ గదులు మరియు గేట్లకు లింక్ చేయబడిన క్యూఆర్ కోడ్‌లను కాన్ఫిగర్ చేయండి.',
      'qr.empty': 'డేటాబేస్‌లో క్యూఆర్ ప్రవేశ పాయింట్లు ఏవీ లేవు.',
      'qr.node_id': 'నోడ్ ఐడీ',
      'qr.loc_name': 'ప్రదేశం పేరు',
      'qr.target_room': 'టార్గెట్ గది ఐడీ',
      'qr.target_bldg': 'టార్గెట్ భవనం / అంతస్తు',
      'qr.date': 'నమోదు చేసిన తేదీ',
      'qr.print_title': 'ప్రింట్ చేయదగిన క్యూఆర్ స్టేషన్ బోర్డులు',
      'qr.print_desc': 'తక్షణ నావిగేషన్ ప్రారంభించడానికి ఈ క్యూఆర్ బోర్డులను ప్రింట్ చేసి క్యాంపస్ గేట్ల వద్ద అమర్చండి.',
      'qr.target_prefix': 'టార్గెట్: రూమ్',
      
      // Common & Status
      'loading.map_data': 'కళాశాల మ్యాప్ వివరాలు లోడ్ అవుతున్నాయి...',
      'stats.active': 'యాక్టివ్',
      'label.building_na': 'భవనం అందుబాటులో లేదు',
      'label.delete': 'తొలగించు',
      'qr.campus_gate': 'క్యాంపస్ గేట్',
      'qr.generating': 'రూపొందిస్తోంది...',

      // Admin Operations Section
      'admin.db_title': 'డేటాబేస్ ఆపరేషన్స్ సెంటర్',
      'admin.db_desc': 'అడ్మినిస్ట్రేటివ్ చర్యలు, నమూనా డేటా నింపడం మరియు క్యాంపస్ నిర్మాణ నిర్వహణ.',
      'admin.seed_btn': 'నమూనా డేటాబేస్ డేటాను నింపండి',
      'admin.manage_rooms': 'గదులను నిర్వహించండి',
      'admin.manage_rooms_desc': 'కళాశాల గదులను జోడించండి లేదా తొలగించండి',
      'admin.manage_bldgs': 'భవనాలను నిర్వహించండి',
      'admin.manage_bldgs_desc': 'క్యాంపస్ బ్లాకులను జోడించండి లేదా తొలగించండి',
      'admin.manage_floors': 'అంతస్తులను నిర్వహించండి',
      'admin.manage_floors_desc': 'భవన అంతస్తులను జోడించండి లేదా తొలగించండి',
      'admin.manage_qr': 'క్యూఆర్ గేట్లను నిర్వహించండి',
      'admin.manage_qr_desc': 'స్కానర్ ప్రవేశ ద్వారాలను జోడించండి లేదా తొలగించండి',
      'admin.no_rooms': 'గదులేవీ కాన్ఫిగర్ చేయలేదు.',
      'admin.no_bldgs': 'భవనాలేవీ కాన్ఫిగర్ చేయలేదు.',
      'admin.no_floors': 'ఎంచుకున్న భవనానికి అంతస్తులేవీ కాన్ఫిగర్ చేయలేదు.',
      'admin.no_qr_gates': 'క్యూఆర్ గేట్లేవీ కాన్ఫిగర్ చేయలేదు.',
      'admin.cad_title': 'విజువల్ బ్లూప్రింట్ & కోఆర్డినేట్ కాలిబ్రేషన్',
      'admin.cad_desc': 'భవన ఫ్లోర్‌ప్లాన్‌లు, వేపాయింట్ నోడ్‌లు మరియు శాటిలైట్ రోడ్ కనెక్టర్ల కోసం ఇంటరాక్టివ్ క్యాడ్ టూల్స్.',
      'admin.mapper_title': 'ఇంటరాక్టివ్ 2D ఫ్లోర్ ప్లాన్ మ్యాపర్',
      'admin.mapper_desc': 'భవనం & అంతస్తు వారీగా ఫిల్టర్ చేసి, కొత్త గది పిన్‌ను తక్షణమే ఉంచడానికి ప్లాన్‌పై ఎక్కడైనా క్లిక్ చేయండి.',
      'admin.no_floors_opt': 'అంతస్తులు లేవు',
      'admin.placeholder_floorplan': 'ఫ్లోర్ ప్లాన్ చిత్రం URL ఇక్కడ పేస్ట్ చేయండి...',
      'btn.save_plan': 'ప్లాన్ సేవ్ చేయండి',
      'admin.legend_classroom': 'తరగతి గది',
      'admin.legend_lab': 'ల్యాబ్',
      'admin.legend_office': 'ఆఫీస్',
      'admin.legend_seminar': 'సెమినార్',
      'admin.tip_click_pin': '✨ పిన్ ఉంచడానికి మ్యాప్‌పై క్లిక్ చేయండి',

      'admin.planner_title': 'క్యాంపస్ రోడ్డు & వేపాయింట్ మ్యాప్ ప్లానర్',
      'admin.planner_desc': 'వేపాయింట్ నోడ్‌లను జోడించండి, రోడ్డు విభాగాలను కలపండి మరియు మీ కళాశాల శాటిలైట్ మ్యాప్‌ను సెట్ చేయండి.',
      'admin.mode_nodes': '📍 నోడ్స్ ఉంచండి',
      'admin.mode_roads': '2. 🛣️ రోడ్లను కలపండి',
      'admin.placeholder_campusmap': 'క్యాంపస్ మ్యాప్ URL ఇక్కడ పేస్ట్ చేయండి...',
      'admin.save_map_bg': 'మ్యాప్ బ్యాక్‌గ్రౌండ్ సేవ్ చేయండి',
      'admin.instr_nodes': '👉 నోడ్ మోడ్: వేపాయింట్ ఉంచడానికి క్రింది శాటిలైట్ మ్యాప్‌పై ఎక్కడైనా క్లిక్ చేయండి. దాని ఐడీ, లేబుల్ వివరాలు ఇవ్వండి.',
      'admin.instr_roads': '👉 రోడ్ కనెక్షన్ మోడ్: రోడ్డు గీయడానికి నోడ్ A పై క్లిక్ చేయండి (ఆకుపచ్చగా మారుతుంది), ఆపై నోడ్ B పై క్లిక్ చేయండి. తొలగించడానికి లైన్ పై క్లిక్ చేయండి.',
      'admin.view_2d': '🗺️ 2D రోడ్ ఎడిటర్',
      'admin.view_ar': '🕶️ AR లైవ్ 3D వ్యూ',
      'admin.view_split': '🔲 స్ప్లిట్-స్క్రీన్ (2D + AR)',
      'admin.preview_gate_select': 'ప్రారంభ గేట్ స్టేషన్:',
      'admin.fullscreen_preview': 'పూర్తి స్క్రీన్',
      'admin.reload_preview': 'సిమ్యులేటర్ రీలోడ్ చేయండి',

      'admin.live_2d_badge': 'లైవ్ 2D ఎడిటర్',
      'admin.places_manager_title': 'ఇంటరాక్టివ్ 2D క్యాంపస్ మ్యాప్ & లైవ్ ప్రదేశాల మేనేజర్',
      'admin.places_manager_desc': 'క్యాంపస్ ప్రదేశాలను జోడించండి, జీపీఎస్ కోఆర్డినేట్లను సరిచేయడానికి పిన్‌లను డ్రాగ్ చేయండి మరియు డైక్స్‌ట్రా టర్న్-బై-టర్న్ రూట్లను పరీక్షించండి.',
      'admin.guide_1': '1. పిన్‌లను డ్రాప్ చేయడానికి "ప్రదేశాన్ని జోడించండి" పై క్లిక్ చేయండి',
      'admin.guide_2': '2. ఖచ్చితమైన జీపీఎస్ కోసం పిన్‌లను డ్రాగ్ చేయండి',
      'admin.guide_3': '3. వివరాలను సవరించడానికి లేదా తొలగించడానికి పిన్‌పై క్లిక్ చేయండి',
      'admin.guide_4': '4. మార్పులు ఆటోమేటిక్‌గా విద్యార్థి నావిగేషన్‌కు సింక్ అవుతాయి',

      // Modal Forms
      'modal.add_room': 'కొత్త గదిని జోడించండి',
      'modal.room_num': 'గది సంఖ్య',
      'modal.room_name': 'గది పేరు',
      'modal.building_block': 'భవనం (బ్లాక్)',
      'modal.floor': 'అంతస్తు',
      'modal.type': 'గది రకం',
      'modal.coord_x': 'ఫ్లోర్ కోఆర్డినేట్ X (px)',
      'modal.coord_y': 'ఫ్లోర్ కోఆర్డినేట్ Y (px)',
      'modal.linked_qr': 'లింక్ చేయబడిన క్యూఆర్ గేట్ ఐడీ (ఐచ్ఛికం)',
      'modal.current_subject': 'ప్రస్తుత సబ్జెక్ట్ / క్లాస్',
      'modal.occupied_by': 'ఉన్నవారు / బ్యాచ్',
      'modal.room_is_free': 'ఈ గది ప్రస్తుతం ఖాళీగా ఉంది',

      'modal.add_bldg': 'క్యాంపస్ భవనాన్ని జోడించండి',
      'modal.bldg_code': 'భవనం కోడ్',
      'modal.bldg_name': 'భవనం పేరు',
      'modal.total_floors': 'మొత్తం అంతస్తులు',
      'modal.gps_lat': 'జీపీఎస్ లాటిట్యూడ్',
      'modal.gps_lng': 'జీపీఎస్ లాంగిట్యూడ్',

      'modal.add_qr': 'క్యూఆర్ ప్రవేశ నోడ్ జోడించండి',
      'modal.qr_code_id': 'క్యూఆర్ కోడ్ ఐడీ',
      'modal.location_name': 'ప్రదేశం పేరు',
      'modal.target_room_id': 'టార్గెట్ రూమ్ ఐడీ',
      'modal.target_bldg_id': 'టార్గెట్ భవనం ఐడీ',
      'modal.target_floor_id': 'టార్గెట్ అంతస్తు ఐడీ',

      'modal.add_floor': 'భవనం అంతస్తును జోడించండి',
      'modal.floor_id': 'అంతస్తు ఐడీ',
      'modal.floor_name': 'అంతస్తు పేరు',
      'modal.floor_level': 'అంతస్తు లెవల్ (సంఖ్య)',
      'modal.floor_plan_url': 'ఫ్లోర్ ప్లాన్ చిత్రం URL (ఐచ్ఛికం)',

      'modal.add_waypoint': 'వేపాయింట్ నోడ్ జోడించండి',
      'modal.waypoint_id': 'నోడ్ ఐడీ (ప్రత్యేకమైనది)',
      'modal.waypoint_label': 'డిస్‌ప్లే లేబుల్',
      'modal.waypoint_x': 'కోఆర్డినేట్ X (px)',
      'modal.waypoint_y': 'కోఆర్డినేట్ Y (px)',
      'modal.maps_to_bldg': 'భవన బ్లాక్‌కు మ్యాప్ చేయబడుతుంది',
      'modal.target_bldg': 'టార్గెట్ భవన బ్లాక్',
      'modal.select_bldg': '-- భవనాన్ని ఎంచుకోండి --',
      
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

  // ===================== TELUGU DOMAIN DICTIONARIES =====================

  private readonly roomTranslations: Record<string, string> = {
    'IoT Research Lab': 'ఐఓటి రీసెర్చ్ ల్యాబ్',
    'CSE HOD Cabin': 'సి.ఎస్.ఇ హెచ్.ఒ.డి క్యాబిన్',
    'Mobile Computing Classroom': 'మొబైల్ కంప్యూటింగ్ తరగతి గది',
    'CSE Central Seminar Hall': 'సి.ఎస్.ఇ సెంట్రల్ సెమినార్ హాల్',
    'Embedded Systems Lab': 'ఎంబెడెడ్ సిస్టమ్స్ ల్యాబ్',
    'Advanced Coding Lab': 'అడ్వాన్స్‌డ్ కోడింగ్ ల్యాబ్',
    'Classroom 202': 'తరగతి గది 202',
    'HOD Computer Science Office': 'కంప్యూటర్ సైన్స్ హెచ్.ఒ.డి కార్యాలయం',
    'Department Seminar Hall': 'డిపార్ట్‌మెంట్ సెమినార్ హాల్',
    'VLSI Design Lab': 'వి.ఎల్.ఎస్.ఐ డిజైన్ ల్యాబ్',
    'Compiler Design Lab': 'కంపైలర్ డిజైన్ ల్యాబ్',
    'Cloud Computing Lab': 'క్లౌడ్ కంప్యూటింగ్ ల్యాబ్',
    'Entrance Corridor': 'ప్రవేశ కారిడార్',
    'Central Library': 'సెంట్రల్ లైబ్రరీ',
    'Library': 'లైబ్రరీ',
    'Main Gate Entrance': 'ప్రధాన ద్వార ప్రవేశం',
    'Physics Lab': 'ఫిజిక్స్ ల్యాబ్',
    'Chemistry Lab': 'కెమిస్ట్రీ ల్యాబ్',
    'Electronics Lab': 'ఎలక్ట్రానిక్స్ ల్యాబ్',
    'Staff Room': 'స్టాఫ్ రూమ్',
    'Principal Office': 'ప్రిన్సిపాల్ కార్యాలయం',
    'Conference Room': 'కాన్ఫరెన్స్ రూమ్ (సమావేశ గది)',
    'Auditorium': 'ఆడిటోరియం',
    'Robotics Lab': 'రోబోటిక్స్ ల్యాబ్',
    'Artificial Intelligence Lab': 'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ ల్యాబ్',
    'Data Science Lab': 'డేటా సైన్స్ ల్యాబ్',
    'Cyber Security Lab': 'సైబర్ సెక్యూరిటీ ల్యాబ్',
    'Mechanical Lab': 'మెకానికల్ ల్యాబ్',
    'Civil Lab': 'సివిల్ ల్యాబ్',
    'English Communication Lab': 'ఇంగ్లీష్ కమ్యూనికేషన్ ల్యాబ్',
    'Server Room': 'సర్వర్ రూమ్',
    'Exam Cell': 'పరీక్షల విభాగం (ఎగ్జామ్ సెల్)',
    'Placement Cell': 'ప్లేస్‌మెంట్ సెల్',
    'Girls Waiting Room': 'బాలికల విశ్రాంతి గది',
    'Boys Waiting Room': 'బాలుర విశ్రాంతి గది',
    'Sports Room': 'క్రీడా విభాగం (స్పోర్ట్స్ రూమ్)',
    'Cafeteria': 'కెఫెటేరియా',
    'Canteen': 'క్యాంటీన్'
  };

  private readonly buildingTranslations: Record<string, string> = {
    'Main Block - Administrative & Tech': 'ప్రధాన బ్లాక్ - పరిపాలన & టెక్నాలజీ',
    'Main Block - Admin': 'ప్రధాన బ్లాక్ - పరిపాలన',
    'Main Block': 'ప్రధాన భవనం (మెయిన్ బ్లాక్)',
    'Block 2 (Computer Science)': 'బ్లాక్ 2 (కంప్యూటర్ సైన్స్)',
    'Block 2 (CSE)': 'బ్లాక్ 2 (సి.ఎస్.ఇ)',
    'Block 2': 'బ్లాక్ 2',
    'Block 3 (ECE & EEE)': 'బ్లాక్ 3 (ఇ.సి.ఇ & ఇ.ఇ.ఇ)',
    'Block 3 (ECE)': 'బ్లాక్ 3 (ఇ.సి.ఇ)',
    'Block 3': 'బ్లాక్ 3',
    'Block A - Computer Science': 'బ్లాక్ ఎ - కంప్యూటర్ సైన్స్',
    'Block A - Computer Engineering': 'బ్లాక్ ఎ - కంప్యూటర్ ఇంజనీరింగ్',
    'Block A': 'బ్లాక్ ఎ',
    'Block B - Electronics Engineering': 'బ్లాక్ బి - ఎలక్ట్రానిక్స్ ఇంజనీరింగ్',
    'Block B - Electronics': 'బ్లాక్ బి - ఎలక్ట్రానిక్స్',
    'Block B': 'బ్లాక్ బి',
    'Central Library': 'సెంట్రల్ లైబ్రరీ',
    'Library': 'లైబ్రరీ',
    'Main Gate Entrance': 'ప్రధాన ద్వారం',
    'Main Gate': 'ప్రధాన ద్వారం',
    'KHIT Ground': 'కె.హెచ్.ఐ.టి గ్రౌండ్',
    'Basketball Court': 'బాస్కెట్‌బాల్ కోర్ట్'
  };

  private readonly roomTypeTranslations: Record<string, string> = {
    'classroom': 'తరగతి గది',
    'lab': 'ప్రయోగశాల (ల్యాబ్)',
    'office': 'కార్యాలయం (ఆఫీస్)',
    'seminar': 'సెమినార్ హాల్'
  };

  private readonly subjectTranslations: Record<string, string> = {
    'Compiler Design': 'కంపైలర్ డిజైన్',
    'Mobile Computing': 'మొబైల్ కంప్యూటింగ్',
    'Cloud Computing': 'క్లౌడ్ కంప్యూటింగ్',
    'Machine Learning': 'మెషిన్ లెర్నింగ్',
    'Data Structures': 'డేటా స్ట్రక్చర్స్',
    'Database Management': 'డేటాబేస్ మేనేజ్‌మెంట్',
    'Computer Networks': 'కంప్యూటర్ నెట్‌వర్క్స్',
    'Operating Systems': 'ఆపరేటింగ్ సిస్టమ్స్',
    'Software Engineering': 'సాఫ్ట్‌వేర్ ఇంజనీరింగ్',
    'Web Development': 'వెబ్ డెవలప్‌మెంట్',
    'Cyber Security': 'సైబర్ సెక్యూరిటీ',
    'VLSI Design': 'వి.ఎల్.ఎస్.ఐ డిజైన్',
    'IoT Systems': 'ఐఓటి సిస్టమ్స్',
    'Artificial Intelligence': 'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్',
    'Mathematics': 'గణితం',
    'Physics': 'ఫిజిక్స్',
    'Chemistry': 'కెమిస్ట్రీ',
    'English': 'ఇంగ్లీష్'
  };

  private readonly floorTranslations: Record<string, string> = {
    'Floor 1': 'మొదటి అంతస్తు',
    'Floor 2': 'రెండవ అంతస్తు',
    'Floor 3': 'మూడవ అంతస్తు',
    'Floor 4': 'నాల్గవ అంతస్తు',
    'Floor 5': 'ఐదవ అంతస్తు',
    'Floor1': 'మొదటి అంతస్తు',
    'Floor2': 'రెండవ అంతస్తు',
    'Floor3': 'మూడవ అంతస్తు',
    'Floor4': 'నాల్గవ అంతస్తు',
    'Floor5': 'ఐదవ అంతస్తు',
    'Ground Floor': 'గ్రౌండ్ ఫ్లోర్',
    'First Floor': 'మొదటి అంతస్తు',
    'Second Floor': 'రెండవ అంతస్తు',
    'Third Floor': 'మూడవ అంతస్తు',
    'Fourth Floor': 'నాల్గవ అంతస్తు',
    'Fifth Floor': 'ఐదవ అంతస్తు'
  };

  private readonly qrCodeTranslations: Record<string, string> = {
    'qr-cse-lab': 'సి.ఎస్.ఇ ల్యాబ్ గేట్',
    'qr-faculty-cs': 'ఫ్యాకల్టీ సి.ఎస్ గేట్',
    'qr-iot-class': 'ఐఓటి క్లాస్ గేట్',
    'qr-gate-a': 'గేట్-ఎ (బ్లాక్ ఎ)',
    'qr-gate-b': 'గేట్-బి (బ్లాక్ బి)',
    'qr-gate-c': 'గేట్-సి (బ్లాక్ సి)'
  };

  private readonly wordReplacements: [RegExp, string][] = [
    [/\b3rd\s*Year\b/gi, '3వ సంవత్సరం'],
    [/\b2nd\s*Year\b/gi, '2వ సంవత్సరం'],
    [/\b1st\s*Year\b/gi, '1వ సంవత్సరం'],
    [/\b4th\s*Year\b/gi, '4వ సంవత్సరం'],
    [/\bFinal\s*Year\b/gi, 'చివరి సంవత్సరం'],
    [/\bcompiler\b/gi, 'కంపైలర్'],
    [/\bdesign\b/gi, 'డిజైన్'],
    [/\blaboratory\b/gi, 'ప్రయోగశాల'],
    [/\blabs?\b/gi, 'ల్యాబ్'],
    [/\bclassrooms?\b/gi, 'తరగతి గది'],
    [/\bclasses\b/gi, 'తరగతులు'],
    [/\bclass\b/gi, 'క్లాస్'],
    [/\bcabins?\b/gi, 'క్యాబిన్'],
    [/\boffices?\b/gi, 'కార్యాలయం'],
    [/\bhalls?\b/gi, 'హాల్'],
    [/\bseminars?\b/gi, 'సెమినార్'],
    [/\bcorridors?\b/gi, 'కారిడార్'],
    [/\bentrances?\b/gi, 'ప్రవేశం'],
    [/\bentry\b/gi, 'ప్రవేశం'],
    [/\bgates?\b/gi, 'గేట్'],
    [/\bmain\b/gi, 'ప్రధాన'],
    [/\bblocks?\b/gi, 'బ్లాక్'],
    [/\bfloors?\b/gi, 'అంతస్తు'],
    [/\bdepartments?\b/gi, 'డిపార్ట్‌మెంట్'],
    [/\blibrary\b/gi, 'లైబ్రరీ'],
    [/\bresearch\b/gi, 'రీసెర్చ్'],
    [/\badvanced\b/gi, 'అడ్వాన్స్‌డ్'],
    [/\bcoding\b/gi, 'కోడింగ్'],
    [/\bsystems?\b/gi, 'సిస్టమ్స్'],
    [/\bembedded\b/gi, 'ఎంబెడెడ్'],
    [/\bcomputing\b/gi, 'కంప్యూటింగ్'],
    [/\bcomputers?\b/gi, 'కంప్యూటర్'],
    [/\bsciences?\b/gi, 'సైన్స్'],
    [/\bengineering\b/gi, 'ఇంజనీరింగ్'],
    [/\belectronics\b/gi, 'ఎలక్ట్రానిక్స్'],
    [/\bclouds?\b/gi, 'క్లౌడ్'],
    [/\bcentral\b/gi, 'సెంట్రల్'],
    [/\bgrounds?\b/gi, 'గ్రౌండ్'],
    [/\bcourts?\b/gi, 'కోర్ట్'],
    [/\badministrative\b/gi, 'పరిపాలన'],
    [/\badmin\b/gi, 'పరిపాలన'],
    [/\btechnolog(?:y|ies)\b/gi, 'టెక్నాలజీ'],
    [/\btech\b/gi, 'టెక్'],
    [/\bbranch\b/gi, 'బ్రాంచ్'],
    [/\bjunction\b/gi, 'జంక్షన్'],
    [/\bwings?\b/gi, 'వింగ్'],
    [/\bstations?\b/gi, 'స్టేషన్'],
    [/\brooms?\b/gi, 'గది'],
    [/\bcenters?\b/gi, 'సెంటర్'],
    [/\bcentres?\b/gi, 'సెంటర్'],
    [/\biot\b/gi, 'ఐఓటి'],
    [/\bcse\b/gi, 'సి.ఎస్.ఇ'],
    [/\bece\b/gi, 'ఇ.సి.ఇ'],
    [/\beee\b/gi, 'ఇ.ఇ.ఇ'],
    [/\bmech\b/gi, 'మెక్'],
    [/\bcivil\b/gi, 'సివిల్'],
    [/\bit\b/gi, 'ఐ.టి'],
    [/\bai\b/gi, 'ఎ.ఐ'],
    [/\bml\b/gi, 'ఎం.ఎల్'],
    [/\bhod\b/gi, 'హెచ్.ఒ.డి'],
    [/\bdata\b/gi, 'డేటా'],
    [/\bnetworks?\b/gi, 'నెట్‌వర్క్'],
    [/\bsecurity\b/gi, 'సెక్యూరిటీ'],
    [/\bvlsi\b/gi, 'వి.ఎల్.ఎస్.ఐ'],
    [/\bartificial\b/gi, 'ఆర్టిఫిషియల్'],
    [/\bintelligence\b/gi, 'ఇంటెలిజెన్స్'],
    [/\bmachine\b/gi, 'మెషిన్'],
    [/\blearning\b/gi, 'లెర్నింగ్'],
    [/\bmobile\b/gi, 'మొబైల్'],
    [/\bweb\b/gi, 'వెబ్'],
    [/\bfirst\b/gi, 'మొదటి'],
    [/\bsecond\b/gi, 'రెండవ'],
    [/\bthird\b/gi, 'మూడవ'],
    [/\bfourth\b/gi, 'నాల్గవ'],
    [/\bfifth\b/gi, 'ఐదవ'],
    [/\byears?\b/gi, 'సంవత్సరం'],
    [/\bbatch\b/gi, 'బ్యాచ్'],
    [/\bfaculty\b/gi, 'ఫ్యాకల్టీ'],
    [/\bmeeting\b/gi, 'మీటింగ్'],
    [/\bfree\b/gi, 'ఖాళీగా ఉంది'],
    [/\boccupied\b/gi, 'తరగతి జరుగుతోంది'],
    [/\bstudent\b/gi, 'విద్యార్థి'],
    [/\bstudents\b/gi, 'విద్యార్థులు'],
    [/\bboys\b/gi, 'బాలుర'],
    [/\bgirls\b/gi, 'బాలికల'],
    [/\bwaiting\b/gi, 'విశ్రాంతి'],
    [/\bsports\b/gi, 'క్రీడలు'],
    [/\bexam\b/gi, 'పరీక్షలు'],
    [/\bplacement\b/gi, 'ప్లేస్‌మెంట్'],
    [/\bcell\b/gi, 'విభాగం']
  ];

  /**
   * Helper to perform word-by-word Telugu translation on any free text
   */
  replaceWords(text: string): string {
    if (!text) return '';
    let result = text;
    for (const [pattern, replacement] of this.wordReplacements) {
      result = result.replace(pattern, replacement);
    }
    return result;
  }

  /**
   * Translate a room name
   */
  translateRoomName(name: string | null | undefined): string {
    if (!name) return '';
    if (!this.isTelugu()) return name;
    if (this.roomTranslations[name]) return this.roomTranslations[name];
    return this.replaceWords(name);
  }

  /**
   * Translate a building name
   */
  translateBuildingName(name: string | null | undefined): string {
    if (!name) return this.t('label.building_na');
    if (!this.isTelugu()) return name;
    if (this.buildingTranslations[name]) return this.buildingTranslations[name];
    return this.replaceWords(name);
  }

  /**
   * Translate room type
   */
  translateRoomType(type: string | null | undefined): string {
    if (!type) return '';
    if (!this.isTelugu()) {
      return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    }
    return this.roomTypeTranslations[type.toLowerCase()] || this.replaceWords(type);
  }

  /**
   * Translate subject
   */
  translateSubject(subject: string | null | undefined): string {
    if (!subject) return '';
    if (!this.isTelugu()) return subject;
    if (this.subjectTranslations[subject]) return this.subjectTranslations[subject];
    return this.replaceWords(subject);
  }

  /**
   * Translate occupied by text (e.g. "CSE-A 3rd Year")
   */
  translateOccupiedBy(occupiedBy: string | null | undefined): string {
    if (!occupiedBy) return '';
    if (!this.isTelugu()) return occupiedBy;
    return this.replaceWords(occupiedBy);
  }

  /**
   * Format room number with localized label
   */
  formatRoomNumber(num: string | number | null | undefined): string {
    if (num == null || num === '') return '';
    if (this.isTelugu()) return `గది ${num}`;
    return `Room ${num}`;
  }

  /**
   * Format coordinate values (X, Y)
   */
  formatCoords(x: number | null | undefined, y: number | null | undefined): string {
    if (x == null || y == null) return '-';
    if (this.isTelugu()) {
      return `X: ${x} పిక్సెల్స్, Y: ${y} పిక్సెల్స్`;
    }
    return `X: ${x}px, Y: ${y}px`;
  }

  /**
   * Translate QR gate code
   */
  translateQrCode(qrCodeId: string | null | undefined): string {
    if (!qrCodeId) return this.t('label.no_gate');
    if (!this.isTelugu()) return qrCodeId;
    if (this.qrCodeTranslations[qrCodeId]) return this.qrCodeTranslations[qrCodeId];
    return `గేట్: ${qrCodeId}`;
  }

  /**
   * Translate floor name
   */
  translateFloor(floor: string | null | undefined): string {
    if (!floor) return '';
    if (!this.isTelugu()) return floor;
    if (this.floorTranslations[floor]) return this.floorTranslations[floor];
    return this.replaceWords(floor);
  }
}
