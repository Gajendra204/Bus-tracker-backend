export interface ITrip {
  busId: string;
  driverId: string;
  routeId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  currentLocation: {
    lat: number;
    lng: number;
  };
  students: Array<{
    studentId: string;
    checkInTime?: Date;
    checkOutTime?: Date;
  }>;
  startedAt?: Date;
  completedAt?: Date;
}