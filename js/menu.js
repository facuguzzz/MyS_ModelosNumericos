function getRegistry() {
  return globalThis.NumericRegistry || null;
}

function getAlgorithms() {
  const registry = getRegistry();
  return registry && typeof registry.getAlgorithms === "function"
    ? registry.getAlgorithms()
    : [];
}

const methodsGrid = document.querySelector("#methodsGrid");

function groupByCategory(items) {
  return items.reduce((groups, algorithm) => {
    const category = algorithm.category || "General";
    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(algorithm);
    return groups;
  }, {});
}

// Crear tarjetas para cada algoritmo disponible
function renderMethods() {
  const algorithms = getAlgorithms();

  if (algorithms.length === 0) {
    methodsGrid.innerHTML = `
      <div class="no-methods">
        <p>No hay métodos disponibles aún.</p>
      </div>
    `;
    return;
  }

  const categories = groupByCategory(algorithms);

  methodsGrid.innerHTML = Object.entries(categories)
    .map(([category, categoryAlgorithms]) => {
      const cards = categoryAlgorithms
        .map((algorithm) => {
          return `
            <a href="solver.html?method=${encodeURIComponent(algorithm.code)}" class="method-card">
              <article class="card-content">
                <h3>${algorithm.name}</h3>
                <p>${algorithm.description}</p>
                <div class="card-footer">
                  <span class="badge">${algorithm.code}</span>
                  <span class="arrow">→</span>
                </div>
              </article>
            </a>
          `;
        })
        .join("");

      return `
        <section class="category-group">
          <h2 class="category-title">${category}</h2>
          <div class="methods-grid">${cards}</div>
        </section>
      `;
    })
    .join("");
}

function initMenuWithRetry(attempt = 0) {
  const maxAttempts = 20;
  const hasRegistry = Boolean(getRegistry());
  const algorithms = getAlgorithms();

  if (!hasRegistry || algorithms.length === 0) {
    if (attempt < maxAttempts) {
      globalThis.setTimeout(() => initMenuWithRetry(attempt + 1), 50);
      return;
    }
  }

  renderMethods();
}

initMenuWithRetry();
