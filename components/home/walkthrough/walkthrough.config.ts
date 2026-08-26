export interface WalkthroughSceneMeta {
  id: 1 | 2 | 3 | 4;
  label: string;
  code: string;
  subsystem: string;
  durationMs: number;
}

export const SCENE_TIMELINE = {
  intro: [0.00, 0.16],
  diagnosis: [0.16, 0.38],
  parts: [0.38, 0.58],
  booking: [0.58, 0.78],
  checkout: [0.78, 0.88],
  exit: [0.88, 1.00],
};

export const SCENES_META: WalkthroughSceneMeta[] = [
  {
    id: 1,
    label: "Telemetry & ECU Scan",
    code: "CAN_0x308",
    subsystem: "DIAGNOSTICS",
    durationMs: 4200,
  },
  {
    id: 2,
    label: "OEM Part Match",
    code: "VIN_BA123PA",
    subsystem: "COMPONENTS",
    durationMs: 4200,
  },
  {
    id: 3,
    label: "Garage Dispatch",
    code: "HUB_NP-KTM",
    subsystem: "FACILITY",
    durationMs: 4200,
  },
  {
    id: 4,
    label: "Settlement & Wallet",
    code: "TX_VLT-8819",
    subsystem: "SETTLEMENT",
    durationMs: 4500,
  },
];

export const DEMO_DATA = {
  vehicle: {
    name: "Honda Civic 1.5L VTEC Turbo",
    year: 2022,
    vin: "BA 123 PA",
    mileage: "34,500 KM",
    healthScore: 87,
    ecuProtocol: "ISO 15765-4 CAN (11-bit, 500 kbaud)",
    subsystems: [
      { id: "SYS-01", name: "Powertrain / Turbo Boost", val: "98%", status: "NOMINAL", code: "0x101" },
      { id: "SYS-02", name: "CVT Transmission Telemetry", val: "95%", status: "NOMINAL", code: "0x204" },
      { id: "SYS-03", name: "Brake Friction Material", val: "15%", status: "ATTENTION", code: "0x308" },
      { id: "SYS-04", name: "CANbus Electrical Bus", val: "100%", status: "NOMINAL", code: "0x412" },
    ],
  },
  diagnosis: {
    dtcCode: "DTC-BRK-45022",
    hexAddress: "0x45022",
    component: "Front Ceramic Brake Pad Assembly",
    padThickness: "2.3 mm",
    thresholdLimit: "2.0 mm",
    wearPercentage: 15,
    estimatedRemainingKm: 3000,
    diagnosticLog: "Sensor reading indicates friction material wear at 15%. Scheduled replacement recommended within 3,000 km.",
  },
  parts: {
    selected: {
      name: "Front Ceramic Brake Pad Kit (OEM Spec)",
      brand: "Honda Genuine Precision",
      partNumber: "HND-45022-TBA-A01",
      fmsi: "FMSI D1878 / GG Friction Rated",
      price: 4500,
      binLocation: "Kathmandu Central Hub // BIN-A4-12",
      unitsAvailable: 24,
      compatibility: "100% VIN Matched (BA 123 PA)",
    },
    alternative: {
      name: "Engine Air Intake Filter Element",
      partNumber: "HND-17220-5AA-A00",
      price: 850,
      stockText: "In Stock (8 units)",
    },
  },
  booking: {
    facility: "Miteri Auto Care — Central Workshop",
    facilityId: "FACILITY #NP-KTM-088",
    certification: "ASE Master Certified / ISO 9001",
    rating: 4.9,
    reviews: 128,
    date: "2026-10-20",
    displayDate: "Tuesday, Oct 20",
    time: "10:00 AM",
    serviceName: "OEM Brake Pad Installation & Digital ECU Calibration",
    laborCost: 1000,
    warranty: "30-Day / 1,000 KM Certified Warranty Protection",
  },
  checkout: {
    partsSubtotal: 4500,
    laborCost: 1000,
    subtotal: 5500,
    loyaltyDiscount: 550, // Exact 10% of Rs. 5,500
    finalTotal: 4950,
    hash: "SHA256: 8f9b4c2e...d1a93",
  },
};
