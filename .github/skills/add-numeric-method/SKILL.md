---
name: add-numeric-method
description: 'Crea e integra nuevos algoritmos numericos en este proyecto con UI dinamica (Calculo, Teoria, Ejemplo), manteniendo estetica/espaciado, categoria de cartas y contenido basado en PDF.'
argument-hint: 'Metodo y PDF a implementar (ej: Newton-Raphson con PDF 02N)'
user-invocable: true
---

# Add Numeric Method

Skill para agregar un nuevo metodo numerico de forma consistente con la arquitectura actual:
- menu por categorias con cartas,
- solver dinamico por metadatos,
- secciones Calculo/Teoria/Ejemplo personalizables por metodo,
- validaciones y criterio tecnico basados en PDF de referencia.

## When To Use
- Cuando se quiere agregar un algoritmo nuevo a `js/algorithms/`.
- Cuando el metodo requiere parametros, resultados, tabla o teoria diferentes.
- Cuando hay que mantener la misma estetica y espaciados sin romper el layout.

## Required Inputs
- Nombre y codigo del metodo (por ejemplo `newton-raphson`).
- PDF de referencia para teoria, formulas, ejemplo y criterio numerico.
- Categoria del menu (por ejemplo `Raices`, `Sistemas`, `Interpolacion`).

## Procedure
1. Analizar el PDF y extraer la estructura operativa.
   - Identificar: funcion objetivo, entradas, criterio de paro, salidas, tabla de iteraciones, fundamento teorico y ejemplo guiado.
   - Registrar diferencias frente al metodo actual para Calculo, Teoria y Ejemplo.

2. Crear el algoritmo desde plantilla.
   - Duplicar `js/algorithms/template-method.js` a un nuevo archivo en `js/algorithms/`.
   - Completar `code`, `name`, `category`, `sections`, `calc`, `theory`, `example`.
   - Usar `globalThis.NumericMethodSkill.create(...)` para normalizacion.

3. Implementar `solve(inputParams)` con contrato de salida.
   - Incluir metricas principales, `summary`, `outputs` y filas para tabla (`tableRows` o clave en `calc.tableDataKey`).
   - Aplicar validaciones matematicas del PDF.
   - Si hay expresion de funcion, reutilizar el evaluador seguro del proyecto.

4. Integrar el metodo en la app.
   - Registrar con `globalThis.NumericRegistry?.registerAlgorithm(...)`.
   - Cargar el script del algoritmo en `index.html` y `solver.html`.
   - Verificar que aparezca la nueva carta en la categoria correcta.

5. Validar UI dinamica y consistencia visual.
   - Calculo: secciones, labels y valores por defecto correctos.
   - Resultado: metricas, resumen y valores auxiliares correctos.
   - Visualizacion y tabla: titulos, columnas y datos coherentes.
   - Teoria y Ejemplo: contenido fiel al PDF con formulas y graficos segun corresponda.
   - Espaciados, tipografia y estilo respetan el sistema visual existente.
   - Validar ejecucion real en navegador (no solo registro interno): sin errores JS en consola y con carta visible del metodo nuevo.

6. Validar colisiones globales entre scripts.
   - Evitar nombres top-level genericos repetidos entre archivos de `js/algorithms/`.
   - Si se usan `const`/`let` en nivel superior, deben tener nombres unicos por algoritmo o encapsularse en IIFE.
   - Si aparece `Identifier '<name>' has already been declared`, corregir antes de cerrar.

## Decision Points
- Si el PDF define formulas diferentes: actualiza `theory.cards[].formulas` y pasos de `example.steps`.
- Si cambian columnas de iteracion: ajustar `calc.tableColumns` y la estructura retornada por `solve`.
- Si no corresponde grafico teorico: omitir `graphFunctionExpression` y metadata de grafico.
- Si el metodo no usa funcion `f(x)`: remover seccion `function` en `sections`.

## Completion Checks
Usar [completion-checks](./references/completion-checks.md) antes de cerrar el trabajo.

## Resources
- [workflow](./references/workflow.md)
- [new-method-checklist](./assets/new-method-checklist.md)
- Guia general del repo: `../../../GUIA_NUEVO_METODO.md`
- Plantilla base del repo: `../../../js/algorithms/template-method.js`
