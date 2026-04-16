function buildFunctionEvaluator(expression) {
  const source = String(expression || "x^3 - x - 2").trim();
  if (!source) {
    throw new Error("Debes ingresar una funcion en terminos de x.");
  }

  if (!/^[0-9a-zA-Z_+\-*/^().,\s]+$/.test(source)) {
    throw new Error("La funcion contiene caracteres no permitidos.");
  }

  const normalized = source.replaceAll("^", "**");
  const identifiers = normalized.match(/[A-Za-z_]+/g) || [];
  const allowedIdentifiers = new Set([
    "x",
    "sin",
    "cos",
    "tan",
    "exp",
    "log",
    "sqrt",
    "abs",
    "pow",
    "min",
    "max",
    "PI",
    "E",
  ]);

  for (const identifier of identifiers) {
    if (!allowedIdentifiers.has(identifier)) {
      throw new Error(
        `La funcion usa el identificador no permitido: ${identifier}.`
      );
    }
  }

  const compiled = new Function(
    "x",
    "const { sin, cos, tan, exp, log, sqrt, abs, pow, min, max, PI, E } = Math; return " +
      normalized
  );

  return {
    source,
    evaluate(x) {
      const value = compiled(x);
      if (!Number.isFinite(value)) {
        throw new TypeError(
          "La evaluacion de la funcion no produjo un numero valido."
        );
      }
      return value;
    },
  };
}

function read(params, key, fallback) {
  const value = params[key];
  return Number.isFinite(value) ? value : fallback;
}

const bisectionAlgorithm = {
  code: "bisection",
  name: "Biseccion",
  description: "Busca la raiz de f(x) = x^3 - x - 2 dentro de un intervalo [a, b].",
  supportsCustomFunction: true,
  functionDefault: "x^3 - x - 2",
  functionHint: "Puedes usar x, + - * / ^ y funciones como sin, cos, exp, log, sqrt.",
  sections: [
    {
      id: "function",
      title: "Funcion",
      description: "Define la funcion que quieres resolver.",
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
    const evaluator = buildFunctionEvaluator(functionExpression);

    let lowerBound = read(inputParams, "lowerBound", 1);
    let upperBound = read(inputParams, "upperBound", 2);
    const tolerance = read(inputParams, "tolerance", 0.0001);
    const maxIterations = Math.trunc(read(inputParams, "maxIterations", 50));

    let fLower = evaluator.evaluate(lowerBound);
    const fUpper = evaluator.evaluate(upperBound);

    if (fLower * fUpper > 0) {
      throw new Error(
        "El intervalo no encierra una raiz: f(a) y f(b) tienen el mismo signo."
      );
    }

    let root = lowerBound;
    let error = Math.abs(upperBound - lowerBound);
    let iterations = 0;

    for (let i = 1; i <= maxIterations; i += 1) {
      iterations = i;
      const midpoint = (lowerBound + upperBound) / 2;
      const fMid = evaluator.evaluate(midpoint);
      error = Math.abs(upperBound - lowerBound) / 2;
      root = midpoint;

      if (Math.abs(fMid) <= tolerance || error <= tolerance) {
        break;
      }

      if (fLower * fMid < 0) {
        upperBound = midpoint;
      } else {
        lowerBound = midpoint;
        fLower = fMid;
      }
    }

    const elapsedMs = Math.round((performance.now() - start) * 1000) / 1000;

    return {
      algorithmCode: this.code,
      algorithmName: this.name,
      resultValue: root,
      iterations,
      error,
      elapsedMs,
      summary: `Raiz aproximada para f(x) = ${evaluator.source}.`,
      outputs: {
        fAtRoot: evaluator.evaluate(root),
        finalLowerBound: lowerBound,
        finalUpperBound: upperBound,
      },
    };
  },
};

globalThis.NumericRegistry?.registerAlgorithm(bisectionAlgorithm);
