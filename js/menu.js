const registry = globalThis.NumericRegistry;
const algorithms = registry ? registry.getAlgorithms() : [];

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

renderMethods();
