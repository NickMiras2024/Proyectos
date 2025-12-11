const readline = require('readline');

// Crear la interfaz de readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para pedir un dato al usuario
function pedirDato() {
    return new Promise((resolve) => {
        rl.question('ingresa un dato: ', (respuesta) => {
            resolve(parseFloat(respuesta));
        });
    });
}

// Función de activación Sigmoide
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

// Derivada de la función Sigmoide
function sigmoidDerivative(x) {
    return x * (1 - x);
}

// Inicialización de los pesos con valores aleatorios
function initWeights(size) {
    return Array.from({ length: size }, () => Math.random() * 2 - 1); // Valores entre -1 y 1
}

// Función para hacer el producto punto de dos arrays
function suma(inputs, weights) {
    return inputs.reduce((sum, input, i) => sum + input * weights[i], 0);
}

// Inicialización de las neuronas
let ocultas = [];
let salida = [];

// Crear Neurona
function crearNeurona(numDeDatos, capa) {
    const pesos = initWeights(numDeDatos);
    const bias = Math.random(); // Inicializar el sesgo
    if (capa === 0) {
        salida.push({ pesos, bias });
    } else {
        ocultas.push({ pesos, bias });
    }
}

// Procesamiento hacia adelante
function procesamientoHaciaDelante(datos) {
    const results = ocultas.map(neurona => {
        return sigmoid(suma(datos, neurona.pesos) + neurona.bias);
    });

    const respuesta = sigmoid(suma(results, salida[0].pesos) + salida[0].bias);
    // console.log(respuesta)
    return { respuesta, results };
}

// Función para calcular el error
function calcularError(x) {
    return (1 / 2) * (x ** 2);
}

// Procesamiento hacia atrás
function procesamientoHaciaAtras(tasaDeAprendizaje, datos, respuestas, epochs) {
    for (let e = 0; e < epochs; e++) {
        let totalError = 0;
        for (let s = 0; s < datos.length; s++) {
            const resultados = procesamientoHaciaDelante(datos[s]);
            const res = resultados.respuesta;
            const x = respuestas[s] - res;
            totalError += calcularError(x);

            // Calcular el delta
            const delta = x * sigmoidDerivative(res);

            // Actualizar salida
            salida[0].bias += tasaDeAprendizaje * delta;
            for (let w = 0; w < salida[0].pesos.length; w++) {
                salida[0].pesos[w] += tasaDeAprendizaje * delta * resultados.results[w];
            }

            // Actualizar capa oculta
            for (let i = 0; i < ocultas.length; i++) {
                const ocultoDelta = delta * salida[0].pesos[i] * sigmoidDerivative(resultados.results[i]);
                ocultas[i].bias += tasaDeAprendizaje * ocultoDelta;
                for (let w = 0; w < ocultas[i].pesos.length; w++) {
                    ocultas[i].pesos[w] += tasaDeAprendizaje * ocultoDelta * datos[s][w];
                }
            }
        }

        // Mostrar error total en cada época
        console.log(`Error total en época ${e}: ${totalError}`);
    }
    console.log('Entrenamiento completado.');
}

// Normalización de datos
function normalizar(datos) {
    const minVals = datos[0].map(() => Infinity);
    const maxVals = datos[0].map(() => -Infinity);

    // Encontrar min y max
    datos.forEach(fila => {
        fila.forEach((valor, i) => {
            minVals[i] = Math.min(minVals[i], valor);
            maxVals[i] = Math.max(maxVals[i], valor);
        });
    });

    return datos.map(fila => fila.map((valor, i) => (valor - minVals[i]) / (maxVals[i] - minVals[i])));
}

// Datos de entrenamiento para la función XOR
let datos = [
        [0,0],
        [0,1],
        [1,0],
        [1,1]
    
    ];
    
    let respuestas = [
        0,1,1,0
    ];
// Normalizar datos
datos = normalizar(datos);

// Crear neuronas
for (let i = 0; i < 2; i++) {
    crearNeurona(2, 1);  // Dos neuronas en la capa oculta
}
crearNeurona(2, 0); // Neurona de salida

// Entrenar la red neuronal
procesamientoHaciaAtras(0.1, datos, respuestas, 10000);
