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

function softmax(arr) {
    const maxVal = Math.max(...arr);
    const expValues = arr.map(x => Math.exp(x - maxVal));
    const sumExpValues = expValues.reduce((a, b) => a + b, 0);
    return expValues.map(x => x / sumExpValues);
}

function softmaxDerivative(softmaxOutput) {
    const jacobianMatrix = [];

    for (let i = 0; i < softmaxOutput.length; i++) {
        const row = [];
        for (let j = 0; j < softmaxOutput.length; j++) {
            if (i === j) {
                // Derivada respecto a sí misma: s_i * (1 - s_i)
                row.push(softmaxOutput[i] * (1 - softmaxOutput[i]));
            } else {
                // Derivada respecto a otro elemento: -s_i * s_j
                row.push(-softmaxOutput[i] * softmaxOutput[j]);
            }
        }
        jacobianMatrix.push(row);
    }

    return jacobianMatrix;
}

function crossEntropyLoss(y_true, y_pred) {
    let loss = 0;
    for (let i = 0; i < y_true.length; i++) {
        if (y_true[i] === 1) {
            loss -= Math.log(y_pred[i]);  // Solo afecta la clase verdadera
        }
    }
    return loss;
}





let ocultas4 = []
let ocultas3 = []
let ocultas2 = []
let ocultas1 = []
let salida = []


function crearNeurona(size, capa) {
    if (capa == 0) {
        let pesos = initWeights(size)
        let bias = Math.random() * 2 - 1

        salida.push({ pesos, bias })
    } else if (capa == 1) {
        let pesos = initWeights(size)
        let bias = Math.random() * 2 - 1
        let pesosOC = Math.random() * 2 - 1
        let pesoOCS = Math.random() * 2 - 1
        let sesgoS =  Math.random() * 2 - 1

        ocultas1.push({ pesos, bias, pesosOC, pesoOCS,sesgoS })

    }else{
        let pesos = initWeights(size)
        let bias = Math.random() * 2 - 1
        let pesosOC = Math.random() * 2 - 1

        ocultas2.push({ pesos, bias, pesosOC })

    }
}

let resultaodAO2 = []
let resultaodAO = []
let paso = 0

function prosesamientoHaciaDelante(datos) {

    if (resultaodAO.length == 0) {
        resultaodAO.push(Array(ocultas1.length).fill(0))
    }
    let resultadosOculta1 = []
    let resultadosOculta1H = [] 
    for (let i = 0; i < ocultas1.length; i++) {
        let r = leakyReLU(suma(datos, ocultas1[i].pesos) + ocultas1[i].pesosOC * resultaodAO[paso][i] + ocultas1[i].bias)
        resultadosOculta1H.push(r)
        resultadosOculta1.push(leakyReLU(ocultas1[i].pesoOCS * r + ocultas1[i].sesgoS))

    }
    paso++
    // console.log(resultadosOculta1)
    resultaodAO.push(resultadosOculta1)

    let resultadosSalida = []
    for (let i = 0; i < salida.length; i++) {
        let resultado = sigmoid(suma(resultadosOculta1, salida[i].pesos) + salida[i].bias)
        if (1 < resultado) {
            resultado = 1
        }
        resultadosSalida.push(resultado)

    }
    // console.log(resultaodAO)

    return {
        resultadosOculta1,
        resultadosOculta1H,

        // resultadosOculta2,

        resultadosSalida
        // resultadosOculta3,
        // resultadosOculta4
    }
}


let abecedario = 'abcdefghijklmnñopqrstuvwxyz'

let diccionario = {}

for (let i = 0; i < abecedario.split('').length; i++) {
    diccionario[abecedario.split('')[i]] = i
}
console.log(diccionario['e'])



function procesamientoHaciaAtras(tasaDeAprendizaje, espochs, datos) {

    // let Bocultas4 = []
    // let Bocultas3 = []
    // let Bocultas2 = []

    let Bocultas1 = []
    let Bsalida = []

    for (let s = 0; s < espochs; s++) {
        let errorE = 0

        let descont = -1
        for (let d = 0; d < datos.length; d++) {
            // console.log(datos[d][0])

            let palabra = datos[d][0].split('')
            let respuestaCompleta = palabra[0]
            let error = 0

            for (let i = 0; i < palabra.length - 1; i++) {
                let res = prosesamientoHaciaDelante([(diccionario[palabra[i]]) / 27])
                let resultadoF = 0


                let indice = 0
                let errores = []
                for (let e = 0; e < res.resultadosSalida.length; e++) {
                    // console.log('TIN',numN,abecedario.split('')[numN])
                    let respuestas = Array(res.resultadosSalida.length).fill(0)
                    respuestas[diccionario[palabra[i + 1]]] = 1


                    

                    let valorDN =  res.resultadosSalida[e] - respuestas[e] 


                    errores.push(valorDN)
                    error += crossEntropyLoss(respuestas, res.resultadosSalida)

                    if (resultadoF < res.resultadosSalida[e]) {
                        resultadoF = res.resultadosSalida[e]
                        indice = e
                        // console.log(resultadoF, abecedario.split('')[indice], indice)

                    }

                }

                // console.log(abecedario.split('')[indice], res.resultadosSalida[indice], errores[indice])
                // console.log(res.resultadosSalida[19],'s')

                // console.log(palabra[i], abecedario.split('')[indice])
                // console.log(errores,res.resultadosSalida)

                respuestaCompleta += abecedario.split('')[indice]

                // console.log(respuestaCompleta)


                //salida
                let errorDeCadaNeuronaS = []
                for (let i2 = 0; i2 < salida.length; i2++) {
                    let deltaS = errores[i2] 
                    errorDeCadaNeuronaS.push(deltaS)
                    // console.log(deltaS)
                    salida[i2].bias += descont * (tasaDeAprendizaje * deltaS)
                    for (let w = 0; w < salida[i2].pesos.length; w++) {
                        salida[i2].pesos[w] += descont * (tasaDeAprendizaje * deltaS * res.resultadosOculta1[w])
                    }
                }
                //oculta1

                let errorDeCadaNeurona = []
                for (let i2 = 0; i2 < ocultas1.length; i2++) {
                    let errorCO2 = 0
                    for (let n = 0; n < errorDeCadaNeuronaS.length; n++) {
                        errorCO2 += errorDeCadaNeuronaS[n] * salida[n].pesos[i2]
                    }
                    let delta = errorCO2 * leakyReLUDerivative(res.resultadosOculta1[i2])
                    errorDeCadaNeurona.push(delta)


                    ocultas1[i2].sesgoS += descont * (tasaDeAprendizaje * delta)
                    ocultas1[i2].pesoOCS += descont * (tasaDeAprendizaje * delta * res.resultadosOculta1H[i2])

                    let delta2 = delta * ocultas1[i2].pesoOCS * leakyReLUDerivative(res.resultadosOculta1H[i2])

                    ocultas1[i2].bias += descont * (tasaDeAprendizaje * delta2)
                    for (let w = 0; w < ocultas1[i2].pesos.length; w++) {
                        ocultas1[i2].pesos[w] += descont * (tasaDeAprendizaje * delta2 * diccionario[palabra[i]])
                    }
                    ocultas1[i2].pesosOC += descont * (tasaDeAprendizaje * delta * resultaodAO[i][i2])

                    // console.log(resultaodAO[i][i2],i,i2) 
                }

                
                // let errorDeCadaNeurona2 = []
                // for (let i2 = 0; i2 < ocultas2.length; i2++) {
                //     let errorCO2 = 0
                //     for (let n = 0; n < errorDeCadaNeurona.length; n++) {
                //         errorCO2 += errorDeCadaNeurona[n] * ocultas1[n].pesos[i2]
                //     }
                //     let delta = errorCO2 * leakyReLUDerivative(res.resultadosOculta2[i2])
                //     errorDeCadaNeurona2.push(delta)
                //     ocultas2[i2].bias += descont * (tasaDeAprendizaje * delta)
                //     for (let w = 0; w < ocultas2[i2].pesos.length; w++) {
                //         ocultas2[i2].pesos[w] += descont * (tasaDeAprendizaje * delta * diccionario[palabra[i]])
                //     }
                //     ocultas2[i2].pesosOC += descont * (tasaDeAprendizaje * delta * resultaodAO2[i][i2])

                //     // console.log(resultaodAO[i][i2],i,i2) 
                // }

            }
            resultaodAO = []
            resultaodAO2 = []
            paso = 0
            console.log(error / palabra.length)
        }
    }

    Probar()

}

let datos = [
    ['estegosaurio']
]
// let datos = [
//     ['estegosaurio'],
//     ['tyranosaurio'],
//     ['triceratops'],
//     ['velociraptor'],
//     ['braquiosaurio'],
//     ['apatosaurio'],
//     ['diplodocus'],
//     ['iguanodon'],
//     ['parasaurolophus'],
//     ['ankylosaurio'],
//     ['pachycephalosaurus'],
//     ['spinosaurus'],
//     ['allosaurus'],
//     ['carnotaurus'],
//     ['giganotosaurus'],
//     ['ceratosaurio'],
//     ['compsognathus'],
//     ['dilophosaurus'],
//     ['edmontosaurus'],
//     ['euoplocephalus'],
//     ['hadrosaurus'],
//     ['kentrosaurus'],
//     ['lambeosaurus'],
//     ['maiasaura'],
//     ['megalosaurus'],
//     ['ornithomimus'],
//     ['ouranosaurus'],
//     ['plateosaurus'],
//     ['protoceratops'],
//     ['saltasaurus'],
//     ['saurolophus'],
//     ['stygimoloch'],
//     ['struthiomimus'],
//     ['torosaurus'],
//     ['therizinosaurus'],
//     ['troodon'],
//     ['utahraptor'],
//     ['albertosaurus'],
//     ['amargasaurus'],
//     ['aragosaurus'],
//     ['baryonyx'],
//     ['camarasaurus'],
//     ['camptosaurus'],
//     ['chindesaurus'],
//     ['coelophysis'],
//     ['cryolophosaurus'],
//     ['daspletosaurus'],
//     ['deinonychus'],
//     ['dryosaurus'],
//     ['dreadnoughtus'],
//     ['euhelopus'],
//     ['fukuisaurus'],
//     ['gasosaurus'],
//     ['gigantoraptor'],
//     ['herrerasaurus'],
//     ['hypsilophodon'],
//     ['indosuchus'],
//     ['juravenator'],
//     ['kritosaurus'],
//     ['lufengosaurus'],
//     ['mamenchisaurus'],
//     ['minmi'],
//     ['monolophosaurus'],
//     ['neovenator'],
//     ['ornitholestes'],
//     ['oviraptor'],
//     ['panoplosaurus'],
//     ['qantassaurus'],
//     ['rapetosaurus'],
//     ['rhabdodon'],
//     ['sarcosuchus'],
//     ['shantungosaurus'],
//     ['sinoceratops'],
//     ['siamosaurus'],
//     ['tarchia'],
//     ['tethyshadros'],
//     ['torvosaurus'],
//     ['utahceratops'],
//     ['valdosaurus'],
//     ['vulcanodon'],
//     ['wooolungosaurus'],
//     ['xenotarsosaurus'],
//     ['yutyrannus'],
//     ['zuniceratops'],
//     ['zephyrosaurus'],
//     ['metriacanthosaurus'],
//     ['europasaurus'],
//     ['khaan'],
//     ['incisivosaurus'],
//     ['jurapteryx'],
//     ['leptoceratops'],
//     ['goyocephale'],
//     ['dysalotosaurus'],
//     ['anchiornis'],
//     ['buitreraptor'],
//     ['caudipteryx'],
//     ['dromaeosaurus'],
//     ['ornithosuchus'],
//     ['oviraptorosaurio'],
//     ['psittacosaurus'],
//     ['qianzhousaurus'],
//     ['yangchuanosaurus'],
//     ['zalmoxes']
// ];





// for (let i = 0; i < 7; i++) {
//     crearNeurona(datos[0].length, 2)
// }
for (let i = 0; i < 3; i++) {
    crearNeurona(datos[0].length, 1)
}

let cantidadDPalabras = abecedario.split('').length

for (let i = 0; i < cantidadDPalabras; i++) {
    crearNeurona(ocultas1.length, 0)

}




procesamientoHaciaAtras(.1, 10, datos)


function Probar() {
    for (let d = 0; d < datos.length; d++) {
        let palabra = datos[d][0].split('')
        let respuestaCompleta = palabra[0]
        for (let i = 0; i < palabra.length - 1; i++) {
            let res = prosesamientoHaciaDelante([(diccionario[palabra[i]]) / 27])
            let resultadoF = 0
            let indice = 0
            for (let e = 0; e < res.resultadosSalida.length; e++) {
                if (resultadoF < res.resultadosSalida[e]) {
                    resultadoF = res.resultadosSalida[e]
                    indice = e
                }

            }
            respuestaCompleta += abecedario.split('')[indice]

            console.log(respuestaCompleta,datos[d]) 

        }
    }
}

