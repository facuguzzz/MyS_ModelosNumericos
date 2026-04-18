function getRegistry() {
  return globalThis.NumericRegistry || null;
}

function getAlgorithms() {
  const registry = getRegistry();
  return registry && typeof registry.getAlgorithms === "function"
    ? registry.getAlgorithms()
    : [];
}

const activeMethodTitle = document.querySelector("#activeMethodTitle");
const algorithmDescription = document.querySelector("#algorithmDescription");
const parameterForm = document.querySelector("#parameterForm");
const dynamicSections = document.querySelector("#dynamicSections");
const submitButton = document.querySelector("#submitButton");

const errorText = document.querySelector("#errorText");
const placeholderText = document.querySelector("#placeholderText");
const resultGrid = document.querySelector("#resultGrid");
const resultMetrics = document.querySelector("#resultMetrics");
const resultSummaryLabel = document.querySelector("#resultSummaryLabel");
const resultOutputs = document.querySelector("#resultOutputs");
const outputsTitle = document.querySelector("#outputsTitle");
const visualizationPanel = document.querySelector("#visualizationPanel");
const visualizationTitle = document.querySelector("#visualizationTitle");
const visualizationSummary = document.querySelector("#visualizationSummary");
const processCanvas = document.querySelector("#processCanvas");
const plotTooltip = document.querySelector("#plotTooltip");
const iterationsPanel = document.querySelector("#iterationsPanel");
const tableTitle = document.querySelector("#tableTitle");
const iterationsHead = document.querySelector("#iterationsHead");
const iterationsBody = document.querySelector("#iterationsBody");

const theoryTitle = document.querySelector("#theoryTitle");
const theoryIntro = document.querySelector("#theoryIntro");
const theoryCards = document.querySelector("#theoryCards");
const theoryGraphCard = document.querySelector("#theoryGraphCard");
const theoryGraphTitle = document.querySelector("#theoryGraphTitle");
const theoryGraphDescription = document.querySelector("#theoryGraphDescription");
const theoryCanvas = document.querySelector("#theoryCanvas");

const exampleTitle = document.querySelector("#exampleTitle");
const exampleIntro = document.querySelector("#exampleIntro");
const exampleCards = document.querySelector("#exampleCards");

const tabButtons = Array.from(document.querySelectorAll(".tab-button"));
const tabContents = Array.from(document.querySelectorAll(".tab-content"));
const resultSummary = document.querySelector("#resultSummary");

let activeAlgorithm = null;
let activeFields = [];
let processPlotState = null;

function getEvaluatorFactory() {
  return globalThis.NumericExpression?.createEvaluator || null;
}

function getAlgorithmForm() {
  return globalThis.AlgorithmForm || null;
}

function getMethodSkill() {
  return globalThis.NumericMethodSkill || null;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mapX(state, x) {
  return (
    state.plotLeft + ((x - state.xMin) / (state.xMax - state.xMin)) * state.plotWidth
  );
}

function mapY(state, y) {
  return (
    state.plotTop + ((state.yMax - y) / (state.yMax - state.yMin)) * state.plotHeight
  );
}

function findNearestIteration(state, cursorX) {
  let nearest = null;

  state.rows.forEach((row) => {
    const px = mapX(state, row.midpoint);
    const distance = Math.abs(px - cursorX);

    if (!nearest || distance < nearest.distance) {
      nearest = {
        row,
        px,
        py: mapY(state, row.fMidpoint),
        distance,
      };
    }
  });

  return nearest;
}

function hidePlotTooltip() {
  if (plotTooltip) {
    plotTooltip.hidden = true;
  }
}

function showPlotTooltip(state) {
  if (!plotTooltip || !state.hover?.nearest) {
    return;
  }

  const nearest = state.hover.nearest;
  const row = nearest.row;

  plotTooltip.innerHTML = `
    <p><strong>Iteracion ${row.iteration}</strong></p>
    <p>c = ${formatNumber(row.midpoint)}</p>
    <p>f(c) = ${formatNumber(row.fMidpoint)}</p>
    <p>Intervalo: [${formatNumber(row.a)}, ${formatNumber(row.b)}]</p>
    <p>Nuevo: [${formatNumber(row.nextLower)}, ${formatNumber(row.nextUpper)}]</p>
  `;

  const tooltipOffsetX = 14;
  const tooltipOffsetY = 14;
  const maxLeft = state.width - 240;
  const left = clamp(state.hover.mouseX + tooltipOffsetX, 8, maxLeft);
  const top = clamp(state.hover.mouseY + tooltipOffsetY, 8, state.height - 126);

  plotTooltip.style.left = `${left}px`;
  plotTooltip.style.top = `${top}px`;
  plotTooltip.hidden = false;
}

function drawProcessPlot() {
  if (!processPlotState || !processCanvas) {
    return;
  }

  const context = processCanvas.getContext("2d");
  if (!context) {
    return;
  }

  const rect = processCanvas.getBoundingClientRect();
  const dpr = globalThis.devicePixelRatio || 1;
  const width = rect.width;
  const height = rect.height;

  processCanvas.width = Math.max(1, Math.round(width * dpr));
  processCanvas.height = Math.max(1, Math.round(height * dpr));
  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  const state = processPlotState;
  state.width = width;
  state.height = height;
  state.plotLeft = 56;
  state.plotRight = width - 24;
  state.plotTop = 20;
  state.plotBottom = height - 96;
  state.plotWidth = state.plotRight - state.plotLeft;
  state.plotHeight = state.plotBottom - state.plotTop;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "rgba(255, 255, 255, 0.72)";
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(19, 35, 58, 0.14)";
  context.lineWidth = 1;
  const xTicks = 8;
  const yTicks = 6;

  for (let i = 0; i <= xTicks; i += 1) {
    const x = state.plotLeft + (state.plotWidth * i) / xTicks;
    context.beginPath();
    context.moveTo(x, state.plotTop);
    context.lineTo(x, state.plotBottom);
    context.stroke();

    const xValue = state.xMin + ((state.xMax - state.xMin) * i) / xTicks;
    context.fillStyle = "rgba(65, 84, 108, 0.84)";
    context.font = '11px "JetBrains Mono", monospace';
    context.fillText(formatNumber(xValue), x - 18, state.plotBottom + 16);
  }

  for (let i = 0; i <= yTicks; i += 1) {
    const y = state.plotTop + (state.plotHeight * i) / yTicks;
    context.beginPath();
    context.moveTo(state.plotLeft, y);
    context.lineTo(state.plotRight, y);
    context.stroke();

    const yValue = state.yMax - ((state.yMax - state.yMin) * i) / yTicks;
    context.fillStyle = "rgba(65, 84, 108, 0.84)";
    context.font = '11px "JetBrains Mono", monospace';
    context.fillText(formatNumber(yValue), 6, y + 4);
  }

  if (state.yMin <= 0 && state.yMax >= 0) {
    context.strokeStyle = "rgba(15, 79, 106, 0.45)";
    context.lineWidth = 1.2;
    const y0 = mapY(state, 0);
    context.beginPath();
    context.moveTo(state.plotLeft, y0);
    context.lineTo(state.plotRight, y0);
    context.stroke();
  }

  const firstRow = state.rows[0];
  const lastRow = state.rows[state.rows.length - 1];
  if (firstRow && lastRow) {
    context.fillStyle = "rgba(15, 118, 110, 0.06)";
    context.fillRect(
      mapX(state, lastRow.nextLower),
      state.plotTop,
      mapX(state, lastRow.nextUpper) - mapX(state, lastRow.nextLower),
      state.plotHeight
    );

    context.strokeStyle = "rgba(15, 118, 110, 0.36)";
    context.lineWidth = 1.4;
    context.setLineDash([6, 5]);
    context.strokeRect(
      mapX(state, firstRow.a),
      state.plotTop,
      mapX(state, firstRow.b) - mapX(state, firstRow.a),
      state.plotHeight
    );
    context.setLineDash([]);
  }

  context.strokeStyle = "#0f4f6a";
  context.lineWidth = 2.4;
  context.beginPath();

  const samples = 480;
  for (let i = 0; i <= samples; i += 1) {
    const x = state.xMin + ((state.xMax - state.xMin) * i) / samples;
    const y = state.evaluator.evaluate(x);
    const px = mapX(state, x);
    const py = mapY(state, y);

    if (i === 0) {
      context.moveTo(px, py);
    } else {
      context.lineTo(px, py);
    }
  }
  context.stroke();

  context.strokeStyle = "rgba(15, 118, 110, 0.55)";
  context.lineWidth = 1.4;
  context.setLineDash([4, 5]);
  context.beginPath();

  state.rows.forEach((row, index) => {
    const px = mapX(state, row.midpoint);
    const py = mapY(state, row.fMidpoint);

    if (index === 0) {
      context.moveTo(px, py);
    } else {
      context.lineTo(px, py);
    }
  });
  context.stroke();
  context.setLineDash([]);

  state.rows.forEach((row, index) => {
    const px = mapX(state, row.midpoint);
    const py = mapY(state, row.fMidpoint);
    const alpha = 0.3 + 0.7 * ((index + 1) / state.rows.length);

    context.fillStyle = `rgba(15, 118, 110, ${alpha})`;
    context.beginPath();
    context.arc(px, py, 3.3, 0, Math.PI * 2);
    context.fill();
  });

  const bandsTop = state.plotBottom + 18;
  const bandsBottom = state.height - 18;
  const bandsHeight = Math.max(16, bandsBottom - bandsTop);
  const labelStep = Math.max(1, Math.ceil(state.rows.length / 7));

  state.rows.forEach((row, index) => {
    const ratio = state.rows.length === 1 ? 0.5 : index / (state.rows.length - 1);
    const y = bandsTop + ratio * bandsHeight;
    const x1 = mapX(state, row.a);
    const x2 = mapX(state, row.b);
    const alpha = 0.2 + 0.65 * ratio;

    context.strokeStyle = `rgba(15, 118, 110, ${alpha})`;
    context.lineWidth = 2.6;
    context.beginPath();
    context.moveTo(x1, y);
    context.lineTo(x2, y);
    context.stroke();

    if (index === 0 || index === state.rows.length - 1 || index % labelStep === 0) {
      context.fillStyle = "rgba(15, 79, 106, 0.85)";
      context.font = '10px "JetBrains Mono", monospace';
      context.fillText(`k${row.iteration}`, x2 + 6, y + 3);
    }
  });

  if (state.hover?.nearest) {
    const hoverPoint = state.hover.nearest;
    context.strokeStyle = "rgba(11, 89, 100, 0.45)";
    context.lineWidth = 1;
    context.setLineDash([3, 4]);
    context.beginPath();
    context.moveTo(hoverPoint.px, state.plotTop);
    context.lineTo(hoverPoint.px, state.plotBottom);
    context.moveTo(state.plotLeft, hoverPoint.py);
    context.lineTo(state.plotRight, hoverPoint.py);
    context.stroke();
    context.setLineDash([]);

    context.fillStyle = "#0b5964";
    context.beginPath();
    context.arc(hoverPoint.px, hoverPoint.py, 5, 0, Math.PI * 2);
    context.fill();
  }

  context.fillStyle = "rgba(19, 35, 58, 0.9)";
  context.font = '12px "JetBrains Mono", monospace';
  context.fillText(`f(x) = ${state.evaluator.source}`, state.plotLeft, 14);
}

function initProcessPlotInteractions() {
  if (!processCanvas || processCanvas.dataset.bound === "true") {
    return;
  }

  processCanvas.addEventListener("mousemove", (event) => {
    if (!processPlotState) {
      return;
    }

    const rect = processCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    processPlotState.hover = {
      mouseX,
      mouseY,
      nearest: findNearestIteration(processPlotState, mouseX),
    };

    drawProcessPlot();
    showPlotTooltip(processPlotState);
  });

  processCanvas.addEventListener("mouseleave", () => {
    if (!processPlotState) {
      return;
    }

    processPlotState.hover = null;
    hidePlotTooltip();
    drawProcessPlot();
  });

  globalThis.addEventListener("resize", () => {
    if (!processPlotState) {
      return;
    }

    drawProcessPlot();
    hidePlotTooltip();
  });

  processCanvas.dataset.bound = "true";
}

function renderProcessPlot(result) {
  if (!visualizationPanel || !processCanvas) {
    return;
  }

  const calc = getCalcConfig();
  const rowKey = calc.tableDataKey || "iterationsLog";
  const rows = Array.isArray(result[rowKey]) ? result[rowKey] : [];
  if (rows.length === 0) {
    visualizationPanel.hidden = true;
    processPlotState = null;
    hidePlotTooltip();
    return;
  }

  let evaluator;
  try {
    const evaluatorFactory = getEvaluatorFactory();
    if (typeof evaluatorFactory !== "function") {
      throw new TypeError("Sin evaluador de funciones");
    }

    evaluator = evaluatorFactory(result.functionExpression, "x^3 - x - 2");
  } catch {
    visualizationPanel.hidden = true;
    processPlotState = null;
    hidePlotTooltip();
    return;
  }

  const xCandidates = [];
  rows.forEach((row) => {
    xCandidates.push(row.a, row.b, row.midpoint, row.nextLower, row.nextUpper);
  });

  let xMin = Math.min(...xCandidates);
  let xMax = Math.max(...xCandidates);
  const xSpan = Math.max(1e-6, xMax - xMin);
  const xPadding = Math.max(0.3, xSpan * 0.25);
  xMin -= xPadding;
  xMax += xPadding;

  const yCandidates = [0];
  const samples = 340;
  for (let i = 0; i <= samples; i += 1) {
    const x = xMin + ((xMax - xMin) * i) / samples;
    try {
      yCandidates.push(evaluator.evaluate(x));
    } catch {
      continue;
    }
  }

  rows.forEach((row) => {
    yCandidates.push(row.fMidpoint);
  });

  let yMin = Math.min(...yCandidates);
  let yMax = Math.max(...yCandidates);
  const ySpan = Math.max(1e-6, yMax - yMin);
  const yPadding = Math.max(0.5, ySpan * 0.2);
  yMin -= yPadding;
  yMax += yPadding;

  processPlotState = {
    rows,
    evaluator,
    xMin,
    xMax,
    yMin,
    yMax,
    hover: null,
    width: 0,
    height: 0,
    plotLeft: 0,
    plotTop: 0,
    plotRight: 0,
    plotBottom: 0,
    plotWidth: 0,
    plotHeight: 0,
  };

  visualizationTitle.textContent =
    calc.visualizationTitle ?? "Visualizacion del algoritmo";
  visualizationSummary.textContent =
    calc.visualizationDescription ??
    `Curva de f(x) = ${evaluator.source} con ${rows.length} iteraciones.`;

  visualizationPanel.hidden = false;
  initProcessPlotInteractions();
  hidePlotTooltip();
  drawProcessPlot();
}

function typesetMath() {
  const mathJax = globalThis.MathJax;
  if (mathJax?.typesetPromise) {
    mathJax.typesetPromise();
  }
}

function activateTab(tabName) {
  tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tabName);
  });

  tabContents.forEach((content) => {
    const isActive = content.dataset.tabContent === tabName;
    content.hidden = !isActive;
    content.classList.toggle("is-active", isActive);
  });

  if (tabName === "teoria" || tabName === "ejemplo") {
    typesetMath();
  }
}

function initTabs() {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activateTab(button.dataset.tab || "calculo");
    });
  });

  activateTab("calculo");
}

function resolveTheoryGraphConfig() {
  if (!activeAlgorithm) {
    return null;
  }

  const graphConfig = activeAlgorithm.theory?.graphFunctionExpression
    ? activeAlgorithm.theory
    : null;

  const evaluatorFactory = getEvaluatorFactory();
  if (!graphConfig || typeof evaluatorFactory !== "function") {
    return null;
  }

  const evaluator = evaluatorFactory(graphConfig.graphFunctionExpression, "x^3 - x - 2");
  const xMin = graphConfig.graphDomain?.min ?? -2.2;
  const xMax = graphConfig.graphDomain?.max ?? 2.2;
  const yMin = graphConfig.graphYRange?.min ?? -8;
  const yMax = graphConfig.graphYRange?.max ?? 6;

  return {
    graphConfig,
    evaluator,
    xMin,
    xMax,
    yMin,
    yMax,
  };
}

function drawTheoryAxes(context, width, height, mapX, mapY) {
  context.clearRect(0, 0, width, height);
  context.fillStyle = "rgba(255, 255, 255, 0.7)";
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(19, 35, 58, 0.22)";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, mapY(0));
  context.lineTo(width, mapY(0));
  context.moveTo(mapX(0), 0);
  context.lineTo(mapX(0), height);
  context.stroke();
}

function drawTheoryFunction(context, mapX, mapY, evaluator, xMin, xMax) {
  context.strokeStyle = "#0f4f6a";
  context.lineWidth = 2.2;
  context.beginPath();

  const samples = 220;
  for (let i = 0; i <= samples; i += 1) {
    const x = xMin + ((xMax - xMin) * i) / samples;
    const y = evaluator.evaluate(x);
    const px = mapX(x);
    const py = mapY(y);

    if (i === 0) {
      context.moveTo(px, py);
    } else {
      context.lineTo(px, py);
    }
  }
  context.stroke();
}

function drawTheoryGraph() {
  if (!theoryCanvas || !activeAlgorithm) {
    return;
  }

  let resolved;
  try {
    resolved = resolveTheoryGraphConfig();
  } catch {
    resolved = null;
  }

  if (!resolved) {
    if (theoryGraphCard) {
      theoryGraphCard.hidden = true;
    }
    return;
  }

  const { graphConfig, evaluator, xMin, xMax, yMin, yMax } = resolved;

  if (theoryGraphCard) {
    theoryGraphCard.hidden = false;
  }

  theoryGraphTitle.textContent = graphConfig.graphTitle || "Grafico conceptual";
  theoryGraphDescription.textContent =
    graphConfig.graphDescription || `Visualizacion de f(x) = ${evaluator.source}.`;

  const context = theoryCanvas.getContext("2d");
  if (!context) {
    return;
  }

  const width = theoryCanvas.width;
  const height = theoryCanvas.height;

  const mapX = (x) => ((x - xMin) / (xMax - xMin)) * width;
  const mapY = (y) => height - ((y - yMin) / (yMax - yMin)) * height;
  drawTheoryAxes(context, width, height, mapX, mapY);

  const intervalA = graphConfig.graphInterval?.a;
  const intervalB = graphConfig.graphInterval?.b;
  const hasInterval = Number.isFinite(intervalA) && Number.isFinite(intervalB);
  const intervalStart = hasInterval ? mapX(intervalA) : mapX(1);
  const intervalEnd = hasInterval ? mapX(intervalB) : mapX(2);
  context.fillStyle = "rgba(15, 118, 110, 0.12)";
  context.fillRect(intervalStart, 0, intervalEnd - intervalStart, height);

  drawTheoryFunction(context, mapX, mapY, evaluator, xMin, xMax);

  context.fillStyle = "#0f4f6a";
  context.font = '12px "JetBrains Mono", monospace';
  context.fillText(`f(x) = ${evaluator.source}`, 14, 22);
  if (hasInterval) {
    context.fillText(`Intervalo inicial [${intervalA}, ${intervalB}]`, intervalStart + 8, 38);
  }
}

// Obtener el método de los parámetros de URL
function getMethodFromUrl() {
  const params = new URLSearchParams(globalThis.location.search);
  return params.get("method");
}

function formatNumber(value) {
  return Number(value).toLocaleString("es-AR", {
    maximumFractionDigits: 10,
  });
}

function getCalcConfig() {
  return activeAlgorithm?.calc || {};
}

function formatMetricValue(value, metric) {
  if (typeof value === "number") {
    const formatted = formatNumber(value);
    return metric?.suffix ? `${formatted}${metric.suffix}` : formatted;
  }

  if (value === null || value === undefined) {
    return "-";
  }

  return String(value);
}

function renderResultMetrics(result, metrics) {
  resultMetrics.innerHTML = "";

  (metrics || []).forEach((metric) => {
    const card = document.createElement("article");
    card.className = "metric";

    const label = document.createElement("span");
    label.className = "metric-label";
    label.textContent = metric.label;

    const value = document.createElement("strong");
    value.textContent = formatMetricValue(result[metric.key], metric);

    card.appendChild(label);
    card.appendChild(value);
    resultMetrics.appendChild(card);
  });
}

function renderNarrativeSection() {
  if (!activeAlgorithm) {
    return;
  }

  const theory = activeAlgorithm.theory || {};
  const example = activeAlgorithm.example || {};

  theoryTitle.textContent = theory.title || "Teoria";
  theoryIntro.textContent = theory.intro || "";
  exampleTitle.textContent = example.title || "Ejemplo";
  exampleIntro.textContent = example.intro || "";

  const methodSkill = getMethodSkill();

  if (methodSkill?.renderNarrativeCards) {
    methodSkill.renderNarrativeCards(theoryCards, theory.cards || []);
    methodSkill.renderNarrativeCards(exampleCards, example.steps || []);
  } else {
    theoryCards.innerHTML = "";
    exampleCards.innerHTML = "";
  }
}

function clearMessages() {
  errorText.hidden = true;
  errorText.textContent = "";
  placeholderText.hidden = true;
}

function showPlaceholder() {
  resultGrid.hidden = true;
  errorText.hidden = true;
  errorText.textContent = "";
  placeholderText.hidden = false;
  visualizationPanel.hidden = true;
  iterationsPanel.hidden = true;
  iterationsHead.innerHTML = "";
  iterationsBody.innerHTML = "";
  processPlotState = null;
  hidePlotTooltip();
}

function showError(message) {
  resultGrid.hidden = true;
  placeholderText.hidden = true;
  errorText.hidden = false;
  errorText.textContent = message;
}

function showResult(result) {
  clearMessages();
  resultGrid.hidden = false;

  const calc = getCalcConfig();
  renderResultMetrics(result, calc.metrics || []);
  resultSummaryLabel.textContent = calc.summaryLabel || "Resumen";
  outputsTitle.textContent = calc.outputsTitle || "Valores auxiliares";
  tableTitle.textContent = calc.tableTitle || "Tabla de datos calculados";
  resultSummary.textContent = result.summary;

  resultOutputs.innerHTML = "";
  Object.entries(result.outputs || {}).forEach(([key, value]) => {
    const row = document.createElement("p");
    const name = document.createElement("span");
    name.textContent = key;

    const val = document.createElement("strong");
    if (typeof value === "number") {
      val.textContent = formatNumber(value);
    } else {
      val.textContent = String(value);
    }

    row.appendChild(name);
    row.appendChild(val);
    resultOutputs.appendChild(row);
  });

  renderProcessPlot(result);

  const rowKey = calc.tableDataKey || "iterationsLog";
  const rows = Array.isArray(result[rowKey]) ? result[rowKey] : [];
  renderIterations(rows, calc.tableColumns || []);
}

function renderIterations(rows, columns) {
  iterationsHead.innerHTML = "";
  iterationsBody.innerHTML = "";

  if (!Array.isArray(rows) || rows.length === 0) {
    iterationsPanel.hidden = true;
    return;
  }

  const activeColumns = Array.isArray(columns) && columns.length > 0
    ? columns
    : [
        { key: "iteration", label: "Iter" },
        { key: "a", label: "a" },
        { key: "b", label: "b" },
        { key: "midpoint", label: "c = (a + b) / 2" },
        { key: "fMidpoint", label: "f(c)" },
      ];

  activeColumns.forEach((column) => {
    const th = document.createElement("th");
    th.textContent = column.label;
    iterationsHead.appendChild(th);
  });

  rows.forEach((row) => {
    const tableRow = document.createElement("tr");

    activeColumns.forEach((column) => {
      const cell = document.createElement("td");
      const rawValue =
        typeof column.formatter === "function"
          ? column.formatter(row)
          : row[column.key];

      if (typeof rawValue === "number") {
        cell.textContent = formatNumber(rawValue);
      } else {
        cell.textContent = String(rawValue ?? "-");
      }

      tableRow.appendChild(cell);
    });

    iterationsBody.appendChild(tableRow);
  });

  iterationsPanel.hidden = false;
}

function renderSections(algorithm) {
  dynamicSections.innerHTML = "";
  activeFields = [];
  activeMethodTitle.textContent = `Metodo actual: ${algorithm.name}`;
  algorithmDescription.textContent = algorithm.description || "";

  const algorithmForm = getAlgorithmForm();
  if (!algorithmForm) {
    throw new Error("No se pudo inicializar el renderer del formulario.");
  }

  activeFields = algorithmForm.renderSections(dynamicSections, algorithm);
  renderNarrativeSection();
  drawTheoryGraph();
}

function collectParams(formData) {
  const algorithmForm = getAlgorithmForm();
  if (!algorithmForm) {
    throw new Error("No se pudo inicializar el parser del formulario.");
  }

  return algorithmForm.collectParams(activeFields, formData);
}

function resolveAlgorithm() {
  const registry = getRegistry();
  const algorithms = getAlgorithms();
  const methodFromUrl = getMethodFromUrl();
  if (methodFromUrl && registry?.getAlgorithmByCode) {
    const fromUrl = registry.getAlgorithmByCode(methodFromUrl);
    if (fromUrl) {
      return fromUrl;
    }
  }

  return algorithms[0] || null;
}

function selectedAlgorithm() {
  return activeAlgorithm;
}

if (parameterForm) {
  parameterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const algorithm = selectedAlgorithm();
    if (!algorithm) {
      showError("No hay algoritmo seleccionado.");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Calculando...";

    try {
      const formData = new FormData(parameterForm);
      const params = collectParams(formData);

      const result = algorithm.solve(params);
      showResult(result);
    } catch (error) {
      showError(error.message || "Ocurrio un error durante el calculo.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Ejecutar calculo";
    }
  });
}

function init() {
  const registry = getRegistry();
  const algorithms = getAlgorithms();

  if (!registry) {
    showError("No se pudo inicializar el registro de algoritmos.");
    return;
  }

  if (algorithms.length === 0) {
    showError("No hay algoritmos disponibles.");
    return;
  }

  activeAlgorithm = resolveAlgorithm();
  if (!activeAlgorithm) {
    showError("No se encontro un algoritmo valido para cargar.");
    return;
  }

  renderSections(activeAlgorithm);
  showPlaceholder();
  initTabs();
  drawTheoryGraph();
  typesetMath();
}

function initWithRetry(attempt = 0) {
  const maxAttempts = 20;
  const registry = getRegistry();
  const algorithms = getAlgorithms();

  if (!registry || algorithms.length === 0 || !getAlgorithmForm()) {
    if (attempt < maxAttempts) {
      globalThis.setTimeout(() => initWithRetry(attempt + 1), 50);
      return;
    }

    showError("No se pudo cargar el metodo. Recarga la pagina o vuelve al menu.");
    return;
  }

  init();
}

initWithRetry();
