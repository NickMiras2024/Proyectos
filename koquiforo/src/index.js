const url = require("url");
const ele = require('electron')
const ex = require('express')
const fs = require('node:fs/promises')
const pt = require('path')
const cors = require('cors')

let App2 = ex()

App2.use(ex.json());


const corsOptions = {
    origin: 'http://127.0.0.1:5500'  // Cambia esto con la URL de tu aplicación
  };
  
App2.use(cors(corsOptions));


async function cambiarP(param){
    await fs.writeFile(pt.join(__dirname , 'views/datos.json'),JSON.stringify(param))
}


App2.get('/', (req,res) =>{
    res.send('hola mundo')
})

App2.post('/cambiar', (req,res)=>{
    console.log(req.body)
    cambiarP(req.body)
    res.send('obtenida') 
})


App2.listen(3000, ()=>{
    console.log('escuchando en el puerto 3000')
})

if (process.env.NODE_ENV !== 'production') {
    require("electron-reload")(__dirname, {

    })
}




let mainWindows;

ele.app.on("ready", () => {
    mainWindows = new ele.BrowserWindow({ autoHideMenuBar: true,});
    mainWindows.loadURL(url.format({
        pathname: pt.join(__dirname, 'views/otrosEnlaces/inicio.html'),
        protocol: 'file',
        slashes: true
    }))

}) 

