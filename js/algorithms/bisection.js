function read(params, key, fallback) {
  const value = params[key];
  return Number.isFinite(value) ? value : fallback;
}

const methodSkill = globalThis.NumericMethodSkill;

const bisectionAlgorithm = (methodSkill?.create || ((value) => value))({
  code: "bisection",
  name: "Biseccion",
  category: "Raices",
  description: "",
  supportsCustomFunction: true,
  functionDefault: "x^3 - x - 2",
  functionHint: "Puedes usar x, + - * / ^ y funciones como sin, cos, exp, log, sqrt.",
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
    visualizationDescription: "",
    tableTitle: "Proceso iterativo",
    tableDataKey: "iterationsLog",
    tableColumns: [
      { key: "iteration", label: "Iter" },
      { key: "a", label: "a" },
      { key: "b", label: "b" },
      { key: "midpoint", label: "c = (a + b) / 2" },
      { key: "fMidpoint", label: "f(c)" },
      {
        key: "intervalText",
        label: "Nuevo intervalo",
        formatter: (row) => `[${row.nextLower}, ${row.nextUpper}]`,
      },
    ],
    visualizationMode: "default",
  },
  theory: {
    title: "Teoria del Metodo de Biseccion",
    intro:
      "Basado en el teorema de Bolzano: si una funcion continua cambia de signo en un intervalo, existe al menos una raiz dentro de ese intervalo.",
    cards: [
      {
        title: "Condicion de existencia",
        paragraphs: ["f continua en [a,b] y:"],
        formulas: [String.raw`\[f(a)\,f(b) < 0\]`, String.raw`Existe \xi \in (a,b) tal que f(\xi)=0.`],
      },
      {
        title: "Regla de iteracion",
        paragraphs: ["Se calcula el punto medio:"],
        formulas: [String.raw`\[c_n = \frac{a_n+b_n}{2}\]`, "Si f(a_n)f(c_n) < 0, el nuevo intervalo es [a_n,c_n], en caso contrario [c_n,b_n]."],
      },
      {
        title: "Criterio de paro",
        paragraphs: ["Se detiene cuando se cumple alguno de los criterios:"],
        formulas: [String.raw`\[|f(c_n)| \leq \varepsilon\]`, String.raw`\[\frac{b_n-a_n}{2} \leq \varepsilon\]`],
      },
      {
        title: "Cota del error",
        paragraphs: ["Tras n iteraciones:"],
        formulas: [String.raw`\[b_n-a_n = \frac{b_0-a_0}{2^n}\]`, String.raw`\[|\xi-c_n| \leq \frac{b_0-a_0}{2^{n+1}}\]`],
      },
    ],
    graphTitle: "Grafico conceptual",
    graphDescription: "Visualizacion de f(x)=x^3-x-2 y del intervalo inicial [1,2].",
    graphFunctionExpression: "x^3 - x - 2",
    graphDomain: { min: -2.2, max: 2.2 },
    graphYRange: { min: -8, max: 6 },
    graphInterval: { a: 1, b: 2 },
  },
  example: {
    title: "Ejemplo guiado",
    intro: "Resolver f(x)=x^3-x-2=0 en [1,2] con epsilon=10^-3.",
    steps: [
      {
        title: "Paso 1: Verificar Bolzano",
        formulas: [String.raw`\[f(1)=-2,\quad f(2)=4,\quad f(1)f(2)=-8<0\]`],
        paragraphs: ["Existe al menos una raiz en (1,2)."],
      },
      {
        title: "Paso 2: Primeras iteraciones",
        formulas: [String.raw`\[c_1=\frac{1+2}{2}=1.5,\quad f(c_1)=-0.125\]`, String.raw`\[c_2=\frac{1.5+2}{2}=1.75,\quad f(c_2)=1.609375\]`],
        paragraphs: ["Nuevo intervalo tras c1: [1.5,2].", "Nuevo intervalo tras c2: [1.5,1.75]."],
      },
      {
        title: "Paso 3: Continuar hasta tolerancia",
        paragraphs: ["Repitiendo el proceso se obtiene una raiz aproximada cercana a 1.521."],
        formulas: [String.raw`\[\frac{b_n-a_n}{2} \leq 10^{-3}\]`],
      },
    ],
  },
  sections: [
    {
      id: "function",
      title: "Funcion",
      description: "",
      fields: [
        {
          key: "functionExpression",
          label: "Funcion f(x)",
          hint:
            "Usa x y operadores + - * / ^. Tambien puedes usar sin, cos, exp, log y sqrt.",
          type: "text",
          defaultValue: "x^3 - x - 2",
          required: true,
        },
      ],
    },
    {
      id: "config",
      title: "Intervalo y control",
      description: "",
      fields: [
        {
          key: "lowerBound",
          label: "Limite inferior (a)",
          hint: "Inicio del intervalo",
          type: "number",
          defaultValue: 1,
        },
        {
          key: "upperBound",
          label: "Limite superior (b)",
          hint: "Fin del intervalo",
          type: "number",
          defaultValue: 2,
        },
        {
          key: "tolerance",
          label: "Tolerancia",
          hint: "Criterio de corte",
          type: "number",
          defaultValue: 0.0001,
        },
        {
          key: "maxIterations",
          label: "Max iteraciones",
          hint: "Tope de iteraciones",
          type: "number",
          integer: true,
          defaultValue: 50,
        },
      ],
    },
  ],
  parameters: [
    {
      key: "lowerBound",
      label: "Limite inferior (a)",
      hint: "Inicio del intervalo",
      defaultValue: 1,
    },
    {
      key: "upperBound",
      label: "Limite superior (b)",
      hint: "Fin del intervalo",
      defaultValue: 2,
    },
    {
      key: "tolerance",
      label: "Tolerancia",
      hint: "Criterio de corte",
      defaultValue: 0.0001,
    },
    {
      key: "maxIterations",
      label: "Max iteraciones",
      hint: "Tope de iteraciones",
      defaultValue: 50,
    },
  ],
  solve(inputParams) {
    const start = performance.now();
    const functionExpression =
      String(inputParams.functionExpression || this.functionDefault).trim();
    const evaluatorFactory = globalThis.NumericExpression?.createEvaluator;
    if (typeof evaluatorFactory !== "function") {
      throw new TypeError("No se pudo inicializar el evaluador de funciones.");
    }

    const evaluator = evaluatorFactory(functionExpression, this.functionDefault);

    let lowerBound = read(inputParams, "lowerBound", 1);
    let upperBound = read(inputParams, "upperBound", 2);
    const tolerance = read(inputParams, "tolerance", 0.0001);
    const maxIterations = Math.trunc(read(inputParams, "maxIterations", 50));

    if (lowerBound >= upperBound) {
      throw new Error("El intervalo debe cumplir a < b.");
    }

    if (tolerance <= 0) {
      throw new Error("La tolerancia debe ser mayor que cero.");
    }

    if (maxIterations <= 0) {
      throw new Error("El maximo de iteraciones debe ser mayor que cero.");
    }

    let fLower = evaluator.evaluate(lowerBound);
    const fUpper = evaluator.evaluate(upperBound);
    const bolzanoProduct = fLower * fUpper;

    if (bolzanoProduct >= 0) {
      throw new Error(
        "No se cumple Bolzano: se requiere f(a) * f(b) < 0 para garantizar raiz."
      );
    }

    let root = lowerBound;
    let error = Math.abs(upperBound - lowerBound);
    let iterations = 0;
    let stopReason = "Maximo de iteraciones alcanzado";
    const iterationsLog = [];

    for (let i = 1; i <= maxIterations; i += 1) {
      iterations = i;
      const currentLower = lowerBound;
      const currentUpper = upperBound;
      const midpoint = (lowerBound + upperBound) / 2;
      const fMid = evaluator.evaluate(midpoint);
      error = Math.abs(upperBound - lowerBound) / 2;
      root = midpoint;

      let nextLower = currentLower;
      let nextUpper = currentUpper;

      if (fLower * fMid < 0) {
        nextUpper = midpoint;
      } else {
        nextLower = midpoint;
      }

      iterationsLog.push({
        iteration: i,
        a: currentLower,
        b: currentUpper,
        midpoint,
        fMidpoint: fMid,
        nextLower,
        nextUpper,
      });

      lowerBound = nextLower;
      upperBound = nextUpper;

      if (Math.abs(fMid) <= tolerance) {
        stopReason = "|f(c)| <= tolerancia";
        break;
      }

      if (error <= tolerance) {
        stopReason = "(b - a) / 2 <= tolerancia";
        break;
      }

      fLower = evaluator.evaluate(lowerBound);
    }

    const elapsedMs = Math.round((performance.now() - start) * 1000) / 1000;

    return {
      algorithmCode: this.code,
      algorithmName: this.name,
      functionExpression: evaluator.source,
      resultValue: root,
      iterations,
      error,
      elapsedMs,
      summary: `Raiz aproximada para f(x) = ${evaluator.source}. Criterio: ${stopReason}.`,
      outputs: {
        bolzanoProduct,
        fAtRoot: evaluator.evaluate(root),
        finalLowerBound: lowerBound,
        finalUpperBound: upperBound,
        stopReason,
      },
      iterationsLog,
    };
  },
});

globalThis.NumericRegistry?.registerAlgorithm(bisectionAlgorithm);
