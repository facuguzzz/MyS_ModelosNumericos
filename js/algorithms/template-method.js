const methodSkill = globalThis.NumericMethodSkill;

const templateMethod = methodSkill.create({
  code: "template",
  name: "Metodo Template",
  category: "Raices",
  description: "Plantilla base para un metodo nuevo.",

  sections: [
    {
      id: "function",
      title: "Funcion",
      description: "Define la funcion en terminos de x.",
      fields: [
        {
          key: "functionExpression",
          label: "Funcion f(x)",
          type: "text",
          defaultValue: "x^2 - 2",
          hint: "Usa x y operadores + - * / ^",
          required: true,
        },
      ],
    },
    {
      id: "config",
      title: "Parametros",
      fields: [
        {
          key: "initialGuess",
          label: "Valor inicial",
          type: "number",
          defaultValue: 1,
          hint: "Valor inicial del metodo",
        },
      ],
    },
  ],

  calc: {
    metrics: [
      { key: "resultValue", label: "Valor principal" },
      { key: "iterations", label: "Iteraciones" },
      { key: "error", label: "Error" },
      { key: "elapsedMs", label: "Tiempo", suffix: " ms" },
    ],
    summaryLabel: "Resumen",
    outputsTitle: "Valores auxiliares",
    visualizationTitle: "Visualizacion del algoritmo",
    visualizationDescription: "Descripcion de lo que grafica este metodo.",
    tableTitle: "Tabla de datos calculados",
    tableDataKey: "tableRows",
    tableColumns: [
      { key: "iteration", label: "Iter" },
      { key: "x", label: "x" },
      { key: "fx", label: "f(x)" },
    ],
    visualizationMode: "default",
  },

  theory: {
    title: "Teoria del metodo",
    intro: "Resumen teorico basado en el PDF de referencia.",
    cards: [
      {
        title: "Fundamento",
        paragraphs: ["Explicacion del fundamento teorico."],
        formulas: ["\\[x_{n+1}=g(x_n)\\]"],
      },
    ],
    graphTitle: "Grafico teorico",
    graphDescription: "Grafico conceptual de la teoria.",
  },

  example: {
    title: "Ejemplo guiado",
    intro: "Caso numerico sencillo del PDF.",
    steps: [
      {
        title: "Paso 1",
        paragraphs: ["Definir datos iniciales."],
        formulas: ["\\[x_0 = 1\\]"],
      },
      {
        title: "Paso 2",
        paragraphs: ["Aplicar iteraciones."],
      },
    ],
  },

  solve(inputParams) {
    const start = performance.now();

    const value = Number(inputParams.initialGuess ?? 0);
    const elapsedMs = Math.round((performance.now() - start) * 1000) / 1000;

    return {
      algorithmCode: this.code,
      algorithmName: this.name,
      functionExpression: String(inputParams.functionExpression || "x^2 - 2"),
      resultValue: value,
      iterations: 1,
      error: 0,
      elapsedMs,
      summary: "Resultado de plantilla.",
      outputs: {
        sampleOutput: value,
      },
      tableRows: [
        {
          iteration: 1,
          x: value,
          fx: value * value - 2,
        },
      ],
    };
  },
});

globalThis.NumericRegistry?.registerAlgorithm(templateMethod);
