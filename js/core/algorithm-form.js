(function initAlgorithmForm(global) {
  function getSections(algorithm) {
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

  function renderSections(container, algorithm) {
    container.innerHTML = "";
    const activeFields = [];

    const sections = getSections(algorithm);

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

      if (Array.isArray(section.notes) && section.notes.length > 0) {
        const notes = document.createElement("ul");
        notes.className = "section-notes";

        section.notes.forEach((note) => {
          const item = document.createElement("li");
          item.textContent = note;
          notes.appendChild(item);
        });

        sectionCard.appendChild(notes);
      }

      const sectionFields = document.createElement("div");
      sectionFields.className = "section-fields";

      (section.fields || []).forEach((field) => {
        activeFields.push(field);
        sectionFields.appendChild(createField(field));
      });

      sectionCard.appendChild(sectionFields);
      container.appendChild(sectionCard);
    });

    return activeFields;
  }

  function collectParams(fields, formData) {
    const params = {};

    fields.forEach((field) => {
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

  global.AlgorithmForm = {
    getSections,
    renderSections,
    collectParams,
  };
})(globalThis);
