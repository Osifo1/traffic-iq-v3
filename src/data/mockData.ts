export const cameraFeeds = [
  { id: 1, name: "Airport Road Feed", status: "active" as const },
  { id: 2, name: "Sapele Road Feed", status: "active" as const },
  { id: 3, name: "Ring Road Checkpoint", status: "active" as const },
  { id: 4, name: "Aduwawa Corridor", status: "active" as const },
];

export const plateLogEntries = [
  { id: 1, plate: "EYG-INB-G", vehicleType: "Car", camera: "Airport Road Feed", time: "14:32:05", confidence: 97.2, status: "Open" as const },
  { id: 2, plate: "NAI-J NRU", vehicleType: "Bus", camera: "Sapele Road Feed", time: "14:31:48", confidence: 94.8, status: "Resolved" as const },
  { id: 3, plate: "BG6-5USJ", vehicleType: "Truck", camera: "Ring Road Checkpoint", time: "14:30:22", confidence: 88.1, status: "Flagged" as const },
  { id: 4, plate: "AVO-B HVE", vehicleType: "Car", camera: "Aduwawa Corridor", time: "14:29:55", confidence: 95.5, status: "Open" as const },
  { id: 5, plate: "LAG-234-EP", vehicleType: "Car", camera: "Airport Road Feed", time: "14:28:10", confidence: 92.3, status: "Resolved" as const },
  { id: 6, plate: "EDO-891-BN", vehicleType: "Motorcycle", camera: "Sapele Road Feed", time: "14:27:44", confidence: 78.6, status: "Open" as const },
  { id: 7, plate: "ABJ-112-FC", vehicleType: "Bus", camera: "Ring Road Checkpoint", time: "14:26:30", confidence: 96.1, status: "Open" as const },
  { id: 8, plate: "KAN-555-KN", vehicleType: "Truck", camera: "Airport Road Feed", time: "14:25:18", confidence: 91.7, status: "Flagged" as const },
  { id: 9, plate: "OYO-321-IB", vehicleType: "Car", camera: "Aduwawa Corridor", time: "14:24:02", confidence: 89.4, status: "Resolved" as const },
  { id: 10, plate: "RIV-678-PH", vehicleType: "Car", camera: "Sapele Road Feed", time: "14:22:55", confidence: 93.8, status: "Open" as const },
  { id: 11, plate: "DEL-443-WR", vehicleType: "Motorcycle", camera: "Ring Road Checkpoint", time: "14:21:33", confidence: 82.1, status: "Open" as const },
  { id: 12, plate: "ENU-765-EN", vehicleType: "Bus", camera: "Airport Road Feed", time: "14:20:11", confidence: 97.5, status: "Resolved" as const },
];

export const vehicleStats = {
  totalVehicles: 1995,
  platesRead: 1847,
  activeCameras: 4,
  incidentsFlagged: 23,
};

export const vehicleDetectionOverTime = [
  { time: "06:00", cars: 45, buses: 12, trucks: 8, motorcycles: 15 },
  { time: "07:00", cars: 120, buses: 35, trucks: 18, motorcycles: 28 },
  { time: "08:00", cars: 210, buses: 58, trucks: 22, motorcycles: 35 },
  { time: "09:00", cars: 180, buses: 48, trucks: 25, motorcycles: 30 },
  { time: "10:00", cars: 150, buses: 42, trucks: 20, motorcycles: 22 },
  { time: "11:00", cars: 130, buses: 38, trucks: 15, motorcycles: 18 },
  { time: "12:00", cars: 165, buses: 45, trucks: 19, motorcycles: 25 },
  { time: "13:00", cars: 140, buses: 40, trucks: 16, motorcycles: 20 },
  { time: "14:00", cars: 107, buses: 31, trucks: 13, motorcycles: 10 },
];

export const vehicleClassBreakdown = [
  { name: "Cars", value: 1247, fill: "hsl(160, 100%, 39%)" },
  { name: "Buses", value: 389, fill: "hsl(216, 70%, 37%)" },
  { name: "Trucks", value: 156, fill: "hsl(190, 80%, 50%)" },
  { name: "Motorcycles", value: 203, fill: "hsl(38, 92%, 50%)" },
];

export const peakTrafficHours = [
  { hour: "6AM", count: 80 },
  { hour: "7AM", count: 201 },
  { hour: "8AM", count: 325 },
  { hour: "9AM", count: 283 },
  { hour: "10AM", count: 234 },
  { hour: "11AM", count: 201 },
  { hour: "12PM", count: 254 },
  { hour: "1PM", count: 216 },
  { hour: "2PM", count: 161 },
  { hour: "3PM", count: 245 },
  { hour: "4PM", count: 298 },
  { hour: "5PM", count: 340 },
  { hour: "6PM", count: 310 },
  { hour: "7PM", count: 220 },
  { hour: "8PM", count: 150 },
];

export const cameraComparison = [
  { camera: "Airport Rd", vehicles: 612 },
  { camera: "Sapele Rd", vehicles: 523 },
  { camera: "Ring Road", vehicles: 478 },
  { camera: "Aduwawa", vehicles: 382 },
];
