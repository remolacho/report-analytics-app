// Tipo flexible para especificaciones de Vega
export interface FlexibleVegaSpec {
  [key: string]: unknown;
  data?: unknown;
  mark?: unknown;
  encoding?: unknown;
  width?: unknown;
  height?: unknown;
  view?: unknown;
  config?: unknown;
}

// Interfaz principal para las especificaciones que vienen del backend
export interface VegaRailsSpec {
  schema: string;
  spec: FlexibleVegaSpec;
} 