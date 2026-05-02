export const CAR_MAKES = [
  'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti',
  'Cadillac', 'Chevrolet', 'Chrysler', 'Citroën', 'Dacia', 'Dodge',
  'Ferrari', 'Fiat', 'Ford', 'Genesis', 'Honda', 'Hyundai', 'Infiniti',
  'Jaguar', 'Jeep', 'Kia', 'Lamborghini', 'Lancia', 'Land Rover',
  'Lexus', 'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz', 'Mini',
  'Mitsubishi', 'Nissan', 'Opel', 'Peugeot', 'Porsche', 'Renault',
  'Rolls-Royce', 'Seat', 'Škoda', 'Smart', 'Subaru', 'Suzuki',
  'Tesla', 'Toyota', 'Volkswagen', 'Volvo',
].sort();

export const CAR_MODELS_BY_MAKE: Record<string, string[]> = {
  'Audi': ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'S3', 'S4', 'S5'],
  'BMW': ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i4', 'iX', 'M2', 'M3', 'M4', 'M5', 'M8'],
  'Mercedes-Benz': ['A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'AMG GT', 'EQC', 'EQS', 'G-Class', 'SL', 'SLK'],
  'Volkswagen': ['Golf', 'Polo', 'Passat', 'Tiguan', 'Touareg', 'Arteon', 'T-Cross', 'T-Roc', 'ID.3', 'ID.4', 'Caddy', 'Transporter', 'Phaeton', 'Scirocco', 'Up'],
  'Toyota': ['Auris', 'Avensis', 'Camry', 'Corolla', 'C-HR', 'GR Yaris', 'Hilux', 'Land Cruiser', 'Prius', 'RAV4', 'Supra', 'Yaris', 'bZ4X'],
  'Honda': ['Accord', 'Civic', 'CR-V', 'HR-V', 'Jazz', 'Legend', 'NSX', 'Pilot', 'Type R'],
  'Ford': ['Bronco', 'Edge', 'Explorer', 'F-150', 'Fiesta', 'Focus', 'Galaxy', 'Kuga', 'Mondeo', 'Mustang', 'Puma', 'Ranger'],
  'Porsche': ['718', '911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck', 'Roadster'],
  'Škoda': ['Citigo', 'Fabia', 'Kamiq', 'Karoq', 'Kodiaq', 'Octavia', 'Scala', 'Superb'],
};

export const FUEL_TYPES = [
  { value: 'PETROL', label: 'Petrol' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'ELECTRIC', label: 'Electric' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'PLUG_IN_HYBRID', label: 'Plug-in Hybrid' },
  { value: 'LPG', label: 'LPG' },
  { value: 'CNG', label: 'CNG' },
  { value: 'HYDROGEN', label: 'Hydrogen' },
];

export const TRANSMISSION_TYPES = [
  { value: 'MANUAL', label: 'Manual' },
  { value: 'AUTOMATIC', label: 'Automatic' },
  { value: 'SEMI_AUTOMATIC', label: 'Semi-Automatic' },
  { value: 'CVT', label: 'CVT' },
];

export const BODY_TYPES = [
  { value: 'SEDAN', label: 'Sedan' },
  { value: 'HATCHBACK', label: 'Hatchback' },
  { value: 'SUV', label: 'SUV' },
  { value: 'COUPE', label: 'Coupé' },
  { value: 'CONVERTIBLE', label: 'Convertible' },
  { value: 'WAGON', label: 'Wagon/Estate' },
  { value: 'VAN', label: 'Van' },
  { value: 'PICKUP', label: 'Pickup' },
  { value: 'MINIVAN', label: 'Minivan' },
  { value: 'CROSSOVER', label: 'Crossover' },
];

export const COMMON_FEATURES = [
  'Air Conditioning', 'Navigation', 'Bluetooth', 'USB Connection',
  'Apple CarPlay', 'Android Auto', 'Leather Seats', 'Heated Seats',
  'Sunroof', 'Panoramic Roof', 'Parking Sensors', 'Rear Camera',
  '360° Camera', 'Cruise Control', 'Adaptive Cruise Control', 'Lane Assist',
  'Blind Spot Monitor', 'LED Headlights', 'Xenon Headlights',
  'Alloy Wheels', 'Keyless Entry', 'Push Start', 'Electric Seats',
  'Memory Seats', 'Seat Massager', 'Head-Up Display', 'Night Vision',
  'Wireless Charging', 'Premium Sound System', 'Sports Package',
  'Tow Bar', 'Roof Bars', '4WD/AWD', 'Hill Descent Control',
];

export const CURRENT_YEAR = new Date().getFullYear();

export const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - 1989 },
  (_, i) => CURRENT_YEAR - i
);
