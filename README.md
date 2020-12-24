# It's Alive

Animación en `<canvas>` de código que se escribe solo.

## Cómo funciona

Para que la animación funciona, el código a escribir deberá estar separado en sus respectivas líneas. Cada línea estará compuesta de *tokens*, los cuales son una cadena de caracteres a las que se le asignarán dos colores específicos: el color cuando el *token* no se ha dibujado completamente y el color que tendrá al estar dibujados todos sus caracteres.

El objeto `AliveCode` dibujará, en un `<canvas>`, una a una todas las líneas del código. Para dibujar cada línea hará una iteración por cada uno de los *tokens* que la componen, agregando en cada ciclo de dibujado un nuevo caracter a dicho *token*.

## Forma de uso

Para crear una animación habrá que instanciar un objeto de la clase `AliveCode`, pasándole como argumento del constructor el elemento del `DOM` en el que se posicionará el `<canvas>`.
```js
const aliveCode = new AliveCode(document.getElementById("app"));
```

### Configuración de la fuente

La fuente a utilizar puede ser modificada mendiante dos funciones: `AliveCode.setFontFamily()` y `AliveCode.setFontSize()`, las cuales sirven para establecer la fuente y el tamaño de ésta, respectivamente.

### Configuración de la paleta de colores

Los colores a utilizar por el objeto `AliveCode` están en la variable `AliveCode.colorPalette`, la cual es un arreglo de colores. Esta variable se puede modificar para establecer los colores que se desee. Cada color deberá estar representado como una cadena de caracteres de la forma `rgb(r,g,b)`, `rgb(r,g,b,a)`, `#xxxxxx` u otras formas de definir colores en `CSS`.

### Creación de las líneas y los *tokens*

Para establecer el código a dibujar por el objeto `AliveCode`, habrá que modificar su campo `AliveCode.lines`, otorgándole un arreglo de líneas. Se entenderá como línea a un arreglo de objetos de la clase `TextToken`.

```js
const aliveCode = new AliveCode(document.getElementById("app"));

aliveCode.colorPalette = [
	"rgb(150,150,150)",
	"rgb(220,220,220)"
];

/*
	Las variables mainColorId y preColorId son las posiciones de los
	colores a utilizar dentro del arreglo de colores AliveCod.colorPalette.
*/
const mainColorId = 1;
const preColorId = 0;

aliveCode.lines = [
	// este es el arreglo de líneas
	[
		// esta es una línea, un arreglo de tokens
		new TextToken("Hola Mundo!", mainColorId, preColorId)
	]
];
```