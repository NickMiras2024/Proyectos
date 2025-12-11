const express = require('express')
const db = require('./db.js')
const router1 = require('./routes/usuarios.js');
const cors=require('cors');
const fs = require( 'fs' ); 
const multer = require('multer');
const path = require('path');
const { url } = require('inspector');

let app = express()
db.obtenerDB('./Gym.db')



app.use(cors())
app.use(express.json())


app.use(router1)



// Supongamos que tienes una matriz de nombres de archivo de imágenes


async function buscar(rutaArch){
    let res1 = fs.readFileSync(__dirname + rutaArch)
    // console.log(res1)
    return res1
}

app.get('/novedades',async (req, res) => {
    let imgs = await db.enviarQuerysP('select * from novedades');
    let obj = []
    console.log(imgs[0].url)
    for(i in imgs){
        console.log(imgs[i].url.match(/.+\.(jpg|png)/i)[1]);
        let infoI = await buscar(imgs[i].url)
        obj.push({i:{infoI,url: imgs[i].url,puntoA:imgs[i].url.match(/.+\.(jpg|png)/i)[1]}})

    }
    
    res.send(JSON.stringify(obj));
});

app.post('/eliminarImg',(req,res)=>{    
    console.log(req.body.url)

    if(req.body.url){
        db.enviarQuerysP('delete from novedades  where url =="'+req.body.url+'"')
        res.send('eliminado correctamente');
    }else{
        res.send('envie los datos bien ');

    }

})

app.get('/documentos/:id', (req, res) => {
    const documentId = req.params.id;
    const filePath = path.join(__dirname, 'archivos', documentId);
    res.sendFile(filePath);
});




const upload2 = multer({
    dest:__dirname + "/archivos"
})


function cambiarName(file){
    console.log(file.mimetype)
    let arch = file.mimetype
    let ruta = arch.split('/')[1]
    let rutaness = `/documentos/${file.filename}.${ruta}`
    let rutanueva = `${file.path}.${ruta}`; 
    fs.renameSync(file.path,rutanueva)
    return rutaness
}



app.post('/subirArch',upload2.single("fileses"),async function(req,res){
    const archivo = req.file;

    console.log(archivo)
    let ruta = cambiarName(archivo)
    if (!archivo) {
        return res.status(400).send(JSON.stringify({err:'No se ha adjuntado ningún archivo.'}));
    }else{
        res.send(JSON.stringify({ruta:ruta}))
    }

})



app.use(express.urlencoded({ extended: true }));
const upload = multer({
    dest: __dirname + "/imgs",
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            // Aceptar el archivo
            cb(null, true);
        } else {
            // Rechazar el archivo
            cb(new Error('El archivo debe ser PNG o JPEG'));
        }
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + "/imgs");
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, file.fieldname + '-' + Date.now() + ext);
        }
    })
});
app.post('/subirIMG', upload.single('imagen'), (req, res) => {
    const archivo = req.file;
    console.log(archivo)
    if (!archivo) {
        return res.status(400).send(JSON.stringify({err:'No se ha adjuntado ningún archivo.'}));
    }
    const urlArchivo = `/imgs/${archivo.filename}`; // Ejemplo de URL, ajusta según sea necesario

    // Guardar la URL en la base de datos
    db.enviarQuerysP(`INSERT INTO novedades (url) VALUES ('${urlArchivo}')`)
        .then(() => {
            // Éxito al guardar en la base de datos
            res.json({ mensaje: 'Archivo recibido y URL guardada correctamente' });
        })
        .catch(error => {
            // Error al guardar en la base de datos
            console.error('Error al guardar en la base de datos:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        });
    // Resto del código para manejar el archivo

    // res.json({ mensaje: 'Archivo recibido correctamente' });s
});

app.get('/',(req,res)=>{
    res.send('esta es la pagina del server')
})

app.set('port', process.env.PORT || 3000)


app.listen(app.get('port'), ()=>{
    console.log('server on port', app.get( 'port' ))
})