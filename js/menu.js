const registry = globalThis.NumericRegistry;
const algorithms = registry ? registry.getAlgorithms() : [];

const methodsGrid = document.querySelector("#methodsGrid");

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

  methodsGrid.innerHTML = algorithms
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
}

renderMethods();
