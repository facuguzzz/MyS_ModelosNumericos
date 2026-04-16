const registry = globalThis.NumericRegistry;
const algorithms = registry ? registry.getAlgorithms() : [];

const algorithmDescription = document.querySelector("#algorithmDescription");
const parameterForm = document.querySelector("#parameterForm");
const dynamicSections = document.querySelector("#dynamicSections");
const submitButton = document.querySelector("#submitButton");

const errorText = document.querySelector("#errorText");
const placeholderText = document.querySelector("#placeholderText");
const resultGrid = document.querySelector("#resultGrid");
const resultOutputs = document.querySelector("#resultOutputs");

const resultValue = document.querySelector("#resultValue");
const resultIterations = document.querySelector("#resultIterations");
const resultError = document.querySelector("#resultError");
const resultElapsed = document.querySelector("#resultElapsed");
const resultSummary = document.querySelector("#resultSummary");

let activeAlgorithm = null;
let activeFields = [];

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

  resultValue.textContent = formatNumber(result.resultValue);
  resultIterations.textContent = String(result.iterations);
  resultError.textContent = formatNumber(result.error);
  resultElapsed.textContent = `${formatNumber(result.elapsedMs)} ms`;
  resultSummary.textContent = result.summary;

  resultOutputs.innerHTML = "";
  Object.entries(result.outputs || {}).forEach(([key, value]) => {
    const row = document.createElement("p");
    const name = document.createElement("span");
    name.textContent = key;

    const val = document.createElement("strong");
    val.textContent = formatNumber(value);

    row.appendChild(name);
    row.appendChild(val);
    resultOutputs.appendChild(row);
  });
}

function getAlgorithmSections(algorithm) {
  if (Array.isArray(algorithm.sections) && algorithm.sections.length > 0) {
    return algorithm.sections;
  }

  const fallbackSections = [];

  if (algorithm.supportsCustomFunction) {
    fallbackSections.push({
      id: "function",
      title: "Funcion",
      fields: [
        {
          key: "functionExpression",
          label: "Funcion f(x)",
          type: "text",
          defaultValue: algorithm.functionDefault || "x^3 - x - 2",
          hint:
            algorithm.functionHint ||
            "Define la expresion en terminos de x. Ej: x^3 - x - 2",
          required: true,
        },
      ],
    });
  }

  if (Array.isArray(algorithm.parameters) && algorithm.parameters.length > 0) {
    fallbackSections.push({
      id: "parameters",
      title: "Parametros",
      fields: algorithm.parameters.map((parameter) => ({
        ...parameter,
        type: "number",
      })),
    });
  }

  return fallbackSections;
}

function createField(field) {
  const wrapper = document.createElement("label");
  wrapper.className = "field";

  const label = document.createElement("span");
  label.className = "label";
  label.textContent = field.label;

  const input = document.createElement("input");
  input.type = field.type === "text" ? "text" : "number";
  input.name = field.key;
  input.value = String(field.defaultValue ?? "");

  if (input.type === "number") {
    input.step = "any";
  } else {
    input.autocomplete = "off";
    input.spellcheck = false;
  }

  if (field.placeholder) {
    input.placeholder = field.placeholder;
  }

  wrapper.appendChild(label);
  wrapper.appendChild(input);

  if (field.hint) {
    const hint = document.createElement("small");
    hint.className = "hint";
    hint.textContent = field.hint;
    wrapper.appendChild(hint);
  }

  return wrapper;
}

function renderSections(algorithm) {
  dynamicSections.innerHTML = "";
  activeFields = [];
  algorithmDescription.textContent = algorithm.description || "";

  const sections = getAlgorithmSections(algorithm);

  sections.forEach((section) => {
    const sectionCard = document.createElement("article");
    sectionCard.className = "section-card";

    if (section.title) {
      const sectionTitle = document.createElement("h3");
      sectionTitle.className = "section-title";
      sectionTitle.textContent = section.title;
      sectionCard.appendChild(sectionTitle);
    }

    if (section.description) {
      const sectionDescription = document.createElement("p");
      sectionDescription.className = "section-description";
      sectionDescription.textContent = section.description;
      sectionCard.appendChild(sectionDescription);
    }

    const sectionFields = document.createElement("div");
    sectionFields.className = "section-fields";

    (section.fields || []).forEach((field) => {
      activeFields.push(field);
      sectionFields.appendChild(createField(field));
    });

    sectionCard.appendChild(sectionFields);
    dynamicSections.appendChild(sectionCard);
  });
}

function collectParams(formData) {
  const params = {};

  activeFields.forEach((field) => {
    const rawValue = formData.get(field.key);

    if (field.type === "text") {
      const text = String(rawValue ?? "").trim();
      if (field.required && !text) {
        throw new Error(`El campo "${field.label}" es obligatorio.`);
      }

      params[field.key] = text;
      return;
    }

    const numeric = Number(rawValue);
    if (!Number.isFinite(numeric)) {
      throw new TypeError(`El campo "${field.label}" debe ser numerico.`);
    }

    params[field.key] = field.integer ? Math.trunc(numeric) : numeric;
  });

  return params;
}

function resolveAlgorithm() {
  const methodFromUrl = getMethodFromUrl();
  if (methodFromUrl) {
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

function init() {
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
}

init();
