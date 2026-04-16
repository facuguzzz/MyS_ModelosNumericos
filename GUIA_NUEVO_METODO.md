# Guia para agregar un nuevo metodo

Esta guia mantiene la estetica actual y reutiliza la Skill del proyecto.

## 1) Crear el archivo del algoritmo

Crear un nuevo archivo en `js/algorithms/` tomando como base `js/algorithms/template-method.js`.

## 2) Definir metadatos minimos

Campos obligatorios:
- `code`
- `name`
- `solve(inputParams)`

Campos recomendados:
- `category` para agrupar la carta en el menu
- `sections` para la seccion Calculo (parametros de entrada)
- `calc` para personalizar resultados, tabla y visualizacion
- `theory` para la pestaña Teoria
- `example` para la pestaña Ejemplo

## 3) Calculo

Para entradas diferentes:
- Definir `sections` con campos `type: "number" | "text"`, `label`, `key`, `hint`, `defaultValue`.

Para salidas diferentes:
- Definir `calc.metrics` con los campos a mostrar.
- Retornar esos campos desde `solve`.
- Definir `calc.tableColumns` y retornar filas en `tableRows` o en la clave configurada en `calc.tableDataKey`.

## 4) Teoria

- Completar `theory.title`, `theory.intro`.
- Cargar `theory.cards` con `title`, `paragraphs[]` y `formulas[]`.
- Las formulas se escriben como texto LaTeX, por ejemplo: `\\[c_n = \\frac{a_n+b_n}{2}\\]`.

## 5) Ejemplo

- Completar `example.title`, `example.intro`.
- Cargar `example.steps` con el mismo formato de tarjetas.

## 6) Registrar y cargar script

- Al final del archivo: `globalThis.NumericRegistry?.registerAlgorithm(miMetodo);`
- Agregar el script en `index.html` y `solver.html`.

## 7) Regla de PDF

Cuando se agrega un metodo nuevo:
- usar el PDF de referencia para teoria, formulas, ejemplo y criterio numerico,
- mantener estilo y espaciados actuales,
- no inventar contenido fuera del criterio usado en el proyecto.

## 8) Checklist rapido

- [ ] El metodo aparece como carta en la categoria correcta.
- [ ] Calculo renderiza parametros correctos.
- [ ] Resultado muestra metricas correctas.
- [ ] Valores auxiliares correctos.
- [ ] Visualizacion y tabla coherentes con el algoritmo.
- [ ] Teoria y Ejemplo cargan contenido del PDF.

## 9) Checklist operativo (5 pasos)

1. Elegir PDF y extraer estructura minima del metodo.
	- Funcion objetivo.
	- Entradas requeridas.
	- Criterio de paro.
	- Tabla de iteraciones esperada.
	- Fundamento teorico y ejemplo.

2. Copiar plantilla y definir la Skill del metodo.
	- Duplicar `js/algorithms/template-method.js`.
	- Completar `code`, `name`, `category`, `sections`, `calc`, `theory`, `example`.

3. Implementar `solve(inputParams)` con salida estandar.
	- Retornar `summary`, `outputs`, metricas configuradas y filas de tabla.
	- Respetar validaciones numericas del PDF.

4. Registrar metodo y cargar scripts.
	- Registrar con `NumericRegistry.registerAlgorithm(...)`.
	- Incluir script en `index.html` y `solver.html`.

5. Validar extremo a extremo.
	- Menu por categoria.
	- Calculo dinamico.
	- Resultados/tabla/visualizacion.
	- Teoria y Ejemplo con contenido del PDF.
