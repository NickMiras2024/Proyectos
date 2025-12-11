//LIBRERIAS
const fs = require('fs/promises');
const path = require('path');
const { isAnyArrayBuffer } = require('util/types');


//FUNCION DE ACTIVACION
function softmax(inputs) {
    const maxInput = Math.max(...inputs); // Estabilidad numérica
    const exps = inputs.map(x => Math.exp(x - maxInput)); // Exponencial para cada entrada
    const sumExps = exps.reduce((a, b) => a + b, 0); // Suma de los exponentes
    return exps.map(x => x / sumExps); // Normalización
}

function reduccionDeDecimales(num) {
    let numSep = num.toString().split('')
    numSep = numSep.slice(0, 12)
    let strF = numSep.join('')
    let numF = parseFloat(strF)
    return numF
}

async function empezarEntrenamiento() {
    try {
        const rutaArchivo = path.resolve(__dirname, './textoDeEntrenamiento.txt');

        const textoProces = await fs.readFile(rutaArchivo, 'utf8');


        let obj = JSON.parse(textoProces)
        let textoObj = obj.data

        function modifText(){
            let textoFinal =[]

            for (let i = 0; i < textoObj.length; i++) {
                let textoEntrada = textoObj[i].input
                let textoSalida = textoObj[i].output
                if(1 < textoEntrada.split(' ').length ){
                    textoFinal.push(textoEntrada)
                }
                if(1 < textoSalida.split(' ').length ){
                    textoFinal.push(textoSalida)
                }
            }
    
            let textoCompleto = textoFinal.join(' ')
            return textoCompleto
        }
        


        parrafo = modifText()
        parrafo = await parrafo.toLowerCase()

        parrafo = parrafo.replace(/\n|\r/g,' ')


        let palabrasCrudas = await parrafo.split(" ")

        let palabras = []

        for (let i = 0; i < palabrasCrudas.length; i++) {
            let registrada = false

            palabras.map(p => {
                if (palabrasCrudas[i] == p) {
                    registrada = true
                }
            })
            if (!registrada) {
                palabras.push(palabrasCrudas[i])
            }
        }



        //datos del tipo input respuesta
        let datos = []
        let rango = 1

        for (let i = 0; i < palabras.length; i++) {
            for (let e = 1; e <= rango; e++) {
                datos.push([palabras[i], palabras[i + e] == undefined ? palabras[i - e] : palabras[i + e]])
            }

        }


        //one hot 
        let oneHot = {}

        for (let i = 0; i < palabras.length; i++) {
            let array = Array(palabras.length).fill(0)
            array[i] = 1
            oneHot[palabras[i]] = array
        }






        //creacion de neuronas
        function crearPesosRandom(size) {
            let pesos = []
            for (let i = 0; i < size; i++) {
                pesos.push(Math.random())
            }
            return pesos
        }



        let capaOculta1 = []
        let salida = []

        function crearNeurona(capa = "o", size) {
            let obj = {
                pesos: crearPesosRandom(size),
                sesgo: Math.random()
            }
            switch (capa) {
                case "o":
                    capaOculta1.push(obj)
                    break;
                case "s":
                    salida.push(obj)
                    break;
                default:
                    break;
            }
        }


        //capa oculta
        let CantidadDeNeuronasO = 75
        let pesosDeCadaNeurona = palabras.length
        console.log(pesosDeCadaNeurona)

        for (let i = 0; i < CantidadDeNeuronasO; i++) {
            crearNeurona("o", pesosDeCadaNeurona)
        }


        //capa oculta
        let CantidadDeNeuronasS = palabras.length
        let pesosDeCadaNeuronaS = CantidadDeNeuronasO

        for (let i = 0; i < CantidadDeNeuronasS; i++) {
            crearNeurona("s", pesosDeCadaNeuronaS)
        }


        //procesamiento hacia delante

        //datos = un array one hot
        function utilizacionDeRed(datos) {
            //capa oculta 
            let salidaO = []
            for (let i = 0; i < capaOculta1.length; i++) {
                let suma = capaOculta1[i].sesgo
                for (let w = 0; w < capaOculta1[i].pesos.length; w++) {
                    suma += (capaOculta1[i].pesos[w] * datos[w])
                }
                salidaO.push(suma)
            }
            //salida
            let salidaS = []
            for (let i = 0; i < salida.length; i++) {
                let suma = salida[i].sesgo
                for (let w = 0; w < salida[i].pesos.length; w++) {
                    suma += (salida[i].pesos[w] * salidaO[w])
                }
                salidaS.push(suma)
            }
            salidaS = softmax(salidaS)

            return { salidaS, salidaO }
        }


        //entrenamiento
        let error = 0
        function backpropagation(respuesta, datos, tasaDeAprendisaje) {

            //procesamiento hacia adelante

            let dato = oneHot[datos]
            let salidaRed = utilizacionDeRed(dato)



            //calculo de error y derivadas
            let indiceDePalabraEsperada = 0
            for (let i = 0; i < palabras.length; i++) {
                if (palabras[i] == respuesta) {
                    indiceDePalabraEsperada = i
                }
            }

            let salidaEsperadaDeCadaNeurona = Array(salidaRed.salidaS.length).fill(0)
            salidaEsperadaDeCadaNeurona[indiceDePalabraEsperada] = 1

            let errorDeCadaNeurona = []
            for (let i = 0; i < salidaEsperadaDeCadaNeurona.length; i++) {
                let der = (salidaRed.salidaS[i] - salidaEsperadaDeCadaNeurona[i])
                error+= Math.abs(der)
                errorDeCadaNeurona.push(der)
            }

            //modificacion de parametros 

            let salidaCopia = salida
            let ocultaCopia = capaOculta1

            //salida
            for (let n = 0; n < salida.length; n++) {
                salidaCopia[n].sesgo -= tasaDeAprendisaje * errorDeCadaNeurona[n]
                for (let w = 0; w < salida[n].pesos.length; w++) {
                    salidaCopia[n].pesos[w] -= tasaDeAprendisaje * errorDeCadaNeurona[n] * salidaRed.salidaO[w]
                }
            }

            //Oculta1
            for (let n = 0; n < capaOculta1.length; n++) {
                let errorDeEstaNeurona = 0
                for (let i = 0; i < salida.length; i++) {
                    errorDeEstaNeurona += salida[i].pesos[n] * errorDeCadaNeurona[i]
                }

                if(errorDeCadaNeurona < -5 ){
                    errorDeCadaNeurona = -5
                }else if(5 < errorDeCadaNeurona ){
                    errorDeCadaNeurona = 5
                }

                ocultaCopia[n].sesgo -= tasaDeAprendisaje * errorDeEstaNeurona
                for (let w = 0; w < capaOculta1[n].pesos.length; w++) {
                    ocultaCopia[n].pesos[w] -= tasaDeAprendisaje * errorDeEstaNeurona * dato[w]
                    ocultaCopia[n].pesos[w] = reduccionDeDecimales(ocultaCopia[n].pesos[w])
                }
            }

            
            salida = salidaCopia
            capaOculta1 = ocultaCopia


        }







        //obtener embeding 
        function obtenerEmbeding() {
            let embeding = {}
            for (let i = 0; i < palabras.length; i++) {
                let dato = oneHot[palabras[i]]
                let salidaRed = utilizacionDeRed(dato)
                embeding[palabras[i]] = salidaRed.salidaO
            }
            return embeding
        }






        let espochs  =  200
        //entrenamiento 
        function entrenamiento() {
            console.log('empezando entrenamiento....')
            for (let i = 0; i < espochs; i++) {
                error = 0
                for (let d = 0; d < datos.length; d++) {
                    backpropagation(datos[d][1], datos[d][0],.05)
                }
                console.log(capaOculta1[0].pesos[0],'o')
                console.log(error,i)
                if(isNaN(error)){
                    i = espochs
                }
            }
            console.log('entrenamiento terminado')

            console.log('embeding resultante:')
            let embeding = obtenerEmbeding()

            function normalizarEmbedding(embedding) {
                const magnitud = Math.sqrt(embedding.reduce((sum, val) => sum + val ** 2, 0));
                return embedding.map(val => val / magnitud);
            }

            let clavesDeObJEm = Object.keys(embeding);

            for (let em = 0; em < clavesDeObJEm.length; em++) {
                embeding[clavesDeObJEm[em]] =  normalizarEmbedding(embeding[clavesDeObJEm[em]])
            }


            fs.writeFile('./embedingFinal.txt', JSON.stringify(embeding), (err) => {
                console.log('embeding guardado en embedingFinal.txt')                
                if (err) throw err;
                });
            // console.log(embeding)

        }

        entrenamiento()

        return obtenerEmbeding()




    } catch (error) {
        console.error('Hubo un problema al leer el archivo:', error);
    }
}

//=>

empezarEntrenamiento()

