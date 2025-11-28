export enum CategoryId {
  FINANCIAL = 'financial',
  HEALTH = 'health',
  MATH = 'math',
  PHYSICS = 'physics',
  CHEMISTRY = 'chemistry',
  CONSTRUCTION = 'construction',
  SPORTS = 'sports',
  ECOLOGY = 'ecology',
  EVERYDAY = 'everyday',
  CONVERSIONS = 'conversions'
}

export interface Category {
  id: CategoryId;
  name: string;
  iconName: string;
  description: string;
  color: string;
}

export interface CalculatorInput {
  name: string;
  label: string;
  type: 'number' | 'text' | 'select';
  options?: string[]; // For select
  placeholder?: string;
  unit?: string;
  defaultValue?: string;
}

export interface CalculatorDef {
  id: string;
  categoryId: CategoryId;
  name: string;
  description: string;
  inputs?: CalculatorInput[]; // If defined, we build a form. If undefined, we use "AI Mode" generic input.
  popular?: boolean;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

export interface TrendDataPoint {
  label: string;
  primary: number;   // e.g. Balance or Total Value
  secondary?: number; // e.g. Interest Paid or Principal
}

export interface CalculationResult {
  result: string | number;
  unit?: string;
  details?: string;
  steps?: string[];
  chartData?: ChartDataPoint[];
  trendData?: TrendDataPoint[];
}