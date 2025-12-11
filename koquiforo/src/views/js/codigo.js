let piso = document.getElementById('mapaPiso');
let player = document.getElementById('Player');
let contenedorP = document.getElementById('contenedorP');
let menu = document.getElementById('menu')
let controles = document.getElementById('controles')
let menu2 = document.getElementById('menu2')
let is = document.getElementsByClassName('p')
let is2 = document.getElementsByClassName('i')
let btnEnv = document.getElementById('btnEnv')
let btnEnv2 = document.getElementById('btnEnv2')
let btnEnv3 = document.getElementById('btnEnv3')
let vida = document.getElementById('vida')
let vidaBoss = document.getElementById('vidaBOSS')
let contVidaBOSS = document.getElementById('contVidaBOSS')
let hojasC = document.getElementById('hojasC')
let salir = document.getElementById('salir');
let reanudar = document.getElementById('reanudar');
let GANP = document.getElementById('GANP');


let res = {

}

let resC = {

}



let particulas = [

]


function numC1(min, max) {
    return Math.random() * (max - min) + min;
};


async function bi() {
    await fetch('./datos.json')
        .then(res => res.json())
        .then(rep => resC = rep)
    coquiObj.datosCagados = true
    console.log(resC)
    res = resC.teclas
    console.log(coquiObj.datosCagados)

    //nivel

    if (coquiObj.datosCagados == true) {


        coquiObj.dificultadJ = resC.dificultad;
        btnEnv2.innerText = coquiObj.dificultadJ

        if (resC.dificultad == 'normal') {
            coquiObj.dañoBola = 50
            coquiObj.dañoHojas = .2
        } else {
            coquiObj.dañoBola = 25
            coquiObj.dañoHojas = .05
        }


        if (resC.nivel == -1) {
            coquiObj.x2 = 100;
            piso.style.backgroundColor = '#A8671A';
            piso.style.width = '13000px'
        } else if (resC.nivel == 0) {
            coquiObj.x2 = 100;
            piso.style.backgroundColor = '#A8671A';
            piso.style.width = '5600px'
        } else if (resC.nivel == 1 || resC.nivel == 2 || resC.nivel == 3 || resC.nivel == 4 || resC.nivel == 5 || resC.nivel == 6) {
            console.log('hola')
            coquiObj.x2 = 500;
            coquiObj.y = 200;
            console.log(resC)
        } else if (resC.nivel == 9 || resC.nivel == 7 || resC.nivel == 10 || resC.nivel == 8) {
            player.classList.add('playerNadando')
            // if (coquiObj.ALA) {
            //     player.style.width = '205px'
            //     player.style.height = '80px'
            // } else {
            //     player.style.height = '110px';
            //     player.style.width = '90px';
            // }

            // setInterval(() => {
            //     let obj = document.createElement('div')
            //     let med = numC1(20, 40)
            //     let objeto1 = {
            //         obj,
            //         vel: numC1(1, 7),
            //         posicion: { x: numC1(10, screen.availWidth), y: 0 },
            //         medidas: { h: med, w: med },
            //         cod3: 'burbujas',
            //         creado: false,
            //         Coll: false,
            //         PORT: false
            //     }
            //     particulas.push(objeto1)
            //     crearObjeto(objeto1)
            // }, 1000);
        }


        if (!resC.cinematicas) {
            obj2 = {
                "nivel": 0,
                "cinematicas": true,
                "dificultad": resC.dificultad,
                "niveles_Completos": resC.niveles_Completos,
                "niveles_J": {
                    "mar": {
                        "N0": true,
                        "N1": resC.niveles_J.mar.N1,
                        "N2": resC.niveles_J.mar.N2,
                        "N3": resC.niveles_J.mar.N3,
                        "N4": resC.niveles_J.mar.N4,
                        "N5": resC.niveles_J.mar.N5,
                        "N6": resC.niveles_J.mar.N6,
                        "N7": resC.niveles_J.mar.N7,
                        "N8": resC.niveles_J.mar.N8,
                        "N9": resC.niveles_J.mar.N9,
                        "N10": resC.niveles_J.mar.N10
                    }
                },
                "teclas": {
                    "MD": resC.teclas.MD,
                    "MI": resC.teclas.MI,
                    "S": resC.teclas.S,
                    "D": resC.teclas.D,
                    "a1": resC.teclas.a1,
                    "a2": resC.teclas.a2,
                    "a3": resC.teclas.a3

                }
            }
            cambiar2()
        }


    }
    crearWorld(`./mapas/mapa${resC.nivel}.txt`)
    contenedorP.removeAttribute('class')
    contenedorP.setAttribute('class', `contenedorP fondo${resC.nivel}`)

}

bi()



//variables principales del juego

let coquiObj = {
    ALA: false,
    ataqueDisparo: false,
    poder2: true,
    correrApp: true,
    vida: 7,
    espacioVida: 7,
    x: 0,
    x2: 100,
    y: piso.clientHeight,
    seMueve: false,
    salto: false,
    Yvel: 0,
    gravedad: -.8,
    cayo: true,
    iz: false,
    vel: 10,
    embestida: false,
    poder: true,
    menu: false,
    actGrav: false,
    datosCagados: false,
    empezarC: false,
    tiempoNeed: 0,
    tiempoT: false,
    nivel: resC.nivel,
    disparado: false,
    cargaAlientoHojal: 45,
    AlientoHojalDispar: false,
    creandoDis: false,
    dañoHojas: .1,
    dañoBola: 50,
    dificultadJ: "normal",
    TV: false,
    sePUede: true

}


let obj2

async function cambiar2(ganar = false, perder = false) {
    try {
        const response = await fetch('http://localhost:3000/cambiar', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj2)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud. Código de estado: ' + response.status);
        }

        console.log('Solicitud POST exitosa');
        if (ganar) {
            window.location.href = 'otrosEnlaces/pagG.html';
        } else if (perder) {
            window.location.href = 'otrosEnlaces/pagP.html';
        } else {
            window.location.reload()
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
    }
}


function handleDivClick(index) {
    return function () {
        document.addEventListener('keydown', function handleKeyDown(e) {
            is2[index].innerHTML = e.key;

            // Remover el listener después de procesar el evento
            document.removeEventListener('keydown', handleKeyDown);
        });
    };
}

for (let i = 0; i < is.length; i++) {
    is[i].addEventListener('click', handleDivClick(i));
}


btnEnv3.addEventListener('click', () => {
    menu2.style.display = 'none'
    coquiObj.menu = !coquiObj.menu

})

reanudar.addEventListener('click', () => {
    menu.style.display = 'none'
    coquiObj.menu = !coquiObj.menu

})


btnEnv2.addEventListener('click', () => {
    coquiObj.dificultadJ = coquiObj.dificultadJ == 'normal' ? 'dificil' : 'normal'
    btnEnv2.innerText = coquiObj.dificultadJ
})



btnEnv.addEventListener('click', () => {


    let obj = {
        "teclas": [
            "d",
            "a",
            "w",
            "s",
            "m",
            "e"
        ]
    }
    let index = 0;
    for (const i of is2) {

        obj.teclas[index] = i.innerText
        index++
    }
    index = 0
    // console.log(obj)
    coquiObj.nivel = resC.nivel
    obj2 = {
        "nivel": coquiObj.nivel,
        "cinematicas": true,
        "dificultad": coquiObj.dificultadJ,
        "niveles_Completos": resC.nivel < resC.niveles_Completos ? resC.niveles_Completos : resC.nivel,

        "niveles_J": {
            "mar": {
                "N0": true,
                "N1": resC.niveles_J.mar.N1,
                "N2": resC.niveles_J.mar.N2,
                "N3": resC.niveles_J.mar.N3,
                "N4": resC.niveles_J.mar.N4,
                "N5": resC.niveles_J.mar.N5,
                "N6": resC.niveles_J.mar.N6,
                "N7": resC.niveles_J.mar.N7,
                "N8": resC.niveles_J.mar.N8,
                "N9": resC.niveles_J.mar.N9,
                "N10": resC.niveles_J.mar.N10
            }
        },
        "teclas": {
            "MD": obj.teclas[0],
            "MI": obj.teclas[1],
            "S": obj.teclas[2],
            "D": obj.teclas[3],
            "a1": obj.teclas[4],
            "a2": obj.teclas[5],
            "a3": obj.teclas[6]

        }
    }


    // console.log(obj2)

    cambiar2()
    menu.style.display = 'none'
});




salir.addEventListener('click', () => {
    coquiObj.nivel = resC.nivel
    obj2 = {
        "nivel": 0,
        "cinematicas": true,
        "dificultad": coquiObj.dificultadJ,
        "niveles_Completos": resC.nivel < resC.niveles_Completos ? resC.niveles_Completos : resC.nivel,
        "niveles_J": {
            "mar": {
                "N0": true,
                "N1": resC.niveles_J.mar.N1,
                "N2": resC.niveles_J.mar.N2,
                "N3": resC.niveles_J.mar.N3,
                "N4": resC.niveles_J.mar.N4,
                "N5": resC.niveles_J.mar.N5,
                "N6": resC.niveles_J.mar.N6,
                "N7": resC.niveles_J.mar.N7,
                "N8": resC.niveles_J.mar.N8,
                "N9": resC.niveles_J.mar.N9,
                "N10": resC.niveles_J.mar.N10
            }
        },
        "teclas": {
            "MD": res.MD,
            "MI": res.MI,
            "S": res.S,
            "D": res.D,
            "a1": res.a1,
            "a2": res.a2,
            "a3": res.a3

        }
    }
    // console.log(obj2)

    cambiar2()

    menu2.style.display = 'none';
    menu.style.display = 'none'
})






controles.addEventListener('click', () => {
    if (resC.nivel !== 0) {
        menu2.style.display = 'flex';
        menu.style.display = 'none'
    } else {
        menu.style.display = 'none'
        coquiObj.menu = false

    }
})

// const ele = require('electron')

//conectar con index
// ipcRenderer.send('send-to-renderer','hello');




//funciones de colicion

function obtenerColl(objeto, posicion) {
    return {
        y: {
            a: posicion.y + (objeto.clientHeight),
            b: posicion.y
        },
        x: {
            a: posicion.x + objeto.clientWidth / 1.5,
            b: posicion.x - objeto.clientHeight / 4
        }
    }
}


function compararColl(obj, pos) {
    let res = obtenerColl(obj, pos)
    if (
        coquiObj.x < res.x.a
        && coquiObj.x > res.x.b
        && coquiObj.y < res.y.a
        && coquiObj.y > res.y.b

        || coquiObj.x2 < res.x.a
        && coquiObj.x2 > res.x.b
        && coquiObj.y < res.y.a
        && coquiObj.y > res.y.b


        // && coquiObj.y > res.y-obj.clientHeight
    ) {
        return true;
    }
    else {
        return false;
    }

}

//para los disparos

function obtenerColl2() {
    return {
        y: {
            a: coquiObj.y + (player.clientHeight),
            b: coquiObj.y
        },
        x: {
            a: coquiObj.x2 + (player.clientWidth) / 1.5,
            b: coquiObj.x2 - (player.clientWidth) / 2
        }
    }
}


function compararColl2(obj, pos) {
    let res = obtenerColl2(obj, pos)
    if (
        // coquiObj.x < res.x.a
        // && coquiObj.x > res.x.b
        // && coquiObj.y < res.y.a
        // && coquiObj.y > res.y.b

        pos.x < res.x.a
        && pos.x > res.x.b
        && pos.y < res.y.a
        && pos.y > res.y.b


        // && coquiObj.y > res.y-obj.clientHeight
    ) {
        return true;
    }
    else {
        return false;
    }

}

//para enemigos
function obtenerColl3(obj, posicion) {
    return {
        y: {
            a: posicion.y + obj.clientHeight,
            b: posicion.y
        },
        x: {
            a: posicion.x + (obj.clientWidth) / 1.5,
            b: posicion.x - (obj.clientWidth) / 2
        }
    }
}


function compararColl3(obj, pos, pos2) {
    let res = obtenerColl3(obj, pos)
    if (
        pos2.x < res.x.a
        && pos2.x > res.x.b
        && pos2.y < res.y.a
        && pos2.y > res.y.b


        // && coquiObj.y > res.y-obj.clientHeight
    ) {
        return true;
    }
    else {
        return false;
    }

}








//ataques: 

//disparos catapulta

setInterval(() => {
    if (coquiObj.cargaAlientoHojal <= 40 && !coquiObj.TV) {
        coquiObj.cargaAlientoHojal += 1
    } else if (coquiObj.cargaAlientoHojal <= 40 && coquiObj.TV) {
        coquiObj.cargaAlientoHojal += 5
    }
}, 800);


let disparosHojasC = [

]

function AlientoHojal(objDis) {
    if (coquiObj.cargaAlientoHojal >= 1) {
        coquiObj.cargaAlientoHojal -= 1
        let dis = document.createElement('div');
        dis.setAttribute('class', 'disparoHoja');
        dis.style.width = '30px';
        dis.style.height = '20px';
        dis.style.left = objDis.posicion.x;
        dis.style.bottom = objDis.posicion.y
        contenedorP.appendChild(dis)
        disparosHojasC.push({ ...objDis, obj: dis })
        setTimeout(() => {
            contenedorP.removeChild(dis)
        }, 2000)
    }
}



let disparos = [
]


function dispararBola(objDis) {
    if (coquiObj.disparado == false) {
        let dis = document.createElement('div');
        dis.setAttribute('class', 'disparoBola');
        dis.style.width = '50px';
        dis.style.height = '50px';
        dis.style.left = objDis.posicion.x;
        dis.style.bottom = objDis.posicion.y
        contenedorP.appendChild(dis)
        disparos.push({ ...objDis, obj: dis })
        // setTimeout(() => {
        //     contenedorP.removeChild(dis)
        // }, 3000)
        coquiObj.disparado = true
    }
}





//embestida

function embestir() {
    if (coquiObj.iz) {
        player.style.transform = 'rotateY(180deg)';
        if (coquiObj.x <= -5) {
            coquiObj.x += coquiObj.vel;
        } else if (coquiObj.x2 >= 100) {
            coquiObj.x2 -= coquiObj.vel - 2;
        }
    } else {
        player.style.transform = 'rotateY(0deg)';
        if (coquiObj.x >= -(piso.clientWidth - screen.availWidth) || coquiObj.x > screen.availWidth) {
            coquiObj.x -= coquiObj.vel;
        } else if (coquiObj.x2 <= screen.availWidth - 100) {
            coquiObj.x2 += coquiObj.vel - 2;
        }

    }
}





//eventos 

let teclasPre = {

}

document.addEventListener('keydown', (e) => {
    teclasPre[e.key] = true

})

document.addEventListener('keyup', function (event) {
    delete teclasPre[event.key];
    coquiObj.seMueve = false
});




//objetos Importantes

let algas = [

]

let bossFinal = [

]





let BOSSE = [

]


let disparosEnemigos = [

]



let enemigosCAC = [

]

let enemigosDIS = [

]


let objetos = [
    {
        PI: { PI: true },
        final: 10000,
        inicio: 1,
        obj: piso,
        posicion: { x: 0, y: 0 }
    }
]


let contador = 0


let coliciones = [
    {
        obj: piso,
        coll: true,
        PORT: [false, 0],
        p: {
            x: 0,
            y: -5
        }
    },
]

let vidaICoq = coquiObj.vida

let estadoDeAnimacionDeSangre = 0

setInterval(() => {
    if (vidaICoq / 2 >= coquiObj.vida) {

        estadoDeAnimacionDeSangre == 0 ? estadoDeAnimacionDeSangre = 18 : estadoDeAnimacionDeSangre = 0
        contenedorP.style.transition = '1s'
        contenedorP.style.boxShadow = `0px 0px ${estadoDeAnimacionDeSangre * 10}px ${estadoDeAnimacionDeSangre * 1.5}px #7e0e0e inset`
    }

}, 2000);








//funcion de gravedad

function grav() {

    //poner gravedad

    coquiObj.Yvel = coquiObj.Yvel + coquiObj.gravedad
    coquiObj.y = coquiObj.y + (coquiObj.Yvel);

    // if(coquiObj.x2 <= obtenerColl(coliciones[0].obj,{x:coliciones[0].p.x,y:coliciones[0].p.y}).x.a){
    //     console.log('ta adentro',obtenerColl(coliciones[0].obj,{x:coliciones[0].p.x,y:coliciones[0].p.y}).x.a, coquiObj.x2)        
    // }else{
    //     console.log('no esta adentro')
    // }

    //ver colicion
    for (const arr in coliciones) {
        coquiObj.cayo = false

        if (resC.nivel == 0 || resC.nivel == -1) {
            let codigo12 = /[0-9]C/;
            if (coliciones[arr].PORT[0] && codigo12.test(coliciones[arr].PORT[1]) == false) {
                let NUMN = `N${coliciones[arr].PORT[1] - 1}`
                if (
                    resC.niveles_Completos >= coliciones[arr].PORT[1]
                    && resC.nivel == 0

                    || resC.niveles_J.mar[NUMN] == true
                    && coliciones[arr].PORT[1] !== 0
                    && resC.nivel == -1
                    || coliciones[arr].PORT[1] == 0
                ) {
                } else {
                    coliciones[arr].obj.classList.replace(coliciones[arr].cod3, 'mundoB');

                }
            }
        }






        // console.log(coliciones[arr])
        if (compararColl(coliciones[arr].obj, { x: coliciones[arr].p.x, y: coliciones[arr].p.y })) {
            if (resC.nivel == 0 || resC.nivel == -1) {
                let codigo12 = /[0-9]C/;
                if (coliciones[arr].PORT[0] && codigo12.test(toString(coliciones[arr].PORT[1])) == false) {
                    let NUMN = `N${coliciones[arr].PORT[1] - 1}`
                    if (
                        resC.niveles_Completos >= coliciones[arr].PORT[1]
                        && resC.nivel == 0

                        || resC.niveles_J.mar[NUMN] == true
                        && coliciones[arr].PORT[1] !== 0
                        && resC.nivel == -1
                        || coliciones[arr].PORT[1] == 0
                    ) {
                        coquiObj.nivel = resC.nivel
                        obj2 = {
                            "nivel": coliciones[arr].PORT[1],
                            "cinematicas": true,
                            "dificultad": coquiObj.dificultadJ,
                            "niveles_Completos": resC.nivel < resC.niveles_Completos ? resC.niveles_Completos : resC.nivel,
                            "niveles_J": {
                                "mar": {
                                    "N0": true,
                                    "N1": resC.niveles_J.mar.N1,
                                    "N2": resC.niveles_J.mar.N2,
                                    "N3": resC.niveles_J.mar.N3,
                                    "N4": resC.niveles_J.mar.N4,
                                    "N5": resC.niveles_J.mar.N5,
                                    "N6": resC.niveles_J.mar.N6,
                                    "N7": resC.niveles_J.mar.N7,
                                    "N8": resC.niveles_J.mar.N8,
                                    "N9": resC.niveles_J.mar.N9,
                                    "N10": resC.niveles_J.mar.N10
                                }
                            },
                            "teclas": {
                                "MD": res.MD,
                                "MI": res.MI,
                                "S": res.S,
                                "D": res.D,
                                "a1": res.a1,
                                "a2": res.a2,
                                "a3": res.a3

                            }
                        }
                        // console.log(obj2)

                        cambiar2()
                        bi()


                    } else if (codigo12.test(coliciones[arr].PORT[1])) {
                        if (coliciones[arr].PORT[1] == '2C') {
                            window.location.href = 'otrosEnlaces/cinematica2.html';
                        }

                    }

                } else if (coliciones[arr].coll) {
                    coquiObj.gravedad = 0
                    coquiObj.Yvel = 0;
                    coquiObj.cayo = true;
                    break

                }
            } else if (coliciones[arr].coll) {
                coquiObj.gravedad = 0
                coquiObj.Yvel = 0;
                coquiObj.cayo = true;
                break
            }

        } else {

            if (!coquiObj.cayo && coquiObj.y < -15) {
                coquiObj.vida -= 1
                coquiObj.Yvel = 25
                break
            }
            coquiObj.gravedad = -.8
        }
    }


}

let timepoEtc = 1000;


// ataque enemigos
setInterval(() => {
    if (enemigosDIS.length >= 1) {
        for (const en in enemigosDIS) {
            if (Math.random() > 0.87 && enemigosDIS[en].creado && enemigosDIS[en].tipo.TD == 'nor' && !coquiObj.TV) {
                coquiObj.creandoDis = true
                let obj = document.createElement('div');
                obj.setAttribute('id', disparosEnemigos.length)
                let objeto1
                if (enemigosDIS[en].cod3 == 'gaviotaG') {
                    objeto1 = {
                        objID: disparosEnemigos.length,
                        obj,
                        posicion: { x: enemigosDIS[en].posicion.x, y: enemigosDIS[en].posicion.y },
                        medidas: { h: 20, w: 20 },
                        cod3: "disparosEnemigosG",
                        direcion: { x: coquiObj.x2 < enemigosDIS[en].posicion.x ? "L" : coquiObj.x2 > enemigosDIS[en].posicion.x ? "R" : "L", y: coquiObj.y },
                        pego: false,
                        empezarConteo: 0
                    }
                } else {
                    objeto1 = {
                        objID: disparosEnemigos.length,
                        obj,
                        posicion: { x: enemigosDIS[en].posicion.x, y: enemigosDIS[en].posicion.y },
                        medidas: { h: 20, w: 20 },
                        cod3: "disparosEnemigos",
                        direcion: { x: coquiObj.x2 < enemigosDIS[en].posicion.x ? "L" : coquiObj.x2 > enemigosDIS[en].posicion.x ? "R" : "L", y: coquiObj.y },
                        pego: false,
                        empezarConteo: 0
                    }
                }
                disparosEnemigos.push(objeto1);
                crearObjeto(objeto1)
                coquiObj.creandoDis = false
            }

            //para las medusas  que no se mueven 
            if (Math.random() > 0.89 && enemigosDIS[en].creado && enemigosDIS[en].tipo.TD == 'nor' && coquiObj.TV) {
                coquiObj.creandoDis = true
                let obj = document.createElement('div');
                obj.setAttribute('id', disparosEnemigos.length)
                let objeto1
                if (enemigosDIS[en].cod3 == 'gaviotaG') {
                    objeto1 = {
                        objID: disparosEnemigos.length,
                        obj,
                        posicion: { x: enemigosDIS[en].posicion.x, y: enemigosDIS[en].posicion.y },
                        medidas: { h: 20, w: 20 },
                        cod3: "disparosEnemigosG",
                        direcion: { x: coquiObj.x2 < enemigosDIS[en].posicion.x ? "L" : coquiObj.x2 > enemigosDIS[en].posicion.x ? "R" : "L", y: coquiObj.y },
                        pego: false,
                        empezarConteo: 0
                    }
                } else {
                    objeto1 = {
                        objID: disparosEnemigos.length,
                        obj,
                        posicion: { x: enemigosDIS[en].posicion.x, y: enemigosDIS[en].posicion.y },
                        medidas: { h: 20, w: 20 },
                        cod3: "disparosEnemigos2",
                        direcion: { x: coquiObj.x2 < enemigosDIS[en].posicion.x ? "L" : coquiObj.x2 > enemigosDIS[en].posicion.x ? "R" : "L", y: coquiObj.y },
                        pego: false,
                        empezarConteo: 0
                    }
                }
                disparosEnemigos.push(objeto1);
                crearObjeto(objeto1)
                coquiObj.creandoDis = false
            }







            //lo mismo pero para los boss
            if (Math.random() > 0.65 && enemigosDIS[en].creado && enemigosDIS[en].tipo.TD == 'BOS') {
                coquiObj.creandoDis = true
                let obj = document.createElement('div');
                obj.setAttribute('id', disparosEnemigos.length)
                let objeto1
                if (enemigosDIS[en].cod3 == 'gaviotaG') {
                    objeto1 = {
                        objID: disparosEnemigos.length,
                        obj,
                        posicion: { x: enemigosDIS[en].posicion.x, y: enemigosDIS[en].posicion.y },
                        medidas: { h: 20, w: 20 },
                        cod3: "disparosEnemigosG",
                        direcion: { x: coquiObj.x2 < enemigosDIS[en].posicion.x ? "L" : coquiObj.x2 > enemigosDIS[en].posicion.x ? "R" : "L", y: coquiObj.y },
                        pego: false,
                        empezarConteo: 0
                    }
                } else {
                    objeto1 = {
                        objID: disparosEnemigos.length,
                        obj,
                        posicion: { x: enemigosDIS[en].posicion.x, y: enemigosDIS[en].posicion.y },
                        medidas: { h: 20, w: 20 },
                        cod3: "disparosEnemigos",
                        direcion: { x: coquiObj.x2 < enemigosDIS[en].posicion.x ? "L" : coquiObj.x2 > enemigosDIS[en].posicion.x ? "R" : "L", y: coquiObj.y },
                        pego: false,
                        empezarConteo: 0
                    }
                }
                disparosEnemigos.push(objeto1);
                crearObjeto(objeto1)
                coquiObj.creandoDis = false
            }
        }
    }

    if (enemigosCAC.length >= 1) {
        for (const en in enemigosCAC) {
            if (enemigosCAC[en].cod3 !== "tiburon" && Math.random() > 0.8 && enemigosCAC[en].creado && !enemigosCAC[en].L && enemigosCAC[en].tipo.TD == 'nor') {
                enemigosCAC[en].L = true;
                enemigosCAC[en].pocicion_medio = { x: coquiObj.x2, y: coquiObj.y }
                enemigosCAC[en].obj.style.transition = '.0s';

            }
            if (Math.random() > 0.6 && enemigosCAC[en].creado && !enemigosCAC[en].L && enemigosCAC[en].tipo.TD == 'BOS') {
                enemigosCAC[en].L = true;
                enemigosCAC[en].pocicion_medio = { x: coquiObj.x2, y: coquiObj.y }
                enemigosCAC[en].obj.style.transition = '.0s';

            }
        }
    }

}, timepoEtc)


let tiempoDeInteraccion = 3000;

let objPos = {
    empe: false
}
let rebot = []

setInterval(() => {

    if (BOSSE.length >= 1 && !coquiObj.menu) {
        for (bos in BOSSE) {
            if (BOSSE[bos].cod3 == "tiburon") {
                tiempoDeInteraccion = 1000;
                console.log(BOSSE[bos])
                if (BOSSE[bos].vida >= BOSSE[bos].vida_I / 2) {
                    for (let f = 0; f <= 4; f++) {
                        let obj = document.createElement('div');
                        let posiciones = { x: numC1(screen.availWidth / 2, screen.availWidth), y: numC1(0, screen.availHeight - 50) }
                        let objeto1 = {
                            obj,
                            tipo: { type: "CAC", TD: "nor" },
                            posicion: { x: posiciones.x, y: posiciones.y },
                            medidas: { h: 70, w: 100 },
                            vida: { vida: 30 },
                            vida_I: 30,
                            inicio: 0,
                            cod3: "tiburon",
                            creado: false,
                            eliminado: false,
                            pocicion_medio: { x: 0, y: 0 },
                            posicion_I: { x: posiciones.x, y: posiciones.y },
                            L: true,
                            contInt: 0,
                            contIntD: 0,
                        }

                        enemigosCAC.push(objeto1)
                        // console.log(objeto1)
                    }
                    console.log(enemigosCAC)
                }

                if (BOSSE[bos].vida <= BOSSE[bos].vida_I / 2 && !objPos.empe) {

                    objPos.empe = true
                    for (let f = 0; f <= 3; f++) {
                        let obj = document.createElement('div');
                        let posiciones = { x: numC1(0 + 20, screen.availWidth - 20), y: numC1(0 + 20, screen.availHeight - 50) }
                        let objeto1 = {
                            obj,
                            vel: numC1(1, 2),
                            iz: false,
                            he: false,
                            tipo: { type: "rebot", TD: "nor" },
                            posicion: { x: posiciones.x, y: posiciones.y },
                            medidas: { h: 125, w: 165 },
                            vida: { vida: 400 },
                            vida_I: 400,
                            inicio: 0,
                            cod3: "medusa2",
                            creado: false,
                            eliminado: false,
                            pocicion_medio: { x: 0, y: 0 },
                            posicion_I: { x: posiciones.x, y: posiciones.y },
                            L: true,
                            contInt: 0,
                            contIntD: 0,
                        }

                        rebot.push(objeto1)
                        enemigosDIS.push(objeto1)

                    }
                }



            }
        }
    }




}, tiempoDeInteraccion);










//funcion de ciclo de app (va aprox 60 fps)

function update() {


    //boss final

    // if (enemigosCAC.length >= 1) {
    //     for (en in enemigosCAC) {
    //         if (enemigosCAC[en].cod3 !== "tiburon") {

    //         }
    //     }

    // }

    if (objPos.empe && !coquiObj.menu) {
        console.log('hola')
        if (BOSSE.length >= 1) {
            for (i in BOSSE) {
                if (BOSSE[i].iz) {
                    BOSSE[i].obj.style.transform = `rotateY(180deg)`

                    BOSSE[i].posicion.x += +10
                    if (BOSSE[i].posicion.x + BOSSE[i].obj.clientWidth >= screen.availWidth) {
                        BOSSE[i].iz = false
                    }
                } else {
                    BOSSE[i].obj.style.transform = `rotateY(0deg)`

                    BOSSE[i].posicion.x += -10
                    if (BOSSE[i].posicion.x <= 0) {
                        BOSSE[i].iz = true
                    }
                }
                if (BOSSE[i].he) {
                    BOSSE[i].posicion.y += 1
                    if (BOSSE[i].posicion.y >= screen.availHeight) {
                        BOSSE[i].he = false;
                    }
                } else {
                    BOSSE[i].posicion.y += -1
                    if (BOSSE[i].posicion.y <= 0) {
                        BOSSE[i].he = true;
                    }
                }
                BOSSE[i].obj.style.left = `${BOSSE[i].posicion.x}px`
                BOSSE[i].obj.style.top = `${BOSSE[i].posicion.y}px`
                if (compararColl2(BOSSE[i].obj, { x: BOSSE[i].posicion.x, y: BOSSE[i].posicion.y })) {
                    coquiObj.vida += -1;
                }
            }

        }
        if (rebot.length >= 1) {

            for (e in rebot) {

                if (rebot[e].iz) {
                    rebot[e].posicion.x += +rebot[e].vel

                    if (rebot[e].posicion.x + rebot[e].obj.clientWidth >= screen.availWidth) {
                        rebot[e].iz = false
                    }
                } else {
                    rebot[e].posicion.x += -rebot[e].vel
                    if (rebot[e].posicion.x <= 0) {
                        rebot[e].iz = true
                    }
                }
                if (rebot[e].he) {
                    rebot[e].posicion.y += 1
                    if (rebot[e].posicion.y >= screen.availHeight) {
                        rebot[e].he = false;
                    }
                } else {
                    rebot[e].posicion.y += -1
                    if (rebot[e].posicion.y <= 0) {
                        rebot[e].he = true;
                    }
                }
                rebot[e].obj.style.left = `${rebot[e].posicion.x}px`
                rebot[e].obj.style.top = `${rebot[e].posicion.y}px`
                enemigosDIS[e].posicion.y = rebot[e].posicion.y
                enemigosDIS[e].posicion.x = rebot[e].posicion.x
                if (compararColl2(rebot[e].obj, { x: rebot[e].posicion.x, y: rebot[e].posicion.y })) {
                    coquiObj.vida += -1;
                }
            }
        }


    }



    if (BOSSE.length >= 1) {

        for (const bos in BOSSE) {
            console.log(BOSSE[bos].creado)
            if (!BOSSE[bos].creado && contador >= BOSSE[bos].inicio) {
                crearObjeto(BOSSE[bos])
                BOSSE[bos].creado = true;
            }
            if (!BOSSE[bos].eliminado && BOSSE[bos].vida <= 0) {
                contenedorP.removeChild(BOSSE[bos].obj)
                BOSSE.splice(bos, 1)
            }
        }

        if (BOSSE.length == 2) {
            if (BOSSE[0].creado && !BOSSE[0].eliminado && BOSSE[1].creado && !BOSSE[1].eliminado) {
                contVidaBOSS.style.display = 'inline';
                vidaBoss.style.width = ((BOSSE[0].vida + BOSSE[1].vida) / (BOSSE[0].vida_I.vida + BOSSE[1].vida_I.vida)) * 100 + '%';
            }

        } else if (BOSSE[0].creado && !BOSSE[0].eliminado) {
            contVidaBOSS.style.display = 'inline';
            vidaBoss.style.width = (BOSSE[0].vida / BOSSE[0].vida_I) * 100 + '%';
        } else {
            contVidaBOSS.style.display = 'none';

        }


    } else {
        contVidaBOSS.style.display = 'none';
    }


    //actualizar vida y aliento hojas


    vida.style.width = (coquiObj.vida * 202) / 100 * coquiObj.espacioVida + '%'
    hojasC.style.width = coquiObj.cargaAlientoHojal / 40 * 100 + '%'

    if (coquiObj.vida <= 0) {
        coquiObj.nivel = resC.nivel
        obj2 = {
            "nivel": 0,
            "cinematicas": true,
            "dificultad": coquiObj.dificultadJ,
            "niveles_Completos": resC.nivel < resC.niveles_Completos ? resC.niveles_Completos : resC.nivel,
            "niveles_J": {
                "mar": {
                    "N0": true,
                    "N1": resC.niveles_J.mar.N1,
                    "N2": resC.niveles_J.mar.N2,
                    "N3": resC.niveles_J.mar.N3,
                    "N4": resC.niveles_J.mar.N4,
                    "N5": resC.niveles_J.mar.N5,
                    "N6": resC.niveles_J.mar.N6,
                    "N7": resC.niveles_J.mar.N7,
                    "N8": resC.niveles_J.mar.N8,
                    "N9": resC.niveles_J.mar.N9,
                    "N10": resC.niveles_J.mar.N10
                }
            },
            "teclas": {
                "MD": res.MD,
                "MI": res.MI,
                "S": res.S,
                "D": res.D,
                "a1": res.a1,
                "a2": res.a2,
                "a3": res.a3

            }
        }
        // console.log(obj2)

        cambiar2(false, true)
    }


    if (coquiObj.correrApp && coquiObj.vida > 0) {

        if (teclasPre['Escape']) {
            coquiObj.menu = !coquiObj.menu;
            if (coquiObj.menu) {
                menu.style.display = 'flex';
            } else {
                menu.style.display = 'none';

            }
            delete teclasPre['Escape'];
        }


        if (!coquiObj.menu) {
            //eventos de jugador
            if (teclasPre[res.a1] && coquiObj.poder == true && !coquiObj.ataqueDisparo && !coquiObj.AlientoHojalDispar && !coquiObj.TV && !coquiObj.ALA) {
                coquiObj.seMueve = false
                coquiObj.salto = false;
                coquiObj.embestida = true;
                coquiObj.poder = false;
            }

            if (coquiObj.poder == false && !coquiObj.TV) {
                delete teclasPre[res.a1];
            }

            if (teclasPre[res.a2] && !coquiObj.embestida && coquiObj.poder2 && !coquiObj.AlientoHojalDispar && !coquiObj.TV && !coquiObj.ALA) {
                coquiObj.seMueve = false
                coquiObj.salto = false;
                coquiObj.poder2 = false;
                coquiObj.ataqueDisparo = true;
                coquiObj.disparado = false;

            }


            if (coquiObj.poder2 == false && !coquiObj.TV) {
                delete teclasPre[res.a2];
            }

            if (teclasPre[res.a3] && !coquiObj.embestida && !coquiObj.ataqueDisparo) {
                coquiObj.seMueve = false
                coquiObj.AlientoHojalDispar = true
            } else {
                coquiObj.AlientoHojalDispar = false
            }






            if (teclasPre[res.MI] && coquiObj.embestida == false && !coquiObj.ataqueDisparo && !coquiObj.ALA) {
                player.style.transform = 'rotateY(180deg)';
                // if (!coquiObj.TV || coquiObj.ALA) {
                //     player.style.height = '110px';
                //     player.style.width = '90px';

                // } else {
                //     player.style.width = '205px';
                //     player.style.height = '80px';

                // }
                if (coquiObj.x2 >= 100 && !coquiObj.ALA) {
                    coquiObj.x2 -= coquiObj.vel - 2;
                    coquiObj.seMueve = true
                    coquiObj.iz = true;
                } else if (coquiObj.x <= -5 && !coquiObj.ALA) {
                    coquiObj.x += coquiObj.vel;
                    coquiObj.seMueve = true;
                    coquiObj.iz = true;
                }
            }

            if (teclasPre[res.S] && !coquiObj.TV && !coquiObj.ALA) {
                if (coquiObj.salto == false) {
                    coquiObj.salto = true;
                    coquiObj.seMueve = false
                }
            } else if (teclasPre[res.S] && !coquiObj.ALA) {
                if (coquiObj.y + player.clientHeight < screen.availHeight) {
                    coquiObj.y += coquiObj.vel - 6
                }
            } else if (teclasPre[res.D] && coquiObj.TV && !coquiObj.ALA) {
                if (coquiObj.y > screen.availHeight - screen.availHeight) {
                    coquiObj.y -= coquiObj.vel - 6
                }
            }

            if (teclasPre[res.MD] && coquiObj.embestida == false && !coquiObj.ataqueDisparo && !coquiObj.ALA) {
                player.style.transform = 'rotateY(0deg)';
                // if (!coquiObj.TV || coquiObj.ALA) {
                //     player.style.height = '110px';
                //     player.style.width = '90px';

                // } else {
                //     player.style.height = '80px';
                //     player.style.width = '205px';

                // }
                if (coquiObj.x >= -(piso.clientWidth - screen.availWidth) || coquiObj.x > screen.availWidth) {
                    coquiObj.x -= coquiObj.vel;
                    coquiObj.seMueve = true;
                    coquiObj.iz = false;
                } else if (coquiObj.x2 <= screen.availWidth - 100) {
                    coquiObj.x2 += coquiObj.vel - 2;
                    coquiObj.iz = false;
                    coquiObj.seMueve = true;

                }
            }



            if (coquiObj.empezarC) {
                contador++
            }
            //asignar variables y sacar dependiendo del contador


            if (coquiObj.actGrav && !coquiObj.TV) {
                // console.log(contador)
                grav()
            }


            //algas 
            if (algas.length >= 1) {
                for (const al in algas) {
                    if (compararColl(algas[al].obj, { x: algas[al].posicion.x, y: algas[al].posicion.y }) && coquiObj.sePUede == true) {
                        setTimeout(() => {
                            console.log(player.classList[1])
                            if (player.classList[1] !== undefined) {
                                if (player.classList[1] == 'playerAtrapado') {
                                    player.classList.add('playerNadando')
                                    player.classList.remove('playerAtrapado')
                                    player.style.width = '205px';
                                    player.style.height = '80px';
                                    coquiObj.sePUede = true
                                    coquiObj.ALA = false

                                }
                            }
                        }, 2000);
                        coquiObj.ALA = true
                        console.log('atrapado')
                        player.classList.remove('playerNadando');
                        player.classList.add('playerAtrapado')
                        coquiObj.x2 = algas[al].posicion.x;
                        algas[al].contador += 1
                        if (algas[al].contador >= algas.length / 5 * 100) {
                            console.log('puedde salir ')
                            coquiObj.ALA = false
                            coquiObj.sePUede = false
                            player.classList.remove('playerAtrapado')
                            player.classList.add('playerNadando');
                            algas[al].contador = 0
                            setTimeout(() => {
                                console.log('puedde volver a entrar ')
                                coquiObj.sePUede = true
                            }, 2000);

                        }
                    } else {
                        player.classList.add('playerNadando')
                        player.style.width = '205px';
                        player.style.height = '80px';

                    }
                }
            } else if (coquiObj.TV) {
                player.classList.add('playerNadando')
                player.style.width = '205px';
                player.style.height = '80px';
                coquiObj.sePUede = true
                coquiObj.ALA = false

            }






            //particulas 

            if (particulas.length >= 1) {
                for (const part in particulas) {
                    particulas[part].posicion.y += particulas[part].vel
                    particulas[part].obj.style.bottom = particulas[part].posicion.y
                    if (particulas[part].posicion.y >= screen.availHeight) {
                        contenedorP.removeChild(particulas[part].obj)
                        particulas.splice(part, 1)
                    }
                }
            }


            //crea y elimina los objetos de tiempo
            for (const ob in objetos) {
                if (coquiObj.empezarC) {
                    coquiObj.actGrav = false
                    if (objetos[ob].inicio <= contador && objetos[ob].obj !== piso && !objetos[ob].creado) {
                        crearObjeto(objetos[ob])
                        objetos[ob].creado = true
                    } else if (objetos[ob].final <= contador && objetos[ob].obj !== piso && !objetos[ob].eliminado) {
                        objetos[ob].obj.style.display = 'none'
                        objetos[ob].eliminado = true;
                        objetos.splice(ob, 1)
                        coliciones.splice(ob, 1)
                    }
                    coquiObj.actGrav = true

                }
                // console.log(objetos , coliciones)
                if (!coquiObj.empezarC) {
                    let obj23 = coliciones.find(item => item.obj == objetos[ob].obj)
                    obj23.p.x = coquiObj.x + objetos[ob].posicion.x
                    objetos[ob].obj.style.left = coquiObj.x + objetos[ob].posicion.x + 'px';
                }
            }
            // console.log(coquiObj.x);
            // piso.style.left = coquiObj.x + 'px';            




            //creador y eliminador de enemigos y etc
            if (coquiObj.empezarC) {
                if (enemigosDIS.length >= 1) {

                    for (const en in enemigosDIS) {
                        if (coquiObj.x2 < enemigosDIS[en].posicion_I.x) {
                            enemigosDIS[en].obj.style.transform = 'rotateY(0deg)';
                        } else {
                            enemigosDIS[en].obj.style.transform = 'rotateY(180deg)';

                        }
                        enemigosDIS[en].obj.style.filter = `brightness(0.9)`
                        // console.log(enemigosDIS[en].vida.vida)
                        if (enemigosDIS[en].inicio <= contador && !enemigosDIS[en].creado) {
                            crearObjeto(enemigosDIS[en])
                            enemigosDIS[en].creado = true
                        }
                        // console.log(enemigosDIS[en].obj)
                        if (enemigosDIS[en].vida.vida <= 0 && !enemigosDIS[en].eliminado) {
                            if (enemigosDIS[en].tipo.TD == 'BOS') {
                                BOSSE.splice(0, 1)
                            }
                            enemigosDIS[en].obj.style.transition = '.3s';

                            enemigosDIS[en].obj.style.filter = ` brightness(0.0)`
                            enemigosDIS[en].obj.style.opacity = ` 0`


                            enemigosDIS[en].contIntD += 1
                            if (enemigosDIS[en].contIntD >= 10) {
                                contenedorP.removeChild(enemigosDIS[en].obj)
                                // console.log(en)
                                enemigosDIS.splice(en, 1)
                            }

                        }

                    }
                }
                if (enemigosCAC.length >= 1) {
                    for (const en in enemigosCAC) {
                        enemigosCAC[en].obj.style.filter = ` brightness(0.9)`
                        // console.log(enemigosDIS[en].vida.vida)
                        if (enemigosCAC[en].inicio <= contador && !enemigosCAC[en].creado) {
                            crearObjeto(enemigosCAC[en])
                            enemigosCAC[en].creado = true
                        }
                        //movimiento de enemigo CAC
                        if (enemigosCAC[en].L) {
                            enemigosCAC[en].contInt += 1
                            // console.log(enemigosCAC[en].contInt, enemigosCAC[en].posicion)
                            if (coquiObj.x2 < enemigosCAC[en].posicion.x) {
                                enemigosCAC[en].posicion.x -= 2
                                enemigosCAC[en].obj.style.transform = 'rotateY(0deg)';

                            } else {
                                enemigosCAC[en].posicion.x += 2
                                enemigosCAC[en].obj.style.transform = 'rotateY(180deg)';


                            }
                            if (coquiObj.y + (player.clientHeight / 2) > enemigosCAC[en].posicion.y) {
                                enemigosCAC[en].posicion.y += 2

                            } else if (coquiObj.y + (player.clientHeight / 2) == enemigosCAC[en].posicion.y) {

                            } else {
                                enemigosCAC[en].posicion.y -= 2

                            }
                            if (compararColl2(enemigosCAC[en].obj, { x: enemigosCAC[en].posicion.x, y: enemigosCAC[en].posicion.y })) {
                                enemigosCAC[en].contInt = 0
                                coquiObj.vida -= 1;
                                enemigosCAC[en].obj.style.transition = '.1s';
                                enemigosCAC[en].posicion.y = enemigosCAC[en].posicion_I.y
                                enemigosCAC[en].posicion.x = enemigosCAC[en].posicion_I.x
                                if (coquiObj.x2 < enemigosCAC[en].posicion_I.x) {

                                    enemigosCAC[en].obj.style.transform = 'rotateY(0deg)';
                                } else {
                                    enemigosCAC[en].obj.style.transform = 'rotateY(180deg)';

                                }
                                enemigosCAC[en].L = false
                            }
                            if (enemigosCAC[en].contInt >= 400) {
                                if (coquiObj.x2 < enemigosCAC[en].posicion_I.x) {

                                    enemigosCAC[en].obj.style.transform = 'rotateY(0deg)';
                                } else {
                                    enemigosCAC[en].obj.style.transform = 'rotateY(180deg)';

                                }
                                enemigosCAC[en].contInt = 0
                                enemigosCAC[en].L = false
                                enemigosCAC[en].obj.style.transition = '1s';
                                enemigosCAC[en].posicion.y = enemigosCAC[en].posicion_I.y
                                enemigosCAC[en].posicion.x = enemigosCAC[en].posicion_I.x

                            }
                        }




                        enemigosCAC[en].obj.style.left = `${enemigosCAC[en].posicion.x}px`;
                        enemigosCAC[en].obj.style.bottom = `${enemigosCAC[en].posicion.y}px`;



                        // console.log(enemigosDIS[en].obj)
                        if (enemigosCAC[en].vida.vida <= 0 && !enemigosCAC[en].eliminado) {
                            if (enemigosCAC[en].tipo.TD == 'BOS') {
                                BOSSE.splice(0, 1)
                            }

                            enemigosCAC[en].obj.style.transition = '.3s';

                            enemigosCAC[en].obj.style.filter = ` brightness(0.0)`
                            enemigosCAC[en].obj.style.opacity = ` 0`

                            enemigosCAC[en].contIntD += 1
                            if (enemigosCAC[en].contIntD >= 10) {
                                contenedorP.removeChild(enemigosCAC[en].obj)
                                // console.log(en)
                                enemigosCAC.splice(en, 1)
                            }
                        }

                    }
                }


            }

            //moverDisparos

            // console.log(contador)

            if (disparosEnemigos.length >= 1 && !coquiObj.creandoDis) {
                // console.log(disparosEnemigos)
                for (const dis in disparosEnemigos) {
                    disparosEnemigos[dis].empezarConteo += 1
                    if (compararColl2(disparosEnemigos[dis].obj, { x: disparosEnemigos[dis].posicion.x, y: disparosEnemigos[dis].posicion.y })) {
                        coquiObj.vida -= 1;
                        contenedorP.removeChild(disparosEnemigos[dis].obj);
                        disparosEnemigos.splice(dis, 1)
                    } else if (disparosEnemigos[dis].empezarConteo >= 400) {
                        contenedorP.removeChild(disparosEnemigos[dis].obj);
                        disparosEnemigos.splice(dis, 1)
                    } else {

                        // console.log(disparosEnemigos[dis].direcion, disparosEnemigos[dis].posicion)
                        disparosEnemigos[dis].obj.style.left = disparosEnemigos[dis].posicion.x
                        disparosEnemigos[dis].obj.style.bottom = disparosEnemigos[dis].posicion.y



                        if (disparosEnemigos[dis].direcion.x === 'R') {
                            disparosEnemigos[dis].posicion.x += 2
                        } else
                            if (disparosEnemigos[dis].direcion.x == 'L') {
                                disparosEnemigos[dis].posicion.x -= 2
                            }
                        if (disparosEnemigos[dis].posicion.y < disparosEnemigos[dis].direcion.y + (player.clientHeight / 2)) {
                            disparosEnemigos[dis].posicion.y += 2
                        } else if (disparosEnemigos[dis].posicion.y > disparosEnemigos[dis].direcion.y + (player.clientHeight / 2)) {
                            disparosEnemigos[dis].posicion.y -= 2
                        }


                    }






                }

            }




            player.style.left = coquiObj.x2;
            player.style.bottom = coquiObj.y;



            //funcion de gravedad en el disparoCatapulta
            if (disparos.length >= 1) {
                for (const bol in disparos) {
                    //en y
                    disparos[bol].yvel = disparos[bol].yvel + disparos[bol].gravedad
                    disparos[bol].posicion.y = disparos[bol].posicion.y + (disparos[bol].yvel)
                    //en x
                    if (disparos[bol].der) {
                        disparos[bol].posicion.x = disparos[bol].posicion.x + disparos[bol].xvel;
                    } else {
                        disparos[bol].posicion.x = disparos[bol].posicion.x - disparos[bol].xvel;
                    }

                    //asignar variables
                    disparos[bol].obj.style.bottom = disparos[bol].posicion.y;
                    disparos[bol].obj.style.left = disparos[bol].posicion.x;

                    //eliminar elemento
                    if (enemigosDIS.length >= 1 && disparos.length >= 1) {
                        for (const en in enemigosDIS) {
                            try {
                                if (compararColl3(enemigosDIS[en].obj, { x: enemigosDIS[en].posicion.x, y: enemigosDIS[en].posicion.y }, disparos[bol].posicion) && enemigosDIS[en].creado) {
                                    enemigosDIS[en].obj.style.filter = ` brightness(0.3)`

                                    enemigosDIS[en].vida.vida -= coquiObj.dañoBola
                                    contenedorP.removeChild(disparos[bol].obj)
                                    disparos.splice(bol, 1)

                                } else if (disparos[bol].posicion.y <= -100) {
                                    contenedorP.removeChild(disparos[bol].obj)
                                    disparos.splice(bol, 1)
                                }
                            } catch (error) {
                                console.log(error)
                            }

                        }

                    }
                    if (enemigosCAC.length >= 1 && disparos.length >= 1) {
                        for (const en in enemigosCAC) {

                            try {
                                console.log(enemigosCAC[en].vida.vida, coquiObj.dañoBola)
                                if (compararColl3(enemigosCAC[en].obj, { x: enemigosCAC[en].posicion.x, y: enemigosCAC[en].posicion.y }, disparos[bol].posicion) && enemigosCAC[en].creado) {

                                    enemigosCAC[en].obj.style.filter = ` brightness(0.3)`

                                    enemigosCAC[en].vida.vida -= coquiObj.dañoBola

                                    contenedorP.removeChild(disparos[bol].obj)
                                    disparos.splice(bol, 1)

                                } else if (disparos[bol].posicion.y <= -100) {
                                    contenedorP.removeChild(disparos[bol].obj)
                                    disparos.splice(bol, 1)
                                }
                            } catch (error) {
                                console.log(error)
                            }


                        }
                    }


                    // console.log(disparos[bol])
                }
            }


            //disparoHojil
            if (disparosHojasC.length >= 1) {
                for (const bol in disparosHojasC) {
                    //en x
                    if (disparosHojasC[bol].der) {
                        disparosHojasC[bol].posicion.x = disparosHojasC[bol].posicion.x + disparosHojasC[bol].xvel;
                        disparosHojasC[bol].xvel -= .1
                    } else {
                        disparosHojasC[bol].obj.style.transform = 'rotateY(180deg)';
                        disparosHojasC[bol].xvel -= .1
                        disparosHojasC[bol].posicion.x = disparosHojasC[bol].posicion.x - disparosHojasC[bol].xvel;
                    }

                    //asignar variables
                    disparosHojasC[bol].obj.style.left = disparosHojasC[bol].posicion.x;

                    //eliminar elemento
                    if (enemigosDIS.length >= 1 && disparosHojasC.length >= 1) {
                        for (const en in enemigosDIS) {
                            if (enemigosDIS.length >= 1 && disparosHojasC.length >= 1) {

                                try {
                                    if (compararColl3(enemigosDIS[en].obj, { x: enemigosDIS[en].posicion.x, y: enemigosDIS[en].posicion.y }, disparosHojasC[bol].posicion) && enemigosDIS[en].creado) {
                                        enemigosDIS[en].obj.style.filter = `brightness(0.3)`
                                        enemigosDIS[en].vida.vida -= coquiObj.dañoHojas
                                        console.log('esto es vida :', enemigosDIS[en].vida.vida)
                                        console.log(enemigosDIS[en])


                                    } else if (disparosHojasC[bol].xvel <= 0) {
                                        disparosHojasC.splice(bol, 1)
                                    }
                                } catch (error) {
                                    // console.log(error)
                                }


                            }

                        }
                    }
                    if (enemigosCAC.length >= 1 && disparosHojasC.length >= 1) {
                        for (const en in enemigosCAC) {
                            if (enemigosCAC.length >= 1 && disparosHojasC.length >= 1) {
                                try {
                                    if (compararColl3(enemigosCAC[en].obj, { x: enemigosCAC[en].posicion.x, y: enemigosCAC[en].posicion.y }, disparosHojasC[bol].posicion) && enemigosCAC[en].creado) {
                                        enemigosCAC[en].obj.style.filter = `brightness(0.3)`
                                        enemigosCAC[en].vida.vida -= coquiObj.dañoHojas
                                        console.log('esto es vida :', enemigosCAC[en].vida.vida)

                                        i

                                    } else if (disparosHojasC[bol].xvel <= 0) {
                                        disparosHojasC.splice(bol, 1)
                                    }
                                } catch (error) {
                                    console.log(error)
                                }


                            }

                        }
                    }

                    if (BOSSE.length >= 1 && disparosHojasC.length >= 1) {
                        for (const en in BOSSE) {
                            if (BOSSE.length >= 1 && disparosHojasC.length >= 1) {
                                try {
                                    if (compararColl3(BOSSE[en].obj, { x: BOSSE[en].posicion.x, y: BOSSE[en].posicion.y }, disparosHojasC[bol].posicion) && BOSSE[en].creado) {
                                        BOSSE[en].obj.style.filter = ` brightness(0.3)`

                                        BOSSE[en].vida -= coquiObj.dañoHojas
                                        console.log(BOSSE[en].vida)

                                    } else { BOSSE[en].obj.style.filter = ` brightness(1.0)` }
                                    if (disparosHojasC[bol].xvel <= 0) {
                                        disparosHojasC.splice(bol, 1)
                                    }
                                } catch (error) {
                                    console.log(error)
                                }


                            }

                        }
                    }



                    // console.log(disparosHojasC[bol])
                }
            }













            //administrador de animaciones

            if (coquiObj.embestida == false && !coquiObj.TV) {
                player.style.width = '90px';
            }
            // else if (coquiObj.TV || !coquiObj.ALA) {
            //     player.style.width = '205px'
            //     player.style.height = '80px'
            // }

            if (coquiObj.embestida == true && !coquiObj.TV) {
                player.classList.add('PlayerEmbestida')
                embestir()
                setTimeout(() => {
                    player.style.width = '160px'
                }, 750);
                setTimeout(() => {
                    coquiObj.embestida = false
                    setTimeout(() => {
                        coquiObj.poder = true
                    }, 5000);
                    player.style.width = '90px'

                }, 1500);
            } else if (coquiObj.ataqueDisparo && !coquiObj.TV) {
                coquiObj.poder2 = false
                player.classList.add('PlayerAHojasBol')

                let objDis = {
                    posicion: {
                        x: coquiObj.x2 + (player.clientWidth / 2),
                        y: coquiObj.y + player.clientHeight
                    },
                    der: !coquiObj.iz,
                    yvel: 20,
                    xvel: 10,
                    gravedad: -.8,
                    daño: 20
                }



                setTimeout(() => {
                    coquiObj.ataqueDisparo = false;
                    dispararBola(objDis);

                    coquiObj.seMueve = false;
                    setTimeout(() => {
                        coquiObj.poder2 = true
                    }, 1200);
                }, 450);


            } else if (coquiObj.AlientoHojalDispar && coquiObj.cargaAlientoHojal >= 1) {

                if (!coquiObj.TV) {
                    player.classList.add('PlayerAHojasAliento')
                }
                //  if (!coquiObj.ALA) {
                //     player.style.width = '205px'
                //     player.style.height = '80px'

                // } else {
                //     player.style.height = '110px';
                //     player.style.width = '90px'

                // }

                let objDis = {
                    posicion: {
                        x: coquiObj.x2 + (player.clientWidth / 2),
                        y: coquiObj.y + (Math.random() * player.clientHeight)
                    },
                    der: !coquiObj.iz,
                    xvel: 10,
                    daño: .1
                }
                setTimeout(() => {
                    AlientoHojal(objDis)

                }, 10);
                // console.log('creado')

            } else if (coquiObj.salto && coquiObj.embestida == false && !coquiObj.TV) {
                coquiObj.seMueve = false
                player.setAttribute('class', 'Player PlayerSalto')
                setTimeout(() => {
                    coquiObj.salto = false;
                    if (coquiObj.cayo) {
                        coquiObj.Yvel = 20;
                        coquiObj.gravedad = -.8;
                    }
                }, 300);
            } else {
                if (coquiObj.seMueve && !coquiObj.salto && coquiObj.embestida == false && !coquiObj.TV) {
                    player.setAttribute('class', 'player PlayerMovimiento')
                } else {
                    player.classList.remove('PlayerMovimiento');
                    player.classList.remove('PlayerSalto');
                    player.classList.remove('PlayerEmbestida');
                    player.classList.remove('PlayerAHojasBol');
                    player.classList.remove('PlayerAHojasAliento');

                }
            }
        }









        //final del nivel 
        // console.log(bossFinal[0])

        // if (coquiObj.empezarC) {
        //     if (coquiObj.tiempoNeed <= contador && BOSSE.length <= 0 && bossFinal.length <= 0 || BOSSE.length <= 0 && bossFinal.length <= 0) {
        //         coquiObj.tiempoT = true
        //     }

        if (coquiObj.tiempoT) {
            for (const en in enemigosCAC) {
                enemigosCAC[en].vida = 0
            }
            for (const en in enemigosDIS) {
                enemigosDIS[en].vida = 0
            }
            coquiObj.empezarC = false
            coquiObj.actGrav = false;
            coquiObj.correrApp = false
            coquiObj.nivel = resC.nivel
            switch (resC.nivel) {
                case 1:
                    resC.niveles_J.mar.N1 = true
                    break;
                case 2:
                    resC.niveles_J.mar.N2 = true
                    break;
                case 3:
                    resC.niveles_J.mar.N3 = true
                    break;
                case 4:
                    resC.niveles_J.mar.N4 = true
                    break;
                case 5:
                    resC.niveles_J.mar.N5 = true
                    break;
                case 6:
                    resC.niveles_J.mar.N6 = true
                    break;
                case 7:
                    resC.niveles_J.mar.N7 = true
                    break;
                case 8:
                    resC.niveles_J.mar.N8 = true
                    break;
                case 9:
                    resC.niveles_J.mar.N9 = true
                    break;
                case 10:
                    resC.niveles_J.mar.N10 = true
                    break;
                default:
                    break;
            }
            obj2 = {
                "nivel": 0,
                "cinematicas": true,
                "dificultad": coquiObj.dificultadJ,
                "niveles_Completos": resC.nivel < resC.niveles_Completos ? resC.niveles_Completos : resC.nivel,
                "niveles_J": {
                    "mar": {
                        "N0": true,
                        "N1": resC.niveles_J.mar.N1,
                        "N2": resC.niveles_J.mar.N2,
                        "N3": resC.niveles_J.mar.N3,
                        "N4": resC.niveles_J.mar.N4,
                        "N5": resC.niveles_J.mar.N5,
                        "N6": resC.niveles_J.mar.N6,
                        "N7": resC.niveles_J.mar.N7,
                        "N8": resC.niveles_J.mar.N8,
                        "N9": resC.niveles_J.mar.N9,
                        "N10": resC.niveles_J.mar.N10
                    }
                },
                "teclas": {
                    "MD": res.MD,
                    "MI": res.MI,
                    "S": res.S,
                    "D": res.D,
                    "a1": res.a1,
                    "a2": res.a2,
                    "a3": res.a3

                }
            }
            // console.log(obj2)
            setTimeout(() => {
                cambiar2(true, false);
            }, 2000);

        }


        // }


    }


    requestAnimationFrame(update)


};






// generador de mapa con archivo txt
async function crearWorld(mapa) {

    let codigoCrud;


    await fetch(mapa)
        .then(response => response.text())
        .then(res => codigoCrud = res);

    console.log(codigoCrud)

    let codigo1 = codigoCrud.split(';')

    // console.log(codigo1)

    // let scri2 = /\w+\$\{"x":-?\d+,"y":-?\d+\}\$\{"h":\d+,"w":\d+\}(\${})?(\${"PI":(true|false)})?/;


    for (const arr in codigo1) {
        if (JSON.parse(codigo1[0]).met == "T") {
            coquiObj.empezarC = true

            timepoEtc = 1000
            coquiObj.TV = false
            contador = 0
            let scri1 = /New_obj(.)/;
            let scri2 = /Enemy(.)/;
            let scri3 = /Fin(.)/;
            let scri1_2 = /\w+\$\{"x":-?\d+,"y":-?\d+\}\$\{"h":\d+,"w":\d+\}\$\d+\$\d+\${"coll":(true|false)}/;
            // let scri2_2 = / [a-z]\$\{"type":"(CAC|LD)"\,"TD": "(las|cat)"\}\$\{"x":(\d+),"y":(\d+)\}\$\{"h":(\d+),"w":(\d+)}\$\{"vida": (\d+)}\$(\d+)/;
            let scri2_2 = /\w+\$\{"type":"([^"]+)"\,"TD": "([^"]+)"\}\$\{"x":(\d+),"y":(\d+)\}\$\{"h":(\d+),"w":(\d+)}\$\{"vida": (\d+)}\$(\d+)/;
            let scri3_2 = /\d+/
            if (scri1.test(codigo1[arr])) {
                let codigo2 = codigo1[arr].match(scri1_2)
                console.log(codigo2)

                let codigo3 = codigo2[0].split('$')


                let objeto1 = {
                    posicion: JSON.parse(codigo3[1]),
                    medidas: JSON.parse(codigo3[2]),
                    inicio: parseInt(codigo3[3]),
                    final: parseInt(codigo3[4]),
                    coll: JSON.parse(codigo3[5]).coll,
                    cod3: codigo3[0],
                    creado: false,
                    eliminado: false
                    // PI: JSON.parse(codigo3[3])
                }

                let obj = document.createElement('div')

                console.log(objeto1.inicio)
                coliciones.push({ obj, coll: objeto1.coll, p: { x: objeto1.posicion.x, y: objeto1.posicion.y } })
                objetos.push({ ...objeto1, obj })


            } else if (scri2.test(codigo1[arr])) {
                let codigo2 = codigo1[arr].match(scri2_2);


                let codigo3 = codigo2[0].split('$');

                let obj = document.createElement('div');


                let objeto1 = {
                    obj,
                    tipo: JSON.parse(codigo3[1]),
                    posicion: { x: JSON.parse(codigo3[2]).x, y: JSON.parse(codigo3[2]).y > screen.availHeight ? screen.availHeight : JSON.parse(codigo3[2]).y },
                    medidas: { w: JSON.parse(codigo3[3]).w > screen.availWidth ? screen.availWidth : JSON.parse(codigo3[3]).w, h: JSON.parse(codigo3[3]).h > screen.availHeight ? screen.availHeight : JSON.parse(codigo3[3]).h },
                    vida: JSON.parse(codigo3[4]),
                    vida_I: JSON.parse(codigo3[4]),
                    inicio: parseInt(codigo3[5]),
                    cod3: codigo3[0],
                    creado: false,
                    eliminado: false,
                    pocicion_medio: { x: 0, y: 0 },
                    posicion_I: JSON.parse(codigo3[2]),
                    L: false,
                    contInt: 0,
                    contIntD: 0,
                    // PI: JSON.parse(codigo3[3])
                }
                // console.log(objeto1)

                console.log(objeto1.inicio)
                if (objeto1.tipo.type == 'DIS') {

                    enemigosDIS.push(objeto1)

                } else if (objeto1.tipo.type == 'CAC') {

                    enemigosCAC.push(objeto1)

                } else if (objeto1.tipo.type == 'DF') {

                    enemigosDIS.push(objeto1)
                    enemigosCAC.push(objeto1)

                }
                if (objeto1.tipo.TD == 'BOS') {
                    BOSSE.push(objeto1)
                }


            } else if (scri3.test(codigo1[arr])) {
                let codigo2 = codigo1[arr].match(scri3_2)
                // console.log(codigo2)
                coquiObj.tiempoNeed = parseInt(codigo2)
                // console.log(coquiObj.tiempoNeed)
            }


        }







        //por tienpo pero sin gravedad

        if (JSON.parse(codigo1[0]).met == "TV") {
            coquiObj.empezarC = true

            // player.style.width = '205px'
            // player.style.height = '80px'
            timepoEtc = 600
            coquiObj.TV = true
            contador = 0
            let scri1 = /New_obj(.)/;
            let scri2 = /Enemy(.)/;
            let scri4 = /Final_Boss(.)/;
            let scri3 = /Fin(.)/;
            let scri1_4 = /tiburon\$\d+\$\d+\$\{"x":\d+,"y":\d+\}\$\{"h":\d+,"w":\d+\}/;
            let scri1_2 = /\w+\$\{"x":-?\d+,"y":-?\d+\}\$\{"h":\d+,"w":\d+\}\$\d+\$\d+\${"coll":(true|false)}/;
            // let scri2_2 = / [a-z]\$\{"type":"(CAC|LD)"\,"TD": "(las|cat)"\}\$\{"x":(\d+),"y":(\d+)\}\$\{"h":(\d+),"w":(\d+)}\$\{"vida": (\d+)}\$(\d+)/;
            let scri2_2 = /\w+\$\{"type":"([^"]+)"\,"TD": "([^"]+)"\}\$\{"x":(\d+),"y":(\d+)\}\$\{"h":(\d+),"w":(\d+)}\$\{"vida": (\d+)}\$(\d+)/;
            let scri3_2 = /\d+/
            if (scri1.test(codigo1[arr])) {
                let codigo2 = codigo1[arr].match(scri1_2)
                // console.log(codigo2)

                let codigo3 = codigo2[0].split('$')


                let objeto1 = {
                    posicion: JSON.parse(codigo3[1]),
                    medidas: JSON.parse(codigo3[2]),
                    inicio: parseInt(codigo3[3]),
                    final: parseInt(codigo3[4]),
                    coll: JSON.parse(codigo3[5]).coll,
                    cod3: codigo3[0],
                    creado: false,
                    eliminado: false
                    // PI: JSON.parse(codigo3[3])
                }
                let obj = document.createElement('div')

                // console.log(codigo3[0])
                if (objeto1.cod3 == "alguita") {
                    algas.push({ ...objeto1, obj, contador: 0 })
                    objetos.push({ ...objeto1, obj })
                }


                // console.log(objeto1.inicio)
                coliciones.push({ obj, coll: objeto1.coll, p: { x: objeto1.posicion.x, y: objeto1.posicion.y } })
                objetos.push({ ...objeto1, obj })
                coquiObj.empezarC = true


            } else if (scri4.test(codigo1[arr])) {
                console.log(codigo1[arr]);


                let codigo2 = codigo1[arr].match(scri1_4);
                console.log(codigo2)

                let codigo3 = codigo2[0].split('$');
                console.log(codigo3)

                let obj = document.createElement('div');


                let objeto1 = {
                    obj,
                    posicion: { x: JSON.parse(codigo3[3]).x, y: JSON.parse(codigo3[3]).y > screen.availHeight ? screen.availHeight : JSON.parse(codigo3[3]).y },
                    medidas: { w: JSON.parse(codigo3[4]).w > screen.availWidth ? screen.availWidth : JSON.parse(codigo3[4]).w, h: JSON.parse(codigo3[4]).h > screen.availHeight ? screen.availHeight : JSON.parse(codigo3[4]).h },
                    vida: JSON.parse(codigo3[1]),
                    vida_I: JSON.parse(codigo3[1]),
                    cod3: codigo3[0],
                    posicion_I: JSON.parse(codigo3[2]),
                    inicio: parseInt(codigo3[2]),
                    creado: false,
                    eliminado: false,
                    L: false,
                    contInt: 0,
                    contIntD: 0,
                    he: false,
                    iz: false
                    // PI: JSON.parse(codigo3[3])
                };
                console.log(objeto1)


                bossFinal.push(objeto1)
                BOSSE.push(objeto1);


                // if(objeto1.cod3 == "tiburon"){
                //     enemigosDIS.push(objeto1)

                // }

                // console.log(bossFinal)
            } else if (scri2.test(codigo1[arr])) {
                let codigo2 = codigo1[arr].match(scri2_2);


                let codigo3 = codigo2[0].split('$');

                let obj = document.createElement('div');


                let objeto1 = {
                    obj,
                    tipo: JSON.parse(codigo3[1]),
                    posicion: { x: JSON.parse(codigo3[2]).x, y: JSON.parse(codigo3[2]).y > screen.availHeight ? screen.availHeight : JSON.parse(codigo3[2]).y },
                    medidas: { w: JSON.parse(codigo3[3]).w > screen.availWidth ? screen.availWidth : JSON.parse(codigo3[3]).w, h: JSON.parse(codigo3[3]).h > screen.availHeight ? screen.availHeight : JSON.parse(codigo3[3]).h },
                    vida: JSON.parse(codigo3[4]),
                    vida_I: JSON.parse(codigo3[4]),
                    inicio: parseInt(codigo3[5]),
                    cod3: codigo3[0],
                    creado: false,
                    eliminado: false,
                    pocicion_medio: { x: 0, y: 0 },
                    posicion_I: JSON.parse(codigo3[2]),
                    L: false,
                    contInt: 0,
                    contIntD: 0,
                    // PI: JSON.parse(codigo3[3])
                }
                // console.log(objeto1)


                console.log(objeto1.inicio)
                if (objeto1.tipo.type == 'DIS') {

                    enemigosDIS.push(objeto1)

                } else if (objeto1.tipo.type == 'CAC') {

                    enemigosCAC.push(objeto1)

                } else if (objeto1.tipo.type == 'DF') {

                    enemigosDIS.push(objeto1)
                    enemigosCAC.push(objeto1)

                }
                if (objeto1.tipo.TD == 'BOS') {
                    BOSSE.push(objeto1)
                }


            } else if (scri3.test(codigo1[arr])) {
                let codigo2 = codigo1[arr].match(scri3_2)
                // console.log(codigo2)
                coquiObj.tiempoNeed = parseInt(codigo2)
                // console.log(coquiObj.tiempoNeed)
                coquiObj.empezarC = true;

            }
        }








        // por largo


        if (JSON.parse(codigo1[0]).met == "L") {
            timepoEtc = 1000
            coquiObj.TV = false
            coquiObj.empezarC = false
            let scri1 = /New_obj(.)/;
            let scri1_2 = /\w+\$\{"x":\d+,"y":\d+\}\$\{"h":\d+,"w":\d+\}\$\{"PORT":\[(true|false),(-?[0-9]+|"[0-9]+C")\],"coll":(true|false) \}/;


            let scri2 = /Enemy(.)/;
            if (scri1.test(codigo1[arr])) {
                let codigo2 = codigo1[arr].match(scri1_2)
                let obj = document.createElement('div')
                console.log(codigo2)

                let codigo3 = codigo2[0].split('$')
                console.log(JSON.parse(codigo3[3]))
                let objeto1 = {
                    obj,
                    posicion: JSON.parse(codigo3[1]),
                    medidas: JSON.parse(codigo3[2]),
                    cod3: codigo3[0],
                    creado: false,
                    Coll: JSON.parse(codigo3[3]).coll,
                    PORT: JSON.parse(codigo3[3]).PORT
                    // PI: JSON.parse(codigo3[3]).PI
                }

                coliciones.push({ obj, cod3: objeto1.cod3, coll: objeto1.Coll, PORT: objeto1.PORT, p: { x: objeto1.posicion.x, y: objeto1.posicion.y } })
                objetos.push({ ...objeto1 })
                crearObjeto(objeto1)

            }
        }

    }


}

function crearObjeto(objeto1) {
    // console.log(objeto1)
    objeto1.obj.setAttribute('class', objeto1.cod3)
    objeto1.obj.style.height = objeto1.medidas.h
    objeto1.obj.style.width = objeto1.medidas.w
    objeto1.obj.style.position = 'absolute';
    objeto1.obj.style.left = objeto1.posicion.x
    objeto1.obj.style.bottom = objeto1.posicion.y
    contenedorP.appendChild(objeto1.obj)
}

document.addEventListener('DOMContentLoaded', () => {
    coquiObj.actGrav = true;
    // console.log(objetos)
})






requestAnimationFrame(update)



