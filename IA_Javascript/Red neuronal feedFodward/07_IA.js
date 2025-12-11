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

function escalonada(x){
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

    let results1 = []

    // // Procesar la capa oculta1
    // for (let i = 0; i < ocultas2.length; i++) {
    //     let z = leakyReLU(suma(datos, ocultas2[i].pesos) + ocultas2[i].bias); // Agregar el sesgo
    //     results1.push(z);
    // }

    let results = [];

    // Procesar la capa oculta
    for (let i = 0; i < ocultas.length; i++) {
        let z = leakyReLU(suma(datos, ocultas[i].pesos) + ocultas[i].bias); // Agregar el sesgo
        results.push(z);
    }
    let respuesta = 0;
    // Procesar la capa de salida
    for (let r = 0; r < salida.length; r++) {
        let z = sigmoid(suma(results, salida[r].pesos) + salida[r].bias); // Agregar el sesgo
        // console.log('neurona activada : ', r);
        // console.log('activacion : ', z);
        respuesta = z;
    }
    // console.log(respuesta)
    return { respuesta, results, results1 };
}

function calcularError(x) {
    return (1 / 2) * (x) ** 2;
}



function procesamientoHaciaAtras(tasaDeAprendisaje, datos, respuestas, espoch) {
    let errorP = 0
    let ultimoError = 0
    let cont = 0
    for (let e = 0; e < espoch; e++) {
        let delta = 0
        let delta2 = 0
        let resultsO = undefined
        let results1 = undefined
        let datosP = undefined
        errorP = 0

        cont++
        for (let s = 0; s < datos.length; s++) {
            // delta = 0
            let resultados = procesamientoHaciaDelante(datos[s]);
            let res = resultados.respuesta
            if (datosP == undefined) {
                datosP = datos[s]
            } else {
                for (let i = 0; i < datos[s].length; i++) {
                    datosP[i] += datos[s][i]
                }
            }
            if (resultsO == undefined) {
                resultsO = resultados.results
            } else {
                for (let i = 0; i < results1.length; i++) {
                    resultsO[i] += resultados.results[i]
                }
            }
            if (results1 == undefined) {
                results1 = resultados.results1
            } else {
                for (let i = 0; i < results1.length; i++) {
                    results1[i] += resultados.results1[i]
                }
            }
            let x = respuestas[s] - res   

            // console.log(resultados.results)
            let error = calcularError(x);
            // console.log(res)
            errorP += error
            // console.log(res)
            // console.log(res- respuestas[s],respuestas[s],res)
            // console.log(`Error en iteración ${e}, muestra ${s}: ${error}`);
            let h = 0.001
            delta += ((calcularError(x + h) -calcularError(x)) / h ) * sigmoidDerivative(res)
            // console.log( delta)
            delta2 +=  leakyReLUDerivative(res)
        }

        if (100 * errorP !== ultimoError) {
            ultimoError = 100 * errorP
            cont = 0
        }

        // console.log(res,respuestas[s])
        // Actualización de la neurona de salida
        for (let i = 0; i < salida.length; i++) {
            // Gradiente de la salida
            // let gradienteSalida = error * sigmoidDerivative(res);
            salida[i].bias += - (tasaDeAprendisaje * (1 /datos.length * delta)) * 1; // Actualización del sesgo de salida

            for (let w = 0; w < salida[i].pesos.length; w++) {
                let gradienteSalida = (1 /datos.length * delta) * salida[i].pesos[w]
                
                // console.log(delta)
                
                salida[i].pesos[w] = salida[i].pesos[w]  -(tasaDeAprendisaje * gradienteSalida);

                // console.log(salida[i].pesos,salida[i].bias, -(tasaDeAprendisaje * gradienteSalida))
                
            }
        }
        // console.log(resultsO)


        // Retropropagación para la capa oculta
        for (let i2 = 0; i2 < ocultas.length; i2++) {

            // Actualización del sesgo de la capa oculta
            ocultas[i2].bias += -tasaDeAprendisaje * (1 /datos.length * delta2) * 1;

            for (let w2 = 0; w2 < ocultas[i2].pesos.length; w2++) {
                let GradienteOculto =  (1 /datos.length *delta) * salida[0].pesos[i2] * (1 /datos.length * delta2) * ocultas[i2].pesos[w2]
                

                ocultas[i2].pesos[w2] += -tasaDeAprendisaje * GradienteOculto;
                
            }
        }
        // console.log(ocultas2)
        // Retropropagación para la capa oculta
        // for (let i3 = 0; i3 < ocultas2.length; i3++) {

        //     // Actualización del sesgo de la capa oculta
        //     ocultas2[i3].bias += -tasaDeAprendisaje * (1 / datos.length * delta2) * 1;

        //     // console.log(ocultas)
        //     for (let w3 = 0; w3 < ocultas2[i3].pesos.length; w3++) {
        //         let GradienteOculto = (1 / datos.length * delta2) * ocultas[0].pesos[i3] * ocultas[1].pesos[i3] * results1[i3] *(1-results1[i3]) * datosP[w3]
        //         ocultas2[i3].pesos[w3] += -tasaDeAprendisaje * GradienteOculto;
        //     }
        // }

        console.log(errorP)

        // if(errorP == NaN){
            // console.log(ocultas,salida)
            // break
        // }

        if (50 <= cont) {
            break
        }
    }
    console.log('Listo');
    Probar(errorP)
}

// Datos de entrenamiento para la función XOR
let datos = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
];

let respuestas = [
    0,
    1,
    1,
    0
];

function normalizar(datos) {
    // Inicializar arrays para los valores mínimos y máximos
    let minVals = [];
    let maxVals = [];

    // Encontrar los valores mínimos y máximos para cada característica
    for (let i = 0; i < datos[0].length; i++) {
        let column = datos.map(fila => fila[i]);
        minVals.push(Math.min(...column));
        maxVals.push(Math.max(...column));
    }

    // Normalizar los datos
    let datosNormalizados = datos.map(fila => {
        return fila.map((valor, index) => {
            return (valor - minVals[index]) / (maxVals[index] - minVals[index]);
        });
    });

    return datosNormalizados;
}


// let datos = [
//     [45, 200], // edad, colesterol
//     [50, 220],
//     [35, 180],
//     [60, 240],
//     [30, 150],
//     [55, 210],
//     [40, 190],
//     [70, 260],
//     [25, 160],
//     [65, 230]
// ];


// let respuestas = [
//     1, // Alto riesgo
//     1, // Alto riesgo
//     0, // Bajo riesgo
//     1, // Alto riesgo
//     0, // Bajo riesgo
//     1, // Alto riesgo
//     0, // Bajo riesgo
//     1, // Alto riesgo
//     0, // Bajo riesgo
//     1  // Alto riesgo
// ];



let tasaDeAprendisaje = 0.2;
let espoch = 1000;

// Crear las neuronas

//capa oculta 2
crearNeurona(2, 1);
crearNeurona(2, 1); 

//capa de salida
crearNeurona(3, 0); 

//capa oculta 1
// crearNeurona(2, 2); 
// crearNeurona(2, 2); 
// crearNeurona(2, 2); 

// Entrenar la red neuronal
procesamientoHaciaAtras(tasaDeAprendisaje, normalizar(datos), respuestas, espoch);

// Probar la red neuronal
function Probar(errorP) {
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
    if (errores == 0) {
        console.log('red neuronal 100 inteligente')
        probarRedPers()
    } else {
        console.log('red neuronal no inteligente')
        for (let i = 0; i < ocultas2.length; i++) {
            for (let e = 0; e < ocultas2[i].pesos.length; e++) {
                ocultas2[i].pesos[e] += Math.random() * errorP
            }
            ocultas2[i].bias += Math.random() * errorP

        }
        for (let i = 0; i < ocultas.length; i++) {
            for (let e = 0; e < ocultas[i].pesos.length; e++) {
                ocultas[i].pesos[e] += Math.random() * errorP
            }
            ocultas[i].bias += Math.random() * errorP

        }
        for (let i = 0; i < salida.length; i++) {
            for (let e = 0; e < salida[i].pesos.length; e++) {
                salida[i].pesos[e] += Math.random() * errorP
            }
            salida[i].bias += Math.random() * errorP

        }
        setTimeout(() => {
            procesamientoHaciaAtras(tasaDeAprendisaje, datos, respuestas, espoch);
        }, 2000);

    }
}


async function probarRedPers() {
    let datos2 = [];

    for (let i = 0; i < datos[0].length; i++) {
        const respuesta = await pedirDato();
        // console.log(`Has ingresado: ${respuesta}`);
        datos2.push(respuesta);
    }

    rl.close(); // Cerrar la interfaz después de recolectar todos los datos
    let resultados = procesamientoHaciaDelante(datos2);
    // console.log();
    
    if( 0.5 <= resultados.respuesta ){
        console.log('Tienes un riesgo bajo')
    }else {
        console.log('Tienes un riesgo alto')
    }

}

// Llama a la función para probar la red
