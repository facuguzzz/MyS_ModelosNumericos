# Workflow detallado

## 1) Extraer criterio del PDF
- Definir objetivo numerico del metodo.
- Enumerar entradas requeridas y dominios validos.
- Definir condicion/es de paro.
- Definir salidas esperadas (valor principal, error, iteraciones, otros).
- Definir tabla de iteraciones (columnas y significado).
- Definir contenido de Teoria y Ejemplo.

## 2) Modelar metadatos del metodo
- `sections`: entradas de Calculo.
- `calc.metrics`: metricas principales.
- `calc.outputsTitle`: titulo de auxiliares.
- `calc.visualizationTitle` y `calc.visualizationDescription`.
- `calc.tableDataKey` y `calc.tableColumns`.
- `theory`: tarjetas, formulas y grafico teorico opcional.
- `example`: pasos guiados.

## 3) Programar solve(inputParams)
- Validar entradas con mensajes claros.
- Ejecutar iteracion/calculo del metodo.
- Armar retorno con contrato estandar del proyecto.
- Mantener trazabilidad (filas de tabla) para explicar convergencia.

## 4) Integrar y registrar
- `NumericRegistry.registerAlgorithm(...)`.
- Script en `index.html` y `solver.html`.
- Confirmar tarjeta en categoria.

## 5) Validar en interfaz
- Revisar desktop y mobile.
- Confirmar que no se rompen espaciados ni layout.
- Confirmar render de formulas y texto de Teoria/Ejemplo.
