export const defaultVegaSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: "container",
  data: {
    values: [
      { Meses: "ENERO", Total: 1073680356 },
      { Meses: "FEBRERO", Total: 994520972 },
      { Meses: "MARZO", Total: 981926666 },
      { Meses: "ABRIL", Total: 998948747 },
      { Meses: "MAYO", Total: 967596833 },
      { Meses: "JUNIO", Total: 910037895 },
      { Meses: "JULIO", Total: 928414848 },
      { Meses: "AGOSTO", Total: 942066275 },
      { Meses: "SEPTIEMBRE", Total: 966095579 },
      { Meses: "OCTUBRE", Total: 979435179 },
      { Meses: "NOVIEMBRE", Total: 980561906 },
      { Meses: "DICIEMBRE", Total: 1017654132 }
    ]
  },
  mark: {
    type: "bar",
    tooltip: true
  },
  encoding: {
    y: {
      field: "Meses",
      type: "nominal",
      sort: "none",
      axis: {
        labelAngle: 0
      }
    },
    x: {
      field: "Total",
      type: "quantitative"
    }
  },
  config: {
    axis: {
      labelFontSize: 12
    }
  }
}; 