//es un modelos seq2seq con el objetivo de dar conversacion coerente y responder preguntas
//IMPORTAR EMBEDING 
const { FORMERR } = require('dns')
let fs = require('fs')
const path = require('path')

let embedingCrudo = fs.readFileSync('./embedingFinal.txt', 'utf-8')
let datosCrudos = fs.readFileSync('./textoDeEntrenamiento.txt', 'utf-8')


let datosMC = JSON.parse(datosCrudos)
let embeding = JSON.parse(embedingCrudo)
// console.log(embeding)


//FUNCION DE ACTIVACION
function softmax(inputs) {
    const maxInput = Math.max(...inputs); // Estabilidad numérica
    const exps = inputs.map(x => Math.exp(x - maxInput)); // Exponencial para cada entrada
    const sumExps = exps.reduce((a, b) => a + b, 0); // Suma de los exponentes
    return exps.map(x => x / sumExps); // Normalización
}

function crossEntropyLoss(yTrue, yPred) {
    let loss = 0;

    for (let i = 0; i < yTrue.length; i++) {
        if (yTrue[i] === 1) {
            loss -= Math.log(yPred[i] + optimizadorAdma.epsilon);
        }
    }

    return loss; // Promedio sobre las muestras
}

function leakyReLU(x, alpha = 0.01) {
    return x > 0 ? x : alpha * x;
}

function leakyReLUDerivative(x, alpha = 0.01) {
    return x > 0 ? 1 : alpha;
}

//CREACION DE NEURONAS
function crearPesosRandom(size) {
    let pesos = []
    for (let i = 0; i < size; i++) {
        pesos.push(Math.random())
    }
    return pesos
}

//variables del optimizador adam
let optimizadorAdma = {
    t: 1,
    b1: 0.9,
    b2: 0.999,
    epsilon: 1e-8
}
let capaOculta4 = []
let capaOculta3 = []
let capaOculta2 = []
let capaOculta1 = []
let capaSalida = []

let capaOculta4E = []
let capaOculta3E = []
let capaOculta2E = []
let capaOculta1E = []

function crearNeurona(capa = 'o', size, red) {
    let objO = {
        pesos: crearPesosRandom(size),
        sesgo: Math.random(),
        pesoO: Math.random(),
        pesoS: Math.random(),
        sesgoS: Math.random(),
        M: Array(size + 4).fill(0),
        V: Array(size + 4).fill(0),
        estadoOculto: 0,
        valoresOcultosEnElTiempo: [0]
    }
    let objS = {
        pesos: crearPesosRandom(size),
        sesgo: Math.random(),
        M: Array(size + 1).fill(0),
        V: Array(size + 1).fill(0)
    }
    if (red == 0) {
        switch (capa) {
            case "o4":
                capaOculta4.push(objO)
                break;
            case "o3":
                capaOculta3.push(objO)
                break;
            case "o2":
                capaOculta2.push(objO)

                break;
            case "o":
                capaOculta1.push(objO)

                break;
            case "s":
                capaSalida.push(objS)
                break;
            default:
                break;
        }
    } else {
        switch (capa) {
            case "o4":
                capaOculta4E.push(objO)
                break;
            case "o3":
                capaOculta3E.push(objO)
                break;
            case "o2":
                capaOculta2E.push(objO)

                break;
            case "o":
                capaOculta1E.push(objO)

                break;
            default:
                break;
        }
    }

}

//claves
let clavesDelObjeto = Object.keys(embeding)


// ASIGNACION DE NEURONAS A CAPAS Y REDES
let valoresC4 = 400
let valoresC3 = 400
let valoresC2 = 400
let valoresC1 = 400


let cantidadDeNeuronasO4 = valoresC4
let cantidadDePesosNeuronalesO4 = embeding[clavesDelObjeto[0]].length

for (let i = 0; i < cantidadDeNeuronasO4; i++) {
    crearNeurona('o4', cantidadDePesosNeuronalesO4, 0)
}


let cantidadDeNeuronasO3 = valoresC3
let cantidadDePesosNeuronalesO3 = cantidadDeNeuronasO4

for (let i = 0; i < cantidadDeNeuronasO3; i++) {
    crearNeurona('o3', cantidadDePesosNeuronalesO3, 0)
}

// console.log(capaOculta3[0])
let cantidadDeNeuronasO2 = valoresC2
let cantidadDePesosNeuronalesO2 = cantidadDeNeuronasO3

for (let i = 0; i < cantidadDeNeuronasO2; i++) {
    crearNeurona('o2', cantidadDePesosNeuronalesO2, 0)
}


let cantidadDeNeuronasO = valoresC1
let cantidadDePesosNeuronalesO = cantidadDeNeuronasO2

for (let i = 0; i < cantidadDeNeuronasO; i++) {
    crearNeurona('o', cantidadDePesosNeuronalesO, 0)
}

let cantidadDeNeuronasS = clavesDelObjeto.length + 1
let cantidadDePesosNeuronalesS = cantidadDeNeuronasO

for (let i = 0; i < cantidadDeNeuronasS; i++) {
    crearNeurona('s', cantidadDePesosNeuronalesS, 0)
}


//ENCODER   


let cantidadDeNeuronasOE4 = valoresC4
let cantidadDePesosNeuronalesOE4 = embeding[clavesDelObjeto[0]].length

for (let i = 0; i < cantidadDeNeuronasOE4; i++) {
    crearNeurona('o4', cantidadDePesosNeuronalesOE4, 1)
}

let cantidadDeNeuronasOE3 = valoresC3
let cantidadDePesosNeuronalesOE3 = cantidadDeNeuronasOE4

for (let i = 0; i < cantidadDeNeuronasOE3; i++) {
    crearNeurona('o3', cantidadDePesosNeuronalesOE3, 1)
}

let cantidadDeNeuronasOE2 = valoresC2
let cantidadDePesosNeuronalesOE2 = cantidadDeNeuronasOE3

for (let i = 0; i < cantidadDeNeuronasOE2; i++) {
    crearNeurona('o2', cantidadDePesosNeuronalesOE2, 1)
}



let cantidadDeNeuronasOE = valoresC1
let cantidadDePesosNeuronalesOE = cantidadDeNeuronasOE2

for (let i = 0; i < cantidadDeNeuronasOE; i++) {
    crearNeurona('o', cantidadDePesosNeuronalesOE, 1)
}



//desinfeccion de red 
function desinfectadorDeRed() {
    // console.log('desinfectando....')
    //salida
    for (let i = 0; i < capaSalida.length; i++) {
        if (isNaN(capaSalida[i].sesgo)) {
            capaSalida[i].sesgo = Math.random()
            capaSalida[i].V[0] = Math.random()
            capaSalida[i].M[0] = Math.random()
        }
        for (let w = 0; w < capaSalida[i].pesos.length; w++) {
            if (isNaN(capaSalida[i].pesos[w])) {
                capaSalida[i].pesos[w] = Math.random()
                capaSalida[i].V[w + 1] = Math.random()
                capaSalida[i].M[w + 1] = Math.random()
            }
        }
    }
    //capaO1
    for (let i = 0; i < capaOculta1.length; i++) {

        if (isNaN(capaOculta1[i].sesgoS)) {
            capaOculta1[i].sesgoS = Math.random()
            capaOculta1[i].V[0] = Math.random()
            capaOculta1[i].M[0] = Math.random()

        }
        if (isNaN(capaOculta1[i].pesoS)) {
            capaOculta1[i].pesoS = Math.random()
            capaOculta1[i].V[1] = Math.random()
            capaOculta1[i].M[1] = Math.random()

        }
        if (isNaN(capaOculta1[i].sesgo)) {
            capaOculta1[i].sesgo = Math.random()
            capaOculta1[i].V[2] = Math.random()
            capaOculta1[i].M[2] = Math.random()

        }
        if (isNaN(capaOculta1[i].pesoO)) {
            capaOculta1[i].pesoO = Math.random()
            capaOculta1[i].V[3] = Math.random()
            capaOculta1[i].M[3] = Math.random()

        }
        for (let w = 0; w < capaOculta1[i].pesos.length; w++) {
            if (isNaN(capaOculta1[i].pesos[w])) {
                capaOculta1[i].pesos[w] = Math.random()
                capaOculta1[i].V[w + 4] = Math.random()
                capaOculta1[i].M[w + 4] = Math.random()


            }
        }
    }
    //capaO2 
    for (let i = 0; i < capaOculta2.length; i++) {

        if (isNaN(capaOculta2[i].sesgoS)) {
            capaOculta2[i].sesgoS = Math.random()
            capaOculta2[i].V[0] = Math.random()
            capaOculta2[i].M[0] = Math.random()

        }
        if (isNaN(capaOculta2[i].pesoS)) {
            capaOculta2[i].pesoS = Math.random()
            capaOculta2[i].V[1] = Math.random()
            capaOculta2[i].M[1] = Math.random()

        }
        if (isNaN(capaOculta2[i].sesgo)) {
            capaOculta2[i].sesgo = Math.random()
            capaOculta2[i].V[2] = Math.random()
            capaOculta2[i].M[2] = Math.random()

        }
        if (isNaN(capaOculta2[i].pesoO)) {
            capaOculta2[i].pesoO = Math.random()
            capaOculta2[i].V[3] = Math.random()
            capaOculta2[i].M[3] = Math.random()

        }
        for (let w = 0; w < capaOculta2[i].pesos.length; w++) {
            if (isNaN(capaOculta2[i].pesos[w])) {
                capaOculta2[i].pesos[w] = Math.random()
                capaOculta2[i].V[w + 4] = Math.random()
                capaOculta2[i].M[w + 4] = Math.random()


            }
        }
    }

    //capaO3
    for (let i = 0; i < capaOculta3.length; i++) {

        if (isNaN(capaOculta3[i].sesgoS)) {
            capaOculta3[i].sesgoS = Math.random()
            capaOculta3[i].V[0] = Math.random()
            capaOculta3[i].M[0] = Math.random()

        }
        if (isNaN(capaOculta3[i].pesoS)) {
            capaOculta3[i].pesoS = Math.random()
            capaOculta3[i].V[1] = Math.random()
            capaOculta3[i].M[1] = Math.random()

        }
        if (isNaN(capaOculta3[i].sesgo)) {
            capaOculta3[i].sesgo = Math.random()
            capaOculta3[i].V[2] = Math.random()
            capaOculta3[i].M[2] = Math.random()

        }
        if (isNaN(capaOculta3[i].pesoO)) {
            capaOculta3[i].pesoO = Math.random()
            capaOculta3[i].V[3] = Math.random()
            capaOculta3[i].M[3] = Math.random()

        }
        for (let w = 0; w < capaOculta3[i].pesos.length; w++) {
            if (isNaN(capaOculta3[i].pesos[w])) {
                capaOculta3[i].pesos[w] = Math.random()
                capaOculta3[i].V[w + 4] = Math.random()
                capaOculta3[i].M[w + 4] = Math.random()
            }
        }
    }

    //capaO3
    for (let i = 0; i < capaOculta4.length; i++) {

        if (isNaN(capaOculta4[i].sesgoS)) {
            capaOculta4[i].sesgoS = Math.random()
            capaOculta4[i].V[0] = Math.random()
            capaOculta4[i].M[0] = Math.random()

        }
        if (isNaN(capaOculta4[i].pesoS)) {
            capaOculta4[i].pesoS = Math.random()
            capaOculta4[i].V[1] = Math.random()
            capaOculta4[i].M[1] = Math.random()

        }
        if (isNaN(capaOculta4[i].sesgo)) {
            capaOculta4[i].sesgo = Math.random()
            capaOculta4[i].V[2] = Math.random()
            capaOculta4[i].M[2] = Math.random()

        }
        if (isNaN(capaOculta4[i].pesoO)) {
            capaOculta4[i].pesoO = Math.random()
            capaOculta4[i].V[3] = Math.random()
            capaOculta4[i].M[3] = Math.random()

        }
        for (let w = 0; w < capaOculta4[i].pesos.length; w++) {
            if (isNaN(capaOculta4[i].pesos[w])) {
                capaOculta4[i].pesos[w] = Math.random()
                capaOculta4[i].V[w + 4] = Math.random()
                capaOculta4[i].M[w + 4] = Math.random()
            }
        }
    }


    //CapaOE1
    for (let i = 0; i < capaOculta1E.length; i++) {

        if (isNaN(capaOculta1E[i].sesgoS)) {
            capaOculta1E[i].sesgoS = Math.random()
            capaOculta1E[i].V[0] = Math.random()
            capaOculta1E[i].M[0] = Math.random()

        }
        if (isNaN(capaOculta1E[i].pesoS)) {
            capaOculta1E[i].pesoS = Math.random()
            capaOculta1E[i].V[1] = Math.random()
            capaOculta1E[i].M[1] = Math.random()

        }
        if (isNaN(capaOculta1E[i].sesgo)) {
            capaOculta1E[i].sesgo = Math.random()
            capaOculta1E[i].V[2] = Math.random()
            capaOculta1E[i].M[2] = Math.random()

        }
        if (isNaN(capaOculta1E[i].pesoO)) {
            capaOculta1E[i].pesoO = Math.random()
            capaOculta1E[i].V[3] = Math.random()
            capaOculta1E[i].M[3] = Math.random()

        }
        for (let w = 0; w < capaOculta1E[i].pesos.length; w++) {
            if (isNaN(capaOculta1E[i].pesos[w])) {
                capaOculta1E[i].pesos[w] = Math.random()
                capaOculta1E[i].V[w + 4] = Math.random()
                capaOculta1E[i].M[w + 4] = Math.random()


            }
        }
    }
    //capaOE2
    for (let i = 0; i < capaOculta2E.length; i++) {

        if (isNaN(capaOculta2E[i].sesgoS)) {
            capaOculta2E[i].sesgoS = Math.random()
            capaOculta2E[i].V[0] = Math.random()
            capaOculta2E[i].M[0] = Math.random()

        }
        if (isNaN(capaOculta2E[i].pesoS)) {
            capaOculta2E[i].pesoS = Math.random()
            capaOculta2E[i].V[1] = Math.random()
            capaOculta2E[i].M[1] = Math.random()

        }
        if (isNaN(capaOculta2E[i].sesgo)) {
            capaOculta2E[i].sesgo = Math.random()
            capaOculta2E[i].V[2] = Math.random()
            capaOculta2E[i].M[2] = Math.random()

        }
        if (isNaN(capaOculta2E[i].pesoO)) {
            capaOculta2E[i].pesoO = Math.random()
            capaOculta2E[i].V[3] = Math.random()
            capaOculta2E[i].M[3] = Math.random()

        }
        for (let w = 0; w < capaOculta2E[i].pesos.length; w++) {
            if (isNaN(capaOculta2E[i].pesos[w])) {
                capaOculta2E[i].pesos[w] = Math.random()
                capaOculta2E[i].V[w + 4] = Math.random()
                capaOculta2E[i].M[w + 4] = Math.random()


            }
        }
    }
    //capaOE3
    for (let i = 0; i < capaOculta3E.length; i++) {

        if (isNaN(capaOculta3E[i].sesgoS)) {
            capaOculta3E[i].sesgoS = Math.random()
            capaOculta3E[i].V[0] = Math.random()
            capaOculta3E[i].M[0] = Math.random()

        }
        if (isNaN(capaOculta3E[i].pesoS)) {
            capaOculta3E[i].pesoS = Math.random()
            capaOculta3E[i].V[1] = Math.random()
            capaOculta3E[i].M[1] = Math.random()

        }
        if (isNaN(capaOculta3E[i].sesgo)) {
            capaOculta3E[i].sesgo = Math.random()
            capaOculta3E[i].V[2] = Math.random()
            capaOculta3E[i].M[2] = Math.random()

        }
        if (isNaN(capaOculta3E[i].pesoO)) {
            capaOculta3E[i].pesoO = Math.random()
            capaOculta3E[i].V[3] = Math.random()
            capaOculta3E[i].M[3] = Math.random()

        }
        for (let w = 0; w < capaOculta3E[i].pesos.length; w++) {
            if (isNaN(capaOculta3E[i].pesos[w])) {
                capaOculta3E[i].pesos[w] = Math.random()
                capaOculta3E[i].V[w + 4] = Math.random()
                capaOculta3E[i].M[w + 4] = Math.random()


            }
        }
    }
    //capaOE4
    for (let i = 0; i < capaOculta4E.length; i++) {

        if (isNaN(capaOculta4E[i].sesgoS)) {
            capaOculta4E[i].sesgoS = Math.random()
            capaOculta4E[i].V[0] = Math.random()
            capaOculta4E[i].M[0] = Math.random()

        }
        if (isNaN(capaOculta4E[i].pesoS)) {
            capaOculta4E[i].pesoS = Math.random()
            capaOculta4E[i].V[1] = Math.random()
            capaOculta4E[i].M[1] = Math.random()

        }
        if (isNaN(capaOculta4E[i].sesgo)) {
            capaOculta4E[i].sesgo = Math.random()
            capaOculta4E[i].V[2] = Math.random()
            capaOculta4E[i].M[2] = Math.random()

        }
        if (isNaN(capaOculta4E[i].pesoO)) {
            capaOculta4E[i].pesoO = Math.random()
            capaOculta4E[i].V[3] = Math.random()
            capaOculta4E[i].M[3] = Math.random()

        }
        for (let w = 0; w < capaOculta4E[i].pesos.length; w++) {
            if (isNaN(capaOculta4E[i].pesos[w])) {
                capaOculta4E[i].pesos[w] = Math.random()
                capaOculta4E[i].V[w + 4] = Math.random()
                capaOculta4E[i].M[w + 4] = Math.random()


            }
        }
    }
}





//PROCESAMIENTO HACIA DELANTE 

let salidaDeEncoder = {}
let salidaDeDecoder = {}

function reduccionDeDecimales(num) {
    let numSep = num.toString().split('')
    numSep = numSep.slice(0, 12)
    let strF = numSep.join('')
    let numF = parseFloat(strF)
    return numF
}

function procesamientoHaciaDelante(datos, uso = 'decoder') {
    if (uso == 'encoder') {
        //para encoder
        //OCULTA4
        let resultadoO4 = []
        let resultadoOH4 = []
        for (let i = 0; i < capaOculta4E.length; i++) {
            let sumaOC = 0
            for (let w = 0; w < capaOculta4E[i].pesos.length; w++) {
                sumaOC += capaOculta4E[i].pesos[w] * datos[w]
            }
            sumaOC += capaOculta4E[i].pesoO * capaOculta4E[i].estadoOculto
            sumaOC += capaOculta4E[i].sesgo
            resultadoOH4.push(leakyReLU(sumaOC))
            capaOculta4E[i].estadoOculto = sumaOC
            capaOculta4E[i].estadoOculto = sumaOC
            capaOculta4E[i].valoresOcultosEnElTiempo.push(sumaOC)
            sumaS = sumaOC * capaOculta4E[i].pesoS + capaOculta4E[i].sesgoS
            resultadoO4.push(leakyReLU(sumaS))

        }
        //OCULTA3
        let resultadoO3 = []
        let resultadoOH3 = []
        for (let i = 0; i < capaOculta3E.length; i++) {
            let sumaOC = 0
            for (let w = 0; w < capaOculta3E[i].pesos.length; w++) {
                sumaOC += capaOculta3E[i].pesos[w] * resultadoO4[w]
            }
            sumaOC += capaOculta3E[i].pesoO * capaOculta3E[i].estadoOculto
            sumaOC += capaOculta3E[i].sesgo
            resultadoOH3.push(leakyReLU(sumaOC))
            capaOculta3E[i].estadoOculto = sumaOC
            capaOculta3E[i].estadoOculto = sumaOC
            capaOculta3E[i].valoresOcultosEnElTiempo.push(sumaOC)
            sumaS = sumaOC * capaOculta3E[i].pesoS + capaOculta3E[i].sesgoS
            resultadoO3.push(leakyReLU(sumaS))

        }
        //OCULTA2
        let resultadoO2 = []
        let resultadoOH2 = []
        for (let i = 0; i < capaOculta2E.length; i++) {
            let sumaOC = 0
            for (let w = 0; w < capaOculta2E[i].pesos.length; w++) {
                sumaOC += capaOculta2E[i].pesos[w] * resultadoO3[w]
            }
            sumaOC += capaOculta2E[i].pesoO * capaOculta2E[i].estadoOculto
            sumaOC += capaOculta2E[i].sesgo
            resultadoOH2.push(leakyReLU(sumaOC))
            capaOculta2E[i].estadoOculto = sumaOC
            capaOculta2E[i].estadoOculto = sumaOC
            capaOculta2E[i].valoresOcultosEnElTiempo.push(sumaOC)
            sumaS = sumaOC * capaOculta2E[i].pesoS + capaOculta2E[i].sesgoS
            resultadoO2.push(leakyReLU(sumaS))

        }
        //OCULTA1
        let resultadoO = []
        let resultadoOH = []
        for (let i = 0; i < capaOculta1E.length; i++) {
            let sumaOC = 0
            for (let w = 0; w < capaOculta1E[i].pesos.length; w++) {
                sumaOC += capaOculta1E[i].pesos[w] * resultadoO2[w]
            }
            sumaOC += capaOculta1E[i].pesoO * capaOculta1E[i].estadoOculto
            sumaOC += capaOculta1E[i].sesgo
            resultadoOH.push(leakyReLU(sumaOC))
            capaOculta1E[i].estadoOculto = sumaOC
            capaOculta1[i].estadoOculto = sumaOC
            capaOculta1E[i].valoresOcultosEnElTiempo.push(sumaOC)
            sumaS = sumaOC * capaOculta1E[i].pesoS + capaOculta1E[i].sesgoS
            resultadoO.push(leakyReLU(sumaS))

        }

        return { resultadoOH, resultadoO, resultadoO2, resultadoOH2, resultadoO3, resultadoOH3, resultadoO4, resultadoOH4 }
    } else {

        //para decoder
        //OCULTA4
        let resultadoO4 = []
        let resultadoOH4 = []
        for (let i = 0; i < capaOculta4.length; i++) {
            let sumaOC = 0
            for (let w = 0; w < capaOculta4[i].pesos.length; w++) {
                sumaOC += capaOculta4[i].pesos[w] * datos[w]
            }
            sumaOC += capaOculta4[i].pesoO * capaOculta4[i].estadoOculto
            sumaOC += capaOculta4[i].sesgo
            resultadoOH4.push(leakyReLU(sumaOC))
            capaOculta4[i].estadoOculto = sumaOC
            capaOculta4[i].valoresOcultosEnElTiempo.push(sumaOC)
            sumaS = sumaOC * capaOculta4[i].pesoS + capaOculta4[i].sesgoS
            resultadoO4.push(leakyReLU(sumaS))

        }
        //OCULTA3
        let resultadoO3 = []
        let resultadoOH3 = []
        for (let i = 0; i < capaOculta3.length; i++) {
            let sumaOC = 0
            for (let w = 0; w < capaOculta3[i].pesos.length; w++) {
                sumaOC += capaOculta3[i].pesos[w] * resultadoO4[w]
            }
            sumaOC += capaOculta3[i].pesoO * capaOculta3[i].estadoOculto
            sumaOC += capaOculta3[i].sesgo
            resultadoOH3.push(leakyReLU(sumaOC))
            capaOculta3[i].estadoOculto = sumaOC
            capaOculta3[i].valoresOcultosEnElTiempo.push(sumaOC)
            sumaS = sumaOC * capaOculta3[i].pesoS + capaOculta3[i].sesgoS
            resultadoO3.push(leakyReLU(sumaS))

        }
        //OCULTA2
        let resultadoO2 = []
        let resultadoOH2 = []
        for (let i = 0; i < capaOculta2.length; i++) {
            let sumaOC = 0
            for (let w = 0; w < capaOculta2[i].pesos.length; w++) {
                sumaOC += capaOculta2[i].pesos[w] * resultadoO3[w]
            }
            sumaOC += capaOculta2[i].pesoO * capaOculta2[i].estadoOculto
            sumaOC += capaOculta2[i].sesgo
            resultadoOH2.push(leakyReLU(sumaOC))
            capaOculta2[i].estadoOculto = sumaOC
            capaOculta2[i].valoresOcultosEnElTiempo.push(sumaOC)
            sumaS = sumaOC * capaOculta2[i].pesoS + capaOculta2[i].sesgoS
            resultadoO2.push(leakyReLU(sumaS))

        }



        //OCULTA1
        let resultadoO = []
        let resultadoOH = []
        for (let i = 0; i < capaOculta1.length; i++) {
            let sumaOC = 0
            for (let w = 0; w < capaOculta1[i].pesos.length; w++) {
                sumaOC += capaOculta1[i].pesos[w] * resultadoO2[w]
            }

            sumaOC += capaOculta1[i].pesoO * capaOculta1[i].estadoOculto
            sumaOC += capaOculta1[i].sesgo
            resultadoOH.push(leakyReLU(sumaOC))
            capaOculta1[i].estadoOculto = sumaOC
            capaOculta1[i].valoresOcultosEnElTiempo.push(sumaOC)
            sumaS = sumaOC * capaOculta1[i].pesoS + capaOculta1[i].sesgoS
            resultadoO.push(leakyReLU(sumaS))

        }



        //salida
        let resultadoSC = []
        for (let i = 0; i < capaSalida.length; i++) {
            let suma = capaSalida[i].sesgo
            for (let w = 0; w < capaSalida[i].pesos.length; w++) {
                suma += reduccionDeDecimales(capaSalida[i].pesos[w] * resultadoO[w])
            }
            resultadoSC.push(suma)
        }

        let resultadoS = softmax(resultadoSC)

        return { resultadoOH, resultadoO, resultadoS, resultadoO2, resultadoOH2, resultadoO3, resultadoOH3, resultadoO4, resultadoOH4 }
    }
}


//CODIFICADOR

function codificador(fraseCrud = '') {
    let frase = fraseCrud.toLowerCase()
    let palabras = frase.split(' ')

    let salidaredF = {
        ocultas1: {
            salidasOcultas: [],
            salidasOcultasH: []
        },
        ocultas2: {
            salidasOcultas: [],
            salidasOcultasH: []
        },
        ocultas3: {
            salidasOcultas: [],
            salidasOcultasH: []
        },
        ocultas4: {
            salidasOcultas: [],
            salidasOcultasH: []
        }

    }

    let salida;
    for (let i = 0; i < palabras.length; i++) {

        if (!embeding[palabras[i]]) {
            console.log('palabra no encontrada')
            continue;
        }

        let embedingPalabra = embeding[palabras[i]]
        salida = procesamientoHaciaDelante(embedingPalabra, 'encoder')
        salidaredF.ocultas1.salidasOcultas.push(salida.resultadoO)
        salidaredF.ocultas1.salidasOcultasH.push(salida.resultadoOH)
        salidaredF.ocultas2.salidasOcultas.push(salida.resultadoO2)
        salidaredF.ocultas2.salidasOcultasH.push(salida.resultadoOH2)
        salidaredF.ocultas3.salidasOcultas.push(salida.resultadoO3)
        salidaredF.ocultas3.salidasOcultasH.push(salida.resultadoOH3)
        salidaredF.ocultas4.salidasOcultas.push(salida.resultadoO4)
        salidaredF.ocultas4.salidasOcultasH.push(salida.resultadoOH4)
    }


    salidaDeEncoder = salidaredF


    return { ULP: palabras[palabras.length - 1] }
}


//DECODIFICADOR
function decodificador(ultimaPalabra) {
    let palabra = ultimaPalabra.toLowerCase()
    let embedingPalabra = embeding[palabra]
    let salida = procesamientoHaciaDelante(embedingPalabra)

    //ASIGNAMIENTO DE PALABRA
    let indiceDeLetra = 0
    let resultadoMasAlto = -1

    for (let i = 0; i < salida.resultadoS.length; i++) {
        if (resultadoMasAlto < salida.resultadoS[i]) {
            resultadoMasAlto = salida.resultadoS[i]
            indiceDeLetra = i
        }
    }
    return { indiceDeLetra, salida }
}

function interaccion(frase, fraaseDeSalida) {
    let salidaFrase = []
    let salidaFraseNR = []

    let palabrasFraseDesalida = fraaseDeSalida.split(' ')
    // console.log('......',palabrasFraseDesalida)
    let estado = codificador(frase)


    salidaFrase.push(clavesDelObjeto.indexOf('|start|'))
    salidaFraseNR.push(clavesDelObjeto.indexOf('|start|'))


    let salidaredF = {
        ocultas4: {
            salidasOcultas: [],
            salidasOcultasH: []
        },
        ocultas3: {
            salidasOcultas: [],
            salidasOcultasH: []
        },
        ocultas2: {
            salidasOcultas: [],
            salidasOcultasH: []
        },
        ocultas1: {
            salidasOcultas: [],
            salidasOcultasH: []
        },
        salida: []
    }



    for (let i = 0; i < palabrasFraseDesalida.length - 1; i++) {
        // console.log(',,,',clavesDelObjeto[salidaFraseNR[salidaFraseNR.length - 1]])
        let salida = decodificador(clavesDelObjeto[salidaFraseNR[salidaFraseNR.length - 1]])

        salidaredF.ocultas1.salidasOcultas.push(salida.salida.resultadoO)
        salidaredF.ocultas1.salidasOcultasH.push(salida.salida.resultadoOH)
        salidaredF.ocultas2.salidasOcultas.push(salida.salida.resultadoO2)
        salidaredF.ocultas2.salidasOcultasH.push(salida.salida.resultadoOH2)
        salidaredF.ocultas3.salidasOcultas.push(salida.salida.resultadoO3)
        salidaredF.ocultas3.salidasOcultasH.push(salida.salida.resultadoOH3)
        salidaredF.ocultas4.salidasOcultas.push(salida.salida.resultadoO4)
        salidaredF.ocultas4.salidasOcultasH.push(salida.salida.resultadoOH4)
        salidaredF.salida.push(salida.salida.resultadoS)


        if (salida.indiceDeLetra !== clavesDelObjeto.indexOf('|end|') || palabrasFraseDesalida[salidaFraseNR.length] != undefined) {
            salidaFraseNR.push(clavesDelObjeto.indexOf(palabrasFraseDesalida[salidaFraseNR.length]))
            salidaFrase.push(salida.indiceDeLetra)
        } else {
            i = palabrasFraseDesalida.length
        }

    }
    salidaFrase.shift()
    salidaFraseNR.shift()


    let salidaFraseEscrita = []
    for (let i = 0; i < salidaFrase.length; i++) {
        salidaFraseEscrita.push(clavesDelObjeto[salidaFrase[i]])
    }


    console.log('.....', salidaFraseEscrita.join(' '))
    salidaDeDecoder = salidaredF

    return { salidaFrase }
}


//se utiliza esta funcion ya que de lo contrario la red no le ve diferencia a
//decir las palabras en distinto orden que a decir palabras completamente diferentes
function sesgoParaIA(valorRed, valorReal, cantidadDePalabrasAcertadas, cantidadDePalabrasEsperadas) {
    const porcentaje = (cantidadDePalabrasAcertadas * 100) / cantidadDePalabrasEsperadas

    let numero = porcentaje * 4 / 100

    numero < 1 ? numero = 1 : numero

    return (valorRed - valorReal) / numero


}


//entrenamiento

function entrenamiento(tasaDeAprendizaje, espochs, datos) {
    let n = 0
    let batch = 7
    console.log('empezando entrenamiento')
    for (let es = 0; es < espochs; es++) {
        // console.log(datos.length)
        let error = 0
        for (let d = 0; d < datos.length; d++) {
            // console.log(datos[d].input)
            //copia de el decoder
            let salidaCopia = capaSalida
            let oculta1Copia = capaOculta1
            let oculta1Copia2 = capaOculta2
            let oculta1Copia3 = capaOculta3
            let oculta1Copia4 = capaOculta4




            //copias del encoder
            let oculta1CopiaE = capaOculta1E
            let oculta1Copia2E = capaOculta2E
            let oculta1Copia3E = capaOculta3E
            let oculta1Copia4E = capaOculta4E

            //reinicio estado oculto de decoder
            capaOculta1.map((data) => {
                data.estadoOculto = 0
                data.valoresOcultosEnElTiempo = [0]
            })

            capaOculta2.map((data) => {
                data.estadoOculto = 0
                data.valoresOcultosEnElTiempo = [0]
            })
            capaOculta3.map((data) => {
                data.estadoOculto = 0
                data.valoresOcultosEnElTiempo = [0]
            })
            capaOculta4.map((data) => {
                data.estadoOculto = 0
                data.valoresOcultosEnElTiempo = [0]
            })


            //reinicio estado oculto de encoder
            capaOculta1E.map((data) => {
                data.estadoOculto = 0
                data.valoresOcultosEnElTiempo = [0]
            })

            capaOculta2E.map((data) => {
                data.estadoOculto = 0
                data.valoresOcultosEnElTiempo = [0]
            })
            capaOculta3E.map((data) => {
                data.estadoOculto = 0
                data.valoresOcultosEnElTiempo = [0]
            })
            capaOculta4E.map((data) => {
                data.estadoOculto = 0
                data.valoresOcultosEnElTiempo = [0]
            })

            let fallo = false

            salidaDeEncoder = {}
            salidaDeDecoder = {}
            let datosActuales = datos[d].input.toLowerCase()
            let respuestasEsperadas = datos[d].output.toLowerCase()

            let datosAcutalesParaEntrenamiento = datosActuales.split(' ')

            let salidaDeRed = interaccion(datosActuales, respuestasEsperadas)

            let erroresDeCapaO = Array(capaOculta1.length).fill(0)
            let erroresDeCapaO2 = Array(capaOculta2.length).fill(0)
            let erroresDeCapaO3 = Array(capaOculta3.length).fill(0)


            // console.log(salidaDeDecoder)
            let respuestasEsperadasArray = respuestasEsperadas.split(' ')
            respuestasEsperadasArray.shift()

            let salidaDeLaFraseEscrita = []

            for (let i = 0; i < salidaDeRed.salidaFrase.length; i++) {
                salidaDeLaFraseEscrita.push(clavesDelObjeto[salidaDeRed.salidaFrase[i]])
            }

            // ENTRENAMIENTO DEL DECODER
            for (let t = salidaDeRed.salidaFrase.length - 1; 0 <= t; t--) {
                let cantidadDePalabrasAcertadas = 0
                for (let CD = 0; CD < salidaDeLaFraseEscrita.length && CD < respuestasEsperadasArray.length; CD++) {

                    if (salidaDeLaFraseEscrita.includes(respuestasEsperadasArray[CD])) {
                        cantidadDePalabrasAcertadas++

                    }
                }

                desinfectadorDeRed()
                //calculoDeError
                let secuenciaDePalabras = datos[d].output.split(' ')
                secuenciaDePalabras.shift()
                let indiceDeDatoEsperado = clavesDelObjeto.indexOf(secuenciaDePalabras[t])

                let errorDeCadaNeuronasalida = []

                let salidaEsperadaDeCadaNeurona = Array(capaSalida.length).fill(0); salidaEsperadaDeCadaNeurona[indiceDeDatoEsperado] = 1

                let activacionesNeuronalesSalida = salidaDeDecoder.salida[t]



                // error += crossEntropyLoss(salidaEsperadaDeCadaNeurona,activacionesNeuronalesSalida)

                for (let i = 0; i < salidaEsperadaDeCadaNeurona.length; i++) {
                    // error += Math.abs(activacionesNeuronalesSalida[i] - salidaEsperadaDeCadaNeurona[i])
                    error += crossEntropyLoss(salidaEsperadaDeCadaNeurona, activacionesNeuronalesSalida)
                    if (isNaN(activacionesNeuronalesSalida[i] - salidaEsperadaDeCadaNeurona[i])) {
                        console.log('-------------------------------------------------------')
                        console.log(activacionesNeuronalesSalida[i], salidaEsperadaDeCadaNeurona[i])
                        console.log(activacionesNeuronalesSalida.length, salidaEsperadaDeCadaNeurona.length)
                        errorDeCadaNeuronasalida.push(0)

                    } else {
                        const errorDeNeurona = sesgoParaIA(activacionesNeuronalesSalida[i], salidaEsperadaDeCadaNeurona[i], cantidadDePalabrasAcertadas, salidaDeRed.salidaFrase.length)
                        errorDeCadaNeuronasalida.push(errorDeNeurona)
                    }

                }



                //actualizacion de la capa de salida
                for (let i = 0; i < capaSalida.length; i++) {

                    // console.log('wsa',errorDeCadaNeuronasalida[i])

                    salidaCopia[i].M[0] = optimizadorAdma.b1 * salidaCopia[i].M[0] + (1 - optimizadorAdma.b1) * errorDeCadaNeuronasalida[i]
                    salidaCopia[i].V[0] = optimizadorAdma.b2 * salidaCopia[i].V[0] + (1 - optimizadorAdma.b2) * (errorDeCadaNeuronasalida[i]) ** 2


                    let mHat = salidaCopia[i].M[0] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t));
                    let vHat = salidaCopia[i].V[0] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t));


                    salidaCopia[i].sesgo -= tasaDeAprendizaje * mHat / (Math.sqrt(vHat) + optimizadorAdma.epsilon) / batch



                    for (let w = 0; w < capaSalida[i].pesos.length; w++) {


                        let pesoPED = reduccionDeDecimales(salidaDeDecoder.ocultas1.salidasOcultas[t][w])

                        // console.log('---------------------')
                        // console.log(salidaCopia[i].M[w + 1],salidaCopia[i].V[w + 1])
                        // console.log( errorDeCadaNeuronasalida[i] , pesoPED)
                        salidaCopia[i].M[w + 1] = optimizadorAdma.b1 * salidaCopia[i].M[w + 1] + (1 - optimizadorAdma.b1) * errorDeCadaNeuronasalida[i] * pesoPED
                        salidaCopia[i].V[w + 1] = optimizadorAdma.b2 * salidaCopia[i].V[w + 1] + (1 - optimizadorAdma.b2) * (errorDeCadaNeuronasalida[i] * pesoPED) ** 2
                        // console.log(salidaCopia[i].M[w + 1],salidaCopia[i].V[w + 1])



                        let mHatP = salidaCopia[i].M[w + 1] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t));
                        let vHatP = salidaCopia[i].V[w + 1] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t));



                        salidaCopia[i].pesos[w] -= tasaDeAprendizaje * mHatP / (Math.sqrt(vHatP) + optimizadorAdma.epsilon) / batch

                    }


                }
                //actualizacion de capa oculta1
                let errorDecadaNeuronaOculta1 = []
                for (let i = 0; i < capaOculta1.length; i++) {

                    let errorDeEstaNeurona = 0
                    for (let e = 0; e < capaSalida.length; e++) {
                        errorDeEstaNeurona += errorDeCadaNeuronasalida[e] * capaSalida[e].pesos[i]
                    }

                    let deltaDeEstaNuerona = reduccionDeDecimales(errorDeEstaNeurona * leakyReLUDerivative(salidaDeDecoder.ocultas1.salidasOcultas[t][i]))
                    if (5 < deltaDeEstaNuerona) {
                        deltaDeEstaNuerona = 5
                    } else if (deltaDeEstaNuerona < -5) {
                        deltaDeEstaNuerona = -5
                    }

                    errorDecadaNeuronaOculta1.push(deltaDeEstaNuerona)
                    //guardar error para el encoder
                    erroresDeCapaO[i] += deltaDeEstaNuerona * capaOculta1[i].pesoO


                    //preparaciones para la optimizacion con adam del sesgo de la salida de la capa oculta 1
                    oculta1Copia[i].M[0] = optimizadorAdma.b1 * oculta1Copia[i].M[0] + (1 - optimizadorAdma.b1) * deltaDeEstaNuerona
                    oculta1Copia[i].V[0] = optimizadorAdma.b2 * oculta1Copia[i].V[0] + (1 - optimizadorAdma.b2) * (deltaDeEstaNuerona) ** 2

                    let mHatSS = oculta1Copia[i].M[0] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatSS = oculta1Copia[i].V[0] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //preparaciones para la optimizacion con adam del peso de la salida de la capa oculta 1
                    oculta1Copia[i].M[1] = optimizadorAdma.b1 * oculta1Copia[i].M[1] + (1 - optimizadorAdma.b1) * (deltaDeEstaNuerona * salidaDeDecoder.ocultas1.salidasOcultasH[t][i])
                    oculta1Copia[i].V[1] = optimizadorAdma.b2 * oculta1Copia[i].V[1] + (1 - optimizadorAdma.b2) * (deltaDeEstaNuerona * salidaDeDecoder.ocultas1.salidasOcultasH[t][i]) ** 2


                    let mHatSP = oculta1Copia[i].M[1] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatSP = oculta1Copia[i].V[1] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //optimizacion de parametros antes mencionados 
                    oculta1Copia[i].sesgoS -= tasaDeAprendizaje * mHatSS / (Math.sqrt(vHatSS) + optimizadorAdma.epsilon) / batch
                    oculta1Copia[i].pesoS -= tasaDeAprendizaje * mHatSP / (Math.sqrt(vHatSP) + optimizadorAdma.epsilon) / batch



                    //optimizacion de parametros "normales" de una red feedfordwar (y pesoH que es propio de las redes recurrentes)
                    let deltaPesosOcultaNeurona = reduccionDeDecimales(deltaDeEstaNuerona * capaOculta1[i].pesoS * leakyReLUDerivative(salidaDeDecoder.ocultas1.salidasOcultasH[t][i]))
                    if (5 < deltaPesosOcultaNeurona) {
                        deltaPesosOcultaNeurona = 5
                    }


                    //preparaciones para la optimizacion con adam del sesgo de la neurona de la capa oculta 1
                    oculta1Copia[i].M[2] = optimizadorAdma.b1 * oculta1Copia[i].M[2] + (1 - optimizadorAdma.b1) * deltaPesosOcultaNeurona
                    oculta1Copia[i].V[2] = optimizadorAdma.b2 * oculta1Copia[i].V[2] + (1 - optimizadorAdma.b2) * deltaPesosOcultaNeurona ** 2

                    let mHatNS = oculta1Copia[i].M[2] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatNS = oculta1Copia[i].V[2] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))

                    //preparaciones para la optimizacion con adam del pesoH de la neurona de la capa oculta 1
                    oculta1Copia[i].M[3] = optimizadorAdma.b1 * oculta1Copia[i].M[3] + (1 - optimizadorAdma.b1) * (deltaPesosOcultaNeurona * oculta1Copia[i].valoresOcultosEnElTiempo[oculta1Copia[i].valoresOcultosEnElTiempo.length - t - 1])
                    oculta1Copia[i].V[3] = optimizadorAdma.b2 * oculta1Copia[i].V[3] + (1 - optimizadorAdma.b2) * (deltaPesosOcultaNeurona * oculta1Copia[i].valoresOcultosEnElTiempo[oculta1Copia[i].valoresOcultosEnElTiempo.length - t - 1]) ** 2

                    let mHatNP = oculta1Copia[i].M[3] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatNP = oculta1Copia[i].V[3] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //optimizacion de parametros antes mencionados 
                    oculta1Copia[i].sesgo -= tasaDeAprendizaje * mHatNS / (Math.sqrt(vHatNS) + optimizadorAdma.epsilon) / batch
                    oculta1Copia[i].pesoO -= tasaDeAprendizaje * mHatNP / (Math.sqrt(vHatNP) + optimizadorAdma.epsilon) / batch


                    for (let w = 0; w < capaOculta1[i].pesos.length; w++) {
                        oculta1Copia[i].M[w + 4] = optimizadorAdma.b1 * oculta1Copia[i].M[w + 3] + (1 - optimizadorAdma.b1) * (deltaPesosOcultaNeurona * salidaDeDecoder.ocultas2.salidasOcultas[t][w])
                        oculta1Copia[i].V[w + 4] = optimizadorAdma.b2 * oculta1Copia[i].V[w + 3] + (1 - optimizadorAdma.b2) * (deltaPesosOcultaNeurona * salidaDeDecoder.ocultas2.salidasOcultas[t][w]) ** 2

                        let mHatNW = oculta1Copia[i].M[w + 4] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                        let vHatNW = oculta1Copia[i].V[w + 4] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))
                        oculta1Copia[i].pesos[w] -= tasaDeAprendizaje * mHatNW / (Math.sqrt(vHatNW) + optimizadorAdma.epsilon) / batch
                    }

                }
                //actualizacion de capa oculta2
                let errorDecadaNeuronaOculta2 = []
                for (let i = 0; i < capaOculta2.length; i++) {

                    let errorDeEstaNeurona = 0
                    for (let e = 0; e < capaOculta1.length; e++) {
                        errorDeEstaNeurona += errorDecadaNeuronaOculta1[e] * capaOculta1[e].pesos[i]
                    }

                    let deltaDeEstaNuerona = reduccionDeDecimales(errorDeEstaNeurona * leakyReLUDerivative(salidaDeDecoder.ocultas2.salidasOcultas[t][i]))
                    if (5 < deltaDeEstaNuerona) {
                        deltaDeEstaNuerona = 5
                    } else if (deltaDeEstaNuerona < -5) {
                        deltaDeEstaNuerona = -5
                    }

                    errorDecadaNeuronaOculta2.push(deltaDeEstaNuerona)

                    //guardar error para el encoder
                    erroresDeCapaO2[i] += deltaDeEstaNuerona * capaOculta2[i].pesoO


                    //preparaciones para la optimizacion con adam del sesgo de la salida de la capa oculta 1
                    oculta1Copia2[i].M[0] = optimizadorAdma.b1 * oculta1Copia2[i].M[0] + (1 - optimizadorAdma.b1) * deltaDeEstaNuerona
                    oculta1Copia2[i].V[0] = optimizadorAdma.b2 * oculta1Copia2[i].V[0] + (1 - optimizadorAdma.b2) * (deltaDeEstaNuerona) ** 2

                    let mHatSS = oculta1Copia2[i].M[0] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatSS = oculta1Copia2[i].V[0] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //preparaciones para la optimizacion con adam del peso de la salida de la capa oculta 1
                    oculta1Copia2[i].M[1] = optimizadorAdma.b1 * oculta1Copia2[i].M[1] + (1 - optimizadorAdma.b1) * (deltaDeEstaNuerona * salidaDeDecoder.ocultas2.salidasOcultasH[t][i])
                    oculta1Copia2[i].V[1] = optimizadorAdma.b2 * oculta1Copia2[i].V[1] + (1 - optimizadorAdma.b2) * (deltaDeEstaNuerona * salidaDeDecoder.ocultas2.salidasOcultasH[t][i]) ** 2


                    let mHatSP = oculta1Copia2[i].M[1] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatSP = oculta1Copia2[i].V[1] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //optimizacion de parametros antes mencionados
                    oculta1Copia2[i].sesgoS -= tasaDeAprendizaje * mHatSS / (Math.sqrt(vHatSS) + optimizadorAdma.epsilon) / batch
                    oculta1Copia2[i].pesoS -= tasaDeAprendizaje * mHatSP / (Math.sqrt(vHatSP) + optimizadorAdma.epsilon) / batch


                    //optimizacion de parametros "normales" de una red feedfordwar (y pesoH que es propio de las redes recurrentes)
                    let deltaPesosOcultaNeurona = reduccionDeDecimales(deltaDeEstaNuerona * capaOculta2[i].pesoS * leakyReLUDerivative(salidaDeDecoder.ocultas2.salidasOcultasH[t][i]))

                    if (5 < deltaPesosOcultaNeurona) {
                        deltaPesosOcultaNeurona = 5
                    } if (-5 > deltaDeEstaNuerona) {
                        deltaPesosOcultaNeurona = -5

                    }


                    //preparaciones para la optimizacion con adam del sesgo de la neurona de la capa oculta 1
                    oculta1Copia2[i].M[2] = optimizadorAdma.b1 * oculta1Copia2[i].M[2] + (1 - optimizadorAdma.b1) * deltaPesosOcultaNeurona
                    oculta1Copia2[i].V[2] = optimizadorAdma.b2 * oculta1Copia2[i].V[2] + (1 - optimizadorAdma.b2) * deltaPesosOcultaNeurona ** 2

                    let mHatNS = oculta1Copia2[i].M[2] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatNS = oculta1Copia2[i].V[2] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))

                    //preparaciones para la optimizacion con adam del pesoH de la neurona de la capa oculta 1

                    oculta1Copia2[i].M[3] = optimizadorAdma.b1 * oculta1Copia2[i].M[3] + (1 - optimizadorAdma.b1) * (deltaPesosOcultaNeurona * oculta1Copia2[i].valoresOcultosEnElTiempo[oculta1Copia2[i].valoresOcultosEnElTiempo.length - t - 1])
                    oculta1Copia2[i].V[3] = optimizadorAdma.b2 * oculta1Copia2[i].V[3] + (1 - optimizadorAdma.b2) * (deltaPesosOcultaNeurona * oculta1Copia2[i].valoresOcultosEnElTiempo[oculta1Copia2[i].valoresOcultosEnElTiempo.length - t - 1]) ** 2

                    let mHatNP = oculta1Copia2[i].M[3] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatNP = oculta1Copia2[i].V[3] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //optimizacion de parametros antes mencionados 
                    oculta1Copia2[i].sesgo -= tasaDeAprendizaje * mHatNS / (Math.sqrt(vHatNS) + optimizadorAdma.epsilon) / batch
                    oculta1Copia2[i].pesoO -= tasaDeAprendizaje * mHatNP / (Math.sqrt(vHatNP) + optimizadorAdma.epsilon) / batch

                    for (let w = 0; w < capaOculta2[i].pesos.length; w++) {
                        try {
                            if (!isNaN(deltaPesosOcultaNeurona)) {
                                oculta1Copia2[i].M[w + 4] = optimizadorAdma.b1 * oculta1Copia2[i].M[w + 3] + (1 - optimizadorAdma.b1) * (deltaPesosOcultaNeurona * salidaDeDecoder.ocultas3.salidasOcultas[t][w])
                                oculta1Copia2[i].V[w + 4] = optimizadorAdma.b2 * oculta1Copia2[i].V[w + 3] + (1 - optimizadorAdma.b2) * (deltaPesosOcultaNeurona * salidaDeDecoder.ocultas3.salidasOcultas[t][w]) ** 2
                                let mHatNW = oculta1Copia2[i].M[w + 4] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                                let vHatNW = oculta1Copia2[i].V[w + 4] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))
                                oculta1Copia2[i].pesos[w] -= tasaDeAprendizaje * mHatNW / (Math.sqrt(vHatNW) + optimizadorAdma.epsilon) / batch
                            } else {
                                console.log('es nan 1c', t, es, w)
                                // console.log(capaSalida[0])
                                desinfectadorDeRed()
                                w = capaOculta2[i].pesos.length
                            }
                        } catch (err) {
                            console.log('fallo el condicional ... ')
                            desinfectadorDeRed()
                            w = capaOculta2[i].pesos.length
                        }

                    }

                }
                //actualizacion de capa oculta3
                let errorDecadaNeuronaOculta3 = []
                for (let i = 0; i < capaOculta3.length; i++) {

                    let errorDeEstaNeurona = 0
                    for (let e = 0; e < capaOculta2.length; e++) {
                        errorDeEstaNeurona += errorDecadaNeuronaOculta2[e] * capaOculta2[e].pesos[i]
                    }

                    let deltaDeEstaNuerona = reduccionDeDecimales(errorDeEstaNeurona * leakyReLUDerivative(salidaDeDecoder.ocultas3.salidasOcultas[t][i]))
                    if (5 < deltaDeEstaNuerona) {
                        deltaDeEstaNuerona = 5
                    } else if (deltaDeEstaNuerona < -5) {
                        deltaDeEstaNuerona = -5
                    }

                    errorDecadaNeuronaOculta3.push(deltaDeEstaNuerona)

                    //guardar error para el encoder
                    erroresDeCapaO3[i] += deltaDeEstaNuerona * capaOculta3[i].pesoO


                    //preparaciones para la optimizacion con adam del sesgo de la salida de la capa oculta 1
                    oculta1Copia3[i].M[0] = optimizadorAdma.b1 * oculta1Copia3[i].M[0] + (1 - optimizadorAdma.b1) * deltaDeEstaNuerona
                    oculta1Copia3[i].V[0] = optimizadorAdma.b2 * oculta1Copia3[i].V[0] + (1 - optimizadorAdma.b2) * (deltaDeEstaNuerona) ** 2

                    let mHatSS = oculta1Copia3[i].M[0] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatSS = oculta1Copia3[i].V[0] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //preparaciones para la optimizacion con adam del peso de la salida de la capa oculta 1
                    oculta1Copia3[i].M[1] = optimizadorAdma.b1 * oculta1Copia3[i].M[1] + (1 - optimizadorAdma.b1) * (deltaDeEstaNuerona * salidaDeDecoder.ocultas3.salidasOcultasH[t][i])
                    oculta1Copia3[i].V[1] = optimizadorAdma.b2 * oculta1Copia3[i].V[1] + (1 - optimizadorAdma.b2) * (deltaDeEstaNuerona * salidaDeDecoder.ocultas3.salidasOcultasH[t][i]) ** 2
                    //  console.log(deltaDeEstaNuerona , salidaDeDecoder.ocultas3.salidasOcultasH[t][i])

                    let mHatSP = oculta1Copia3[i].M[1] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatSP = oculta1Copia3[i].V[1] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //optimizacion de parametros antes mencionados
                    oculta1Copia3[i].sesgoS -= tasaDeAprendizaje * mHatSS / (Math.sqrt(vHatSS) + optimizadorAdma.epsilon) / batch
                    oculta1Copia3[i].pesoS -= tasaDeAprendizaje * mHatSP / (Math.sqrt(vHatSP) + optimizadorAdma.epsilon) / batch

                    //optimizacion de parametros "normales" de una red feedfordwar (y pesoH que es propio de las redes recurrentes)
                    let deltaPesosOcultaNeurona = reduccionDeDecimales(deltaDeEstaNuerona * capaOculta3[i].pesoS * leakyReLUDerivative(salidaDeDecoder.ocultas3.salidasOcultasH[t][i]))

                    if (5 < deltaPesosOcultaNeurona) {
                        deltaPesosOcultaNeurona = 5
                    }


                    //preparaciones para la optimizacion con adam del sesgo de la neurona de la capa oculta 1
                    oculta1Copia3[i].M[2] = optimizadorAdma.b1 * oculta1Copia3[i].M[2] + (1 - optimizadorAdma.b1) * deltaPesosOcultaNeurona
                    oculta1Copia3[i].V[2] = optimizadorAdma.b2 * oculta1Copia3[i].V[2] + (1 - optimizadorAdma.b2) * deltaPesosOcultaNeurona ** 2

                    let mHatNS = oculta1Copia3[i].M[2] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatNS = oculta1Copia3[i].V[2] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))

                    //preparaciones para la optimizacion con adam del pesoH de la neurona de la capa oculta 1

                    oculta1Copia3[i].M[3] = optimizadorAdma.b1 * oculta1Copia3[i].M[3] + (1 - optimizadorAdma.b1) * (deltaPesosOcultaNeurona * oculta1Copia3[i].valoresOcultosEnElTiempo[oculta1Copia3[i].valoresOcultosEnElTiempo.length - t - 1])
                    oculta1Copia3[i].V[3] = optimizadorAdma.b2 * oculta1Copia3[i].V[3] + (1 - optimizadorAdma.b2) * (deltaPesosOcultaNeurona * oculta1Copia3[i].valoresOcultosEnElTiempo[oculta1Copia3[i].valoresOcultosEnElTiempo.length - t - 1]) ** 2

                    let mHatNP = oculta1Copia3[i].M[3] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatNP = oculta1Copia3[i].V[3] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //optimizacion de parametros antes mencionados 
                    oculta1Copia3[i].sesgo -= tasaDeAprendizaje * mHatNS / (Math.sqrt(vHatNS) + optimizadorAdma.epsilon) / batch
                    oculta1Copia3[i].pesoO -= tasaDeAprendizaje * mHatNP / (Math.sqrt(vHatNP) + optimizadorAdma.epsilon) / batch

                    for (let w = 0; w < capaOculta3[i].pesos.length; w++) {
                        try {
                            if (!isNaN(deltaPesosOcultaNeurona)) {
                                oculta1Copia3[i].M[w + 4] = optimizadorAdma.b1 * oculta1Copia3[i].M[w + 3] + (1 - optimizadorAdma.b1) * (deltaPesosOcultaNeurona * salidaDeDecoder.ocultas4.salidasOcultas[t][w])
                                oculta1Copia3[i].V[w + 4] = optimizadorAdma.b2 * oculta1Copia3[i].V[w + 3] + (1 - optimizadorAdma.b2) * (deltaPesosOcultaNeurona * salidaDeDecoder.ocultas4.salidasOcultas[t][w]) ** 2
                                let mHatNW = oculta1Copia3[i].M[w + 4] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                                let vHatNW = oculta1Copia3[i].V[w + 4] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))
                                oculta1Copia3[i].pesos[w] -= tasaDeAprendizaje * mHatNW / (Math.sqrt(vHatNW) + optimizadorAdma.epsilon) / batch
                            } else {
                                //  console.log('es nan', t, es, w)
                                //  console.log(capaSalida[0])
                                desinfectadorDeRed()

                            }
                        } catch (err) {
                            console.log('fallo el condicional ... ')
                            desinfectadorDeRed()
                            w = capaOculta3[i].pesos.length

                        }

                    }

                }
                //actualizacion de capa oculta3
                let errorDecadaNeuronaOculta4 = []
                for (let i = 0; i < capaOculta4.length; i++) {

                    let errorDeEstaNeurona = 0
                    for (let e = 0; e < capaOculta3.length; e++) {
                        errorDeEstaNeurona += errorDecadaNeuronaOculta3[e] * capaOculta3[e].pesos[i]
                    }

                    let deltaDeEstaNuerona = reduccionDeDecimales(errorDeEstaNeurona * leakyReLUDerivative(salidaDeDecoder.ocultas4.salidasOcultas[t][i]))
                    if (5 < deltaDeEstaNuerona) {
                        deltaDeEstaNuerona = 5
                    } else if (deltaDeEstaNuerona < -5) {
                        deltaDeEstaNuerona = -5
                    }


                    //preparaciones para la optimizacion con adam del sesgo de la salida de la capa oculta 1
                    oculta1Copia4[i].M[0] = optimizadorAdma.b1 * oculta1Copia4[i].M[0] + (1 - optimizadorAdma.b1) * deltaDeEstaNuerona
                    oculta1Copia4[i].V[0] = optimizadorAdma.b2 * oculta1Copia4[i].V[0] + (1 - optimizadorAdma.b2) * (deltaDeEstaNuerona) ** 2

                    let mHatSS = oculta1Copia4[i].M[0] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatSS = oculta1Copia4[i].V[0] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //preparaciones para la optimizacion con adam del peso de la salida de la capa oculta 1
                    oculta1Copia4[i].M[1] = optimizadorAdma.b1 * oculta1Copia4[i].M[1] + (1 - optimizadorAdma.b1) * (deltaDeEstaNuerona * salidaDeDecoder.ocultas4.salidasOcultasH[t][i])
                    oculta1Copia4[i].V[1] = optimizadorAdma.b2 * oculta1Copia4[i].V[1] + (1 - optimizadorAdma.b2) * (deltaDeEstaNuerona * salidaDeDecoder.ocultas4.salidasOcultasH[t][i]) ** 2
                    //  console.log(deltaDeEstaNuerona , salidaDeDecoder.ocultas3.salidasOcultasH[t][i])

                    let mHatSP = oculta1Copia4[i].M[1] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatSP = oculta1Copia4[i].V[1] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //optimizacion de parametros antes mencionados
                    oculta1Copia4[i].sesgoS -= tasaDeAprendizaje * mHatSS / (Math.sqrt(vHatSS) + optimizadorAdma.epsilon) / batch
                    oculta1Copia4[i].pesoS -= tasaDeAprendizaje * mHatSP / (Math.sqrt(vHatSP) + optimizadorAdma.epsilon) / batch

                    //optimizacion de parametros "normales" de una red feedfordwar (y pesoH que es propio de las redes recurrentes)
                    let deltaPesosOcultaNeurona = reduccionDeDecimales(deltaDeEstaNuerona * capaOculta4[i].pesoS * leakyReLUDerivative(salidaDeDecoder.ocultas4.salidasOcultasH[t][i]))

                    if (5 < deltaPesosOcultaNeurona) {
                        deltaPesosOcultaNeurona = 5
                    }


                    //preparaciones para la optimizacion con adam del sesgo de la neurona de la capa oculta 1
                    oculta1Copia4[i].M[2] = optimizadorAdma.b1 * oculta1Copia4[i].M[2] + (1 - optimizadorAdma.b1) * deltaPesosOcultaNeurona
                    oculta1Copia4[i].V[2] = optimizadorAdma.b2 * oculta1Copia4[i].V[2] + (1 - optimizadorAdma.b2) * deltaPesosOcultaNeurona ** 2

                    let mHatNS = oculta1Copia4[i].M[2] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatNS = oculta1Copia4[i].V[2] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))

                    //preparaciones para la optimizacion con adam del pesoH de la neurona de la capa oculta 1

                    oculta1Copia4[i].M[3] = optimizadorAdma.b1 * oculta1Copia4[i].M[3] + (1 - optimizadorAdma.b1) * (deltaPesosOcultaNeurona * oculta1Copia4[i].valoresOcultosEnElTiempo[oculta1Copia4[i].valoresOcultosEnElTiempo.length - t - 1])
                    oculta1Copia4[i].V[3] = optimizadorAdma.b2 * oculta1Copia4[i].V[3] + (1 - optimizadorAdma.b2) * (deltaPesosOcultaNeurona * oculta1Copia4[i].valoresOcultosEnElTiempo[oculta1Copia4[i].valoresOcultosEnElTiempo.length - t - 1]) ** 2

                    let mHatNP = oculta1Copia4[i].M[3] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatNP = oculta1Copia4[i].V[3] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //optimizacion de parametros antes mencionados 
                    oculta1Copia4[i].sesgo -= tasaDeAprendizaje * mHatNS / (Math.sqrt(vHatNS) + optimizadorAdma.epsilon) / batch
                    oculta1Copia4[i].pesoO -= tasaDeAprendizaje * mHatNP / (Math.sqrt(vHatNP) + optimizadorAdma.epsilon) / batch

                    for (let w = 0; w < capaOculta4[i].pesos.length; w++) {
                        try {
                            if (!isNaN(deltaPesosOcultaNeurona)) {
                                oculta1Copia4[i].M[w + 4] = optimizadorAdma.b1 * oculta1Copia4[i].M[w + 3] + (1 - optimizadorAdma.b1) * (deltaPesosOcultaNeurona * t <= 0 ? embeding['|start|'][w] : embeding[clavesDelObjeto[salidaDeRed.salidaFrase[t - 1]]][w])
                                oculta1Copia4[i].V[w + 4] = optimizadorAdma.b2 * oculta1Copia4[i].V[w + 3] + (1 - optimizadorAdma.b2) * (deltaPesosOcultaNeurona * t <= 0 ? embeding['|start|'][w] : embeding[clavesDelObjeto[salidaDeRed.salidaFrase[t - 1]]][w]) ** 2
                                let mHatNW = oculta1Copia4[i].M[w + 4] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                                let vHatNW = oculta1Copia4[i].V[w + 4] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))
                                oculta1Copia4[i].pesos[w] -= tasaDeAprendizaje * mHatNW / (Math.sqrt(vHatNW) + optimizadorAdma.epsilon) / batch
                            } else {
                                //  console.log('es nan', t, es, w)
                                //  console.log(capaSalida[0])
                                desinfectadorDeRed()

                            }
                        } catch (err) {
                            console.log('fallo el condicional ... ')
                            desinfectadorDeRed()
                            w = capaOculta4[i].pesos.length
                        }

                    }

                }



            }

            //ENTRENAMIENTO DEL ENCODER

            for (let t = salidaDeEncoder.ocultas1.salidasOcultas.length - 1; 0 <= t; t--) {
                let errorDeCadaNeurona = erroresDeCapaO
                desinfectadorDeRed()

                //capa oculta 1
                let errorDecadaNeuronaOculta1 = []
                for (let i = 0; i < capaOculta1E.length; i++) {

                    let deltaDeEstaNuerona = reduccionDeDecimales(errorDeCadaNeurona[i] * leakyReLUDerivative(salidaDeEncoder.ocultas1.salidasOcultas[t][i]))

                    if (5 < deltaDeEstaNuerona) {
                        deltaDeEstaNuerona = 5
                    } else if (deltaDeEstaNuerona < -5) {
                        deltaDeEstaNuerona = -5
                    }
                    errorDecadaNeuronaOculta1.push(deltaDeEstaNuerona)



                    //guardar error para el encoder
                    erroresDeCapaO[i] += deltaDeEstaNuerona * capaOculta1E[i].pesoO


                    //preparaciones para la optimizacion con adam del sesgo de la salida de la capa oculta 1
                    oculta1CopiaE[i].M[0] = optimizadorAdma.b1 * oculta1CopiaE[i].M[0] + (1 - optimizadorAdma.b1) * deltaDeEstaNuerona
                    oculta1CopiaE[i].V[0] = optimizadorAdma.b2 * oculta1CopiaE[i].V[0] + (1 - optimizadorAdma.b2) * (deltaDeEstaNuerona) ** 2

                    let mHatSS = oculta1CopiaE[i].M[0] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatSS = oculta1CopiaE[i].V[0] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //preparaciones para la optimizacion con adam del peso de la salida de la capa oculta 1
                    oculta1CopiaE[i].M[1] = optimizadorAdma.b1 * oculta1CopiaE[i].M[1] + (1 - optimizadorAdma.b1) * (deltaDeEstaNuerona * salidaDeEncoder.ocultas1.salidasOcultasH[t][i])
                    oculta1CopiaE[i].V[1] = optimizadorAdma.b2 * oculta1CopiaE[i].V[1] + (1 - optimizadorAdma.b2) * (deltaDeEstaNuerona * salidaDeEncoder.ocultas1.salidasOcultasH[t][i]) ** 2

                    let mHatSP = oculta1CopiaE[i].M[1] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatSP = oculta1CopiaE[i].V[1] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //optimizacion de parametros antes mencionados 
                    oculta1CopiaE[i].sesgoS -= tasaDeAprendizaje * mHatSS / (Math.sqrt(vHatSS) + optimizadorAdma.epsilon) / batch
                    oculta1CopiaE[i].pesoS -= tasaDeAprendizaje * mHatSP / (Math.sqrt(vHatSP) + optimizadorAdma.epsilon) / batch



                    //optimizacion de parametros "normales" de una red feedfordwar (y pesoH que es propio de las redes recurrentes)
                    let deltaPesosOcultaNeurona = reduccionDeDecimales(deltaDeEstaNuerona * capaOculta1E[i].pesoS * leakyReLUDerivative(salidaDeEncoder.ocultas1.salidasOcultasH[t][i]))

                    if (5 < deltaPesosOcultaNeurona) {
                        deltaPesosOcultaNeurona = 5
                    }



                    //preparaciones para la optimizacion con adam del sesgo de la neurona de la capa oculta 1
                    oculta1CopiaE[i].M[2] = optimizadorAdma.b1 * oculta1CopiaE[i].M[2] + (1 - optimizadorAdma.b1) * deltaPesosOcultaNeurona
                    oculta1CopiaE[i].V[2] = optimizadorAdma.b2 * oculta1CopiaE[i].V[2] + (1 - optimizadorAdma.b2) * deltaPesosOcultaNeurona ** 2

                    let mHatNS = oculta1CopiaE[i].M[2] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatNS = oculta1CopiaE[i].V[2] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))

                    //preparaciones para la optimizacion con adam del pesoH de la neurona de la capa oculta 1
                    oculta1CopiaE[i].M[3] = optimizadorAdma.b1 * oculta1CopiaE[i].M[3] + (1 - optimizadorAdma.b1) * (deltaPesosOcultaNeurona * oculta1CopiaE[i].valoresOcultosEnElTiempo[oculta1CopiaE[i].valoresOcultosEnElTiempo.length - t - 1])
                    oculta1CopiaE[i].V[3] = optimizadorAdma.b2 * oculta1CopiaE[i].V[3] + (1 - optimizadorAdma.b2) * (deltaPesosOcultaNeurona * oculta1CopiaE[i].valoresOcultosEnElTiempo[oculta1CopiaE[i].valoresOcultosEnElTiempo.length - t - 1]) ** 2

                    let mHatNP = oculta1CopiaE[i].M[3] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatNP = oculta1CopiaE[i].V[3] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //optimizacion de parametros antes mencionados 
                    oculta1CopiaE[i].sesgo -= tasaDeAprendizaje * mHatNS / (Math.sqrt(vHatNS) + optimizadorAdma.epsilon) / batch
                    oculta1CopiaE[i].pesoO -= tasaDeAprendizaje * mHatNP / (Math.sqrt(vHatNP) + optimizadorAdma.epsilon) / batch

                    for (let w = 0; w < capaOculta1E[i].pesos.length; w++) {
                        oculta1CopiaE[i].M[w + 4] = optimizadorAdma.b1 * oculta1CopiaE[i].M[w + 3] + (1 - optimizadorAdma.b1) * (deltaPesosOcultaNeurona * salidaDeEncoder.ocultas2.salidasOcultas[t][w])
                        oculta1CopiaE[i].V[w + 4] = optimizadorAdma.b2 * oculta1CopiaE[i].V[w + 3] + (1 - optimizadorAdma.b2) * (deltaPesosOcultaNeurona * salidaDeEncoder.ocultas2.salidasOcultas[t][w]) ** 2


                        let mHatNW = oculta1CopiaE[i].M[w + 4] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                        let vHatNW = oculta1CopiaE[i].V[w + 4] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))
                        oculta1CopiaE[i].pesos[w] -= tasaDeAprendizaje * mHatNW / (Math.sqrt(vHatNW) + optimizadorAdma.epsilon) / batch
                    }

                }

                //actualizacion de capa oculta2
                let errorDecadaNeuronaOculta2 = []
                for (let i = 0; i < capaOculta2E.length; i++) {

                    let errorDeEstaNeurona = 0
                    for (let e = 0; e < capaOculta1E.length; e++) {
                        errorDeEstaNeurona += errorDecadaNeuronaOculta1[e] * capaOculta1E[e].pesos[i]

                    }

                    let deltaDeEstaNuerona = reduccionDeDecimales(errorDeEstaNeurona * leakyReLUDerivative(salidaDeEncoder.ocultas2.salidasOcultas[t][i]))
                    if (5 < deltaDeEstaNuerona) {
                        deltaDeEstaNuerona = 5
                    } else if (deltaDeEstaNuerona < -5) {
                        deltaDeEstaNuerona = -5
                    }

                    errorDecadaNeuronaOculta2.push(deltaDeEstaNuerona)


                    //guardar error para el encoder
                    erroresDeCapaO2[i] += deltaDeEstaNuerona * capaOculta2E[i].pesoO


                    //preparaciones para la optimizacion con adam del sesgo de la salida de la capa oculta 1
                    oculta1Copia2E[i].M[0] = optimizadorAdma.b1 * oculta1Copia2E[i].M[0] + (1 - optimizadorAdma.b1) * deltaDeEstaNuerona
                    oculta1Copia2[i].V[0] = optimizadorAdma.b2 * oculta1Copia2E[i].V[0] + (1 - optimizadorAdma.b2) * (deltaDeEstaNuerona) ** 2

                    let mHatSS = oculta1Copia2E[i].M[0] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatSS = oculta1Copia2E[i].V[0] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //preparaciones para la optimizacion con adam del peso de la salida de la capa oculta 1
                    oculta1Copia2E[i].M[1] = optimizadorAdma.b1 * oculta1Copia2E[i].M[1] + (1 - optimizadorAdma.b1) * (deltaDeEstaNuerona * salidaDeEncoder.ocultas2.salidasOcultasH[t][i])
                    oculta1Copia2E[i].V[1] = optimizadorAdma.b2 * oculta1Copia2E[i].V[1] + (1 - optimizadorAdma.b2) * (deltaDeEstaNuerona * salidaDeEncoder.ocultas2.salidasOcultasH[t][i]) ** 2

                    let mHatSP = oculta1Copia2E[i].M[1] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatSP = oculta1Copia2E[i].V[1] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //optimizacion de parametros antes mencionados 
                    oculta1Copia2E[i].sesgoS -= tasaDeAprendizaje * mHatSS / (Math.sqrt(vHatSS) + optimizadorAdma.epsilon) / batch
                    oculta1Copia2E[i].pesoS -= tasaDeAprendizaje * mHatSP / (Math.sqrt(vHatSP) + optimizadorAdma.epsilon) / batch



                    //optimizacion de parametros "normales" de una red feedfordwar (y pesoH que es propio de las redes recurrentes)
                    let deltaPesosOcultaNeurona = reduccionDeDecimales(deltaDeEstaNuerona * capaOculta2[i].pesoS * leakyReLUDerivative(salidaDeEncoder.ocultas2.salidasOcultasH[t][i]))
                    if (5 < deltaPesosOcultaNeurona) {
                        deltaPesosOcultaNeurona = 5
                    }



                    //preparaciones para la optimizacion con adam del sesgo de la neurona de la capa oculta 1
                    oculta1Copia2E[i].M[2] = optimizadorAdma.b1 * oculta1Copia2E[i].M[2] + (1 - optimizadorAdma.b1) * deltaPesosOcultaNeurona
                    oculta1Copia2E[i].V[2] = optimizadorAdma.b2 * oculta1Copia2E[i].V[2] + (1 - optimizadorAdma.b2) * deltaPesosOcultaNeurona ** 2

                    let mHatNS = oculta1Copia2E[i].M[2] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatNS = oculta1Copia2E[i].V[2] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))

                    //preparaciones para la optimizacion con adam del pesoH de la neurona de la capa oculta 1
                    oculta1Copia2E[i].M[3] = optimizadorAdma.b1 * oculta1Copia2E[i].M[3] + (1 - optimizadorAdma.b1) * (deltaPesosOcultaNeurona * oculta1Copia2E[i].valoresOcultosEnElTiempo[oculta1Copia2E[i].valoresOcultosEnElTiempo.length - t - 1])
                    oculta1Copia2E[i].V[3] = optimizadorAdma.b2 * oculta1Copia2E[i].V[3] + (1 - optimizadorAdma.b2) * (deltaPesosOcultaNeurona * oculta1Copia2E[i].valoresOcultosEnElTiempo[oculta1Copia2E[i].valoresOcultosEnElTiempo.length - t - 1]) ** 2

                    let mHatNP = oculta1Copia2E[i].M[3] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatNP = oculta1Copia2E[i].V[3] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //optimizacion de parametros antes mencionados 
                    oculta1Copia2E[i].sesgo -= tasaDeAprendizaje * mHatNS / (Math.sqrt(vHatNS) + optimizadorAdma.epsilon) / batch
                    oculta1Copia2E[i].pesoO -= tasaDeAprendizaje * mHatNP / (Math.sqrt(vHatNP) + optimizadorAdma.epsilon) / batch

                    for (let w = 0; w < oculta1Copia2E[i].pesos.length; w++) {
                        // console.log(embeding['|start|'][w] ,embeding[clavesDelObjeto[salidaDeRed.salidaFrase[t - 1]]][w],t,i,w)
                        oculta1Copia2E[i].M[w + 4] = optimizadorAdma.b1 * oculta1Copia2E[i].M[w + 3] + (1 - optimizadorAdma.b1) * (deltaPesosOcultaNeurona * salidaDeEncoder.ocultas3.salidasOcultas[t][w])
                        oculta1Copia2E[i].V[w + 4] = optimizadorAdma.b2 * oculta1Copia2E[i].V[w + 3] + (1 - optimizadorAdma.b2) * (deltaPesosOcultaNeurona * salidaDeEncoder.ocultas3.salidasOcultas[t][w]) ** 2


                        let mHatNW = oculta1Copia2E[i].M[w + 4] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                        let vHatNW = oculta1Copia2E[i].V[w + 4] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))
                        oculta1Copia2E[i].pesos[w] -= tasaDeAprendizaje * mHatNW / (Math.sqrt(vHatNW) + optimizadorAdma.epsilon) / batch

                    }

                }
                //actualizacion de capa oculta3
                let errorDecadaNeuronaOculta3 = []
                for (let i = 0; i < capaOculta3E.length; i++) {

                    let errorDeEstaNeurona = 0
                    for (let e = 0; e < capaOculta2E.length; e++) {
                        errorDeEstaNeurona += errorDecadaNeuronaOculta2[e] * capaOculta2E[e].pesos[i]

                    }

                    let deltaDeEstaNuerona = reduccionDeDecimales(errorDeEstaNeurona * leakyReLUDerivative(salidaDeEncoder.ocultas3.salidasOcultas[t][i]))
                    if (5 < deltaDeEstaNuerona) {
                        deltaDeEstaNuerona = 5
                    } else if (deltaDeEstaNuerona < -5) {
                        deltaDeEstaNuerona = -5
                    }

                    errorDecadaNeuronaOculta3.push(deltaDeEstaNuerona)


                    //guardar error para el encoder
                    erroresDeCapaO3[i] += deltaDeEstaNuerona * capaOculta3E[i].pesoO


                    //preparaciones para la optimizacion con adam del sesgo de la salida de la capa oculta 1
                    oculta1Copia3E[i].M[0] = optimizadorAdma.b1 * oculta1Copia3E[i].M[0] + (1 - optimizadorAdma.b1) * deltaDeEstaNuerona
                    oculta1Copia3E[i].V[0] = optimizadorAdma.b2 * oculta1Copia3E[i].V[0] + (1 - optimizadorAdma.b2) * (deltaDeEstaNuerona) ** 2

                    let mHatSS = oculta1Copia3E[i].M[0] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatSS = oculta1Copia3E[i].V[0] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //preparaciones para la optimizacion con adam del peso de la salida de la capa oculta 1
                    oculta1Copia3E[i].M[1] = optimizadorAdma.b1 * oculta1Copia3E[i].M[1] + (1 - optimizadorAdma.b1) * (deltaDeEstaNuerona * salidaDeEncoder.ocultas3.salidasOcultasH[t][i])
                    oculta1Copia3E[i].V[1] = optimizadorAdma.b2 * oculta1Copia3E[i].V[1] + (1 - optimizadorAdma.b2) * (deltaDeEstaNuerona * salidaDeEncoder.ocultas3.salidasOcultasH[t][i]) ** 2

                    let mHatSP = oculta1Copia3E[i].M[1] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatSP = oculta1Copia3E[i].V[1] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //optimizacion de parametros antes mencionados 
                    oculta1Copia3E[i].sesgoS -= tasaDeAprendizaje * mHatSS / (Math.sqrt(vHatSS) + optimizadorAdma.epsilon) / batch
                    oculta1Copia3E[i].pesoS -= tasaDeAprendizaje * mHatSP / (Math.sqrt(vHatSP) + optimizadorAdma.epsilon) / batch



                    //optimizacion de parametros "normales" de una red feedfordwar (y pesoH que es propio de las redes recurrentes)
                    let deltaPesosOcultaNeurona = reduccionDeDecimales(deltaDeEstaNuerona * capaOculta3[i].pesoS * leakyReLUDerivative(salidaDeEncoder.ocultas3.salidasOcultasH[t][i]))
                    if (5 < deltaPesosOcultaNeurona) {
                        deltaPesosOcultaNeurona = 5
                    }



                    //preparaciones para la optimizacion con adam del sesgo de la neurona de la capa oculta 1
                    oculta1Copia3E[i].M[2] = optimizadorAdma.b1 * oculta1Copia3E[i].M[2] + (1 - optimizadorAdma.b1) * deltaPesosOcultaNeurona
                    oculta1Copia3E[i].V[2] = optimizadorAdma.b2 * oculta1Copia3E[i].V[2] + (1 - optimizadorAdma.b2) * deltaPesosOcultaNeurona ** 2

                    let mHatNS = oculta1Copia3E[i].M[2] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatNS = oculta1Copia3E[i].V[2] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))

                    //preparaciones para la optimizacion con adam del pesoH de la neurona de la capa oculta 1
                    oculta1Copia3E[i].M[3] = optimizadorAdma.b1 * oculta1Copia3E[i].M[3] + (1 - optimizadorAdma.b1) * (deltaPesosOcultaNeurona * oculta1Copia3E[i].valoresOcultosEnElTiempo[oculta1Copia3E[i].valoresOcultosEnElTiempo.length - t - 1])
                    oculta1Copia3E[i].V[3] = optimizadorAdma.b2 * oculta1Copia3E[i].V[3] + (1 - optimizadorAdma.b2) * (deltaPesosOcultaNeurona * oculta1Copia3E[i].valoresOcultosEnElTiempo[oculta1Copia3E[i].valoresOcultosEnElTiempo.length - t - 1]) ** 2

                    let mHatNP = oculta1Copia3E[i].M[3] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatNP = oculta1Copia3E[i].V[3] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //optimizacion de parametros antes mencionados 
                    oculta1Copia3E[i].sesgo -= tasaDeAprendizaje * mHatNS / (Math.sqrt(vHatNS) + optimizadorAdma.epsilon) / batch
                    oculta1Copia3E[i].pesoO -= tasaDeAprendizaje * mHatNP / (Math.sqrt(vHatNP) + optimizadorAdma.epsilon) / batch

                    for (let w = 0; w < oculta1Copia3E[i].pesos.length; w++) {
                        // console.log(embeding['|start|'][w] ,embeding[clavesDelObjeto[salidaDeRed.salidaFrase[t - 1]]][w],t,i,w)
                        oculta1Copia3E[i].M[w + 4] = optimizadorAdma.b1 * oculta1Copia3E[i].M[w + 3] + (1 - optimizadorAdma.b1) * (deltaPesosOcultaNeurona * salidaDeEncoder.ocultas4.salidasOcultas[t][w])
                        oculta1Copia3E[i].V[w + 4] = optimizadorAdma.b2 * oculta1Copia3E[i].V[w + 3] + (1 - optimizadorAdma.b2) * (deltaPesosOcultaNeurona * salidaDeEncoder.ocultas4.salidasOcultas[t][w]) ** 2


                        let mHatNW = oculta1Copia3E[i].M[w + 4] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                        let vHatNW = oculta1Copia3E[i].V[w + 4] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))
                        oculta1Copia3E[i].pesos[w] -= tasaDeAprendizaje * mHatNW / (Math.sqrt(vHatNW) + optimizadorAdma.epsilon) / batch

                    }

                }
                //actualizacion de capa oculta3
                let errorDecadaNeuronaOculta4 = []
                for (let i = 0; i < capaOculta4E.length; i++) {

                    let errorDeEstaNeurona = 0
                    for (let e = 0; e < capaOculta3E.length; e++) {
                        errorDeEstaNeurona += errorDecadaNeuronaOculta3[e] * capaOculta3E[e].pesos[i]

                    }

                    let deltaDeEstaNuerona = reduccionDeDecimales(errorDeEstaNeurona * leakyReLUDerivative(salidaDeEncoder.ocultas4.salidasOcultas[t][i]))
                    if (5 < deltaDeEstaNuerona) {
                        deltaDeEstaNuerona = 5
                    } else if (deltaDeEstaNuerona < -5) {
                        deltaDeEstaNuerona = -5
                    }


                    //preparaciones para la optimizacion con adam del sesgo de la salida de la capa oculta 1
                    oculta1Copia4E[i].M[0] = optimizadorAdma.b1 * oculta1Copia4E[i].M[0] + (1 - optimizadorAdma.b1) * deltaDeEstaNuerona
                    oculta1Copia4E[i].V[0] = optimizadorAdma.b2 * oculta1Copia4E[i].V[0] + (1 - optimizadorAdma.b2) * (deltaDeEstaNuerona) ** 2

                    let mHatSS = oculta1Copia4E[i].M[0] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatSS = oculta1Copia4E[i].V[0] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //preparaciones para la optimizacion con adam del peso de la salida de la capa oculta 1
                    oculta1Copia4E[i].M[1] = optimizadorAdma.b1 * oculta1Copia4E[i].M[1] + (1 - optimizadorAdma.b1) * (deltaDeEstaNuerona * salidaDeEncoder.ocultas4.salidasOcultasH[t][i])
                    oculta1Copia4E[i].V[1] = optimizadorAdma.b2 * oculta1Copia4E[i].V[1] + (1 - optimizadorAdma.b2) * (deltaDeEstaNuerona * salidaDeEncoder.ocultas4.salidasOcultasH[t][i]) ** 2

                    let mHatSP = oculta1Copia4E[i].M[1] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatSP = oculta1Copia4E[i].V[1] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //optimizacion de parametros antes mencionados 
                    oculta1Copia4E[i].sesgoS -= tasaDeAprendizaje * mHatSS / (Math.sqrt(vHatSS) + optimizadorAdma.epsilon)/ batch
                    oculta1Copia4E[i].pesoS -= tasaDeAprendizaje * mHatSP / (Math.sqrt(vHatSP) + optimizadorAdma.epsilon) / batch



                    //optimizacion de parametros "normales" de una red feedfordwar (y pesoH que es propio de las redes recurrentes)
                    let deltaPesosOcultaNeurona = reduccionDeDecimales(deltaDeEstaNuerona * capaOculta4[i].pesoS * leakyReLUDerivative(salidaDeEncoder.ocultas4.salidasOcultasH[t][i]))
                    if (5 < deltaPesosOcultaNeurona) {
                        deltaPesosOcultaNeurona = 5
                    }



                    //preparaciones para la optimizacion con adam del sesgo de la neurona de la capa oculta 1
                    oculta1Copia4E[i].M[2] = optimizadorAdma.b1 * oculta1Copia4E[i].M[2] + (1 - optimizadorAdma.b1) * deltaPesosOcultaNeurona
                    oculta1Copia4E[i].V[2] = optimizadorAdma.b2 * oculta1Copia4E[i].V[2] + (1 - optimizadorAdma.b2) * deltaPesosOcultaNeurona ** 2

                    let mHatNS = oculta1Copia4E[i].M[2] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatNS = oculta1Copia4E[i].V[2] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))

                    //preparaciones para la optimizacion con adam del pesoH de la neurona de la capa oculta 1
                    oculta1Copia4E[i].M[3] = optimizadorAdma.b1 * oculta1Copia4E[i].M[3] + (1 - optimizadorAdma.b1) * (deltaPesosOcultaNeurona * oculta1Copia4E[i].valoresOcultosEnElTiempo[oculta1Copia4E[i].valoresOcultosEnElTiempo.length - t - 1])
                    oculta1Copia4E[i].V[3] = optimizadorAdma.b2 * oculta1Copia4E[i].V[3] + (1 - optimizadorAdma.b2) * (deltaPesosOcultaNeurona * oculta1Copia4E[i].valoresOcultosEnElTiempo[oculta1Copia4E[i].valoresOcultosEnElTiempo.length - t - 1]) ** 2

                    let mHatNP = oculta1Copia4E[i].M[3] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                    let vHatNP = oculta1Copia4E[i].V[3] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))


                    //optimizacion de parametros antes mencionados 
                    oculta1Copia4E[i].sesgo -= tasaDeAprendizaje * mHatNS / (Math.sqrt(vHatNS) + optimizadorAdma.epsilon) / batch
                    oculta1Copia4E[i].pesoO -= tasaDeAprendizaje * mHatNP / (Math.sqrt(vHatNP) + optimizadorAdma.epsilon) / batch

                    for (let w = 0; w < oculta1Copia4E[i].pesos.length; w++) {
                        // console.log(embeding['|start|'][w] ,embeding[clavesDelObjeto[salidaDeRed.salidaFrase[t - 1]]][w],t,i,w)
                        oculta1Copia4E[i].M[w + 4] = optimizadorAdma.b1 * oculta1Copia4E[i].M[w + 3] + (1 - optimizadorAdma.b1) * (deltaPesosOcultaNeurona * embeding[datosAcutalesParaEntrenamiento[t]][w])
                        oculta1Copia4E[i].V[w + 4] = optimizadorAdma.b2 * oculta1Copia4E[i].V[w + 3] + (1 - optimizadorAdma.b2) * (deltaPesosOcultaNeurona * embeding[datosAcutalesParaEntrenamiento[t]][w]) ** 2


                        let mHatNW = oculta1Copia4E[i].M[w + 4] / (1 - Math.pow(optimizadorAdma.b1, optimizadorAdma.t))
                        let vHatNW = oculta1Copia4E[i].V[w + 4] / (1 - Math.pow(optimizadorAdma.b2, optimizadorAdma.t))
                        oculta1Copia4E[i].pesos[w] -=( tasaDeAprendizaje * mHatNW / (Math.sqrt(vHatNW) + optimizadorAdma.epsilon)) / batch

                    }

                }



            }
            if (!fallo) {
                // console.log(fallo)

                if (n == batch) {
                    //asociacion de capas del decoder
                    capaSalida = salidaCopia
                    capaOculta1 = oculta1Copia
                    capaOculta2 = oculta1Copia2
                    //asociacion de capas del encoder
                    capaOculta1E = oculta1CopiaE
                    capaOculta2E = oculta1Copia2E
                    n = 0
                }
                //incremento del tiempo del optimizador
                optimizadorAdma.t++

            } else {
                es = espochs
            }
            n++
        }
        console.log(error, es)
    }
    console.log('entrenamiento terminado...')

    let objetoF = {
        S: capaSalida,
        CO1: capaOculta1,
        CO2: capaOculta2,
        CO3: capaOculta3,
        CO4: capaOculta4,

        CO1E: capaOculta1E,
        CO2E: capaOculta2E,
        CO3E: capaOculta3E,
        CO4E: capaOculta4E,

    }

    fs.writeFile('./entrenamientoF.txt', JSON.stringify(objetoF), (err) => {
        if (err) {
            console.log("Hubo un error al escribir el archivo:", err);
        } else {
            console.log("Texto escrito correctamente en el archivo.");
        }
    });
    // fs.writeFile(ruta,JSON.stringify(objetoF))
    // console.log(capaOculta2)
    // console.log('_---____---_-_----_-_---___--o1')
    // console.log(capaOculta1)

    // console.log('_---____---_-_----_-_---___--oe1')
    // console.log(capaOculta1E)

    // console.log('_---____---_-_----_-_---___--oe2')
    // console.log(capaOculta2E)

    console.log('_---____---_-_----_-_---___--s')
    console.log(capaSalida[0])


}



entrenamiento(.05, 200, datosMC.data)



