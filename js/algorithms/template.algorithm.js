const templateAlgorithm = {
  code: "template",
  name: "Template",
  description: "Ejemplo base para crear nuevos algoritmos.",
  sections: [
    {
      id: "function",
      title: "Funcion",
      description: "Campos de texto u opciones para la funcion.",
      fields: [
        {
          key: "functionExpression",
          label: "Funcion f(x)",
          type: "text",
          defaultValue: "x^2 - 2",
          hint: "Usa una expresion valida en terminos de x.",
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
          hint: "Semilla para el algoritmo.",
        },
      ],
    },
  ],
  solve(inputParams) {
    const start = performance.now();

    const elapsedMs = Math.round((performance.now() - start) * 1000) / 1000;

    return {
      algorithmCode: this.code,
      algorithmName: this.name,
      resultValue: inputParams.initialGuess,
      iterations: 0,
      error: 0,
      elapsedMs,
      summary: "Resultado de ejemplo.",
      outputs: {
        customOutput: inputParams.initialGuess,
      },
    };
  },
};

globalThis.NumericRegistry?.registerAlgorithm(templateAlgorithm);
