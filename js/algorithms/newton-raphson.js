function readNewtonParam(params, key, fallback) {
  const value = params[key];
  return Number.isFinite(value) ? value : fallback;
}

const newtonMethodSkill = globalThis.NumericMethodSkill;

const newtonRaphsonAlgorithm = (newtonMethodSkill?.create || ((value) => value))({
  code: "newton-raphson",
  name: "Newton-Raphson",
  category: "Raices",
  description: "",
  supportsCustomFunction: true,
  functionDefault: "x^3 - x - 4",
  functionHint: "Usa x, + - * / ^ y funciones como sin, cos, exp, log, sqrt.",
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
    tableDataKey: "newtonLog",
    tableColumns: [
      { key: "iteration", label: "Iter" },
      { key: "x", label: "x_n" },
      { key: "fx", label: "f(x_n)" },
      { key: "dfx", label: "f'(x_n)" },
      { key: "nextX", label: "x_{n+1}" },
      { key: "errorAbs", label: "|x_{n+1}-x_n|" },
    ],
    visualizationMode: "default",
  },
  theory: {
    title: "Teoria del Metodo de Newton-Raphson",
    intro:
      "Segun el documento 02A, Newton-Raphson busca la raiz de f(x)=0 aproximando localmente la funcion mediante su recta tangente.",
    cards: [
      {
        title: "Definicion y principio",
        paragraphs: [
          "Es un algoritmo iterativo para encontrar aproximaciones precisas de ceros de funciones no lineales.",
          "La raiz de la tangente en x_n se usa como la siguiente aproximacion.",
        ],
        formulas: [
          String.raw`\[f(x)=0\]`,
          String.raw`\[x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}\]`,
        ],
      },
      {
        title: "Interpretacion geometrica",
        paragraphs: [
          "Cada iteracion traza la tangente en (x_n, f(x_n)) y toma su interseccion con el eje x.",
          "Ese corte genera x_{n+1}, que idealmente acerca rapidamente a la raiz.",
        ],
        formulas: [
          String.raw`\[\text{Tangente en }x_n\Rightarrow\text{nuevo corte en }x_{n+1}\]`,
        ],
      },
      {
        title: "Ventajas",
        paragraphs: [
          "Convergencia cuadratica cuando el punto inicial esta suficientemente cerca de la raiz.",
          "Implementacion relativamente simple cuando se dispone de la derivada.",
        ],
        formulas: [
          String.raw`\[|e_{n+1}|\approx C|e_n|^2\]`,
        ],
      },
      {
        title: "Limitaciones y reglas de uso",
        paragraphs: [
          "Puede divergir si el punto inicial no es adecuado.",
          "Falla cuando f'(x_n)=0 o es muy cercana a cero.",
          "Requiere conocer o estimar la derivada de la funcion.",
        ],
        formulas: [
          String.raw`\[f'(x_n)\neq 0\]`,
        ],
      },
    ],
    graphTitle: "Grafico conceptual",
    graphDescription:
      "Caso del documento para busqueda de raiz: f(x)=x^3-x-4 con aproximacion inicial x0=1.",
    graphFunctionExpression: "x^3 - x - 4",
    graphDomain: { min: -3.2, max: 3.2 },
    graphYRange: { min: -5, max: 22 },
    graphInterval: { a: 1, b: 1.8 },
  },
  example: {
    title: "Ejemplo guiado",
    intro:
      "Caso del PDF: f(x)=x^3-x-4, x0=1.0 y tolerancia=1e-6. La raiz aproximada reportada es x≈1.79632.",
    steps: [
      {
        title: "Paso 1: Definir funcion y derivada",
        paragraphs: [
          "Se formula el problema de raiz y su derivada para aplicar la iteracion.",
        ],
        formulas: [
          String.raw`\[f(x)=x^3-x-4\]`,
          String.raw`\[f'(x)=3x^2-1\]`,
        ],
      },
      {
        title: "Paso 2: Primeras iteraciones",
        paragraphs: [
          "Con x0=1, el documento muestra saltos iniciales grandes y posterior estabilizacion.",
        ],
        formulas: [
          String.raw`\[x_1=1-\frac{f(1)}{f'(1)}=1-\frac{-4}{2}=3\]`,
          String.raw`\[x_2\approx2.23077,\quad x_3\approx1.88219\]`,
        ],
      },
      {
        title: "Paso 3: Convergencia",
        paragraphs: [
          "Repitiendo la iteracion hasta tolerancia, se obtiene la raiz aproximada indicada por el documento.",
        ],
        formulas: [
          String.raw`\[x\approx1.79632\]`,
          String.raw`\[|x_{n+1}-x_n|\leq10^{-6}\]`,
        ],
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
          hint: "Caso del documento: x^3 - x - 4",
          type: "text",
          defaultValue: "x^3 - x - 4",
          required: true,
        },
        {
          key: "derivativeExpression",
          label: "Derivada f'(x)",
          hint: "Caso del documento: 3*x^2 - 1",
          type: "text",
          defaultValue: "3*x^2 - 1",
          required: true,
        },
      ],
    },
    {
      id: "config",
      title: "Control de iteracion",
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
          hint: "Caso del documento: 1e-6",
          type: "number",
          defaultValue: 0.000001,
        },
        {
          key: "maxIterations",
          label: "Max iteraciones",
          hint: "Tope de seguridad",
          type: "number",
          integer: true,
          defaultValue: 50,
        },
      ],
    },
  ],
  solve(inputParams) {
    const start = performance.now();
    const functionExpression =
      String(inputParams.functionExpression || this.functionDefault).trim();
    const derivativeExpression = String(
      inputParams.derivativeExpression || "3*x^2 - 1"
    ).trim();

    const evaluatorFactory = globalThis.NumericExpression?.createEvaluator;
    if (typeof evaluatorFactory !== "function") {
      throw new TypeError("No se pudo inicializar el evaluador de funciones.");
    }

    const functionEvaluator = evaluatorFactory(functionExpression, this.functionDefault);
    const derivativeEvaluator = evaluatorFactory(derivativeExpression, "3*x^2 - 1");

    const tolerance = readNewtonParam(inputParams, "tolerance", 0.000001);
    const maxIterations = Math.trunc(readNewtonParam(inputParams, "maxIterations", 50));
    let currentX = readNewtonParam(inputParams, "initialGuess", 1);

    if (!Number.isFinite(currentX)) {
      throw new TypeError("El valor inicial debe ser numerico.");
    }

    if (tolerance <= 0) {
      throw new Error("La tolerancia debe ser mayor que cero.");
    }

    if (maxIterations <= 0) {
      throw new Error("El maximo de iteraciones debe ser mayor que cero.");
    }

    const derivativeEpsilon = 1e-12;
    let resultValue = currentX;
    let error = Number.POSITIVE_INFINITY;
    let iterations = 0;
    let stopReason = "Maximo de iteraciones alcanzado";
    const newtonLog = [];

    for (let i = 1; i <= maxIterations; i += 1) {
      const fx = functionEvaluator.evaluate(currentX);
      const dfx = derivativeEvaluator.evaluate(currentX);

      if (!Number.isFinite(fx) || !Number.isFinite(dfx)) {
        throw new TypeError("f(x) o f'(x) produjo un valor no finito.");
      }

      if (Math.abs(dfx) <= derivativeEpsilon) {
        throw new Error(
          "f'(x_n) es cero o muy cercana a cero; Newton-Raphson no puede continuar."
        );
      }

      const nextX = currentX - fx / dfx;
      if (!Number.isFinite(nextX)) {
        throw new TypeError("La iteracion produjo un valor no finito.");
      }

      const errorAbs = Math.abs(nextX - currentX);
      const fAtNext = functionEvaluator.evaluate(nextX);
      const segmentMin = Math.min(currentX, nextX);
      const segmentMax = Math.max(currentX, nextX);

      newtonLog.push({
        iteration: i,
        x: currentX,
        fx,
        dfx,
        nextX,
        errorAbs,
        result: nextX,
        a: segmentMin,
        b: segmentMax,
        midpoint: nextX,
        fMidpoint: fAtNext,
        nextLower: segmentMin,
        nextUpper: segmentMax,
      });

      iterations = i;
      resultValue = nextX;
      error = errorAbs;

      if (errorAbs <= tolerance) {
        stopReason = "|x_{n+1} - x_n| <= tolerancia";
        break;
      }

      if (Math.abs(fAtNext) <= tolerance) {
        stopReason = "|f(x_{n+1})| <= tolerancia";
        break;
      }

      currentX = nextX;
    }

    const elapsedMs = Math.round((performance.now() - start) * 1000) / 1000;

    return {
      algorithmCode: this.code,
      algorithmName: this.name,
      functionExpression: functionEvaluator.source,
      resultValue,
      iterations,
      error,
      elapsedMs,
      summary: `Raiz aproximada por Newton-Raphson para f(x) = ${functionEvaluator.source}. Criterio: ${stopReason}.`,
      outputs: {
        initialGuess: readNewtonParam(inputParams, "initialGuess", 1),
        derivativeExpression: derivativeEvaluator.source,
        tolerance,
        maxIterations,
        fAtResult: functionEvaluator.evaluate(resultValue),
        derivativeAtResult: derivativeEvaluator.evaluate(resultValue),
        stopReason,
      },
      newtonLog,
    };
  },
});

globalThis.NumericRegistry?.registerAlgorithm(newtonRaphsonAlgorithm);
