import React from 'react';
import { VegaLite } from 'react-vega';
import { VisualizationSpec } from 'vega-embed';
import { FlexibleVegaSpec } from '../../../types/vega';

interface CustomVegaProps {
  spec: FlexibleVegaSpec;
}

export const CustomVegaChart: React.FC<CustomVegaProps> = ({ spec }) => {
  return (
    <div className="custom-vega-container">
      <VegaLite spec={spec as VisualizationSpec} />
    </div>
  );
}; 