// Función de activación Sigmoide
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

// Derivada de la función Sigmoide
function sigmoidDerivative(x) {
    return x * (1 - x);
}

function tanh(x) {
    return Math.tanh(x); // o (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
}

function tanhDerivative(x) {
    const tanhValue = tanh(x);
    return 1 - tanhValue * tanhValue;
}


// Inicialización de los pesos con valores aleatorios
function initWeights(size) {
    const scale = Math.sqrt(1 / size);
    return Array.from({ length: size }, () => (Math.random() * 2 - 1) * scale);
}


// Función para hacer el producto punto de dos arrays
function suma(inputs, weights) {
    return inputs.reduce((sum, input, i) => sum + input * weights[i], 0);
}

// Función para calcular el error
function calcularError(x) {
    return (1 / 2) * (x ** 2);
}

function ECZ(YR, YP) {
    return -(YR * Math.log(YP) + (1 - YR) * Math.log(1 - YP))
}

function leakyReLU(x, alpha = 0.01) {
    return x > 0 ? x : alpha * x;
}

function leakyReLUDerivative(x, alpha = 0.01) {
    return x > 0 ? 1 : alpha;
}


let ocultas4 = []
let ocultas3 = []
let ocultas2 = []
let ocultas1 = []
let salida = []


function crearNeurona(size, capa) {
    let pesos = initWeights(size)
    let bias = Math.random() * 2 - 1
    if (capa == 0) {
        salida.push({ pesos, bias })
    } else if (capa == 1) {
        ocultas1.push({ pesos, bias })

    } else if (capa == 2) {
        ocultas2.push({ pesos, bias })

    }
    else if (capa == 3) {
        ocultas3.push({ pesos, bias })

    } else {
        ocultas4.push({ pesos, bias })

    }
}

let prob = 0.0

function prosesamientoHaciaDelante(datos) {
    // let resultadosOculta4 = []
    // for (let i = 0; i < ocultas4.length; i++) {
    //     resultadosOculta4.push( Math.random() < prob ? 0.1 : tanh(suma(datos, ocultas4[i].pesos) + ocultas4[i].bias))
    // }

    // let resultadosOculta3 = []
    // for (let i = 0; i < ocultas3.length; i++) {
    //     resultadosOculta3.push( Math.random() < prob ? 0.1 :  leakyReLU(suma(datos, ocultas3[i].pesos) + ocultas3[i].bias))
    // }

    // let resultadosOculta2 = []
    // for (let i = 0; i < ocultas2.length; i++) {
    //     resultadosOculta2.push(sigmoid(suma(datos, ocultas2[i].pesos) + ocultas2[i].bias))
    // }
    let resultadosOculta1 = []
    for (let i = 0; i < ocultas1.length; i++) {
        resultadosOculta1.push(sigmoid(Math.random() < prob ? 0.1 : suma(datos, ocultas1[i].pesos) + ocultas1[i].bias))
    }
    let resultadosSalida = sigmoid(suma(resultadosOculta1, salida[0].pesos) + salida[0].bias)
    // console.log(resultadosOculta1)

    // console.log(ocultas2)
    return {
        resultadosOculta1
        // , resultadosOculta2
        ,
        resultadosSalida
        // , resultadosOculta3,
        // resultadosOculta4 
    }
}


function procesamientoHaciaAtras(tasaDeAprendizaje, espochs, datos, resultados) {
    let errorM = +Infinity

    let Bocultas4 = []
    let Bocultas3 = []
    let Bocultas2 = []
    let Bocultas1 = []
    let Bsalida = []

    for (let s = 0; s < espochs; s++) {
        // console.log(s,'/',espochs ) 
        let error = 0
        for (let d = 0; d < datos.length; d++) {
            let res = prosesamientoHaciaDelante(datos[d])
            let x = res.resultadosSalida - respuestas[d]
            error += ECZ(resultados[d], res.resultadosSalida) /datos.length
            // console.log(error)


            //salida
            let deltaS = x 


            salida[0].bias -= tasaDeAprendizaje * deltaS
            for (let w = 0; w < salida[0].pesos.length; w++) {
                salida[0].pesos[w] -= tasaDeAprendizaje * deltaS * res.resultadosOculta1[w]
            }

            //oculta1

            let errorDeCadaNeurona = []
            for (let i = 0; i < ocultas1.length; i++) {
                let errorDN = deltaS * salida[0].pesos[i]
                let delta = errorDN * sigmoidDerivative(res.resultadosOculta1[i])
                errorDeCadaNeurona.push(delta)
                ocultas1[i].bias -= tasaDeAprendizaje * delta
                for (let w = 0; w < ocultas1[i].pesos.length; w++) {
                    ocultas1[i].pesos[w] -= tasaDeAprendizaje * delta * datos[d][w]
                }
            }

            // let errorDeCadaNeurona2 = []
            // for (let i = 0; i < ocultas2.length; i++) {
            //     let errorDN = 0
            //     for (let n = 0; n < errorDeCadaNeurona.length; n++) {
            //         errorDN += errorDeCadaNeurona[n] * ocultas2[i].pesos[n]

            //     }

            //     let delta = errorDN * sigmoidDerivative(res.resultadosOculta2[i])
            //     errorDeCadaNeurona2.push(delta)
            //     ocultas2[i].bias += tasaDeAprendizaje * delta
            //     for (let w = 0; w < ocultas2[i].pesos.length; w++) {
            //         ocultas2[i].pesos[w] +=tasaDeAprendizaje * delta * datos[d][w]
            //     }
            // }
        }

        if (error < errorM) {
            errorM = error

            Bocultas4 = ocultas4
            Bocultas3 = ocultas3
            Bocultas2 = ocultas2
            Bocultas1 = ocultas1
            Bsalida = salida


        }

        console.log(error)
        // Probar2()
    }
    // console.log('errM', errorM)
    console.log(ocultas1)
    // console.log(salida)



    // ocultas4 = Bocultas4 
    // ocultas3 = Bocultas3 
    // ocultas2 = Bocultas2 
    // ocultas1 =  Bocultas1
    // salida = Bsalida 


    Probar()

}




function numeroAleatorio() {
    return Math.floor(Math.random() * 101);
}


function IP() {
    let arr = []
    arr.push(numeroAleatorio())
    arr.push(numeroAleatorio())

    datos.push(arr)
    if (
        // arr[0] < 80 
        // && 20 < arr[0]
        // &&
        arr[1] < 80
        &&
        20 < arr[1]
    ) {
        respuestas.push(1)
    } else {
        respuestas.push(0)

    }

}


let datos = [
];

let respuestas = [

];



for (let i = 0; i < 2000; i++) {
    IP()
}


let DP = [
];

let RP = [

];



function IP2() {
    let arr = []
    arr.push(numeroAleatorio())
    arr.push(numeroAleatorio())

    DP.push(arr)

    if (
        // arr[0] < 80 
        // && 20 < arr[0]
        // &&
        arr[1] < 80
        &&
        20 < arr[1]
    ) {
        RP.push(1)
    } else {
        RP.push(0)

    }
}



for (let i = 0; i < 100; i++) {
    IP2()
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


// datos = normalizar(datos)
// DP = normalizar(DP)


// for (let i = 0; i < 15  ; i++) {
//     crearNeurona(datos[0].length, 4)
// }


// for (let i = 0; i < 7  ; i++) {
//     crearNeurona(datos[0].length, 3)
// }

// for (let i = 0; i < 4 ; i++) {
//     crearNeurona(datos[0].length, 2)
// }

for (let i = 0; i < 5; i++) {
    crearNeurona(datos[0].length, 1)
}

crearNeurona(ocultas1.length, 0)


// console.log(ocultas1, ocultas2, salida)


procesamientoHaciaAtras(.001, 10000, datos, respuestas)


function Probar() {
    let errores = 0
    for (let i = 0; i < DP.length; i++) {
        console.log('______________');
        let res = prosesamientoHaciaDelante(DP[i]);
        // let error = respuestas[i] - res.respuesta;
        let respuestaF = res.resultadosSalida < 0.5 ? 0 : 1
        // console.log(`Resultado: ${respuestaF},y ${res.respuesta} ,resultado esperado : ${respuestas[i]} Error: ${error}`);
        errores += Math.abs(respuestaF - RP[i])
        console.log(respuestaF, RP[i], Math.abs(respuestaF - RP[i]));
    }
    console.log(errores / DP.length * 100, Math.abs((errores / DP.length * 100) - 100), errores)
    Probar3()
}

function Probar2() {
    let errores = 0
    for (let i = 0; i < datos.length; i++) {
        // console.log('______________');
        let res = prosesamientoHaciaDelante(datos[i]);
        // let error = respuestas[i] - res.respuesta;
        let respuestaF = res.resultadosSalida < 0.5 ? 0 : 1
        // console.log(`Resultado: ${respuestaF},y ${res.respuesta} ,resultado esperado : ${respuestas[i]} Error: ${error}`);
        errores += Math.abs(respuestaF - respuestas[i])
        // console.log(respuestaF, respuestas[i], Math.abs(respuestaF - respuestas[i]));
    }
    // console.log(errores / datos.length * 100,Math.abs((errores / datos.length * 100)- 100 ), errores)
    console.log(errores / datos.length)
    console.log('_____________________')
}


function Probar3() {
    let errores = 0
    for (let i = 0; i < datos.length; i++) {
        console.log(i, '______________');
        let res = prosesamientoHaciaDelante(datos[i]);
        // let error = respuestas[i] - res.respuesta;
        let respuestaF = res.resultadosSalida < 0.5 ? 0 : 1
        // console.log(`Resultado: ${respuestaF},y ${res.respuesta} ,resultado esperado : ${respuestas[i]} Error: ${error}`);
        errores += Math.abs(respuestaF - respuestas[i])
        console.log(respuestaF, respuestas[i], Math.abs(respuestaF - respuestas[i]));
    }
    console.log(errores / datos.length * 100, Math.abs((errores / datos.length * 100) - 100), errores)
    // console.log(errores / datos.length)
    // console.log('_____________________')
    let res = prosesamientoHaciaDelante([1, 1, 0]);
    let res2 = prosesamientoHaciaDelante([0, 1, 1]);

    console.log(res.resultadosSalida < 0.5 ? 0 : 1)
    console.log(res2.resultadosSalida < 0.5 ? 0 : 1)

}