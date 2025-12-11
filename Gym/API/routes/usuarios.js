const express = require('express')
const db = require('../db.js')



const router = express.Router()


router.post('/obtenerUnUsuario', async (req, res) => {
    // console.log("this is req.body" , req.body)
    if (req.body.DNI && req.body.contrasena, req.body.UDNI) {
        const [...usuario] = await db.enviarQuerysP(`select * from usuarios where usuarios.DNI == ${req.body.DNI} and usuarios.contrasena == "${req.body.contrasena}"`)
        if (usuario[0].rango == "administrador") {
            const usuarioNeed = await db.enviarQuerysP(`select * from usuarios where usuarios.DNI == ${req.body.UDNI}`)
            res.send(usuarioNeed)
        } else {
            res.send({ err: "no tines los privilegios nesesarios " })
        }
    } else {
        res.send({ err: "envie los datos correctos " })
    }

})


router.post('/obtenerContrasena', async (req, res) => {
    console.log(req.body)
    if (req.body.Email && req.body.DNI) {
        try {
            console.log(`"${req.body.Email}"`)
            let [...usuarios] = await db.enviarQuerysP(`select * from usuarios where usuarios.DNI == ${parseInt(req.body.DNI)} and usuarios.Email == "${req.body.Email}" `)

            if (usuarios.length == 1) {
                res.send(JSON.stringify({ "contrasena": usuarios[0].contrasena }))
                console.log('mandado')
                console.log(usuarios[0].contrasena)
            } else {
                res.send(JSON.stringify({ "error": 404 }))

            }

        } catch (error) {
            console.log('ocurrio un error' + error)
            res.send(JSON.stringify({ "error": 'no se pudo encontrar el usuario' }))
        }


    } else {
        res.send(JSON.stringify({ "error": 'por favor ingresa la contraseña y el Email' }))
    }
});


router.post('/iniciarSecion', async (req, res) => {
    console.log(req.body)
    if (req.body.contrasena && req.body.DNI) {
        try {
            console.log(`"${req.body.contrasena}"`)
            let [...usuario2] = await db.enviarQuerysP(`select * from usuarios where usuarios.Email == "${req.body.DNI}"`)

            console.log(usuario2)

            let usuario3 = usuario2[0].DNI


            let [...usuarios] = await db.obtenerDatosTabla("usuarios", [req.body.contrasena, usuario3])
            if (usuarios.length == 1) {
                res.send(JSON.stringify(usuarios[0]))
                console.log('mandado')
                console.log(usuarios)
            } else {
                res.send(JSON.stringify({ "error": 404 }))

            }

        } catch (error) {
            console.log('ocurrio un error' + error)
            res.send(JSON.stringify({ "error": 'no se pudo encontrar el usuario' }))
        }


    } else {
        res.send(JSON.stringify({ "error": 'por favor ingresa la contraseña y el Email' }))
    }
});



router.post('/eliminarEntrenamiento', async (req, res) => {
    if (req.body.id) {
        try {
            await db.enviarQuerysP(`delete from entrenamientos where entrenamientos.id == ${req.body.id}`)
            res.send('eliminado correctamente')
            console.log('eliminado correctamente')
        } catch (error) {
            res.send('hubo un error')
            console.log(error)
        }
    }
})


router.post('/obtHisEnt', async (req, res) => {
    console.log(req.body)
    if (req.body.DNI) {
        try {
            let entrenamientos = await db.enviarQuerysP(`select * from  historialEnt where historialEnt.usuarioDNI== ${req.body.DNI}`)
            res.send(entrenamientos)
        } catch (error) {
            res.send('no se pudo haceder ')
            console.log(error)
        }

    } else {
        res.send('no se envio el DNI')
    }

})

router.post('/obtEnt', async (req, res) => {
    console.log(req.body)
    if (req.body.userDNI) {
        try {
            let entrenamientos = await db.enviarQuerysP(`select * from  entrenamientos where entrenamientos.usuarioDNI== ${req.body.userDNI}`)
            res.send(entrenamientos)
        } catch (error) {
            res.send('no se pudo haceder ')
            console.log(error)
        }

    } else {
        res.send('no se envio el DNI')
    }

})




router.post('/addEntrenamiento', async (req, res) => {
    // console.log(req.body)
    if (req.body.DNI && req.body.contrasena) {
        let usuarios = await db.obtenerDatosTabla("usuarios", [req.body.contrasena, req.body.DNI])
        if (usuarios.length == 1) {
            if (usuarios[0].rango == 'entrenador') {
                if (req.body.usuarioDNI && req.body.dia && req.body.hs && req.body.entrenamiento) {
                    try {
                        const fecha = new Date()
                        const fechaI1 = `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`
                        await db.insertarDatosEntrenamientos([req.body.usuarioDNI, req.body.dia, req.body.hs, req.body.entrenamiento, req.body.ruta ? req.body.ruta : 'none'])
                        await db.insertarDatosHistorial([req.body.usuarioDNI, req.body.entrenamiento, req.body.dia, req.body.hs, fechaI1, req.body.DNI])
                        res.send('insertado correctamente')
                        console.log('insertado correctamente')
                    } catch (error) {
                        res.send('hubo un error')
                        console.log(error)
                    }


                } else {
                    res.send('faltan los datos del entrenamiento')
                }
            } else {
                res.send('no tiene los privilegios de usuario ')
            }
        } else {
            res.send('no existe este usuario')
        }
    } else {
        res.send('envie datos correctos')
    }

})

router.post('/obtUE20', async (req, res) => {
    // console.log("this is req.body in root obtUE2", req.body)
    if (req.body.contrasena && req.body.DNI && req.body.DNIU) {
        let usuarios = await db.obtenerDatosTabla("usuarios", [req.body.contrasena, req.body.DNI])
        if (usuarios.length == 1 && usuarios[0].rango == "administrador") {
            let [...info] = await db.enviarQuerysP(`select * from clientes where clientes.clienteDNI == ${req.body.DNIU}`)
            res.send(info[0])
        } else {
            res.send('no se pudo encontrar el entrenador')
        }

    } else {
        res.send('envie los datos correctos')
    }
})

router.post('/obtUE', async (req, res) => {
    // console.log(req.body)
    if (req.body.contrasena && req.body.DNI) {
        let usuarios = await db.obtenerDatosTabla("usuarios", [req.body.contrasena, req.body.DNI])
        if (usuarios.length == 1) {
            let [...info] = await db.enviarQuerysP(`select * from clientes where clientes.entrenadorDNI == ${req.body.DNI}`)
            res.send(info)
        } else {
            res.send('no se pudo encontrar el entrenador')
        }

    } else {
        res.send('envie los datos correctos')
    }
})

router.post('/eliminarPreUsuarios', async (req, res) => {
    if (req.body.DNI && req.body.Email && req.body.contrasena
        && req.body.CDNI && req.body.CEmail) {
        console.log(req.body)
        let [...info] = await db.enviarQuerysP(`select * from usuarios where usuarios.DNI == ${req.body.DNI} and usuarios.Email == "${req.body.Email}" and usuarios.contrasena == "${req.body.contrasena}"`)
        if (info.length == 1) {
            if (info[0].rango == "administrador") {
                console.log("hasta aca to good 1")
                await db.enviarQuerysP(`DELETE from usuariosPed where usuariosPed.Email == "${req.body.CEmail}" and usuariosPed.DNI == ${req.body.CDNI}`)
                res.send({ res: "usuario eliminado" })

            } else {
                res.send({ err: "no tienes los privilegios nesesarios" })
            }
        } else {
            res.send({ err: "no existe este usuario" })
        }
    } else {
        res.send({ err: "envie datos correctos" })
    }
})



router.post('/obtenerPreUsuarios', async (req, res) => {
    console.log("esto ess", req.body)
    if (req.body.contrasena && req.body.DNI) {
        try {
            // console.log(req.body)
            let [...usuarios] = await db.enviarQuerysP(`select * from usuarios where usuarios.DNI == ${req.body.DNI} and usuarios.contrasena == "${req.body.contrasena}"`)
            console.log(usuarios)
            if (usuarios.length == 1) {
                if (usuarios[0].rango == 'administrador') {
                    let [...info] = await db.enviarQuerysP(`select * from usuariosPed`)
                    // console.log(info)

                    res.send(info)
                    return
                } else {
                    res.send('no tiene el rango nesesario')
                    return
                }

            } else {
                res.send('no estas registrado')
                return

            }
        } catch (error) {
            console.log('ocurrio un error' + error)
            res.send('no se pudo encontrar el usuario')
        }

    } else {
        res.send('envie datos correctos')
    }

})




router.post('/obtenerUsuarios', async (req, res) => {
    console.log("esto ess", req.body)
    if (req.body.COD) {
        if (req.body.COD == "G8&hJ94kLzT3!qWmN2pXcV7@rQbY#5DkF")
            try {
                let [...info] = await db.enviarQuerysP(`select * from usuarios`)
                // console.log(info)

                res.send(info)
                return

            } catch (error) {
                console.log('ocurrio un error' + error)
                res.send('no se pudo encontrar el usuario')
            }
    } else {
        if (req.body.contrasena && req.body.DNI) {
            try {
                // console.log(req.body)
                let [...usuarios] = await db.enviarQuerysP(`select * from usuarios where usuarios.DNI == ${req.body.DNI} and usuarios.contrasena == "${req.body.contrasena}"`)
                console.log(usuarios)
                if (usuarios.length == 1) {
                    if (usuarios[0].rango == 'administrador') {
                        let [...info] = await db.enviarQuerysP(`select * from usuarios`)
                        // console.log(info)

                        res.send(info)
                        return
                    } else {
                        res.send('no tiene el rango nesesario')
                        return
                    }

                } else {
                    res.send('no estas registrado')
                    return

                }
            } catch (error) {
                console.log('ocurrio un error' + error)
                res.send('no se pudo encontrar el usuario')
            }

        } else {
            res.send('envie datos correctos')
        }

    }

})




router.post('/updateUsers2', async (req, res) => {
    console.log('enviaste una peticion a updateUsers2 ----- peticion : ',req.body)
    if (req.body.DNIU && req.body.entrenadorDNI) {
        try {
            const query1 = `UPDATE clientes SET entrenadorDNI = ${req.body.entrenadorDNI} where clienteDNI == ${req.body.DNIU}`
            console.log(query1)
            await db.enviarQuerysP(query1)
            res.send('datos actualizados con exito')
            console.log('modificado correctamente ')
        } catch (error) {
            res.send('No se pudieron actualizar los datos')
            console.log(error)
        }
    } else {
        res.send('envia los datos correctos')

    }
})

router.post('/updateUsers', async (req, res) => {
    console.log(req.body)
    if (req.body.DNI
        && req.body.nombre
        && req.body.Email
        && req.body.rango
        && req.body.tel
        && req.body.fechaI
    ) {
        console.log(req.body.rango.toLowerCase())
        try {
            const query1 = `UPDATE usuarios SET nombre = "${req.body.nombre}",Email  = "${req.body.Email}",rango = "${req.body.rango.toLowerCase()}",tel = ${parseInt(req.body.tel)},fechaI = "${req.body.fechaI}" where DNI == ${parseInt(req.body.DNI)}`
            console.log(query1)
            await db.enviarQuerysP(query1)
            res.send('datos actualizados con exito')
            console.log('modificado correctamente ')
        } catch (error) {
            res.send('No se pudieron actualizar los datos')
            console.log(error)
        }
    } else {
        res.send('envia los datos correctos')

    }
})

// db.insertarDatosUsuarios(["Nico Miras","nicomiras20@gmail.com","entrenamiento","cliente",2213102801,"18/2/2024",49249767,77771])

router.post('/preRegistrarse', async (req, res) => {
    console.log("enviaste una peticion a preRegistrarse", req.body)
    if (req.body.DNI
        && req.body.nombre
        && req.body.Email
        && req.body.rango
        && req.body.tel
        && req.body.fechaI
        && req.body.contrasena
        ||
        req.body.DNI
        && req.body.nombre
        && req.body.Email
        && req.body.rango
        && req.body.tel
        && req.body.fechaI
        && req.body.contrasena
        && req.body.entrenadorDNI
    ) {
        console.log(req.body)
        try {
            console.log('hasta aca to good 1')
            let usuarios = await db.enviarQuerysP(`select * from usuarios where usuarios.DNI == ${req.body.DNI} and usuarios.contrasena == "${req.body.contrasena}" or usuarios.DNI == ${req.body.DNI}`)
            console.log('hasta aca to good 2')

            if (usuarios.length == 1) {
                console.log('hasta aca to good 3')
                console.log('ya esta registrado')

                res.send('ya esta registrado')
                return
            } else {
                db.insertarDatosUsuariosPed([req.body.nombre, req.body.Email, req.body.rango, parseInt(req.body.tel), req.body.fechaI, parseInt(req.body.DNI), req.body.contrasena])

            }

        } catch {
            console.log("algo paso")
            res.send("algo paso")
        }


    } else {
        res.send({ err: "envie datos correctos" })
    }
})




router.post('/registrarse', async (req, res) => {
    // console.log(req.body)
    if (req.body.DNI
        && req.body.nombre
        && req.body.Email
        && req.body.rango
        && req.body.tel
        && req.body.fechaI
        && req.body.contrasena
        ||
        req.body.DNI
        && req.body.nombre
        && req.body.Email
        && req.body.rango
        && req.body.tel
        && req.body.fechaI
        && req.body.contrasena
        && req.body.entrenadorDNI
    ) {
        console.log(req.body)
        try {
            console.log('hasta aca to good 1')
            let usuarios = await db.enviarQuerysP(`select * from usuarios where usuarios.DNI == ${req.body.DNI}  or usuarios.Email == "${req.body.Email}"`)
            console.log('hasta aca to good 2')

            if (usuarios.length == 1) {
                console.log('hasta aca to good 3')
                console.log('ya esta registrado')

                res.send('ya esta registrado')
                return
            } else {
                console.log('hasta aca to good 4')
                if (req.body.rango == 'cliente' && req.body.entrenadorDNI) {
                    db.insertarDatosUsuarios([req.body.nombre, req.body.Email, req.body.rango, parseInt(req.body.tel), req.body.fechaI, parseInt(req.body.DNI), req.body.contrasena], [parseInt(req.body.DNI), parseInt(req.body.entrenadorDNI), req.body.nombre], true)
                    res.send('registrando...')
                    console.log('hasta aca to good 5')
                } else {
                    db.insertarDatosUsuarios([req.body.nombre, req.body.Email, req.body.rango, parseInt(req.body.tel), req.body.fechaI, parseInt(req.body.DNI), req.body.contrasena], [])
                    res.send('registrando...')
                    console.log('hasta aca to good 5')

                }

                return

            }
        } catch (error) {
            console.log('ocurrio un error' + error)
            res.send('no se pudo registrar el usuario por favor intente de nuevo')
        }

    } else {
        res.send('envie datos correctos')
    }

})


router.post('/eliminar', async (req, res) => {
    if (req.body.DNI
        && req.body.contrasena
    ) {
        if (req.body.rango == 'cliente') {
            db.eliminarcliente([req.body.DNI])

        }
        console.log(`"${req.body.contrasena}"`)
        db.eliminarUsuario([req.body.DNI, `"${req.body.contrasena}"`])
            .then((res1) => {
                console.log(res1)
                res.send('eliminado')
            }).catch((rej) => {
                res.send(rej)
                console.log(rej)
            })
    } else {
        res.send('ingrese los datos correctos')
    }

})



module.exports = router