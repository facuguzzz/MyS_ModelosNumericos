(function initRegistry(global) {
  const algorithms = [];

  function normalizeAlgorithm(algorithm) {
    if (!algorithm || typeof algorithm !== "object") {
      return null;
    }

    if (!algorithm.code || typeof algorithm.solve !== "function") {
      return null;
    }

    return {
      name: algorithm.code,
      description: "",
      sections: [],
      ...algorithm,
    };
  }

  function registerAlgorithm(algorithm) {
    const normalizedAlgorithm = normalizeAlgorithm(algorithm);
    if (!normalizedAlgorithm) {
      return;
    }

    const existingIndex = algorithms.findIndex(
      (candidate) => candidate.code === normalizedAlgorithm.code
    );

    if (existingIndex >= 0) {
      algorithms[existingIndex] = normalizedAlgorithm;
      return;
    }

    algorithms.push(normalizedAlgorithm);
  }

  function getAlgorithms() {
    return algorithms.slice();
  }

  function getAlgorithmByCode(code) {
    return algorithms.find((algorithm) => algorithm.code === code) || null;
  }

  global.NumericRegistry = {
    registerAlgorithm,
    getAlgorithms,
    getAlgorithmByCode,
  };
})(globalThis);
