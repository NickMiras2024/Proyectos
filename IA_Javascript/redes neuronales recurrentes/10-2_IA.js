// Inicialización de pesos y sesgos
let wx = Math.random() * 2 - 1;  
let wh = Math.random() * 2 - 1;
let sesgo = Math.random() * 2 - 1; 
let Way = Math.random() * 2 - 1; 
let sesgoY = Math.random() * 2 - 1;  

// Función para la pasada hacia adelante
function pass(data, prevP) {
    let h = wx * data + wh * prevP + sesgo; 
    let salida = Way * h + sesgoY;  
    return { salida, h };
}

// Datos de entrenamiento
let datos = [
    [.1, .2, .3],
    [.3, .4, .5],
    [.2, .3, .4],
];

// Respuestas esperadas
let respuestas = [
    [.1, .3, .6],
    [.3, .7, 1.2],
    [.2, .5, .9]
];


// Tasa de aprendizaje
let TDA = 0.01;
// Número de épocas
let espoch = 2600;

function BPTT() {
    for (let es = 0; es < espoch; es++) {
        for (let e = 0; e < datos.length; e++) {
            let PP = 0;  // estado oculto anterior
            for (let d = 0; d < datos[e].length; d++) {
                let salida = 0;


                let res = pass(datos[e][d], PP)


                salida = res.salida

                //actualizacion de pesos

                let error = salida - respuestas[e][d]


                let derSal = error 

                let deltaEON = derSal * Way 

                sesgo -= TDA * deltaEON
                wx -= TDA * deltaEON * datos[e][d]
                wh -= TDA * deltaEON * PP  

                sesgoY -= TDA * derSal 
                Way -= derSal * res.h

                PP = res.h
                console.log(1/2 * (error) ** 2)


            }

        }
    }
    probar()
}

BPTT();


function probar(){
    for (let e = 0; e < datos.length; e++) {
        let salida = []
        let PP = 0;  // estado oculto anterior
        for (let d = 0; d < datos[e].length; d++) {
            let res = pass(datos[e][d], PP)
            PP = res.h
            salida.push(res.salida)
        }
        console.log(salida,respuestas[e])
    }
    console.log('________________________________')
    probar2()
}




function probar2(){
    let datos2= [
        [5,3,8],
    ]
    
    let respuestas2 = [
        [5,8,16]
    ]
    for (let e = 0; e < datos2.length; e++) {
        let salida = []
        let PP = 0;  // estado oculto anterior
        for (let d = 0; d < datos2[e].length; d++) {
            let res = pass(datos2[e][d], PP)
            PP = res.h
            salida.push(res.salida)
        }
        console.log(salida,respuestas2[e])
    }
}

