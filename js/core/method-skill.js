(function initMethodSkill(global) {
  const defaultConfig = {
    category: "General",
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
      visualizationDescription:
        "Curva de la funcion y evolucion del intervalo en cada iteracion.",
      tableTitle: "Tabla de datos calculados",
      tableColumns: [],
      tableDataKey: "tableRows",
      visualizationMode: "default",
    },
    theory: {
      title: "Teoria",
      intro: "",
      cards: [],
      graphTitle: "",
      graphDescription: "",
    },
    example: {
      title: "Ejemplo",
      intro: "",
      steps: [],
    },
  };

  function mergeCalc(calc) {
    return {
      ...defaultConfig.calc,
      ...(calc || {}),
      metrics:
        Array.isArray(calc?.metrics) && calc.metrics.length > 0
          ? calc.metrics
          : defaultConfig.calc.metrics,
      tableColumns:
        Array.isArray(calc?.tableColumns) && calc.tableColumns.length > 0
          ? calc.tableColumns
          : defaultConfig.calc.tableColumns,
    };
  }

  function create(definition) {
    if (!definition || typeof definition !== "object") {
      throw new TypeError("La definicion del metodo es invalida.");
    }

    if (!definition.code || !definition.name || typeof definition.solve !== "function") {
      throw new TypeError("El metodo debe incluir code, name y solve().");
    }

    return {
      ...definition,
      category: definition.category || defaultConfig.category,
      calc: mergeCalc(definition.calc),
      theory: {
        ...defaultConfig.theory,
        ...(definition.theory || {}),
        cards: Array.isArray(definition.theory?.cards)
          ? definition.theory.cards
          : defaultConfig.theory.cards,
      },
      example: {
        ...defaultConfig.example,
        ...(definition.example || {}),
        steps: Array.isArray(definition.example?.steps)
          ? definition.example.steps
          : defaultConfig.example.steps,
      },
    };
  }

  function renderNarrativeCards(container, cards) {
    container.innerHTML = "";

    (cards || []).forEach((card) => {
      const article = document.createElement("article");
      article.className = "theory-card";

      if (card.title) {
        const title = document.createElement("h3");
        title.textContent = card.title;
        article.appendChild(title);
      }

      (card.paragraphs || []).forEach((text) => {
        const p = document.createElement("p");
        p.textContent = text;
        article.appendChild(p);
      });

      (card.formulas || []).forEach((formula) => {
        const p = document.createElement("p");
        p.className = "math-block";
        p.textContent = formula;
        article.appendChild(p);
      });

      container.appendChild(article);
    });
  }

  global.NumericMethodSkill = {
    create,
    renderNarrativeCards,
  };
})(globalThis);
