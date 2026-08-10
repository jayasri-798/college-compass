import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampusDataService } from '../../core/services/campus-data.service';
import { AuthService } from '../../core/services/auth.service';
import { Building, Floor, Room, QrCode, Waypoint, Road } from '../../core/models/campus.model';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private campusService = inject(CampusDataService);
  authService = inject(AuthService);

  // States using Angular Signals
  buildings = signal<Building[]>([]);
  rooms = signal<Room[]>([]);
  qrCodes = signal<QrCode[]>([]);
  loading = signal<boolean>(true);
  activeTab = signal<string>('rooms');
  qrCodeDataUrls = signal<{[key: string]: string}>({});

  // Floor Plan Mapper Selection States
  selectedMapperBuildingId = signal<string>('MainBlock');
  selectedMapperFloorId = signal<string>('Floor3');
  floorsOfMapperBuilding = signal<Floor[]>([]);
  customFloorPlanUrl = signal<string>('');

  // Waypoint & Road Planner States
  waypointsList = signal<Waypoint[]>([]);
  roadsList = signal<Road[]>([]);
  plannerMode = signal<'nodes' | 'roads'>('nodes');
  selectedNodeForConnection = signal<string | null>(null);
  showWaypointModal = signal<boolean>(false);
  waypointForm = signal<any>({ id: '', label: '', x: 0, y: 0, isBuilding: false, buildingId: '' });
  campusMapUrl = signal<string>('campus-map.jpg');

  roomsForSelectedMapper = computed(() => {
    const bId = this.selectedMapperBuildingId();
    const fId = this.selectedMapperFloorId();
    return this.rooms().filter(r => r.buildingId === bId && r.floorId === fId);
  });

  switchTab(tabName: string) {
    this.activeTab.set(tabName);
  }

  // Modals Visibility
  showRoomModal = signal<boolean>(false);
  showBuildingModal = signal<boolean>(false);
  showQrModal = signal<boolean>(false);
  showFloorModal = signal<boolean>(false);

  // Form Models
  roomForm = signal<any>({ number: '', name: '', type: 'classroom', x: 0, y: 0, qrCodeId: '', isFree: true, currentSubject: '', occupiedBy: '', buildingId: 'MainBlock', floorId: 'Floor3', buildingName: '' });
  buildingForm = signal<any>({ name: '', code: '', totalFloors: 1, latitude: 0, longitude: 0 });
  qrForm = signal<any>({ code: '', locationName: '', targetRoomId: '', targetBuildingId: 'MainBlock', targetFloorId: 'Floor3' });
  floorForm = signal<any>({ id: '', name: '', level: 1, floorPlanUrl: '' });

  getFloorsForSelectedBuilding(): string[] {
    const bldgCode = this.roomForm().buildingId;
    const bldg = this.buildings().find(b => b.code === bldgCode || b.id === bldgCode);
    if (!bldg) return ['Floor3'];
    const floors: string[] = [];
    for (let i = 1; i <= bldg.totalFloors; i++) {
      floors.push(`Floor${i}`);
    }
    return floors;
  }

  // Operations
  openRoomModal() {
    this.roomForm.set({ number: '', name: '', type: 'classroom', x: 0, y: 0, qrCodeId: '', isFree: true, currentSubject: '', occupiedBy: '', buildingId: 'MainBlock', floorId: 'Floor3', buildingName: '' });
    this.showRoomModal.set(true);
  }

  async saveRoom() {
    if (!this.authService.isAdmin()) {
      alert('Access Denied: Only administrators can add rooms.');
      return;
    }
    try {
      const selectedBldg = this.buildings().find(b => b.code === this.roomForm().buildingId || b.id === this.roomForm().buildingId);
      if (selectedBldg) {
        this.roomForm.update(form => ({ 
          ...form, 
          buildingName: selectedBldg.name,
          buildingId: selectedBldg.id || selectedBldg.code
        }));
      }
      await this.campusService.addRoom(this.roomForm());
      this.showRoomModal.set(false);
      this.loadCampusData();
    } catch (err: any) {
      alert(`Error saving room: ${err.message}`);
    }
  }

  async deleteRoom(room: any, event: Event) {
    event.stopPropagation();
    if (!this.authService.isAdmin()) {
      alert('Access Denied: Only administrators can delete rooms.');
      return;
    }
    if (!room || !room.id) return;
    if (confirm('Are you sure you want to delete this room?')) {
      try {
        await this.campusService.deleteRoom(room.id, room.buildingId || 'MainBlock', room.floorId || 'Floor3');
        this.loadCampusData();
      } catch (err: any) {
        alert(`Error deleting room: ${err.message}`);
      }
    }
  }

  openBuildingModal() {
    this.buildingForm.set({ name: '', code: '', totalFloors: 1, latitude: 0, longitude: 0 });
    this.showBuildingModal.set(true);
  }

  async saveBuilding() {
    if (!this.authService.isAdmin()) {
      alert('Access Denied: Only administrators can add buildings.');
      return;
    }
    try {
      await this.campusService.addBuilding(this.buildingForm());
      this.showBuildingModal.set(false);
      this.loadCampusData();
    } catch (err: any) {
      alert(`Error saving building: ${err.message}`);
    }
  }

  async deleteBuilding(code: string, event: Event) {
    event.stopPropagation();
    if (!this.authService.isAdmin()) {
      alert('Access Denied: Only administrators can delete buildings.');
      return;
    }
    if (confirm('Are you sure you want to delete this building?')) {
      try {
        await this.campusService.deleteBuilding(code);
        this.loadCampusData();
      } catch (err: any) {
        alert(`Error deleting building: ${err.message}`);
      }
    }
  }

  openQrModal() {
    this.qrForm.set({ code: '', locationName: '', targetRoomId: '', targetBuildingId: 'MainBlock', targetFloorId: 'Floor3' });
    this.showQrModal.set(true);
  }

  async saveQrCode() {
    if (!this.authService.isAdmin()) {
      alert('Access Denied: Only administrators can add QR codes.');
      return;
    }
    try {
      await this.campusService.addQrCode(this.qrForm());
      this.showQrModal.set(false);
      this.loadCampusData();
    } catch (err: any) {
      alert(`Error saving QR Code: ${err.message}`);
    }
  }

  async deleteQrCode(qrId: string | undefined, event: Event) {
    event.stopPropagation();
    if (!this.authService.isAdmin()) {
      alert('Access Denied: Only administrators can delete QR codes.');
      return;
    }
    if (!qrId) return;
    if (confirm('Are you sure you want to delete this QR Code?')) {
      try {
        await this.campusService.deleteQrCode(qrId);
        this.loadCampusData();
      } catch (err: any) {
        alert(`Error deleting QR Code: ${err.message}`);
      }
    }
  }
  
  // Search & Filter State
  searchQuery = signal<string>('');
  selectedTypeFilter = signal<string>('all');

  // Computed Values for Stats Panel
  totalBuildingsCount = computed(() => this.buildings().length);
  totalRoomsCount = computed(() => this.rooms().length);
  totalQrCount = computed(() => this.qrCodes().length);
  
  // Filtered rooms logic
  filteredRooms = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const type = this.selectedTypeFilter();
    
    return this.rooms().filter(room => {
      const matchesSearch = 
        room.name.toLowerCase().includes(query) || 
        room.number.includes(query) || 
        (room.buildingName && room.buildingName.toLowerCase().includes(query));
      
      const matchesType = type === 'all' || room.type === type;
      
      return matchesSearch && matchesType;
    });
  });

  ngOnInit() {
    this.loadCampusData();
    this.loadMapperFloors();
    this.loadWaypointsAndRoads();
  }

  async loadWaypointsAndRoads() {
    try {
      const waypoints = await this.campusService.getWaypointsFlat();
      this.waypointsList.set(waypoints);
      const roads = await this.campusService.getRoadsFlat();
      this.roadsList.set(roads);
      
      const config = await this.campusService.getCampusMapConfig();
      if (config && config.imageUrl) {
        this.campusMapUrl.set(config.imageUrl);
      } else {
        this.campusMapUrl.set('campus-map.jpg');
      }
    } catch (e) {
      console.error('Error loading waypoints/roads config:', e);
    }
  }

  loadCampusData() {
    this.loading.set(true);
    
    this.campusService.getBuildings().subscribe({
      next: (b) => this.buildings.set(b),
      error: (e) => console.error('Error fetching buildings', e)
    });

    this.campusService.getQrCodes().subscribe({
      next: async (q) => {
        this.qrCodes.set(q);
        
        // Generate QR code images dynamically when gates load
        const urls: {[key: string]: string} = {};
        for (const qr of q) {
          if (qr.id) {
            urls[qr.id] = await this.generateQrUrl(qr.id);
          }
        }
        this.qrCodeDataUrls.set(urls);
      },
      error: (e) => console.error('Error fetching QR Codes', e)
    });

    this.campusService.getAllRoomsFlat().subscribe({
      next: (r) => {
        this.rooms.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        console.error('Error fetching flat rooms list', e);
        this.loading.set(false);
      }
    });
  }

  async generateQrUrl(gateId: string): Promise<string> {
    const targetUrl = `https://college-compass-cc.vercel.app/ar-map.html?gate=${gateId}`;
    try {
      return await QRCode.toDataURL(targetUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
    } catch (err) {
      console.error('Failed to generate QR Code:', err);
      return '';
    }
  }

  downloadQrCode(qr: QrCode) {
    const dataUrl = this.qrCodeDataUrls()[qr.id || ''];
    if (!dataUrl) return;
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `gate-${qr.id || 'code'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  printQrCode(qr: QrCode) {
    const dataUrl = this.qrCodeDataUrls()[qr.id || ''];
    if (!dataUrl) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Label - ${qr.locationName}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              text-align: center;
            }
            .label-card {
              border: 3px double #000;
              padding: 30px;
              border-radius: 12px;
              max-width: 400px;
            }
            img {
              width: 250px;
              height: 250px;
            }
            h1 {
              font-size: 24px;
              margin: 10px 0 5px 0;
            }
            p {
              font-size: 14px;
              color: #555;
              margin: 0 0 15px 0;
            }
            .scan-tip {
              font-size: 11px;
              color: #888;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="label-card">
            <div class="scan-tip">Scan to Navigate</div>
            <h1>COLLEGE COMPASS</h1>
            <p>${qr.locationName} (${qr.id})</p>
            <img src="${dataUrl}" alt="QR Code Label">
            <div style="font-size: 10px; color: #999; margin-top: 10px;">Destination Room: ${qr.targetRoomId}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  onCanvasClick(event: MouseEvent) {
    const svg = event.currentTarget as SVGGraphicsElement;
    const rect = svg.getBoundingClientRect();
    
    // Scale relative mouse click coordinates to fit 800x400 viewBox
    const x = Math.round(((event.clientX - rect.left) / rect.width) * 800);
    const y = Math.round(((event.clientY - rect.top) / rect.height) * 400);
    
    // Pre-populate coordinate model and open Add Room modal
    this.roomForm.update(form => ({
      ...form,
      number: '',
      name: '',
      type: 'classroom',
      x: x,
      y: y,
      qrCodeId: '',
      isFree: true,
      currentSubject: '',
      occupiedBy: ''
    }));
    this.showRoomModal.set(true);
  }

  seedingStatus = signal<string | null>(null);

  async seedData() {
    if (!this.authService.isAdmin()) {
      alert('Access Denied: Only administrators can seed the database.');
      return;
    }
    this.seedingStatus.set('Seeding database...');
    try {
      await this.campusService.seedSampleData();
      this.seedingStatus.set('Success! MainBlock data seeded.');
      setTimeout(() => this.seedingStatus.set(null), 4000);
      this.loadCampusData();
    } catch (err: any) {
      console.error(err);
      this.seedingStatus.set(`Seeding failed: ${err.message || 'Check environment configuration'}`);
      setTimeout(() => this.seedingStatus.set(null), 5000);
    }
  }

  onMapperBuildingChange(buildingId: string) {
    this.selectedMapperBuildingId.set(buildingId);
    this.selectedMapperFloorId.set('Floor1');
    this.loadMapperFloors();
  }

  onMapperFloorChange(floorId: string) {
    this.selectedMapperFloorId.set(floorId);
    const activeFloor = this.floorsOfMapperBuilding().find(f => f.id === floorId);
    this.customFloorPlanUrl.set(activeFloor ? (activeFloor.floorPlanUrl || '') : '');
  }

  loadMapperFloors() {
    const bId = this.selectedMapperBuildingId();
    this.campusService.getFloors(bId).subscribe(floors => {
      this.floorsOfMapperBuilding.set(floors);
      // Fallback to Floor3 if selectedFloorId is not in list and selected is default Floor3
      let activeFloor = floors.find(f => f.id === this.selectedMapperFloorId());
      if (!activeFloor && floors.length > 0) {
        // Automatically choose first available floor
        this.selectedMapperFloorId.set(floors[0].id || 'Floor1');
        activeFloor = floors[0];
      }
      if (activeFloor) {
        this.customFloorPlanUrl.set(activeFloor.floorPlanUrl || '');
      } else {
        this.customFloorPlanUrl.set('');
      }
    });
  }

  async saveCustomFloorPlan() {
    if (!this.authService.isAdmin()) return;
    const bId = this.selectedMapperBuildingId();
    const fId = this.selectedMapperFloorId();
    const url = this.customFloorPlanUrl();
    if (!url) {
      alert('Please provide a valid image URL first.');
      return;
    }
    try {
      await this.campusService.updateFloorPlan(bId, fId, url);
      alert('Floor plan successfully updated!');
      this.loadMapperFloors();
    } catch (err: any) {
      alert(`Error updating floor plan: ${err.message}`);
    }
  }

  openFloorModal() {
    this.floorForm.set({ id: '', name: '', level: 1, floorPlanUrl: '' });
    this.showFloorModal.set(true);
  }

  async saveFloor() {
    if (!this.authService.isAdmin()) {
      alert('Access Denied: Only administrators can add floors.');
      return;
    }
    const bId = this.selectedMapperBuildingId();
    const form = this.floorForm();
    if (!form.id || !form.name) {
      alert('Please provide both a Floor ID (e.g. Floor1) and a Floor Name.');
      return;
    }
    try {
      await this.campusService.addFloor(bId, form);
      this.showFloorModal.set(false);
      alert('Floor successfully saved!');
      this.loadMapperFloors();
    } catch (err: any) {
      alert(`Error saving floor: ${err.message}`);
    }
  }

  async deleteFloor(floorId: string | undefined, event: Event) {
    event.stopPropagation();
    if (!this.authService.isAdmin()) {
      alert('Access Denied: Only administrators can delete floors.');
      return;
    }
    if (!floorId) return;
    const bId = this.selectedMapperBuildingId();
    if (confirm(`Are you sure you want to delete ${floorId}? This will remove it from this building.`)) {
      try {
        await this.campusService.deleteFloor(bId, floorId);
        alert('Floor successfully deleted.');
        this.loadMapperFloors();
      } catch (err: any) {
        alert(`Error deleting floor: ${err.message}`);
      }
    }
  }

  async saveCampusMapUrl() {
    if (!this.authService.isAdmin()) return;
    const url = this.campusMapUrl();
    if (!url) {
      alert('Please enter a valid image URL.');
      return;
    }
    try {
      await this.campusService.updateCampusMapConfig(url);
      alert('Campus satellite map successfully updated!');
      this.loadWaypointsAndRoads();
    } catch (err: any) {
      alert(`Error updating campus map image: ${err.message}`);
    }
  }

  onPlannerMapClick(event: MouseEvent) {
    if (!this.authService.isAdmin()) return;
    if (this.plannerMode() !== 'nodes') return;
    const svg = event.currentTarget as SVGGraphicsElement;
    const rect = svg.getBoundingClientRect();
    
    // Scale relative mouse click coordinates to fit 800x400 viewBox
    const x = Math.round(((event.clientX - rect.left) / rect.width) * 800);
    const y = Math.round(((event.clientY - rect.top) / rect.height) * 400);

    this.waypointForm.set({
      id: '',
      label: '',
      x: x,
      y: y,
      isBuilding: false,
      buildingId: ''
    });
    this.showWaypointModal.set(true);
  }

  async saveWaypoint() {
    if (!this.authService.isAdmin()) return;
    const form = this.waypointForm();
    if (!form.id || !form.label) {
      alert('Please fill out both the Node ID and Label.');
      return;
    }
    try {
      await this.campusService.addWaypoint(form);
      this.showWaypointModal.set(false);
      this.loadWaypointsAndRoads();
    } catch (err: any) {
      alert(`Error saving waypoint node: ${err.message}`);
    }
  }

  async onWaypointNodeClick(waypoint: Waypoint, event: Event) {
    event.stopPropagation();
    if (!this.authService.isAdmin()) return;
    
    if (this.plannerMode() === 'roads') {
      const fromNode = this.selectedNodeForConnection();
      if (!fromNode) {
        // First node selected
        this.selectedNodeForConnection.set(waypoint.id);
      } else {
        // Second node selected, connect them!
        if (fromNode === waypoint.id) {
          this.selectedNodeForConnection.set(null);
          return;
        }
        try {
          // Add segments in both directions for bi-directional pathing
          await this.campusService.addRoad({ fromNode: fromNode, toNode: waypoint.id });
          await this.campusService.addRoad({ fromNode: waypoint.id, toNode: fromNode });
          this.selectedNodeForConnection.set(null);
          this.loadWaypointsAndRoads();
        } catch (err: any) {
          alert(`Error saving road segment connection: ${err.message}`);
        }
      }
    }
  }

  async deleteWaypointNode(id: string, event: Event) {
    event.stopPropagation();
    if (!this.authService.isAdmin()) return;
    if (confirm(`Are you sure you want to delete node ${id}? This will also delete any connecting roads.`)) {
      try {
        await this.campusService.deleteWaypoint(id);
        
        // Clean up connecting roads in DB
        const roads = this.roadsList().filter(r => r.fromNode === id || r.toNode === id);
        for (const road of roads) {
          if (road.id) {
            await this.campusService.deleteRoad(road.id);
          }
        }
        
        this.loadWaypointsAndRoads();
      } catch (err: any) {
        alert(`Error deleting waypoint: ${err.message}`);
      }
    }
  }

  async deleteRoadSegment(road: Road, event: Event) {
    event.stopPropagation();
    if (!this.authService.isAdmin()) return;
    if (confirm(`Delete the road connecting ${road.fromNode} and ${road.toNode}?`)) {
      try {
        if (road.id) {
          await this.campusService.deleteRoad(road.id);
          // Also delete opposite direction segment if it exists
          const oppId = `${road.toNode}-${road.fromNode}`;
          await this.campusService.deleteRoad(oppId);
        }
        this.loadWaypointsAndRoads();
      } catch (err: any) {
        alert(`Error deleting road segment: ${err.message}`);
      }
    }
  }

  getWaypointCoords(id: string): { x: number, y: number } | null {
    const node = this.waypointsList().find(w => w.id === id);
    return node ? { x: node.x, y: node.y } : null;
  }

  logout() {
    this.authService.logout();
  }
}
