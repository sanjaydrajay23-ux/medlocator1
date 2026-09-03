import type { Medicine } from "@/types";

function dateFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const seedMedicines: Medicine[] = [
  { id: "med-001", name: "Paracetamol 500mg", category: "Tablet", rack: "Rack A-1", price: 25, quantity: 240, expiryDate: dateFromNow(400), lowStockThreshold: 20 },
  { id: "med-002", name: "Ibuprofen 400mg", category: "Tablet", rack: "Rack A-2", price: 35, quantity: 8, expiryDate: dateFromNow(180), lowStockThreshold: 15 },
  { id: "med-003", name: "Amoxicillin 250mg", category: "Capsule", rack: "Rack B-3", price: 60, quantity: 0, expiryDate: dateFromNow(220), lowStockThreshold: 10 },
  { id: "med-004", name: "Cough Syrup DX", category: "Syrup", rack: "Shelf S-2", price: 95, quantity: 32, expiryDate: dateFromNow(25), lowStockThreshold: 10 },
  { id: "med-005", name: "Insulin Glargine", category: "Injection", rack: "Fridge F-1", price: 720, quantity: 5, expiryDate: dateFromNow(60), lowStockThreshold: 8 },
  { id: "med-006", name: "Metformin 850mg", category: "Tablet", rack: "Rack A-4", price: 45, quantity: 150, expiryDate: dateFromNow(320), lowStockThreshold: 25 },
  { id: "med-007", name: "Omeprazole 20mg", category: "Capsule", rack: "Rack B-1", price: 72, quantity: 0, expiryDate: dateFromNow(10), lowStockThreshold: 12 },
  { id: "med-008", name: "Salbutamol Inhaler", category: "Inhaler", rack: "Shelf S-4", price: 110, quantity: 18, expiryDate: dateFromNow(95), lowStockThreshold: 6 },
  { id: "med-009", name: "Aspirin 75mg", category: "Tablet", rack: "Rack A-5", price: 20, quantity: 300, expiryDate: dateFromNow(500), lowStockThreshold: 30 },
  { id: "med-010", name: "Vitamin D3 2000IU", category: "Tablet", rack: "Rack C-2", price: 55, quantity: 12, expiryDate: dateFromNow(200), lowStockThreshold: 15 },
  { id: "med-011", name: "Loratadine 10mg", category: "Tablet", rack: "Rack C-1", price: 30, quantity: 45, expiryDate: dateFromNow(28), lowStockThreshold: 10 },
  { id: "med-012", name: "Diclofenac Gel", category: "Topical", rack: "Shelf S-3", price: 65, quantity: 3, expiryDate: dateFromNow(150), lowStockThreshold: 8 },
  { id: "med-013", name: "Cetirizine 10mg", category: "Tablet", rack: "Rack C-3", price: 25, quantity: 120, expiryDate: dateFromNow(360), lowStockThreshold: 20 },
  { id: "med-014", name: "Ranitidine 150mg", category: "Tablet", rack: "Rack A-3", price: 40, quantity: 7, expiryDate: dateFromNow(-5), lowStockThreshold: 15 },
  { id: "med-015", name: "Ceftriaxone 1g", category: "Injection", rack: "Fridge F-2", price: 190, quantity: 22, expiryDate: dateFromNow(75), lowStockThreshold: 10 },
];
