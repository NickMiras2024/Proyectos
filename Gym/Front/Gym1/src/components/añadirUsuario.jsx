import { useState } from 'react';
import '../styles/añadirUsuario.css'
import { contextoGood } from '../App';
import { useContext } from 'react';





function AñadirUsuario() {

    const { usuario, N, SN, N2, SN2,ruta, N3, SN3, N4, SN4, N5, SN5, N6, SN6, N7, SN7, N8, SN8 } = useContext(contextoGood)

    const [res4, setR4] = useState(undefined)
    const [cargarThis, setcargarThis] = useState(true)


    async function cargarUsuarios(data2) {
        const response = await fetch(`${ruta}/obtenerUsuarios`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data2)
        });


        const respuestaNes = new Promise((res, rej) => {
            try {
                res(response.json())
            } catch (error) {
                rej(error)
            }
        })

        setR4(await respuestaNes)
        console.log(await respuestaNes)
    }


    let cargado = false
    const saberCompt = /Cliente/i

    if(cargarThis ){
        cargarUsuarios({COD: "G8&hJ94kLzT3!qWmN2pXcV7@rQbY#5DkF"}) 
        setcargarThis(false)
    } 


    const handleSelectChange = (event) => {
        SN4(event.target.value);
        // console.log(N4)
        
        
    

    };
    return (
        <div className="contForm">
            <p>Nombre</p>
            <input className="input" type="text" name="nombre" id="nombre" onChange={(e) => {

                    SN(e.target.value)

            }} value={N} />

            <p>Email</p>
            <input className="input" type="email" name="nombre" id="nombre" onChange={(e) => {

                SN2(e.target.value)


            }} value={N2} />
            <div className='selct12'>
                <p>Tipo de usuario</p>
                <select value={N4} className='selct1' onChange={handleSelectChange}>
                    <option value={''} className='op'></option>
                    <option value="administrador" className='op'>Administrador</option>
                    <option value="entrenador" className='op'>Entrenador</option>
                    <option value="cliente" className='op'>Cliente</option>
                </select>
            </div>
            <p>tel</p>
            <input className="input" type="number" name="" id="" onChange={(e) => {

                SN5(e.target.value)

            }} value={N5} />
            <p>DNI</p>
            <input className="input" type="number" name="" id="" onChange={(e) => {

                SN6(e.target.value)


            }} value={N6} />
            <p>contraseña</p>
            <input className="input" type="text" onChange={(e) => {

                SN7(e.target.value)

            }} value={N7} />

            {/* {
                saberCompt.test(N4) ?
                    <>
                        <div className='selct12'>
                            <p>DNI entrenador</p>
                            <select value={N8} className='selct1' onChange={(e)=>{
                                SN8(e.target.value)

                                
                            }}> 
                            <option value={0} className='op'></option>
                                {res4 !== undefined ?
                                    res4.map((f, index) => {
                                        cargado = true
                                        // console.log(f)
                                        if(f.rango == "entrenador"){
                                            return <option value={f.DNI} key={index} className='op'>{ `${f.nombre} : (${f.DNI})`}</option>

                                        }
                                           
                                    })
                                    : <></>
                                }
                                
                            </select>
                        </div>
                    </>

                    : <></>
            } */}




        </div>
    );
}

export default AñadirUsuario;