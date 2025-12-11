// Inicialización de pesos y sesgos
let wx = Math.random() * 2 - 1;  // peso de la entrada a la celda
let wh = Math.random() * 2 - 1;  // peso de la salida recurrente
let sesgo = Math.random() * 2 - 1;  // sesgo para la celda oculta
let Way = Math.random() * 2 - 1;  // peso de la salida a la predicción final
let sesgoY = Math.random() * 2 - 1;  // sesgo de la salida final

let mt = [0, 0, 0]; 
let vt = [0, 0, 0];

let mts = [0, 0]; 
let vts = [0, 0];

// Función para la pasada hacia adelante
function pass(data, prevP) {
    let h = wx * data + wh * prevP + sesgo;  
    let salida = Way * h + sesgoY; 
    return { salida, h };
}

//datos de entranamiento 

let datos = [
    [0.5, 1, 1.5, 2],
    [2, 4, 6, 8],
    [1, 3, 6, 10],
    [1, 2, 4, 8],
    [1, 1.5, 2.25, 3.375]
];

//respuesatas para el entrenamiento 
let respuestas = [
    [0.5, 1.5, 3, 5],  
    [2, 6, 12, 20],
    [1, 4, 10, 20],
    [1, 3, 7, 15],
    [1, 2.5, 5.25, 9.625]
];


// Tasa de aprendizaje y etc
let TDA = 0.01;
let espoch = 1000;
let b1 = 0.9, b2 = 0.999, epsilon = 1e-8;

// Entrenamiento con BPTT
function BPTT() {
    let t = 1; // Contador de iteraciones 

    for (let es = 0; es < espoch; es++) {
        for (let e = 0; e < datos.length; e++) {
            let PP = 0;  // Estado oculto anterior
            for (let d = 0; d < datos[e].length; d++) {
                let res = pass(datos[e][d], PP);
                let salida = res.salida;
                let error = salida - respuestas[e][d];

                // Gradientes
                let derSal = error; 
                let deltaEON = derSal * Way;

               // actualizacion de way y sesgoY
                let sumaQueHayQueHacerConCadaPeso = [1, res.h];
                for (let i = 0; i < mts.length; i++) {
                    mts[i] = b1 * mts[i] + (1 - b1) * derSal * sumaQueHayQueHacerConCadaPeso[i];
                    vts[i] = b2 * vts[i] + (1 - b2) * (derSal * sumaQueHayQueHacerConCadaPeso[i]) ** 2;

                    let mHat = mts[i] / (1 - Math.pow(b1, t));
                    let vHat = vts[i] / (1 - Math.pow(b2, t));

                    if (i === 0) sesgoY -= TDA * mHat / (Math.sqrt(vHat) + epsilon);
                    else Way -= TDA * mHat / (Math.sqrt(vHat) + epsilon);
                }

                // actualizacion de wx, wh y sesgo
                let sumaQueHayQueHacerConCadaPeso2 = [1, datos[e][d], PP];
                for (let i = 0; i < mt.length; i++) {
                    mt[i] = b1 * mt[i] + (1 - b1) * deltaEON * sumaQueHayQueHacerConCadaPeso2[i];
                    vt[i] = b2 * vt[i] + (1 - b2) * (deltaEON * sumaQueHayQueHacerConCadaPeso2[i]) ** 2;

                    let mHat = mt[i] / (1 - Math.pow(b1, t));
                    let vHat = vt[i] / (1 - Math.pow(b2, t));

                    if (i === 0) sesgo -= TDA * mHat / (Math.sqrt(vHat) + epsilon);
                    else if (i === 1) wx -= TDA * mHat / (Math.sqrt(vHat) + epsilon);
                    else wh -= TDA * mHat / (Math.sqrt(vHat) + epsilon);
                }

                PP = res.h;
                t++; 
                console.log(1/2 * (error) ** 2)

            }
        }
    }
    probar();
}


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

BPTT();
