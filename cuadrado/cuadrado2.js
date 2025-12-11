let user =  document.getElementById('user');
let evento = user.addEventListener('click', sumarPuntos);
  let contenedor = document.getElementById('contenedor');
  let soundPress = new Audio('punto.wav');
  let soundPerder = new Audio('perder.wav');
  let soundGanar = new Audio('ganar1.wav');

let puntos = 0;

function sumarPuntos(e){
    soundPress.play()
    puntos++;
    document.getElementById('puntos').innerHTML = 'score: ' + puntos + '/60';
    user.style.left = innerWidth * numC1(0.1,0.9) + 'px';
    user.style.top = innerHeight * numA1(0.1,0.7) + 'px';
    function numA1 (min, max){ 
        return Math.random() * (max - min) + min;
    };
    function numC1 (min, max){ 
        return Math.random() * (max - min) + min;
    };
    if(puntos==60){
        contenedor.style.backgroundImage = 'url(fondo3.png)'
        user.removeEventListener('click', sumarPuntos);
        clearInterval(intervalo);
        soundGanar.play()
    }
}

let tiempo = 60;
function time (){
    tiempo--;
    document.getElementById('pTime').innerHTML = 'time: ' +  tiempo;
if (tiempo==0){
    soundPerder.play()
    contenedor.style.backgroundImage = 'url(fondo2.png)'
    user.removeEventListener('click', sumarPuntos);
    clearInterval(intervalo);
}
}



let intervalo = setInterval(time, 1000);