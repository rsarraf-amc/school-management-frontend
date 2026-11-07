export const routes = [
  { id: 1, routeTitle: "City Center via Main St", routeFare: 1500 },
  { id: 2, routeTitle: "North Suburbs via Highway 1", routeFare: 2000 },
  { id: 3, routeTitle: "East District Route", routeFare: 1200 },
  { id: 4, routeTitle: "West Hills via Valley Road", routeFare: 2500 }
];

export const vehicles = [
  { id: 1, vehicleNo: "UP-32-AB-1234", vehicleModel: "Tata Starbus 2021", yearMade: "2021", driverName: "Ramesh Singh", driverLicense: "DL-12345678", driverContact: "9876543210", note: "Regular maintenance done" },
  { id: 2, vehicleNo: "UP-32-CD-5678", vehicleModel: "Mahindra Cruzio", yearMade: "2020", driverName: "Suresh Kumar", driverLicense: "DL-87654321", driverContact: "9876543211", note: "" },
  { id: 3, vehicleNo: "UP-32-EF-9012", vehicleModel: "Force Traveller", yearMade: "2022", driverName: "Vinod Yadav", driverLicense: "DL-11223344", driverContact: "9876543212", note: "" }
];

export const drivers = [
  { id: 1, name: "Ramesh Singh", licenseNo: "DL-12345678", phone: "9876543210", address: "123 Main St, City" },
  { id: 2, name: "Suresh Kumar", licenseNo: "DL-87654321", phone: "9876543211", address: "456 North St, City" },
  { id: 3, name: "Vinod Yadav", licenseNo: "DL-11223344", phone: "9876543212", address: "789 East St, City" }
];

export const assignedVehicles = [
  { id: 1, route: "City Center via Main St", vehicle: "UP-32-AB-1234" },
  { id: 2, route: "North Suburbs via Highway 1", vehicle: "UP-32-CD-5678" }
];

export const stoppages = [
  { id: 1, stoppageName: "Central Market", fareAmount: 500 },
  { id: 2, stoppageName: "North Gate Park", fareAmount: 800 },
  { id: 3, stoppageName: "Valley Hospital", fareAmount: 1000 }
];

export const studentTransport = [
  { id: 1, class: "10", section: "A", admissionNo: "ADM-1001", studentName: "Aarav Sharma", routeTitle: "City Center via Main St", vehicleNo: "UP-32-AB-1234", fare: 1500 },
  { id: 2, class: "9", section: "B", admissionNo: "ADM-0902", studentName: "Ishani Verma", routeTitle: "North Suburbs via Highway 1", vehicleNo: "UP-32-CD-5678", fare: 2000 }
];

export const transportStats = {
  activeRoutes: 12,
  totalVehicles: 25,
  assignedStudents: 450,
  totalDrivers: 28,
  utilizationRate: "85%",
  monthlyRevenue: "₹6,75,000",
  routeDistribution: [
    { name: "City Center", value: 35 },
    { name: "North Suburbs", value: 25 },
    { name: "East District", value: 20 },
    { name: "West Hills", value: 20 }
  ],
  capacityTrend: [
    { month: "Jan", capacity: 500, utilized: 420 },
    { month: "Feb", capacity: 500, utilized: 435 },
    { month: "Mar", capacity: 500, utilized: 450 },
    { month: "Apr", capacity: 520, utilized: 450 }
  ]
};
