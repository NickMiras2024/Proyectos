//FUNCIONES DE ACTIVACION

// Función de activación Sigmoide
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

// Derivada de la función Sigmoide
function sigmoidDerivative(x) {
    return x * (1 - x);
}

function leakyReLU(x, alpha = 0.01) {
    return x > 0 ? x : alpha * x;
}

function leakyReLUDerivative(x, alpha = 0.01) {
    return x > 0 ? 1 : alpha;
}


function softmax(inputs) {
    const maxInput = Math.max(...inputs); // Estabilidad numérica
    const exps = inputs.map(x => Math.exp(x - maxInput)); // Exponencial para cada entrada
    const sumExps = exps.reduce((a, b) => a + b, 0); // Suma de los exponentes
    return exps.map(x => x / sumExps); // Normalización
}

function softmaxDerivative(softmaxOutput) {
    const n = softmaxOutput.length;
    const jacobianMatrix = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === j) {
                jacobianMatrix[i][j] = softmaxOutput[i] * (1 - softmaxOutput[i]);
            } else {
                jacobianMatrix[i][j] = -softmaxOutput[i] * softmaxOutput[j];
            }
        }
    }

    return jacobianMatrix;
}








//funciones para crear las neuronas

function crearPesosRandom(size) {
    let pesos = []
    for (let i = 0; i < size; i++) {
        pesos.push(Math.random())
    }
    return pesos
}


function crearNeurona(capa, size) {
    switch (capa) {
        case 'salida':
            let dataS = {
                pesos: crearPesosRandom(size),
                sesgo: Math.random(),
                M: Array(size + 1).fill(0),
                V: Array(size + 1).fill(0)
            }
            neuronasSalida.push(dataS)
            break;

        case 'oculta1':

            let dataO = {
                pesos: crearPesosRandom(size),
                sesgo: Math.random(),
                pesoH: Math.random(),
                pesoS: Math.random(),
                sesgoS: Math.random(),
                M: Array(size + 4).fill(0),
                V: Array(size + 4).fill(0)

            }
            neuronasOculta1.push(dataO)
            break;

        case 'oculta2':

            let dataO2 = {
                pesos: crearPesosRandom(size),
                sesgo: Math.random(),
                pesoH: Math.random(),
                pesoS: Math.random(),
                sesgoS: Math.random(),
                M: Array(size + 4).fill(0),
                V: Array(size + 4).fill(0)
            }
            neuronasOculta2.push(dataO2)
            break;

        default:
            break;
    }
}


// arrays con objetos de neuronas

let neuronasSalida = []
let neuronasOculta1 = []
let neuronasOculta2 = []
let HP = {
    ocultas1: [],
    ocultas2: [],
    //variables del optimizador adam
    t: 1,
    b1: 0.9,
    b2: 0.999,
    epsilon: 1e-8
}

//datos




// let datos = [
//     ['s', 'a', 'u', 'r', 'i', 'o', '|']
// ]


// let datos = [
//     ['e','s','t','e','g','o','s', 'a', 'u', 'r', 'i', 'o', '|']
// ]

let datos = [
    ['e', 's', 't', 'e', 'g', 'o', 's', 'a', 'u', 'r', 'i', 'o', '|'],
    ['t', 'i', 'r', 'a', 'n', 'o', 's', 'a', 'u', 'r', 'i', 'o', '|'],
    ['b', 'r', 'a', 'q', 'u', 'i', 'o', 's', 'a', 'u', 'r', 'i', 'o', '|'],
    ['c', 'o', 'm', 'p', 's', 'o', 'g', 'n', 'a', 't', 'h', 'i', 's', 'a', 'u', 'r', 'i', 'o', '|'],
    ['a', 'l', 'l', 'o', 's', 'a', 'u', 'r', 'i', 'o', '|'],
    ['m', 'a', 'p', 'u', 's', 'a', 'u', 'r', 'i', 'o', '|'],
    ['c', 'h', 'i', 'l', 'e', 's', 'a', 'u', 'r', 'i', 'o', '|'],
    ['e', 'd', 'm', 'o', 'n', 't', 'o', 's', 'a', 'u', 'r', 'i', 'o', '|'],
    ['c', 'a', 'r', 'n', 'o', 't', 'a', 'u', 'r', 'i', 'o', '|'],
    ['g', 'i', 'g', 'a', 'n', 't', 'o', 's', 'a', 'u', 'r', 'i', 'o', '|']
];





//asignamiento de variables de abecedario 

//28 letras
let abecedario = 'abcdefghijklmnñopqrstuvwxyz|'

let letrasDelAbc = abecedario.split('')

let cantidadDeLetras = letrasDelAbc.length

let abcObj = {}
for (let i = 0; i < letrasDelAbc.length; i++) {
    let one_hot_palabra = Array(cantidadDeLetras).fill(0)
    one_hot_palabra[i] = 1
    abcObj[letrasDelAbc[i]] = one_hot_palabra
}


//creacion de neuronas
//ocultas2
let CDNO2 = 28
let cantidadDePesosO2 = letrasDelAbc.length


for (let CDN = 0; CDN < CDNO2; CDN++) {
    crearNeurona('oculta2', cantidadDePesosO2)
}

//ocultas1

let CDNO = 46
let cantidadDePesosO = CDNO2


for (let CDN = 0; CDN < CDNO; CDN++) {
    crearNeurona('oculta1', cantidadDePesosO)
}

//salida

let CDNS = cantidadDeLetras
let cantidadDePesosS = CDNO

for (let CDN = 0; CDN < CDNS; CDN++) {
    crearNeurona('salida', cantidadDePesosS)

}



HP.ocultas1 = Array(CDNO).fill(0)
HP.ocultas2 = Array(CDNO2).fill(0)

let respuestaRed = []
let espochs = 600



function entrenar() {
    console.log('________ENTRENAMIENTO DE RED NEURONAL RECURRENTE CREADORA DE NOMBRES DE DINOSAURIOS (RCND)__________')
    for (let e = 0; e < espochs; e++) {
        for (let i = 0; i < datos.length; i++) {
            respuestaRed = []
            respuestaRed.push(datos[i][0])
            console.log('__________________________')
            console.log(datos[i])
            for (let d = 0; d < datos[i].length - 1; d++) {
                console.log('-', datos[i][d], d)

                let neuronasModificadasCopias = entrenamiento(abcObj[datos[i][d]], HP, datos[i][d + 1], 0.01)
                neuronasSalida = neuronasModificadasCopias.neuronasSalidaC
                neuronasOculta1 = neuronasModificadasCopias.neuronasOculta1C
                neuronasOculta2 = neuronasModificadasCopias.neuronasOculta2C

            }
            HP.ocultas1 = Array(CDNO).fill(0)
            HP.ocultas2 = Array(CDNO).fill(0)
            HP.t = 1
            console.log({ datos: datos[i], respuestaRed })
        }
    }
    crearNombreDeDinosaurio()
}


//UTILIZACION DE RED 


function numeroAleatorio(min, max) {
    return Math.random() * (max - min) + min;
}



function caluculosNeuronales(datos, PP) {
    //transformacion de letra a num 
    let indiceDatoA = datos


    // console.log(indiceDatoA)
    //oculta2
    let salidaOculta2H = []
    let salidaOculta2S = []

    for (let i = 0; i < neuronasOculta2.length; i++) {
        let sumaOC = 0
        let sumaSalida = 0


        for (let e = 0; e < neuronasOculta2[i].pesos.length; e++) {
            sumaOC += neuronasOculta2[i].pesos[e] * indiceDatoA[e]
        }

        sumaOC += neuronasOculta2[i].pesoH * PP.ocultas2[i]
        sumaOC += neuronasOculta2[i].sesgo
        let salidaH = leakyReLU(sumaOC)
        salidaOculta2H.push(salidaH)
        sumaSalida += neuronasOculta2[i].pesoS * salidaH + neuronasOculta2[i].sesgoS
        let salidaF = leakyReLU(sumaSalida)
        salidaOculta2S.push(salidaF)
        HP.ocultas2[i] = salidaH
    }

    // console.log(salidaOculta2S)


    //oculta1
    let salidaOcultaH = []
    let salidaOcultaS = []

    for (let i = 0; i < neuronasOculta1.length; i++) {
        let sumaOC = 0
        let sumaSalida = 0

        for (let e = 0; e < neuronasOculta1[i].pesos.length; e++) {
            sumaOC += neuronasOculta1[i].pesos[e] * salidaOculta2S[e]
        }
        sumaOC += neuronasOculta1[i].pesoH * PP.ocultas1[i]
        sumaOC += neuronasOculta1[i].sesgo

        let salidaH = leakyReLU(sumaOC)

        salidaOcultaH.push(salidaH)
        sumaSalida += neuronasOculta1[i].pesoS * salidaH + neuronasOculta1[i].sesgoS

        let salidaF = leakyReLU(sumaSalida)

        salidaOcultaS.push(salidaF)

        HP.ocultas1[i] = salidaH
    }


    //salida
    let salidaSalida = []

    for (let i = 0; i < neuronasSalida.length; i++) {
        let suma = 0
        for (let e = 0; e < salidaOcultaS.length; e++) {
            suma += salidaOcultaS[e] * neuronasSalida[i].pesos[e]
        }

        suma += neuronasSalida[i].sesgo

        let salida = suma
        salidaSalida.push(salida)
    }


    salidaSalida = softmax(salidaSalida)



    //asignamieto de letra al resultado 

    let indiceDeLetra = 0
    let resultadoMasAlto = -1

    for (let i = 0; i < salidaSalida.length; i++) {
        if (resultadoMasAlto < salidaSalida[i]) {
            resultadoMasAlto = salidaSalida[i]
            indiceDeLetra = i
        }
    }
    // console.log(neuronasSalida[0].pesos[0])
    return { indiceDeLetra, salidaOculta2H, salidaOculta2S, salidaOcultaH, salidaOcultaS, salidaSalida ,respuestaDeLaRed: letrasDelAbc[indiceDeLetra]}
}


function entrenamiento(datos, PP, respuestas, tasaDeAprendizaje) {

    let neuronasSalidaC = neuronasSalida
    let neuronasOculta1C = neuronasOculta1
    let neuronasOculta2C = neuronasOculta2

    let salidaNeuronas = caluculosNeuronales(datos, PP)
    let indiceDatoA = datos

    respuestaRed.push(salidaNeuronas.respuestaDeLaRed)



    let [indiceDeLetra, salidaOculta2H, salidaOculta2S, salidaOcultaH, salidaOcultaS, salidaSalida]
        = [salidaNeuronas.indiceDeLetra, salidaNeuronas.salidaOculta2H, salidaNeuronas.salidaOculta2S, salidaNeuronas.salidaOcultaH, salidaNeuronas.salidaOcultaS, salidaNeuronas.salidaSalida]

    //calculos de error Y derivadas

    let indiceDeSalidaEsperado = letrasDelAbc.indexOf(respuestas);
    if (indiceDeSalidaEsperado === -1) {
        console.error("Respuesta no encontrada en el abecedario");
    }
    let resultadoDecadaNueronaEsperado = []

    for (let i = 0; i < salidaSalida.length; i++) {
        indiceDeSalidaEsperado == i ? resultadoDecadaNueronaEsperado.push(1) : resultadoDecadaNueronaEsperado.push(0)
    }


    let derivadaDeCadaNeuronaS = []

    for (let i = 0; i < salidaSalida.length; i++) {
        derivadaDeCadaNeuronaS.push(salidaSalida[i] - resultadoDecadaNueronaEsperado[i])

    }

    // console.log(salidaSalida)



    //actualizacion de valores de neuronas

    //salida

    for (let i = 0; i < neuronasSalida.length; i++) {
        neuronasSalidaC[i].M[0] = HP.b1 * neuronasSalidaC[i].M[0] + (1 - HP.b1) * derivadaDeCadaNeuronaS[i]
        neuronasSalidaC[i].V[0] = HP.b2 * neuronasSalidaC[i].V[0] + (1 - HP.b2) * (derivadaDeCadaNeuronaS[i]) ** 2

        let mHat = neuronasSalidaC[i].M[0] / (1 - Math.pow(HP.b1, HP.t));
        let vHat = neuronasSalidaC[i].V[0] / (1 - Math.pow(HP.b2, HP.t));


        neuronasSalidaC[i].sesgo -= tasaDeAprendizaje * mHat / (Math.sqrt(vHat) + HP.epsilon)




        for (let w = 0; w < neuronasSalida[i].pesos.length; w++) {
            neuronasSalidaC[i].M[w + 1] = HP.b1 * neuronasSalidaC[i].M[w + 1] + (1 - HP.b1) * derivadaDeCadaNeuronaS[i] * salidaOcultaS[w]
            neuronasSalidaC[i].V[w + 1] = HP.b2 * neuronasSalidaC[i].V[w + 1] + (1 - HP.b2) * (derivadaDeCadaNeuronaS[i] * salidaOcultaS[w]) ** 2

            let mHatP = neuronasSalidaC[i].M[w + 1] / (1 - Math.pow(HP.b1, HP.t));
            let vHatP = neuronasSalidaC[i].V[w + 1] / (1 - Math.pow(HP.b2, HP.t));

            neuronasSalidaC[i].pesos[w] -= tasaDeAprendizaje * mHatP / (Math.sqrt(vHatP) + HP.epsilon)

        }
    }



    //oculta1
    let errorDecadaNeuronaOculta1 = []
    for (let i = 0; i < neuronasOculta1.length; i++) {

        let errorDeEstaNeurona = 0
        for (let e = 0; e < neuronasSalida.length; e++) {
            errorDeEstaNeurona += derivadaDeCadaNeuronaS[e] * neuronasSalida[e].pesos[i]
        }

        let deltaDeEstaNuerona = errorDeEstaNeurona * leakyReLUDerivative(salidaOcultaS[i])
        errorDecadaNeuronaOculta1.push(deltaDeEstaNuerona)

        //preparaciones para la optimizacion con adam del sesgo de la salida de la capa oculta 1
        neuronasOculta1C[i].M[0] = HP.b1 * neuronasOculta1C[i].M[0] + (1 - HP.b1) * deltaDeEstaNuerona
        neuronasOculta1C[i].V[0] = HP.b2 * neuronasOculta1C[i].V[0] + (1 - HP.b2) * (deltaDeEstaNuerona) ** 2

        let mHatSS = neuronasOculta1C[i].M[0] / (1 - Math.pow(HP.b1, HP.t))
        let vHatSS = neuronasOculta1C[i].V[0] / (1 - Math.pow(HP.b2, HP.t))


        //preparaciones para la optimizacion con adam del peso de la salida de la capa oculta 1
        neuronasOculta1C[i].M[1] = HP.b1 * neuronasOculta1C[i].M[1] + (1 - HP.b1) * (deltaDeEstaNuerona * salidaOcultaH[i])
        neuronasOculta1C[i].V[1] = HP.b2 * neuronasOculta1C[i].V[1] + (1 - HP.b2) * (deltaDeEstaNuerona * salidaOcultaH[i]) ** 2

        let mHatSP = neuronasOculta1C[i].M[1] / (1 - Math.pow(HP.b1, HP.t))
        let vHatSP = neuronasOculta1C[i].V[1] / (1 - Math.pow(HP.b2, HP.t))


        //optimizacion de parametros antes mencionados 
        neuronasOculta1C[i].sesgoS -= tasaDeAprendizaje * mHatSS / (Math.sqrt(vHatSS) + HP.epsilon)
        neuronasOculta1C[i].pesoS -= tasaDeAprendizaje * mHatSP / (Math.sqrt(vHatSP) + HP.epsilon)



        //optimizacion de parametros "normales" de una red feedfordwar (y pesoH que es propio de las redes recurrentes)
        let deltaPesosOcultaNeurona = deltaDeEstaNuerona * neuronasOculta1[i].pesoS * leakyReLUDerivative(salidaOcultaH[i])



        //preparaciones para la optimizacion con adam del sesgo de la neurona de la capa oculta 1
        neuronasOculta1C[i].M[2] = HP.b1 * neuronasOculta1C[i].M[2] + (1 - HP.b1) * deltaPesosOcultaNeurona
        neuronasOculta1C[i].V[2] = HP.b2 * neuronasOculta1C[i].V[2] + (1 - HP.b2) * deltaPesosOcultaNeurona ** 2

        let mHatNS = neuronasOculta1C[i].M[2] / (1 - Math.pow(HP.b1, HP.t))
        let vHatNS = neuronasOculta1C[i].V[2] / (1 - Math.pow(HP.b2, HP.t))

        //preparaciones para la optimizacion con adam del sesgo de la neurona de la capa oculta 1
        neuronasOculta1C[i].M[3] = HP.b1 * neuronasOculta1C[i].M[3] + (1 - HP.b1) * (deltaPesosOcultaNeurona * PP.ocultas1[i])
        neuronasOculta1C[i].V[3] = HP.b2 * neuronasOculta1C[i].V[3] + (1 - HP.b2) * (deltaPesosOcultaNeurona * PP.ocultas1[i]) ** 2

        let mHatNP = neuronasOculta1C[i].M[3] / (1 - Math.pow(HP.b1, HP.t))
        let vHatNP = neuronasOculta1C[i].V[3] / (1 - Math.pow(HP.b2, HP.t))


        //optimizacion de parametros antes mencionados 
        neuronasOculta1C[i].sesgo -= tasaDeAprendizaje * mHatNS / (Math.sqrt(vHatNS) + HP.epsilon)
        neuronasOculta1C[i].pesoH -= tasaDeAprendizaje * mHatNP / (Math.sqrt(vHatNP) + HP.epsilon)


        for (let w = 0; w < neuronasOculta1[i].pesos.length; w++) {
            neuronasOculta1C[i].M[w + 4] = HP.b1 * neuronasOculta1C[i].M[w + 3] + (1 - HP.b1) * (deltaPesosOcultaNeurona * salidaOculta2S[w])
            neuronasOculta1C[i].V[w + 4] = HP.b2 * neuronasOculta1C[i].V[w + 3] + (1 - HP.b2) * (deltaPesosOcultaNeurona * salidaOculta2S[w]) ** 2


            let mHatNW = neuronasOculta1C[i].M[w + 4] / (1 - Math.pow(HP.b1, HP.t))
            let vHatNW = neuronasOculta1C[i].V[w + 4] / (1 - Math.pow(HP.b2, HP.t))

            // console.log('---------------------------')
            // console.log('-',mHatNW,vHatNW)
            // console.log('-', neuronasOculta1C[i].pesos[w])
            neuronasOculta1C[i].pesos[w] -= tasaDeAprendizaje * mHatNW / (Math.sqrt(vHatNW) + HP.epsilon)
            // console.log('-', neuronasOculta1C[i].pesos[w])
        }
        // console.log('-',neuronasOculta1C[i])

    }


    //problema acá 
    //oculta2
    for (let i = 0; i < neuronasOculta2.length; i++) {
        // console.log(i,neuronasOculta2C[i])
        let errorDeEstaNeurona = 0
        for (let e = 0; e < neuronasOculta1.length; e++) {
            errorDeEstaNeurona += errorDecadaNeuronaOculta1[e] * neuronasOculta1[e].pesos[i]
        }

        let deltaDeEstaNuerona = errorDeEstaNeurona * leakyReLUDerivative(salidaOculta2S[i])



        //preparaciones para la optimizacion con adam del sesgo de la salida de la capa oculta 2
        neuronasOculta2C[i].M[0] = HP.b1 * neuronasOculta2C[i].M[0] + (1 - HP.b1) * deltaDeEstaNuerona
        neuronasOculta2C[i].V[0] = HP.b2 * neuronasOculta2C[i].V[0] + (1 - HP.b2) * (deltaDeEstaNuerona) ** 2

        let mHatSS = neuronasOculta2C[i].M[0] / (1 - Math.pow(HP.b1, HP.t))
        let vHatSS = neuronasOculta2C[i].V[0] / (1 - Math.pow(HP.b2, HP.t))

        //preparaciones para la optimizacion con adam del peso de la salida de la capa oculta 2
        neuronasOculta2C[i].M[1] = HP.b1 * neuronasOculta2C[i].M[1] + (1 - HP.b1) * (deltaDeEstaNuerona * salidaOculta2H[i])
        neuronasOculta2C[i].V[1] = HP.b2 * neuronasOculta2C[i].V[1] + (1 - HP.b2) * (deltaDeEstaNuerona * salidaOculta2H[i]) ** 2

        let mHatSP = neuronasOculta2C[i].M[1] / (1 - Math.pow(HP.b1, HP.t))
        let vHatSP = neuronasOculta2C[i].V[1] / (1 - Math.pow(HP.b2, HP.t))


        //optimizacion de parametros antes mencionados 
        neuronasOculta2C[i].sesgoS -= tasaDeAprendizaje * mHatSS / (Math.sqrt(vHatSS) + HP.epsilon)
        neuronasOculta2C[i].pesoS -= tasaDeAprendizaje * mHatSP / (Math.sqrt(vHatSP) + HP.epsilon)



        //optimizacion de parametros "normales" de una red feedfordwar (y pesoH que es propio de las redes recurrentes)
        let deltaPesosOcultaNeurona = deltaDeEstaNuerona * neuronasOculta2[i].pesoS * leakyReLUDerivative(salidaOculta2H[i])

        //preparaciones para la optimizacion con adam del sesgo de la neurona de la capa oculta 2
        neuronasOculta2C[i].M[2] = HP.b1 * neuronasOculta2C[i].M[2] + (1 - HP.b1) * deltaPesosOcultaNeurona
        neuronasOculta2C[i].V[2] = HP.b2 * neuronasOculta2C[i].V[2] + (1 - HP.b2) * deltaPesosOcultaNeurona ** 2

        let mHatNS = neuronasOculta2C[i].M[2] / (1 - Math.pow(HP.b1, HP.t))
        let vHatNS = neuronasOculta2C[i].V[2] / (1 - Math.pow(HP.b2, HP.t))

        //preparaciones para la optimizacion con adam del sesgo de la neurona de la capa oculta 2
        neuronasOculta2C[i].M[3] = HP.b1 * neuronasOculta2C[i].M[3] + (1 - HP.b1) * (deltaPesosOcultaNeurona * PP.ocultas2[i])
        neuronasOculta2C[i].V[3] = HP.b2 * neuronasOculta2C[i].V[3] + (1 - HP.b2) * (deltaPesosOcultaNeurona * PP.ocultas2[i]) ** 2

        let mHatNP = neuronasOculta2C[i].M[3] / (1 - Math.pow(HP.b1, HP.t))
        let vHatNP = neuronasOculta2C[i].V[3] / (1 - Math.pow(HP.b2, HP.t))


        //optimizacion de parametros antes mencionados 
        neuronasOculta2C[i].sesgo -= tasaDeAprendizaje * mHatNS / (Math.sqrt(vHatNS) + HP.epsilon)
        neuronasOculta2C[i].pesoH -= tasaDeAprendizaje * mHatNP / (Math.sqrt(vHatNP) + HP.epsilon)


        // console.log('_',deltaPesosOcultaNeurona)

        for (let w = 0; w < neuronasOculta2[i].pesos.length; w++) {

            neuronasOculta2C[i].M[w + 4] = HP.b1 * neuronasOculta2C[i].M[w + 3] + (1 - HP.b1) * (deltaPesosOcultaNeurona * indiceDatoA[w])
            neuronasOculta2C[i].V[w + 4] = HP.b2 * neuronasOculta2C[i].V[w + 3] + (1 - HP.b2) * (deltaPesosOcultaNeurona * indiceDatoA[w]) ** 2

            let mHatNW = neuronasOculta2C[i].M[w + 4] / (1 - Math.pow(HP.b1, HP.t))
            let vHatNW = neuronasOculta2C[i].V[w + 4] / (1 - Math.pow(HP.b2, HP.t))

            // console.log('-',Math.sqrt(vHatNW) + HP.epsilon)

            // console.log('---------------------------')
            // console.log(neuronasOculta2C[i].pesos.length)
            // console.log('-', neuronasOculta2C[i].pesos[w])
            neuronasOculta2C[i].pesos[w] -= tasaDeAprendizaje * mHatNW / (Math.sqrt(vHatNW) + HP.epsilon)
            // console.log('-', neuronasOculta2C[i].pesos[w])

        }
    }


    HP.t += 1

    // console.log('____________________')
    // console.log(neuronasSalida)

    // console.log('____________________')
    // console.log(neuronasOculta1)

    // console.log('____________________')
    // console.log(neuronasOculta2)


    return { neuronasOculta1C, neuronasSalidaC, neuronasOculta2C }
}


function crearNombreDeDinosaurio() {
    console.log('________CREACION DE NOMBRES DE DINOSAURIOS__________')

    for (let i = 0; i < 10; i++) {
        HP.ocultas1 = Array(CDNO).fill(0)
        HP.ocultas2 = Array(CDNO).fill(0)
        // let num = i
        let num = Math.round(numeroAleatorio(0, cantidadDeLetras-1 ))
        let letra = letrasDelAbc[num]
        let palabra = []
        palabra.push(letra)
        console.log(palabra)
        for (let i = 0; i < 10; i++) {
            let res = caluculosNeuronales(abcObj[palabra[i]], HP)
            if (res.indiceDeLetra == letrasDelAbc.length - 1) {
                console.log(letrasDelAbc[res.indiceDeLetra])
                break
            } else {
                palabra.push(letrasDelAbc[res.indiceDeLetra])
            }
        }
        console.log('_________________________________________')
        console.log('LA RED CREO ESTE NOMBRE DE DINOSAURIO :')
        console.log(palabra.join(''))
        console.log('_________________________________________')
    }

}










entrenar()

