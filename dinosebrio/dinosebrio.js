let dino = document.getElementById('dino');
let contenedor = document.getElementById('contenedor');
let d = false;
let i = false;
let dd = false;
let px = 100;
let py = 30;
document.addEventListener('keydown', iz);
document.addEventListener('keydown', ar);
document.addEventListener('keydown', de);
document.addEventListener('keyup', t);
let pegar2 = new Audio('SDis.wav');
let ganar = new Audio('ganar2.wav');
let perder = new Audio('perder.wav');
let saltar = new Audio('saltar.wav');
let musica = new Audio('musicaEpic.aac');
let disparar1 = new Audio('disparar.wav');
let pegar1 = new Audio('pegar.wav');


pegar1.volume = .9;
pegar2.volume = .9;
ganar.volume = .9;
perder.volume = .9;
saltar.volume = .9;
disparar1.volume = .9;

musica.volume = .4;

let Lado = false;
musica.play()


function iz (e){
    
    console.log(e.key);
    if(e.key == 'ArrowLeft'){ 
        Lado = false;
        i = true;
        px--;
        px--;
        dino.style.left = px + 'px';
        dino.style.transform = 'rotateY(180deg)';
        setTimeout(() => {
            i = false;   
      },1000);
      if(px <= 0){
        document.removeEventListener('keydown', iz);
      }if(px < 1050){
        document.addEventListener('keydown', de);
      };
    };
};

function de (e){
    if(e.key == 'ArrowRight'){
        Lado = true;
        d = true;
        px++;
        px++;
        dino.style.left = px + 'px';
        dino.style.transform = 'rotateY(0deg)';
        setTimeout(() => {
            d = false; 
            console.log('d = false')
      },1000);
      if(px >= 1050){
        document.removeEventListener('keydown', de);
      };if(px > 0) {
        document.addEventListener('keydown', iz);
      };
    };
};

function t (e) {
     setTimeout((e) => {
          d = false;
          i = false;   
    },2000);
};


function ar (e){
    dd = false;
    if(e.key == 'ArrowUp'){
        saltar.play();
    dino.style.backgroundPosition = 'center';
    dino.style.backgroundSize = '100%';
    dino.style.height = 180 + 'px';
    dino.style.background = 'url(dinosebrio_jump.png)';
    document.removeEventListener('keydown',ar);
    document.removeEventListener('keydown',iz);
    document.removeEventListener('keydown',de);
        if(d == true){
            let intervaloSX1 = setInterval(() => {
                px++;
                dino.style.left = px + 'px';
                if(dd == true){
                    clearInterval(intervaloSX1);
                };  
              if(px >= 1100){
                clearInterval(intervaloSX1);
            }
            }, 1);

        }
        if(i == true){
            let intervaloSX2 = setInterval(() => {
                px--;
                dino.style.left = px + 'px';
                if(dd == true){
                    clearInterval(intervaloSX2);
                };           
                if( px <= 0){
                    clearInterval(intervaloSX2);
            }
            }, 1);                

        }
        let intervaloS1 = setInterval(() => {
           py++;
           dino.style.bottom = py + 'px';
           if(py >= 150){
            clearInterval(intervaloS1);
            let intervaloS2 = setInterval(() => {
                py--;
                dino.style.bottom = py + 'px';

            if(py<=30){
                clearInterval(intervaloS2);
                dd = true;
                document.addEventListener('keydown', iz);
                document.addEventListener('keydown', ar);
                document.addEventListener('keydown', de);
    dino.style.background = 'url(dinosebrio_quiet.png)';
    dino.style.backgroundSize = '100%';
    dino.style.height = 150 + 'px';
    dino.style.backgroundPosition = 'center';
            };
            }, 0.1);
           };
        }, 0.1);
    };
};

//enemigos
let vidaP = document.getElementById('vidaP');
let body = document.getElementById('body');
let vida =  1000;
let energia = 100;
let piso = document.getElementById('piso');
let pisoMalo = false;
let escudo = false;
let vidaDE = 1500;

pisoMal()

function pisoMal(){
    setTimeout(() => {
       pisoMalo = true;
       piso.style.backgroundImage = 'url(tierraMala.png)'; 
    },10);
    setTimeout(() => {
        pisoMalo = false;
        piso.style.backgroundImage = 'url(tierra.png)'; 
     },7000);
    let tiempoPM = setTimeout(() => {
        pisoMal() 
     },15900);
     if(vidaDE <= 0){
        clearTimeout(tiempoPM);
     }
}



let intervaloVida =setInterval(() => {
        if(pisoMalo == false || pisoMalo == true && escudo == true){
            vida++;
            vidaDE++;
        }
 }, 500);

 setInterval(() => {
    if(pisoMalo == true && py == 30 && vida > 0 && escudo == false){
        vida--;   
    if(vida <= 500 && vida > 350){

        body.style.boxShadow = 'inset 0px 0px 8px 0px red';
    }else
    if(vida <= 350 && vida >250){

        body.style.boxShadow = 'inset 0px 0px 18px 10px red';
    }else    
    if(vida <= 250 && vida >= 0 ){
        body.style.boxShadow = 'inset 0px 0px 38px 20px red';
        
    }else{body.style.boxShadow = 'inset 0px 0px 0px 0px red';}    
    if(vida <= 0 ){
        perder.play();
        dino.remove()
        clearInterval(intervaloScore);
        clearInterval(intervaloEnemi);
        clearInterval(intervaloVida);
    }
    }
 }, 50);

//score
let score = 0;

setInterval(() => {
    vidaP.innerText = 'vida:' + vida;
}, 1);




let p = document.getElementById('score');
let intervaloScore = setInterval(() => {
    score++;
    p.innerText = 'puntos:' + score;  
    
}, 1000);


//enemigo Dino

let dinoE = document.getElementById('dinoE');

let pyDE = 30;
let pxDE = 1000;
let bolaG = false;
let Pbola= pxDE;
let distancia;
let pegar = false;
let acercar =true;
let TA = true;
let Te = true;
let pme;
let pmey = 500;
let pmei = false;
let met = 0;

let intervaloEnemi =setInterval(() => {
        distancia = pxDE - px;
        if(distancia <= 600 && bolaG == false && acercar == false && distancia >=310 ){
            Dbola()
            dinoE.style.transform = 'rotateY(180deg)'
            disparar1.play();
        }
        if(distancia >= 500 && acercar == true && TA == true && distancia <=1000 ){
            acercarDE()
            dinoE.style.transform = 'rotateY(180deg)'
        }

        if(distancia <= 300 && pegar == false && distancia >= 0 && escudo == false && distancia >= 0){
            pegarD()
            pegar1.play();
            dinoE.style.transform = 'rotateY(180deg)'
        }
        if(distancia <= -5 && distancia >= -300 && pegar == false && escudo == false ){
            pegarD2()
            dinoE.style.transform = 'rotateY(0deg)'
            pegar1.play();
        };
        if(distancia <= -320 && acercar == true && TA == true && distancia >= -980){
            acercarDE2()
            dinoE.style.transform = 'rotateY(0deg)'
        }
        if(distancia >= -800 && bolaG == false && acercar == false && distancia <= -310){
            Dbola2()
            dinoE.style.transform = 'rotateY(0deg)'
            disparar1.play();
        }
        if(pmei == false && escudo == false){
            meteorito()
            pmei = true;
            if(met >= 15){
                recar()
            }
        }
}, 10);





function meteorito(){
    pme = px;
    let bola = document.createElement('div');
    bola.setAttribute('id', 'bola');
    contenedor.appendChild(bola);
    bola.style.bottom = pmey + 'px';
    bola.style.left = pme + 'px';
    bola.style.transform = 'scale(2)';
    bola.style.transform = 'rotate(-90deg)';
   let intervaloMetiorito =  setInterval(() => {
        pmey--;
    bola.style.bottom = pmey + 'px';
        if(pmey <= 30){
            clearInterval(intervaloMetiorito);
            bola.remove()
            pmei = false;
            pmey=500;
        }
        let pxd = px +100;
        if(pmey >= 30 && pme >px && pme < pxd && pmey <= 60 && escudo == false){
            sacarVida1(200);
            clearInterval(intervaloMetiorito);
            bola.remove();
            pmei = false;
            pmey=500;
        }
    }, 1);
}



function acercarDE(){
    TA=false
    let intervaloADE =setInterval(() => {
        pxDE--;
    dinoE.style.left = pxDE + 'px';
        if(distancia <= 300 || pxDE <= 0){
            clearInterval(intervaloADE);
            acercar=false;
            TA=true;
            Te = false;
        }
    }, 1);
}

function acercarDE2(){
    TA=false
    let intervaloADE2 =setInterval(() => {
        pxDE++;
    dinoE.style.left = pxDE + 'px';
        if(distancia <= -300 || pxDE <= 0){
            clearInterval(intervaloADE2);
            acercar=false;
            TA=true;
        }
    }, 1);
}

function pegarD2(){
    if(vida <= 500 && vida > 350){
        body.style.boxShadow = 'inset 0px 0px 8px 0px red';
    }else
    if(vida <= 350 && vida >250){
        body.style.boxShadow = 'inset 0px 0px 18px 10px red';
    }else    
    if(vida <= 250 && vida >= 0 ){
        body.style.boxShadow = 'inset 0px 0px 38px 20px red';
        
    }else{body.style.boxShadow = 'inset 0px 0px 0px 0px red';}  
    pegar=true
    dinoE.style.translate = '3s';
    for(w = 0;w<200;w++){
        pxDE++;
    };
    if (vida <= 0 ) {
        perder.play();

        dino.remove()
        clearInterval(intervaloScore);
        clearInterval(intervaloEnemi);
        clearInterval(intervaloVida);
    }   
    for(s = 0;s<50;s++){
        vida--;
    };
    
    setTimeout(volver2,300)
    dinoE.style.left = pxDE + 'px';
}
function volver2(){
    
for(y = 0;y<200;y++){
            pxDE--;
    };
    dinoE.style.left = pxDE + 'px';
    setTimeout(() => {
        pegar=false;
    }, 2000);
    if (vida <= 0 ) {
        perder.play();
        dino.remove();
        clearInterval(intervaloScore);
        clearInterval(intervaloEnemi);
        clearInterval(intervaloVida);
    }   
}


function pegarD(){
    if(vida <= 500 && vida > 350){
        body.style.boxShadow = 'inset 0px 0px 8px 0px red';
    }else
    if(vida <= 350 && vida >250){
        body.style.boxShadow = 'inset 0px 0px 18px 10px red';
    }else    
    if(vida <= 250 && vida >= 0 ){
        body.style.boxShadow = 'inset 0px 0px 38px 20px red';
        
    }else{body.style.boxShadow = 'inset 0px 0px 0px 0px red';}  
    pegar=true
    dinoE.style.translate = '3s';
    for(w = 0;w<200;w++){
        pxDE--;
    };
    if (vida <= 0 ) {
        perder.play();
        dino.remove()
        clearInterval(intervaloScore);
        clearInterval(intervaloEnemi);
        clearInterval(intervaloVida);
    }   
    for(s = 0;s<50;s++){
        vida--;
    };
    
    setTimeout(volver,300)
    dinoE.style.left = pxDE + 'px';
}
function volver(){
    
for(y = 0;y<200;y++){
            pxDE++;
    };
    dinoE.style.left = pxDE + 'px';
    setTimeout(() => {
        pegar=false;
    }, 2000);
    if (vida <= 0 ) {
        perder.play();
        dino.remove()
        clearInterval(intervaloScore);
        clearInterval(intervaloEnemi);
        clearInterval(intervaloVida);
    }   
}



function sacarVida1(num){
    pegar2.play()
    for(q=0;q<num;q++){
        vida--;
        if (vida <= 0 ) {
            dino.remove()
        perder.play();

            clearInterval(intervaloScore);
            clearInterval(intervaloEnemi);
            clearInterval(intervaloVida);
        }   
    };    
};


function Dbola (){
    let contenedor2 = document.getElementById('contenedor2');
    bolaG = true;
    let bola = document.createElement('div');
    bola.setAttribute('id', 'bola');
    contenedor2.appendChild(bola);
    let intervaloDbola =setInterval(()=>{
        Pbola--;
        bola.style.zIndex = 3;
        bola.style.left = Pbola + 'px';
        if(Pbola <= 0){
            clearInterval(intervaloDbola);
            bola.remove();
            Pbola= pxDE;
            bolaG = false;
        };
        if(px == Pbola && py == 30 && escudo == false){ sacarVida1(100)
            clearInterval(intervaloDbola);
            bola.remove();
            Pbola= pxDE;
            bolaG = false;
        }
       
    },1)
    
}        


function Dbola2 (){
    let contenedor2 = document.getElementById('contenedor2');
    bolaG = true;
    let bola = document.createElement('div');
    bola.style.transform = 'rotateY(180deg)';
    bola.setAttribute('id', 'bola');
    contenedor2.appendChild(bola);
    let intervaloDbola2 =setInterval(()=>{
        Pbola++;
        bola.style.zIndex = 3;
        bola.style.left = Pbola + 'px';
        if(Pbola >= 1250){
            clearInterval(intervaloDbola2);
            bola.remove();
            Pbola= pxDE;
            bolaG = false;
        };
        if(px == Pbola && py == 30 && escudo == false){ sacarVida1(100)
            clearInterval(intervaloDbola2);
            bola.remove();
            Pbola= pxDE;
            bolaG = false;
        }
       
    },1)
    
}        




//escudo
document.addEventListener('keydown',AP);

let time = false;

function AP (e){
    if(e.key == 'z' && energia >= 40){
       for(q=0;q<40;q++){
        energia--;
       } ;
        
        escudo = true;
        dino.style.filter = 'grayscale(.5)';
        setTimeout(() => {
            escudo=false;
            dino.style.filter = 'none';
        }, 7000);
    }
    if (e.key == 'x' && energia >= 7 && time == false) {
        DB2()
        disparar1.play();
        for(q=0;q<7;q++){
            energia--;
       } ;
            
    }
    if(e.key == 'c' && energia >= 1){
        for(q=0;q<1;q++){
            energia--;
            vida++;
       } ;
    }
}

let energiaG = document.getElementById('energia');

setInterval(() => {
    energiaG.innerText = 'energia:' + energia; 
},10);

let pxB = px;

    function DB2(){
        time= true;
        let contenedor2 = document.getElementById('contenedor2');
        let bola = document.createElement('div');
        bola.setAttribute('id', 'bola');
        contenedor2.appendChild(bola);
        if(Lado == true){
            bola.style.transform = 'rotateY(180deg)';
           let intervaloDbola2 =setInterval(() => {
              pxB++;
              bola.style.zIndex = 3;
              bola.style.left = pxB + 'px';
              if(pxB >= 1300){
                clearInterval(intervaloDbola2);
                bola.remove()
                pxB=px;
                time=false;
              }
              if (pxB == pxDE) {
                for(q=0;q<100;q++){
                    vidaDE--;
                    clearInterval(intervaloDbola2);
                    bola.remove()
                    pxB=px;
                    time=false;
                    pegar2.play();
                    if(vidaDE == 0){
                        dinoE.remove()
                        clearInterval(intervaloEnemi);
                    }
                } ;
              }
           }, 1);     
        }
        if(Lado == false){
            let intervaloDbola2 =setInterval(() => {
               pxB--;
               bola.style.zIndex = 3;
               bola.style.left = pxB + 'px';
               if(pxB <= 0){
                 clearInterval(intervaloDbola2);
                 bola.remove()
                 pxB=px;
                 time = false;
               }
               if (pxB == pxDE) {
                for(q=0;q<100;q++){
                    vidaDE--;
                    clearInterval(intervaloDbola2);
                    bola.remove()
                    pxB=px;
                    time=false;
                    pegar2.play();
                    if(vidaDE == 0){
                        dinoE.remove()
                        clearInterval(intervaloEnemi);
                    }
                   } ;
                }
            }, 1);     
         }
    }

setInterval(() => {
    energia++;
},1000);

let contenedor2 = document.getElementById('contenedor2');

let VidaP2 = document.getElementById('vidaP2');

setInterval(() => {
    VidaP2.innerText = "vida enemigo: " + vidaDE;
}, 10);

//victoria
let text1 = document.getElementById('h1')
let text = false;

setInterval(() => {
    if(vidaDE <= 0 && text == false){
        text1.style.display = 'inline';
        text1.style.color = 'rgb(0, 255, 34)';
        text1.innerHTML = 'Ganaste';
        text=true;
        ganar.play();
        dinoE.remove()
        clearInterval(intervaloEnemi);
    clearInterval(intervaloVida);
    clearInterval(intervaloScore);
    document.removeEventListener('keydown',iz);
    document.removeEventListener('keydown',ar);
    document.removeEventListener('keydown',de);
    document.removeEventListener('keydown',t);
    document.removeEventListener('keydown',AP);
    }
}, 1);



setInterval(() => {
    if(vida <= 0 && text == false){
        text=true;
        text1.innerHTML = 'Perdiste';
        text1.style.display = 'inline';
        text1.style.color = 'rgb(163, 33, 0)';
    perder.play();
    dino.remove()
    clearInterval(intervaloScore);
    clearInterval(intervaloEnemi);
    clearInterval(intervaloVida);
    document.removeEventListener('keydown',iz);
    document.removeEventListener('keydown',ar);
    document.removeEventListener('keydown',de);
    document.removeEventListener('keydown',t);
    document.removeEventListener('keydown',AP);
}
}, 1);