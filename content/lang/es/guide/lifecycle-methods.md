---
name: Lifecycle Methods
permalink: '/guide/lifecycle-methods'
---

# Métodos del ciclo de vida

> _**Nota:** Si has utilizando Custom Elements de HTML5, es similar a los métodos `attachedCallback` y `detachedCallback`._

Preact invoca los siguientes métodos del ciclo en caso de que estén definidos para un componente:

| Método                      | ¿Cuándo se llama?                                           |
|-----------------------------|-------------------------------------------------------------|
| `componentWillMount`        | antes de montar el componente en el DOM                     |
| `componentDidMount`         | después de montar el componente en el DOM                   |
| `componentWillUnmount`      | antes de remover el componente del DOM                      |
| `componentDidUnmount`       | después de remover el componente del DOM                    |
| `componentWillReceiveProps` | antes de recibir nuevas propiedades                         |
| `shouldComponentUpdate`     | antes de `render()`. Devolver `false` para omitir el render |
| `componentWillUpdate`       | antes de `render()`                                         |
| `componentDidUpdate`        | después de `render()`                                       |
