
//DATOS ETC
let fs = require('fs')
const path = require('path');
const {empezarEntrenamiento} = require(path.resolve(__dirname,'embedingMoment'))


async function embedingTemporal (text) {
    return await empezarEntrenamiento(text)
}




let redCruda = fs.readFileSync(path.resolve(__dirname, 'entrenamientoF.txt'), 'utf-8')
let embedingCrudo = fs.readFileSync(path.resolve(__dirname, 'embedingFinal.txt'), 'utf-8')


let red = JSON.parse(redCruda)
let embeding = JSON.parse(embedingCrudo)
// console.log(embeding)
//claves
let clavesDelObjeto = Object.keys(embeding)



//FUNCION DE ACTIVACION
function softmax(inputs) {
    const maxInput = Math.max(...inputs); // Estabilidad numérica
    const exps = inputs.map(x => Math.exp(x - maxInput)); // Exponencial para cada entrada
    const sumExps = exps.reduce((a, b) => a + b, 0); // Suma de los exponentes
    return exps.map(x => x / sumExps); // Normalización
}


function leakyReLU(x, alpha = 0.01) {
    return x > 0 ? x : alpha * x;
}

//reductor de decimales 
function reduccionDeDecimales(num) {
    let numSep = num.toString().split('')
    numSep = numSep.slice(0, 12)
    let strF = numSep.join('')
    let numF = parseFloat(strF)
    return numF
}

//CAPAS DE RED
let capaOculta4 = red.CO4
let capaOculta3 = red.CO3
let capaOculta2 = red.CO2
let capaOculta1 = red.CO1
let capaSalida = red.S

let capaOculta4E = red.CO4E
let capaOculta3E = red.CO3E
let capaOculta2E = red.CO2E
let capaOculta1E = red.CO1E




//UTILIZACION DE RED
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
    let salida;
    for (let i = 0; i < palabras.length; i++) {

        if (!embeding[palabras[i]]) {
            console.log('palabra no encontrada',palabras[i])
            continue;
        }

        let embedingPalabra = embeding[palabras[i]]
        salida = procesamientoHaciaDelante(embedingPalabra, 'encoder')

    }

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
    return { indiceDeLetra }
}

//INTERACCION   
async function interaccion(frase) {

    //actualizacion de embeding 
    function normalizarEmbedding(embedding) {
        const magnitud = Math.sqrt(embedding.reduce((sum, val) => sum + val ** 2, 0));
        return embedding.map(val => val / magnitud);
      }

    function actualizarEmbedding(embeddingActual, embeddingNuevo, tasaAprendizaje) {
        console.log(embeddingNuevo,'0000')
        return embeddingActual.map((valor, indice) =>
          valor + tasaAprendizaje * (embeddingNuevo[indice] - valor)
        );
      }
      
      


    let embedingT = await embedingTemporal(frase)
    let objetoET = Object.keys(embedingT)
    console.log(objetoET,'oooo')
    for (let em = 0; em < objetoET.length; em++) {
        if(embeding[objetoET[em]]){
            embeding[objetoET[em]] = await actualizarEmbedding(normalizarEmbedding(embeding[objetoET[em]]),normalizarEmbedding(embedingT[objetoET[em]]),0.1)

        }else{
            embeding[objetoET[em]] = await normalizarEmbedding(embedingT[objetoET[em]])
            
        }
    }







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



    let salidaFrase = []
    let max = 10

    // console.log('......',palabrasFraseDesalida)
    let estado = codificador(frase)


    salidaFrase.push(clavesDelObjeto.indexOf('|start|'))




    for (let i = 0; i < max; i++) {
        // console.log(',,,',clavesDelObjeto[salidaFraseNR[salidaFraseNR.length - 1]])
        let salida = decodificador(clavesDelObjeto[salidaFrase[salidaFrase.length - 1]])

        if (salida.indiceDeLetra !== clavesDelObjeto.indexOf('|end|') || palabrasFraseDesalida[salidaFraseNR.length] != undefined) {
            salidaFrase.push(salida.indiceDeLetra)
        } else {
            i = max
        }

    }
    salidaFrase.shift()


    let salidaFraseEscrita = []
    for (let i = 0; i < salidaFrase.length; i++) {
        salidaFraseEscrita.push(clavesDelObjeto[salidaFrase[i]])
    }


    console.log('.....', salidaFraseEscrita.join(' '))

    return salidaFraseEscrita.join(' ')
}

module.exports = {
    interaccion
};