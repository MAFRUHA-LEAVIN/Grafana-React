import { PanelPlugin } from '@grafana/data';
import { AnalysisPanel, AnalysisPanelOptions } from 'ui/AnalysisPanel';

let defaults: AnalysisPanelOptions = {
  selectedAnalysisConfiguration: null,
  analysisConfigurations: {},
};

export const plugin = new PanelPlugin<AnalysisPanelOptions>(AnalysisPanel)
  .setPanelOptions((builder) => {
    builder;
  })
  .setDefaults(defaults);
