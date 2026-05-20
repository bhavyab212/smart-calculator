// ── Scientific Constants (CODATA 2018 recommended values) ──────────────────

export interface SciConstant {
  symbol: string;
  name: string;
  value: number;
  unit: string;
  category: 'Universal' | 'Electromagnetic' | 'Atomic' | 'PhysicoChem' | 'Adopted';
}

export const SCIENTIFIC_CONSTANTS: SciConstant[] = [
  // Universal
  { symbol: 'c',   name: 'Speed of light in vacuum',    value: 299792458,           unit: 'm/s',          category: 'Universal' },
  { symbol: 'h',   name: 'Planck constant',              value: 6.62607015e-34,      unit: 'J·s',          category: 'Universal' },
  { symbol: 'ℏ',   name: 'Reduced Planck constant',      value: 1.054571817e-34,     unit: 'J·s',          category: 'Universal' },
  { symbol: 'μ₀',  name: 'Magnetic constant',            value: 1.25663706212e-6,    unit: 'N/A²',         category: 'Universal' },
  { symbol: 'ε₀',  name: 'Electric constant',            value: 8.8541878128e-12,    unit: 'F/m',          category: 'Universal' },
  { symbol: 'Z₀',  name: 'Characteristic impedance',     value: 376.730313668,       unit: 'Ω',            category: 'Universal' },
  { symbol: 'G',   name: 'Gravitational constant',       value: 6.67430e-11,         unit: 'N·m²/kg²',     category: 'Universal' },
  { symbol: 'gn',  name: 'Standard acceleration gravity',value: 9.80665,             unit: 'm/s²',         category: 'Universal' },

  // Electromagnetic
  { symbol: 'e',   name: 'Elementary charge',            value: 1.602176634e-19,     unit: 'C',            category: 'Electromagnetic' },
  { symbol: 'eV',  name: 'Electron volt',                value: 1.602176634e-19,     unit: 'J',            category: 'Electromagnetic' },
  { symbol: 'Φ₀',  name: 'Magnetic flux quantum',        value: 2.067833848e-15,     unit: 'Wb',           category: 'Electromagnetic' },
  { symbol: 'G₀',  name: 'Conductance quantum',          value: 7.748091729e-5,      unit: 'S',            category: 'Electromagnetic' },
  { symbol: 'KJ',  name: 'Josephson constant',           value: 483597.8484e9,       unit: 'Hz/V',         category: 'Electromagnetic' },
  { symbol: 'RK',  name: 'von Klitzing constant',        value: 25812.80745,         unit: 'Ω',            category: 'Electromagnetic' },
  { symbol: 'μB',  name: 'Bohr magneton',                value: 9.2740100783e-24,    unit: 'J/T',          category: 'Electromagnetic' },
  { symbol: 'μN',  name: 'Nuclear magneton',             value: 5.0507837461e-27,    unit: 'J/T',          category: 'Electromagnetic' },

  // Atomic & Nuclear
  { symbol: 'me',  name: 'Electron mass',                value: 9.1093837015e-31,    unit: 'kg',           category: 'Atomic' },
  { symbol: 'mp',  name: 'Proton mass',                  value: 1.67262192369e-27,   unit: 'kg',           category: 'Atomic' },
  { symbol: 'mn',  name: 'Neutron mass',                 value: 1.67492749804e-27,   unit: 'kg',           category: 'Atomic' },
  { symbol: 'mμ',  name: 'Muon mass',                    value: 1.883531627e-28,     unit: 'kg',           category: 'Atomic' },
  { symbol: 'α',   name: 'Fine structure constant',      value: 7.2973525693e-3,     unit: '',             category: 'Atomic' },
  { symbol: 'Ry',  name: 'Rydberg constant',             value: 10973731.568160,     unit: '1/m',          category: 'Atomic' },
  { symbol: 'a₀',  name: 'Bohr radius',                  value: 5.29177210903e-11,   unit: 'm',            category: 'Atomic' },
  { symbol: 'Eh',  name: 'Hartree energy',               value: 4.3597447222071e-18, unit: 'J',            category: 'Atomic' },
  { symbol: 'c₁',  name: 'First radiation constant',     value: 3.741771852e-16,     unit: 'W·m²',         category: 'Atomic' },
  { symbol: 'c₂',  name: 'Second radiation constant',    value: 1.438776877e-2,      unit: 'm·K',          category: 'Atomic' },

  // Physico-Chemical
  { symbol: 'NA',  name: 'Avogadro constant',            value: 6.02214076e23,       unit: '1/mol',        category: 'PhysicoChem' },
  { symbol: 'mu',  name: 'Atomic mass constant',         value: 1.66053906660e-27,   unit: 'kg',           category: 'PhysicoChem' },
  { symbol: 'F',   name: 'Faraday constant',             value: 96485.33212,         unit: 'C/mol',        category: 'PhysicoChem' },
  { symbol: 'R',   name: 'Molar gas constant',           value: 8.314462618,         unit: 'J/(mol·K)',    category: 'PhysicoChem' },
  { symbol: 'k',   name: 'Boltzmann constant',           value: 1.380649e-23,        unit: 'J/K',          category: 'PhysicoChem' },
  { symbol: 'Vm',  name: 'Molar volume (STP)',           value: 22.41396954e-3,      unit: 'm³/mol',       category: 'PhysicoChem' },
  { symbol: 'σ',   name: 'Stefan-Boltzmann constant',   value: 5.670374419e-8,      unit: 'W/(m²·K⁴)',   category: 'PhysicoChem' },
  { symbol: 'b',   name: 'Wien displacement constant',   value: 2.897771955e-3,      unit: 'm·K',          category: 'PhysicoChem' },
  { symbol: 'c₃',  name: 'Third radiation constant',     value: 3.002916077e-26,     unit: 'J·m',          category: 'PhysicoChem' },
  { symbol: 'atm', name: 'Standard atmosphere',          value: 101325,              unit: 'Pa',           category: 'Adopted' },
];

// ── Unit Conversions (NIST SP811) ──────────────────────────────────────────

export interface UnitConversion {
  from: string;
  to: string;
  factor: number;   // result = value * factor (for linear) or use fn
  fn?: (v: number) => number;
  fnInv?: (v: number) => number;
  category: string;
  label: string;
}

export const UNIT_CONVERSIONS: UnitConversion[] = [
  // Length
  { from: 'in',   to: 'cm',  factor: 2.54,           category: 'Length',       label: 'in → cm' },
  { from: 'cm',   to: 'in',  factor: 1/2.54,          category: 'Length',       label: 'cm → in' },
  { from: 'ft',   to: 'm',   factor: 0.3048,          category: 'Length',       label: 'ft → m' },
  { from: 'm',    to: 'ft',  factor: 1/0.3048,        category: 'Length',       label: 'm → ft' },
  { from: 'yd',   to: 'm',   factor: 0.9144,          category: 'Length',       label: 'yd → m' },
  { from: 'mile', to: 'km',  factor: 1.609344,        category: 'Length',       label: 'mile → km' },
  { from: 'km',   to: 'mile',factor: 1/1.609344,      category: 'Length',       label: 'km → mile' },
  { from: 'nm',   to: 'm',   factor: 1e-9,            category: 'Length',       label: 'nm → m' },
  { from: 'Å',    to: 'm',   factor: 1e-10,           category: 'Length',       label: 'Å → m' },
  { from: 'ly',   to: 'm',   factor: 9.4607304725808e15, category: 'Length',   label: 'ly → m' },

  // Area
  { from: 'acre', to: 'm²',  factor: 4046.8564224,    category: 'Area',         label: 'acre → m²' },
  { from: 'm²',   to: 'acre',factor: 1/4046.8564224,  category: 'Area',         label: 'm² → acre' },

  // Volume
  { from: 'gal(US)', to: 'L', factor: 3.785411784,   category: 'Volume',       label: 'gal(US) → L' },
  { from: 'L', to: 'gal(US)', factor: 1/3.785411784, category: 'Volume',       label: 'L → gal(US)' },
  { from: 'gal(UK)', to: 'L', factor: 4.54609,       category: 'Volume',       label: 'gal(UK) → L' },
  { from: 'qt',   to: 'L',   factor: 0.946352946,    category: 'Volume',       label: 'qt → L' },
  { from: 'fl oz', to: 'mL', factor: 29.5735295625,  category: 'Volume',       label: 'fl oz → mL' },
  { from: 'pt',   to: 'L',   factor: 0.473176473,    category: 'Volume',       label: 'pt → L' },

  // Mass
  { from: 'oz',   to: 'g',   factor: 28.349523125,   category: 'Mass',         label: 'oz → g' },
  { from: 'g',    to: 'oz',  factor: 1/28.349523125, category: 'Mass',         label: 'g → oz' },
  { from: 'lb',   to: 'kg',  factor: 0.45359237,     category: 'Mass',         label: 'lb → kg' },
  { from: 'kg',   to: 'lb',  factor: 1/0.45359237,   category: 'Mass',         label: 'kg → lb' },
  { from: 'ton(short)', to: 'kg', factor: 907.18474,   category: 'Mass',         label: 'ton(US) → kg' },
  { from: 'ton(long)',  to: 'kg', factor: 1016.0469088, category: 'Mass',         label: 'ton(UK) → kg' },

  // Velocity
  { from: 'km/h', to: 'm/s', factor: 1/3.6,          category: 'Velocity',     label: 'km/h → m/s' },
  { from: 'm/s',  to: 'km/h',factor: 3.6,            category: 'Velocity',     label: 'm/s → km/h' },
  { from: 'mph',  to: 'm/s', factor: 0.44704,        category: 'Velocity',     label: 'mph → m/s' },
  { from: 'knot', to: 'm/s', factor: 0.514444,       category: 'Velocity',     label: 'knot → m/s' },

  // Pressure
  { from: 'atm',     to: 'Pa',  factor: 101325,      category: 'Pressure',     label: 'atm → Pa' },
  { from: 'mmHg',    to: 'Pa',  factor: 133.322,     category: 'Pressure',     label: 'mmHg → Pa' },
  { from: 'lbf/in²', to: 'kPa', factor: 6.894757,   category: 'Pressure',     label: 'psi → kPa' },
  { from: 'bar',     to: 'Pa',  factor: 100000,      category: 'Pressure',     label: 'bar → Pa' },

  // Energy
  { from: 'kgf·m','to': 'J',  factor: 9.80665,       category: 'Energy',       label: 'kgf·m → J' },
  { from: 'cal₁₅','to': 'J',  factor: 4.18580,       category: 'Energy',       label: 'cal → J' },
  { from: 'BTU',  to: 'J',    factor: 1055.05585262, category: 'Energy',       label: 'BTU → J' },
  { from: 'kWh',  to: 'J',    factor: 3600000,       category: 'Energy',       label: 'kWh → J' },
  { from: 'eV',   to: 'J',    factor: 1.602176634e-19,category: 'Energy',      label: 'eV → J' },
  { from: 'erg',  to: 'J',    factor: 1e-7,          category: 'Energy',       label: 'erg → J' },

  // Power
  { from: 'hp',   to: 'kW',   factor: 0.74569987158,  category: 'Power',       label: 'hp → kW' },
  { from: 'kW',   to: 'hp',   factor: 1/0.74569987158,category: 'Power',       label: 'kW → hp' },

  // Temperature (special: non-linear)
  {
    from: '°F', to: '°C',
    factor: 0, // unused
    fn: (v) => (v - 32) * 5 / 9,
    fnInv: (v) => v * 9 / 5 + 32,
    category: 'Temperature',
    label: '°F → °C',
  },
];

export function applyConversion(conv: UnitConversion, value: number): number {
  if (conv.fn) return conv.fn(value);
  return value * conv.factor;
}
