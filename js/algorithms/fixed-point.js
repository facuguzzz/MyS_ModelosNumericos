function read(params, key, fallback) {
  const value = params[key];
  return Number.isFinite(value) ? value : fallback;
}

const fixedPointMethodSkill = globalThis.NumericMethodSkill;

const fixedPointAlgorithm = (fixedPointMethodSkill?.create || ((value) => value))({
  code: "fixed-point",
  name: "Punto Fijo",
  category: "Raices",
  description: "",
  supportsCustomFunction: true,
  functionDefault: "cos(x)",
  functionHint: "Funcion original f(x) para evaluar cercania a cero. Usa x, + - * / ^ y funciones.",
  calc: {
    metrics: [
      { key: "resultValue", label: "Valor principal" },
      { key: "iterations", label: "Iteraciones" },
      { key: "error", label: "Error" },
      { key: "elapsedMs", label: "Tiempo", suffix: " ms" },
    ],
    summaryLabel: "Resumen",
    outputsTitle: "Valores auxiliares",
    visualizationTitle: "Visualizacion del proceso",
    visualizationDescription: "",
    tableTitle: "Proceso iterativo",
    tableDataKey: "fixedPointLog",
    tableColumns: [
      { key: "iteration", label: "Iter" },
      { key: "xCurrent", label: "x_n" },
      { key: "gX", label: "g(x_n)" },
      { key: "xNext", label: "x_{n+1}" },
      { key: "fAtNext", label: "f(x_{n+1})" },
      { key: "errorAbs", label: "|x_{n+1} - x_n|" },
    ],
    visualizationMode: "default",
  },
  theory: {
    title: "Teoria del Metodo del Punto Fijo",
    intro:
      "A partir del PDF, el metodo busca un valor x* que al evaluarlo en la funcion de iteracion se conserva: g(x*) = x*.",
    cards: [
      {
        title: "Definicion fundamental",
        paragraphs: [
          "Un punto fijo es un valor que no cambia al aplicarle la funcion de iteracion.",
        ],
        formulas: [String.raw`\[g(x^*) = x^*\]`],
      },
      {
        title: "Teorema de Banach",
        paragraphs: [
          "Si X es completo y la funcion es contractiva sobre X, existe un unico punto fijo.",
        ],
        formulas: [
          String.raw`\[\exists!\,x^* \in X\]`,
          String.raw`\[\|g(x)-g(y)\| \leq L\|x-y\|,\quad 0<L<1\]`,
        ],
      },
      {
        title: "Mecanica iterativa",
        paragraphs: [
          "Se parte de un valor inicial x0 y se construye la sucesion iterativa.",
          "Cuando hay convergencia, la sucesion se aproxima al punto fijo.",
        ],
        formulas: [
          String.raw`\[x_{n+1}=g(x_n)\]`,
          String.raw`\[\lim_{n\to\infty}x_n=x^*\]`,
        ],
      },
      {
        title: "Preparacion de la funcion",
        paragraphs: [
          "Se parte de la funcion original f(x)=0 y se reescribe como x=g(x) para iterar.",
          "Caso del documento: f(x)=cos(x), por lo tanto g(x)=cos(x)+x.",
        ],
        formulas: [
          String.raw`\[f(x)=0\]`,
          String.raw`\[x=g(x)\]`,
          String.raw`\[g(x)=\cos(x)+x\]`,
        ],
      },
    ],
    graphTitle: "Grafico conceptual",
    graphDescription:
      "Espacio de evaluacion del documento en el intervalo [-2pi, 2pi] para f(x)=cos(x).",
    graphFunctionExpression: "cos(x)",
    graphDomain: { min: -6.2831853072, max: 6.2831853072 },
    graphYRange: { min: -1.5, max: 1.5 },
    graphInterval: { a: 1, b: 1.5708 },
  },
  example: {
    title: "Ejemplo guiado",
    intro: "Caso del PDF: f(x)=cos(x), g(x)=cos(x)+x, con x0=1.0, tol=1e-5 y max_iter=100.",
    steps: [
      {
        title: "Paso 1: Reescritura para iterar",
        paragraphs: [
          "Se inicia con la funcion original y se la lleva a forma de punto fijo.",
        ],
        formulas: [
          String.raw`\[f(x)=\cos(x)\]`,
          String.raw`\[0=\cos(x)\]`,
          String.raw`\[x=\cos(x)+x\Rightarrow g(x)=\cos(x)+x\]`,
        ],
      },
      {
        title: "Paso 2: Iteraciones iniciales",
        paragraphs: [
          "Con x0=1.0 se aplican iteraciones sucesivas usando x_{n+1}=g(x_n).",
        ],
        formulas: [
          String.raw`\[x_1=\cos(1.0)+1.0\approx1.5403023059\]`,
          String.raw`\[x_2=\cos(x_1)+x_1\approx1.5707916010\]`,
        ],
      },
      {
        title: "Paso 3: Criterio de corte",
        paragraphs: [
          "El algoritmo detiene cuando la diferencia absoluta entre iteraciones es menor a la tolerancia.",
        ],
        formulas: [
          String.raw`\[|x_{n+1}-x_n|<10^{-5}\]`,
        ],
      },
    ],
  },
  sections: [
    {
      id: "function",
      title: "Funcion original",
      description: "",
      fields: [
        {
          key: "functionExpression",
          label: "Funcion f(x)",
          hint: "Caso del documento: cos(x)",
          type: "text",
          defaultValue: "cos(x)",
          required: true,
        },
      ],
    },
    {
      id: "iteration",
      title: "Funcion de iteracion",
      description: "",
      fields: [
        {
          key: "iterationExpression",
          label: "Funcion g(x)",
          hint: "Caso del documento: cos(x) + x",
          type: "text",
          defaultValue: "cos(x) + x",
          required: true,
        },
      ],
    },
    {
      id: "config",
      title: "Control de convergencia",
      description: "",
      fields: [
        {
          key: "initialGuess",
          label: "Valor inicial (x0)",
          hint: "Caso del documento: 1.0",
          type: "number",
          defaultValue: 1,
        },
        {
          key: "tolerance",
          label: "Tolerancia",
          hint: "Caso del documento: 1e-5",
          type: "number",
          defaultValue: 0.00001,
        },
        {
          key: "maxIterations",
          label: "Max iteraciones",
          hint: "Caso del documento: 100",
          type: "number",
          integer: true,
          defaultValue: 100,
        },
      ],
    },
  ],
  solve(inputParams) {
    const start = performance.now();
    const functionExpression =
      String(inputParams.functionExpression || this.functionDefault).trim();
    const iterationExpression = String(
      inputParams.iterationExpression || "cos(x) + x"
    ).trim();

    const evaluatorFactory = globalThis.NumericExpression?.createEvaluator;
    if (typeof evaluatorFactory !== "function") {
      throw new TypeError("No se pudo inicializar el evaluador de funciones.");
    }

    const fEvaluator = evaluatorFactory(functionExpression, this.functionDefault);
    const gEvaluator = evaluatorFactory(iterationExpression, "cos(x) + x");

    const tolerance = read(inputParams, "tolerance", 0.00001);
    const maxIterations = Math.trunc(read(inputParams, "maxIterations", 100));
    let currentX = read(inputParams, "initialGuess", 1);

    if (!Number.isFinite(currentX)) {
      throw new TypeError("El valor inicial debe ser numerico.");
    }

    if (tolerance <= 0) {
      throw new Error("La tolerancia debe ser mayor que cero.");
    }

    if (maxIterations <= 0) {
      throw new Error("El maximo de iteraciones debe ser mayor que cero.");
    }

    let resultValue = currentX;
    let error = Number.POSITIVE_INFINITY;
    let iterations = 0;
    let stopReason = "Maximo de iteraciones alcanzado";
    const fixedPointLog = [];

    for (let i = 1; i <= maxIterations; i += 1) {
      const xNext = gEvaluator.evaluate(currentX);
      const fAtNext = fEvaluator.evaluate(xNext);
      const errorAbs = Math.abs(xNext - currentX);

      if (!Number.isFinite(xNext) || !Number.isFinite(fAtNext)) {
        throw new TypeError(
          "La iteracion produjo un valor no finito. Revisa f(x) o g(x)."
        );
      }

      const segmentMin = Math.min(currentX, xNext);
      const segmentMax = Math.max(currentX, xNext);

      fixedPointLog.push({
        iteration: i,
        xCurrent: currentX,
        gX: xNext,
        xNext,
        fAtNext,
        errorAbs,
        a: segmentMin,
        b: segmentMax,
        midpoint: xNext,
        fMidpoint: fAtNext,
        nextLower: segmentMin,
        nextUpper: segmentMax,
      });

      iterations = i;
      resultValue = xNext;
      error = errorAbs;

      if (errorAbs <= tolerance) {
        stopReason = "|x_{n+1} - x_n| <= tolerancia";
        break;
      }

      currentX = xNext;
    }

    const elapsedMs = Math.round((performance.now() - start) * 1000) / 1000;

    return {
      algorithmCode: this.code,
      algorithmName: this.name,
      functionExpression: fEvaluator.source,
      resultValue,
      iterations,
      error,
      elapsedMs,
      summary: `Aproximacion por Punto Fijo para f(x) = ${fEvaluator.source} usando g(x) = ${gEvaluator.source}. Criterio: ${stopReason}.`,
      outputs: {
        initialGuess: read(inputParams, "initialGuess", 1),
        tolerance,
        maxIterations,
        iterationFunction: gEvaluator.source,
        fAtResult: fEvaluator.evaluate(resultValue),
        stopReason,
      },
      fixedPointLog,
    };
  },
});

globalThis.NumericRegistry?.registerAlgorithm(fixedPointAlgorithm);
