// Analysis option details
export interface Option {
  optionType: string;
  optionLabel: string;
  dataType: string;
  selectOptions: string[];
  defaultOptionIndex: number;
  mandatory: string;
  description: string;
}

// Option for analysis configuration value
export interface ConfigOption {
  description: string;
  options: Map<string, Option>;
}

// Options for analysis configuration
export interface ConfigOptions {
  optionMap: Map<string, ConfigOption>;
}

// Type for timeseries
export interface Series {
  name?: string;
  rows: any[][];
}

// Payload for analysis request interface
export interface AnalysisPayload {
  rangeData: Series[];
  command: string;
  options: ConfigOptions;
}
