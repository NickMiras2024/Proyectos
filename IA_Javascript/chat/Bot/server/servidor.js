const ex = require('express');
const cors = require('cors')
const {interaccion } = require('../NIAM.js')

let app = ex();


app.use(ex.json());

app.use(cors())

async function enviarInfo(info){
    return await interaccion(info)
}


app.post('/interactuar',async (req,res)=>{
    console.log(req.body)
    if(req.body.input){
        console.log(req.body.input)
        let result = await enviarInfo(req.body.input)
        res.send(result)
    }else{
        res.send('no se pudo leer el mensaje')

    }
})





app.listen(3000,()=>{
    console.log('escuchando en el puerto 3000')
})