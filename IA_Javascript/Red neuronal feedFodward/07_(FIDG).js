const readline = require('readline');

// Crear la interfaz de readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para pedir un dato al usuario
function pedirDato() {
    return new Promise((resolve) => {
        rl.question('ingresa un dato', (respuesta) => {
            resolve(parseFloat(respuesta));
        });
    });
}




// Función de activación Sigmoide
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function escalonada(x) {
    return x >= 1 ? 1 : 0
}


// Derivada de la función Sigmoide
function sigmoidDerivative(x) {
    return x * (1 - x);
}


function relu(x) {
    return Math.max(0, x);
}

function reluDerivative(x) {
    return x > 0 ? 1 : 0;
}

function leakyReLU(x, alpha = 0.01) {
    return x > 0 ? x : alpha * x;
}

function leakyReLUDerivative(x, alpha = 0.01) {
    return x > 0 ? 1 : alpha;
}

// Inicialización de los pesos con valores aleatorios
function initWeights(size) {
    let weights = [];
    for (let i = 0; i < size; i++) {
        weights.push(Math.random() * 2 - 1);  // Valores entre -1 y 1
    }
    return weights;
}

// Inicialización de las neuronas
let ocultas2 = []
let ocultas = [];
let salida = [];

// Función para hacer el producto punto de dos arrays
function suma(inputs, weights) {
    let sum = 0;
    for (let i = 0; i < inputs.length; i++) {
        sum += inputs[i] * weights[i];
    }
    return sum;
}

function crearNeurona(numDeDatos, capa) {
    let pesos = initWeights(numDeDatos);
    let bias = Math.random(); // Inicializar el sesgo
    if (capa == 0) {
        salida.push({ pesos, bias });
    } else {
        if (capa == 2) {
            ocultas2.push({ pesos, bias });

        } else {
            ocultas.push({ pesos, bias });

        }
    }
}

function procesamientoHaciaDelante(datos) {
    let results = [];
    // Procesar la capa oculta
    for (let i = 0; i < ocultas.length; i++) {
        let z = sigmoid(suma(datos, ocultas[i].pesos) + ocultas[i].bias); // Agregar el sesgo
        results.push(z);
    }
    let respuesta = 0;
    // Procesar la capa de salida
    for (let r = 0; r < salida.length; r++) {
        let z = sigmoid(suma(results, salida[r].pesos) + salida[r].bias); // Agregar el sesgo
        respuesta = z;
    }
    return { respuesta, results };
}

function calcularError(x) {
    return (1 / 2) * (x) ** 2;
}



function procesamientoHaciaAtras(tasaDeAprendisaje, datos, respuestas, espoch) {
    for (let e = 0; e < espoch; e++) {
        let errorP = 0
        for (let s = 0; s < datos.length; s++) {
            let resultados = procesamientoHaciaDelante(datos[s]);
            let res = resultados.respuesta
            let x = respuestas[s] - res
            errorP += calcularError(x);
            

            delta = x * sigmoidDerivative(res)

            // Actualización de la neurona de salida
            for (let i = 0; i < salida.length; i++) {
                salida[i].bias += tasaDeAprendisaje * delta; // Actualización del sesgo de salida
                for (let w = 0; w < salida[i].pesos.length; w++) {
                    let gradienteSalida = delta * resultados.results[w]
                    salida[i].pesos[w] +=  tasaDeAprendisaje * gradienteSalida;
                }
            }
            // Retropropagación para la capa oculta
            for (let i2 = 0; i2 < ocultas.length; i2++) {
                const ocultoDelta = delta * salida[0].pesos[i2] * sigmoidDerivative(resultados.results[i2]);
                ocultas[i2].bias += tasaDeAprendisaje * ocultoDelta;
                for (let w2 = 0; w2 < ocultas[i2].pesos.length; w2++) {
                    ocultas[i2].pesos[w2] += tasaDeAprendisaje * ocultoDelta * datos[s][w2] ;

                }
            }
        }
        console.log(`Error total en época ${e}: ${errorP}`);

    }

    Probar()
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
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]

];

let respuestas = [
    0, 1, 1, 0
];
// Normalizar datos
datos = normalizar(datos);


let tasaDeAprendisaje = .1;
let espoch = 10000;

// Crear las neuronas

//capa oculta 2
crearNeurona(2, 1);
crearNeurona(2, 1);

//capa de salida
crearNeurona(2, 0);

//capa oculta 1
// crearNeurona(2, 2); 
// crearNeurona(2, 2); 
// crearNeurona(2, 2); 

// Entrenar la red neuronal
procesamientoHaciaAtras(tasaDeAprendisaje, normalizar(datos), respuestas, espoch);

// Probar la red neuronal
function Probar() {
    let errores = 0
    for (let i = 0; i < datos.length; i++) {
        console.log('______________');
        let res = procesamientoHaciaDelante(datos[i]);
        let error = respuestas[i] - res.respuesta;
        let respuestaF = res.respuesta < 0.5 ? 0 : 1
        // console.log(`Resultado: ${respuestaF},y ${res.respuesta} ,resultado esperado : ${respuestas[i]} Error: ${error}`);
        errores += Math.abs(respuestaF - respuestas[i])
        console.log(respuestaF, respuestas[i], Math.abs(respuestaF - respuestas[i]));
    }
    console.log(errores)
}

// Llama a la función para probar la red
