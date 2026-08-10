import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  collectionGroup
} from '@angular/fire/firestore';
import { Observable, from, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Building, Floor, Room, QrCode, Waypoint, Road } from '../models/campus.model';

@Injectable({
  providedIn: 'root'
})
export class CampusDataService {
  private firestore = inject(Firestore);

  // High-quality mock fallback data for final year project demonstration
  private mockBuildings: Building[] = [
    { id: 'block-a', name: 'Block A - Computer Engineering', code: 'A', totalFloors: 4, latitude: 16.3124, longitude: 80.4365 },
    { id: 'block-b', name: 'Block B - Electronics Engineering', code: 'B', totalFloors: 3, latitude: 16.3128, longitude: 80.4369 },
    { id: 'admin-block', name: 'Administrative Block', code: 'ADMIN', totalFloors: 2, latitude: 16.3120, longitude: 80.4360 }
  ];

  private mockRooms: Room[] = [
    { id: 'room-101', number: '101', name: 'Embedded Systems Lab', type: 'lab', x: 450, y: 280, qrCodeId: 'qr-gate-a', buildingId: 'block-a', floorId: 'floor-1', buildingName: 'Block A - Computer Engineering' },
    { id: 'room-102', number: '102', name: 'Advanced Coding Lab', type: 'lab', x: 120, y: 350, qrCodeId: 'qr-gate-b', buildingId: 'block-a', floorId: 'floor-1', buildingName: 'Block A - Computer Engineering' },
    { id: 'room-202', number: '202', name: 'Classroom 202', type: 'classroom', x: 230, y: 110, buildingId: 'block-a', floorId: 'floor-2', buildingName: 'Block A - Computer Engineering' },
    { id: 'room-303', number: '303', name: 'HOD Computer Science Office', type: 'office', x: 50, y: 90, buildingId: 'block-a', floorId: 'floor-3', buildingName: 'Block A - Computer Engineering' },
    { id: 'room-404', number: '404', name: 'Department Seminar Hall', type: 'seminar', x: 600, y: 400, buildingId: 'block-a', floorId: 'floor-4', buildingName: 'Block A - Computer Engineering' },
    { id: 'room-201', number: '201', name: 'VLSI Design Lab', type: 'lab', x: 310, y: 220, qrCodeId: 'qr-gate-c', buildingId: 'block-b', floorId: 'floor-2', buildingName: 'Block B - Electronics Engineering' }
  ];

  private mockQrCodes: QrCode[] = [
    { id: 'qr-gate-a', code: 'QR_GATE_A_1029', locationName: 'Main Entrance Block A', targetBuildingId: 'block-a', targetFloorId: 'floor-1', targetRoomId: 'room-101', createdAt: new Date().toISOString() },
    { id: 'qr-gate-b', code: 'QR_GATE_B_2048', locationName: 'Side Entrance Block B', targetBuildingId: 'block-b', targetFloorId: 'floor-2', targetRoomId: 'room-201', createdAt: new Date().toISOString() },
    { id: 'qr-gate-c', code: 'QR_GATE_C_4511', locationName: 'Admin Lobby Entrance', targetBuildingId: 'admin-block', targetFloorId: 'floor-1', targetRoomId: '', createdAt: new Date().toISOString() }
  ];

  /**
   * Fetches all buildings, catches error or empty to load mock
   */
  getBuildings(): Observable<Building[]> {
    try {
      const buildingsCol = collection(this.firestore, 'buildings');
      return (collectionData(buildingsCol, { idField: 'id' }) as Observable<Building[]>).pipe(
        catchError(() => {
          console.warn('Firestore buildings fetch failed. Falling back to mock data.');
          return of(this.mockBuildings);
        })
      );
    } catch (e) {
      console.warn('Firestore initialization failed. Using mock buildings.');
      return of(this.mockBuildings);
    }
  }

  /**
   * Fetches all floors for a specific building
   */
  getFloors(buildingId: string): Observable<Floor[]> {
    try {
      const floorsCol = collection(this.firestore, `buildings/${buildingId}/floors`);
      return (collectionData(floorsCol, { idField: 'id' }) as Observable<Floor[]>).pipe(
        catchError(() => of([]))
      );
    } catch (e) {
      return of([]);
    }
  }

  /**
   * Fetches all rooms for a specific floor in a building
   */
  getRooms(buildingId: string, floorId: string): Observable<Room[]> {
    try {
      const roomsCol = collection(this.firestore, `buildings/${buildingId}/floors/${floorId}/rooms`);
      return (collectionData(roomsCol, { idField: 'id' }) as Observable<Room[]>).pipe(
        catchError(() => of([]))
      );
    } catch (e) {
      return of([]);
    }
  }

  /**
   * Fetches all QR Codes
   */
  getQrCodes(): Observable<QrCode[]> {
    try {
      const qrCol = collection(this.firestore, 'qr_codes');
      return (collectionData(qrCol, { idField: 'id' }) as Observable<QrCode[]>).pipe(
        catchError(() => {
          console.warn('Firestore QR Codes fetch failed. Falling back to mock data.');
          return of(this.mockQrCodes);
        })
      );
    } catch (e) {
      console.warn('Firestore initialization failed. Using mock QR Codes.');
      return of(this.mockQrCodes);
    }
  }

  /**
   * Connects directly to active Firestore data collection stream pointing to
   * buildings/MainBlock/floors/Floor3/rooms. Falls back to mock data if empty/failed.
   */
  getAllRoomsFlat(): Observable<Room[]> {
    try {
      const roomsCol = collectionGroup(this.firestore, 'rooms');
      return (collectionData(roomsCol, { idField: 'id' }) as Observable<Room[]>).pipe(
        map(rooms => {
          if (rooms.length === 0) {
            console.log('No rooms in active Firestore stream. Displaying default mock data.');
            return this.mockRooms;
          }
          return rooms;
        }),
        catchError((err) => {
          console.warn('Firestore live streaming failed. Falling back to mock rooms.', err);
          return of(this.mockRooms);
        })
      );
    } catch (e) {
      console.warn('Firestore stream initialization failed. Using mock rooms.');
      return of(this.mockRooms);
    }
  }

  /**
   * Seed sample data directly into the active Firestore database collections
   */
  async seedSampleData(): Promise<void> {
    try {
      // 1. Seed KHIT Buildings with actual coordinates
      const buildings = [
        { id: 'MainBlock', name: 'Main Block - Administrative & Tech', code: 'MAIN', totalFloors: 5, latitude: 16.258009, longitude: 80.332492 },
        { id: 'Block2', name: 'Block 2 (Computer Science)', code: 'BLOCK2', totalFloors: 4, latitude: 16.258056, longitude: 80.332672 },
        { id: 'Block3', name: 'Block 3 (ECE & EEE)', code: 'BLOCK3', totalFloors: 4, latitude: 16.258339, longitude: 80.333195 },
        { id: 'Library', name: 'Central Library', code: 'LIBRARY', totalFloors: 2, latitude: 16.257509, longitude: 80.333457 },
        { id: 'MainGate', name: 'Main Gate Entrance', code: 'GATE', totalFloors: 1, latitude: 16.256891, longitude: 80.333380 }
      ];

      for (const b of buildings) {
        const bRef = doc(this.firestore, `buildings/${b.id}`);
        await setDoc(bRef, {
          name: b.name,
          code: b.code,
          totalFloors: b.totalFloors,
          latitude: b.latitude,
          longitude: b.longitude
        });
      }

      // 2. Seed Floor 3
      const floorRef = doc(this.firestore, 'buildings/MainBlock/floors/Floor3');
      await setDoc(floorRef, {
        level: 3,
        name: 'Third Floor',
        floorPlanUrl: 'https://images.unsplash.com/photo-1541829019-259276a7f013?w=800&fit=crop'
      });

      // 3. Seed Rooms on Floor 3
      const rooms = [
        { id: 'room-301', number: '301', name: 'IoT Research Lab', type: 'lab', x: 120, y: 150, qrCodeId: 'qr-cse-lab' },
        { id: 'room-302', number: '302', name: 'CSE HOD Cabin', type: 'office', x: 280, y: 180, qrCodeId: 'qr-faculty-cs' },
        { id: 'room-303', number: '303', name: 'Mobile Computing Classroom', type: 'classroom', x: 450, y: 220, qrCodeId: 'qr-iot-class' },
        { id: 'room-304', number: '304', name: 'CSE Central Seminar Hall', type: 'seminar', x: 620, y: 350, qrCodeId: '' }
      ];

      for (const r of rooms) {
        const roomRef = doc(this.firestore, `buildings/MainBlock/floors/Floor3/rooms/${r.id}`);
        await setDoc(roomRef, {
          number: r.number,
          name: r.name,
          type: r.type,
          x: r.x,
          y: r.y,
          qrCodeId: r.qrCodeId,
          buildingId: 'MainBlock',
          floorId: 'Floor3',
          buildingName: 'Main Block - Administrative & Tech'
        });
      }

      // 4. Seed QR Codes
      const qrCodes = [
        { id: 'qr-cse-lab', code: 'QR_CSE_LAB_110', locationName: 'Main Entrance CSE Lab Wing', targetBuildingId: 'MainBlock', targetFloorId: 'Floor3', targetRoomId: 'room-301' },
        { id: 'qr-faculty-cs', code: 'QR_FACULTY_CS_112', locationName: 'Main Admin Wing Entrance', targetBuildingId: 'MainBlock', targetFloorId: 'Floor3', targetRoomId: 'room-302' },
        { id: 'qr-iot-class', code: 'QR_IOT_CLASS_115', locationName: 'Classroom Wing Entrance', targetBuildingId: 'MainBlock', targetFloorId: 'Floor3', targetRoomId: 'room-303' }
      ];

      for (const q of qrCodes) {
        const qrRef = doc(this.firestore, `qr_codes/${q.id}`);
        await setDoc(qrRef, {
          code: q.code,
          locationName: q.locationName,
          targetBuildingId: q.targetBuildingId,
          targetFloorId: q.targetFloorId,
          targetRoomId: q.targetRoomId,
          createdAt: new Date().toISOString()
        });
      }

      // 5. Seed Admin Emails
      const adminEmails = [
        'pakanatijayasri@gmail.com',
        'chinthalacheruvuamareswar@gmail.com',
        'balasri.org@gmail.com',
        'jayasri798@gmail.com'
      ];
      for (const email of adminEmails) {
        const adminRef = doc(this.firestore, `admins/${email}`);
        await setDoc(adminRef, {
          email,
          role: 'admin',
          createdAt: new Date().toISOString()
        });
      }

      // 6. Seed Default Campus Map Config
      const configRef = doc(this.firestore, 'configs/campusMap');
      await setDoc(configRef, { imageUrl: 'campus-map.jpg' });

      // 7. Seed Default Waypoints
      const defaultWaypoints = [
        { id: 'gate', x: 400, y: 360, label: 'Main Gate Entrance', isBuilding: false },
        { id: 'road_mid', x: 400, y: 250, label: 'Main Block Junction', isBuilding: false },
        { id: 'road_left', x: 260, y: 250, label: 'Block 2 Branch', isBuilding: false },
        { id: 'road_right', x: 500, y: 250, label: 'Library / Court Branch', isBuilding: false },
        { id: 'road_top_left', x: 260, y: 140, label: 'KHIT Ground Branch', isBuilding: false },
        { id: 'road_top_right', x: 540, y: 180, label: 'Block 3 Junction', isBuilding: false },
        { id: 'MainBlock', x: 400, y: 200, label: 'Main Block - Admin', isBuilding: true, buildingId: 'MainBlock' },
        { id: 'Block2', x: 220, y: 220, label: 'Block 2 (CSE)', isBuilding: true, buildingId: 'Block2' },
        { id: 'Block3', x: 580, y: 150, label: 'Block 3 (ECE)', isBuilding: true, buildingId: 'Block3' },
        { id: 'Library', x: 500, y: 200, label: 'Central Library', isBuilding: true, buildingId: 'Library' },
        { id: 'Court', x: 560, y: 220, label: 'Basketball Court', isBuilding: false },
        { id: 'Ground', x: 260, y: 80, label: 'KHIT Ground', isBuilding: false }
      ];

      for (const w of defaultWaypoints) {
        const wRef = doc(this.firestore, `waypoints/${w.id}`);
        await setDoc(wRef, {
          x: w.x,
          y: w.y,
          label: w.label,
          isBuilding: w.isBuilding,
          buildingId: w.buildingId || ''
        });
      }

      // 8. Seed Default Roads
      const defaultRoads = [
        { fromNode: 'gate', toNode: 'road_mid' },
        { fromNode: 'road_mid', toNode: 'gate' },
        { fromNode: 'road_mid', toNode: 'road_left' },
        { fromNode: 'road_left', toNode: 'road_mid' },
        { fromNode: 'road_mid', toNode: 'road_right' },
        { fromNode: 'road_right', toNode: 'road_mid' },
        { fromNode: 'road_mid', toNode: 'MainBlock' },
        { fromNode: 'MainBlock', toNode: 'road_mid' },
        { fromNode: 'road_left', toNode: 'road_top_left' },
        { fromNode: 'road_top_left', toNode: 'road_left' },
        { fromNode: 'road_left', toNode: 'Block2' },
        { fromNode: 'Block2', toNode: 'road_left' },
        { fromNode: 'road_right', toNode: 'road_top_right' },
        { fromNode: 'road_top_right', toNode: 'road_right' },
        { fromNode: 'road_right', toNode: 'Library' },
        { fromNode: 'Library', toNode: 'road_right' },
        { fromNode: 'road_right', toNode: 'Court' },
        { fromNode: 'Court', toNode: 'road_right' },
        { fromNode: 'road_top_left', toNode: 'Ground' },
        { fromNode: 'Ground', toNode: 'road_top_left' },
        { fromNode: 'road_top_right', toNode: 'Block3' },
        { fromNode: 'Block3', toNode: 'road_top_right' }
      ];

      for (const r of defaultRoads) {
        const rId = `${r.fromNode}-${r.toNode}`;
        const rRef = doc(this.firestore, `roads/${rId}`);
        await setDoc(rRef, {
          fromNode: r.fromNode,
          toNode: r.toNode
        });
      }

      console.log('Firestore Database successfully seeded with College Compass Main Block (Floor 3) and KHIT Campus Map data.');
    } catch (error) {
      console.error('Failed to seed Firestore data:', error);
      throw error;
    }
  }

  // CRUD Operations for Rooms
  addRoom(room: Partial<Room>): Promise<void> {
    const roomId = room.id || `room-${room.number}`;
    const buildingId = room.buildingId || 'MainBlock';
    const floorId = room.floorId || 'Floor3';
    const roomRef = doc(this.firestore, `buildings/${buildingId}/floors/${floorId}/rooms/${roomId}`);
    return setDoc(roomRef, {
      number: room.number || '',
      name: room.name || '',
      type: room.type || 'classroom',
      x: Number(room.x) || 0,
      y: Number(room.y) || 0,
      qrCodeId: room.qrCodeId || '',
      isFree: room.isFree !== undefined ? room.isFree : true,
      currentSubject: room.currentSubject || '',
      occupiedBy: room.occupiedBy || '',
      buildingId: buildingId,
      floorId: floorId,
      buildingName: room.buildingName || 'Main Block'
    });
  }

  deleteRoom(roomId: string, buildingId: string = 'MainBlock', floorId: string = 'Floor3'): Promise<void> {
    const roomRef = doc(this.firestore, `buildings/${buildingId}/floors/${floorId}/rooms/${roomId}`);
    return deleteDoc(roomRef);
  }

  // CRUD Operations for Buildings
  addBuilding(building: Partial<Building>): Promise<void> {
    const code = building.code || 'BLDG';
    const buildingRef = doc(this.firestore, `buildings/${code}`);
    return setDoc(buildingRef, {
      name: building.name || '',
      code: code,
      totalFloors: Number(building.totalFloors) || 1,
      latitude: Number(building.latitude) || 0,
      longitude: Number(building.longitude) || 0
    });
  }

  deleteBuilding(code: string): Promise<void> {
    const buildingRef = doc(this.firestore, `buildings/${code}`);
    return deleteDoc(buildingRef);
  }

  updateFloorPlan(buildingId: string, floorId: string, floorPlanUrl: string): Promise<void> {
    const floorRef = doc(this.firestore, `buildings/${buildingId}/floors/${floorId}`);
    return setDoc(floorRef, { 
      floorPlanUrl: floorPlanUrl,
      level: Number(floorId.replace('Floor', '')) || 1,
      name: `${floorId} Plan`
    }, { merge: true });
  }

  addFloor(buildingId: string, floor: Partial<Floor>): Promise<void> {
    const floorId = floor.id || `Floor${floor.level || 1}`;
    const floorRef = doc(this.firestore, `buildings/${buildingId}/floors/${floorId}`);
    return setDoc(floorRef, {
      level: Number(floor.level) || 1,
      name: floor.name || `${floorId} Plan`,
      floorPlanUrl: floor.floorPlanUrl || ''
    }, { merge: true });
  }

  deleteFloor(buildingId: string, floorId: string): Promise<void> {
    const floorRef = doc(this.firestore, `buildings/${buildingId}/floors/${floorId}`);
    return deleteDoc(floorRef);
  }

  // CRUD Operations for QR Codes
  addQrCode(qr: Partial<QrCode>): Promise<void> {
    const qrId = qr.id || `qr-${qr.code?.toLowerCase() || Math.random().toString(36).substr(2, 9)}`;
    const qrRef = doc(this.firestore, `qr_codes/${qrId}`);
    return setDoc(qrRef, {
      code: qr.code || '',
      locationName: qr.locationName || '',
      targetBuildingId: qr.targetBuildingId || 'MainBlock',
      targetFloorId: qr.targetFloorId || 'Floor3',
      targetRoomId: qr.targetRoomId || '',
      createdAt: new Date().toISOString()
    });
  }

  deleteQrCode(qrId: string): Promise<void> {
    const qrRef = doc(this.firestore, `qr_codes/${qrId}`);
    return deleteDoc(qrRef);
  }

  // CRUD Operations for Waypoints
  getWaypointsFlat(): Promise<Waypoint[]> {
    const waypointsCol = collection(this.firestore, 'waypoints');
    return getDocs(waypointsCol).then(snap => {
      const list: Waypoint[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as Waypoint);
      });
      return list;
    });
  }

  addWaypoint(waypoint: Waypoint): Promise<void> {
    const wRef = doc(this.firestore, `waypoints/${waypoint.id}`);
    return setDoc(wRef, {
      x: Number(waypoint.x),
      y: Number(waypoint.y),
      label: waypoint.label,
      isBuilding: !!waypoint.isBuilding,
      buildingId: waypoint.buildingId || ''
    });
  }

  deleteWaypoint(waypointId: string): Promise<void> {
    const wRef = doc(this.firestore, `waypoints/${waypointId}`);
    return deleteDoc(wRef);
  }

  // CRUD Operations for Roads
  getRoadsFlat(): Promise<Road[]> {
    const roadsCol = collection(this.firestore, 'roads');
    return getDocs(roadsCol).then(snap => {
      const list: Road[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as Road);
      });
      return list;
    });
  }

  addRoad(road: Road): Promise<void> {
    const roadId = road.id || `${road.fromNode}-${road.toNode}`;
    const rRef = doc(this.firestore, `roads/${roadId}`);
    return setDoc(rRef, {
      fromNode: road.fromNode,
      toNode: road.toNode
    });
  }

  deleteRoad(roadId: string): Promise<void> {
    const rRef = doc(this.firestore, `roads/${roadId}`);
    return deleteDoc(rRef);
  }

  // Config Operations
  getCampusMapConfig(): Promise<any> {
    return getDocs(collection(this.firestore, 'configs')).then(snap => {
      let data = { imageUrl: '' };
      snap.forEach(d => {
        if (d.id === 'campusMap') data = d.data() as any;
      });
      return data;
    });
  }

  updateCampusMapConfig(imageUrl: string): Promise<void> {
    const docRef = doc(this.firestore, 'configs/campusMap');
    return setDoc(docRef, { imageUrl }, { merge: true });
  }
}
