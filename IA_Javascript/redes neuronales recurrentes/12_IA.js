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
                sesgo: Math.random()
            }
            neuronasSalida.push(dataS)
            break;

        case 'oculta1':

            let dataO = {
                pesos: crearPesosRandom(size),
                sesgo: Math.random(),
                pesoH: Math.random(),
                pesoS: Math.random(),
                sesgoS: Math.random()
            }
            neuronasOculta1.push(dataO)
            break;

        case 'oculta2':

            let dataO2 = {
                pesos: crearPesosRandom(size),
                sesgo: Math.random(),
                pesoH: Math.random(),
                pesoS: Math.random(),
                sesgoS: Math.random()
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
    ocultas2: []
}

//datos


let datos = [
    ['s', 'a', 'u', 'r', 'i', 'o','|']
]






//asignamiento de variables de abecedario 

let abecedario = 'abcdefghijklmnñopqrstuvwxyz|'

let letrasDelAbc = abecedario.split('')

let cantidadDeLetras = letrasDelAbc.length


//creacion de neuronas
//ocultas2
let CDNO2 = 5
let cantidadDePesosO2 = datos[0][0].length


for (let CDN = 0; CDN < CDNO2; CDN++) {
    crearNeurona('oculta2', cantidadDePesosO2)
}

//ocultas1

let CDNO = 5
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






function entrenamiento(datos, PP, respuestas, tasaDeAprendizaje) {

    let neuronasSalidaC = neuronasSalida
    let neuronasOculta1C = neuronasOculta1
    let neuronasOculta2C = neuronasOculta2
    

    function limitarDecimales(numero, decimales) {
        return Math.round(numero * (10 ** decimales)) / (10 ** decimales)
    }

    //pocesamient hacia delante 

    console.log(HP)


    //transformacion de letra a num 
    let indiceDatoA = 0

    for (let i = 0; i < cantidadDeLetras; i++) {
        if (letrasDelAbc[i] == datos) {
            indiceDatoA = i
        }
    }


    // console.log(indiceDatoA)
    //oculta2
    let salidaOculta2H = []
    let salidaOculta2S = []

    for (let i = 0; i < neuronasOculta2.length; i++) {
        let sumaOC = 0
        let sumaSalida = 0
        for (let e = 0; e < neuronasOculta2[i].pesos.length; e++) {
            sumaOC += neuronasOculta2[i].pesos[e] * indiceDatoA

        }
        sumaOC += neuronasOculta2[i].pesoH * PP.ocultas2[i]
        sumaOC += neuronasOculta2[i].sesgo
        let salidaH = leakyReLU(sumaOC)
        salidaOculta2H.push(salidaH)
        sumaSalida += neuronasOculta2[i].pesoS * salidaH + neuronasOculta2[i].sesgoS
        let salidaF = leakyReLU(sumaSalida)
        salidaOculta2S.push(salidaF)
        HP.ocultas2[i] = limitarDecimales(salidaH,12) / 100
    }



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
        HP.ocultas1[i] =  limitarDecimales(salidaH,12) / 100
    }


    //salida
    let salidaSalida = []

    for (let i = 0; i < neuronasSalida.length; i++) {
        let suma = 0
        for (let e = 0; e < salidaOcultaS.length; e++) {
            suma += salidaOcultaS[e] * neuronasSalida[i].pesos[e]

        }
        suma += neuronasSalida[i].sesgo
        let salida = sigmoid(suma)
        salidaSalida.push(salida)
    }

    salidaSalida = softmax(salidaSalida)


    // console.log(salidaSalida)

    //asignamieto de letra al resultado 

    let indiceDeLetra = 0
    let resultadoMasAlto = -1

    for (let i = 0; i < salidaSalida.length; i++) {
        if (resultadoMasAlto < salidaSalida[i]) {
            resultadoMasAlto = salidaSalida[i]
            indiceDeLetra = i
        }
    }
    console.log(letrasDelAbc[indiceDeLetra])
    // console.log(neuronasSalida[0].pesos[0])


    //calculos de error Y derivadas


    let indiceDeSalidaEsperado = 0

    for (let i = 0; i < letrasDelAbc.length; i++) {
        letrasDelAbc[i] == respuestas ? indiceDeSalidaEsperado = i : indiceDeSalidaEsperado = indiceDeSalidaEsperado
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
        neuronasSalidaC[i].sesgo -= limitarDecimales(tasaDeAprendizaje * derivadaDeCadaNeuronaS[i], 12)

        for (let w = 0; w < neuronasSalida[i].pesos.length; w++) {
            neuronasSalidaC[i].pesos[w] -= limitarDecimales(tasaDeAprendizaje * derivadaDeCadaNeuronaS[i] * salidaOcultaS[w], 12)
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

        neuronasOculta1C[i].sesgoS -= limitarDecimales(tasaDeAprendizaje * deltaDeEstaNuerona, 12)
        neuronasOculta1C[i].pesoS -= limitarDecimales(tasaDeAprendizaje * deltaDeEstaNuerona * salidaOcultaH[i], 12)

        let deltaPesosOcultaNeurona = deltaDeEstaNuerona * neuronasOculta1[i].pesoS * leakyReLUDerivative(salidaOcultaH[i])  

        neuronasOculta1C[i].sesgo -= limitarDecimales(tasaDeAprendizaje * deltaPesosOcultaNeurona, 12)
        for (let w = 0; w < neuronasOculta1[i].pesos.length; w++) {
            neuronasOculta1C[i].pesos[w] -= limitarDecimales(tasaDeAprendizaje * deltaPesosOcultaNeurona * salidaOculta2S[w], 12)
        }
        neuronasOculta1C[i].pesoH -= limitarDecimales(tasaDeAprendizaje * deltaPesosOcultaNeurona * PP.ocultas1[i], 12)
    }

    //oculta2
    for (let i = 0; i < neuronasOculta2.length; i++) {
        let errorDeEstaNeurona = 0
        for (let e = 0; e < neuronasOculta1.length; e++) {
            errorDeEstaNeurona += errorDecadaNeuronaOculta1[e] * neuronasOculta1[e].pesos[i]
        }

        let deltaDeEstaNuerona = errorDeEstaNeurona * leakyReLUDerivative(salidaOculta2S[i])

        neuronasOculta2C[i].sesgoS -= limitarDecimales(tasaDeAprendizaje * deltaDeEstaNuerona, 12)
        neuronasOculta2C[i].pesoS -= limitarDecimales(tasaDeAprendizaje * deltaDeEstaNuerona * salidaOculta2H[i], 12)

        let deltaPesosOcultaNeurona = deltaDeEstaNuerona * neuronasOculta2[i].pesoS * leakyReLUDerivative(salidaOculta2H[i])

        neuronasOculta2C[i].sesgo -= limitarDecimales(tasaDeAprendizaje * deltaPesosOcultaNeurona, 12)
        for (let w = 0; w < neuronasOculta2[i].pesos.length; w++) {
            neuronasOculta2C[i].pesos[w] -= limitarDecimales(tasaDeAprendizaje * deltaPesosOcultaNeurona * indiceDatoA, 12)
        }
        neuronasOculta2C[i].pesoH -= limitarDecimales(tasaDeAprendizaje * deltaPesosOcultaNeurona * PP.ocultas2[i], 12)
    }

    // console.log('____________________')
    // console.log(neuronasSalida)

    // console.log('____________________')
    // console.log(neuronasOculta1)
    
    // console.log('____________________')
    // console.log(neuronasOculta2)


    return {neuronasOculta1C,neuronasSalidaC,neuronasOculta2C}
}


function entrenar(){

    let listo = false
    for (let e = 0; e < 1; e++) {
        for (let i = 0; i < datos.length; i++) {
            
            console.log('__________________________')
            console.log(datos[i])
    
            let d = 0
            let pruebafor = setInterval(() => {
                if (d < datos[i].length - 1) {
                    let neuronasModificadasCopias = entrenamiento(datos[i][d], HP, respuestas = datos[i][d + 1], 0.1)

                    let verificacion = neuronasModificadasCopias.neuronasOculta1C[0].pesos[0] +neuronasModificadasCopias.neuronasOculta2C[0].pesos[0] + neuronasModificadasCopias.neuronasSalidaC[0].pesos[0]

                    if(verificacion !== NaN || Math.abs(verificacion) !== Infinity){
                        console.log(neuronasModificadasCopias.neuronasOculta2C[0].pesos[0])
                        neuronasSalida = neuronasModificadasCopias.neuronasSalidaC
                        neuronasOculta1 = neuronasModificadasCopias.neuronasOculta1C
                        neuronasOculta2 = neuronasModificadasCopias.neuronasOculta1C
                    }
                    d++
                }else{
                    listo = true
                    clearInterval(pruebafor)
                }
            }, 2000);
    
            HP.ocultas1 = Array(CDNO).fill(0)
            HP.ocultas2 = Array(CDNO).fill(0)
        }
    }

    let interval = setInterval(() => {
        if(listo){
            entrenar()    
            clearInterval(interval)
    
        }
    }, 200);
}


entrenar()

