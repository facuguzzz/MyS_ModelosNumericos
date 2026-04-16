(function initNumericExpression(global) {
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

  function createEvaluator(expression, fallbackExpression) {
    const source = String(expression || fallbackExpression || "").trim();
    if (!source) {
      throw new Error("Debes ingresar una funcion en terminos de x.");
    }

    if (!/^[0-9a-zA-Z_+\-*/^().,\s]+$/.test(source)) {
      throw new Error("La funcion contiene caracteres no permitidos.");
    }

    const normalized = source.replaceAll("^", "**");
    const identifiers = normalized.match(/[A-Za-z_]+/g) || [];

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

  global.NumericExpression = {
    createEvaluator,
  };
})(globalThis);
