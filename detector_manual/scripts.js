let canvas = document.getElementById('canvas')
let video = document.getElementById('video')
let pelo = document.getElementById('pelotita')


let ctx = canvas.getContext("2d", { willReadFrequently: true });


// let img = new Image()
// img.src = 'img.jpg'


let pelop = {
  x: document.body.clientWidth / 2,
  y: document.body.clientHeight / 2,
}





let puntoMAY = 0


let PY = -1
let UY = 0

let UPPM = [0,0]



function calcDist(arr1,arr2){
  let dis = {
    y: Math.abs(arr1[1] - arr2[1]),
    x: Math.abs(arr1[0]-arr2[0])
  }
  return dis
}
console.log('la distancia en x es : ' , calcDist(PY,UY).x)
console.log('la distancia en y es : ' , calcDist(PY,UY).y)



function pintar(param) {
  PY = -1
  UY = 0

  ctx.drawImage(param, 0, 0, canvas.width, canvas.height)

  let frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let data = frame.data

  for (let i = 0; i <= data.length; i += 4) {
    let r = data[i]
    let g = data[i + 1]
    let b = data[i + 2]
    let dest = 50
    
    
    if ( dest < r - b &&  dest < r - g  ) {
      data[i] = 0
      data[i + 1] = 0
      data[i + 2] = 0
      let y =  Math.floor(i / (4 * canvas.width));
      let x = (i / 4)% canvas.width

      if (PY == -1) {        
        PY = [x, y]
      }
      if(UY == 0){
        UY = [x,y]
      }else{
        if(UY[1] < y ){
          UY = [x,y]
        }
      }
      UPPM = [ (UY[0] + PY[0])/2 ,(UY[1] + PY[1])/2]
    } else {
      data[i] = 255
      data[i + 1] = 255
      data[i + 2] = 255
      // console.log('paso por aca')

    }
  }


  ctx.putImageData(frame, 0, 0)
  console.log(data)


  if (PY != -1) {
    ctx.fillStyle = 'red'; // Color del cuadrado
    ctx.fillRect(PY[0], PY[1], 5, 5); 
    ctx.fillRect(UY[0], UY[1], 5, 5); 

    ctx.fillStyle = '#0f0'; // Color del cuadrado
    ctx.fillRect(UPPM[0], UPPM[1], 5, 5); 


    if(puntoMAY == 0){
      puntoMAY = -PY[1] + UY[1]
      console.log(puntoMAY)
    }else{
      let umbrella = (puntoMAY / 4) *2
      if(umbrella >-PY[1] + UY[1] ){
        pelo.style.background = '#00c'
        pelo.style.boxShadow = '0px 0px 18px 0px #aad'
      }else{
        pelo.style.background = 'rgb(3, 191, 47)'
        pelo.style.boxShadow = '0px 0px 18px 0px rgb(65, 235, 105)'
      }
    }
  }

  pelop.x =  100 - (UPPM[0] / canvas.width  * 100)
  pelop.y =  UPPM[1] / canvas.height  * 100

  pelo.style.top = pelop.y + '%';
  pelo.style.left = pelop.x + '%';



  requestAnimationFrame(obtCam(false))

}

let stream; 

async function obtCam(condicional){
  if(condicional == true){
    stream = await navigator.mediaDevices.getUserMedia({video : true});
  }
  video.srcObject = stream
  video.onloadeddata = function() {
    pintar(video); 
  };
 }
 
 obtCam(true)