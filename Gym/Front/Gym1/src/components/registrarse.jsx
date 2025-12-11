import '../styles/registrarse.css'
import { useContext, useState } from 'react'
import { contextoGood } from '../App'









function Registrarse1() {

    const { getI, setI, cargarT, ruta } = useContext(contextoGood)


    const conseguirContraseña = async (data2) => {
        // console.log(data2);
        if (data2.DNI && data2.Email) {
            try {
                const response = await fetch(`${ruta}/obtenerContrasena`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data2)
                });

                try {
                    const respuesta = await response.json();

                    // console.log(respuesta)

                    alert(`la contraseña es : ${respuesta.contrasena}`)

                } catch (error) {
                    console.log(error)
                }


            } catch (error) {
                console.log(error)
            }

        }

    }

    const conectarseConServer = async (data2) => {
        // console.log(data2);
        if (data2.DNI && data2.contrasena) {
            try {
                console.log('hasta ahora to good');

                const response = await fetch(`${ruta}/iniciarSecion`, {
                    method: "POST",
                    // mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data2)
                });


                // console.log(typeof response);


                // console.log(await response.json());



                try {
                    const respuesta = await response.json()


                    if (respuesta.error) {
                        if (respuesta.error == 404) {
                            alert('no esta registrado')

                        }
                    }

                    if (respuesta.error) {
                        console.log(respuesta.error)

                    }
                    // console.log(response)

                    if (typeof respuesta == 'object') {
                        // console.log(respuesta);
                        window.localStorage.setItem('usuario', JSON.stringify(respuesta));

                        // usuario = await JSON.parse(localStorage.getItem('usuario'))
                        cargarT()
                        // window.location.reload();


                    }
                } catch (error) {
                    console.log(error)
                }



            } catch (error) {
                console.log(error)
            }

        }

    }







    const [valor1, setV1] = useState('')
    const [valor2, setV2] = useState('')
    const [cambiar, setCam] = useState(false)
    const [ver,setVer] = useState(false)


       

    return (
        <>
            {
                !cambiar ?
                    <div className="container">
                        {/* <p className="pMail">DNI</p> */}
                        <input type="text" id="" className="input1 inp4" onChange={(e) => {
                            setV1(e.target.value)
                        }} value={valor1} placeholder="E-mali" name="gmail" />
                        {/* <p className="pAsunt">Contraseña</p> */}
                        <input type="password" onChange={(e) => {
                            setV2(e.target.value)
                            


                        }}
                            value={valor2} id="input" className="input2" placeholder="Contraseña" name="asunto"
                        />
                        <div className='conteiner_V_C'>
                            <input type="checkbox" className='checkV' name="" id="123" onClick={
                                    (e)=>{
                                    setVer(e.target.checked)
                                    console.log(e.target.checked)
                                    if(!ver){
                                        document.getElementById("input").type="text";
                                    }else {
                                        document.getElementById("input").type="password";
                            
                                    }
                            
                                }
                            }/>
                            <p className='p51'>Ver contraseña</p>
                        </div>
                        <button className='btnOlv' onClick={() => {

                            setCam(true)
                            setV1('')
                            setV2('')

                        }}> Olvide mi contraseña </button>
                        <div className="btnsEnviar">
                            <button className='inpSub2' onClick={() => {
                                setI(!getI)
                                setV1('')
                                setV2('')

                            }}>Cancelar</button>
                            <button className='inpSub' onClick={() => {

                                const tester = /\w+\@gmail\.\w+/;
                                if (tester.test(valor1) && valor2.length >= 3) {
                                    conectarseConServer({ "DNI": valor1, "contrasena": `${valor2}` })

                                } else {
                                    alert('coloque parametros validos')
                                }

                            }}>Iniciar secion </button>
                        </div>
                    </div>
                    :
                    <div className="container">
                        {/* <p className="pMail">DNI</p> */}
                        <input type="number" id="" className="input1 inp4" onChange={(e) => {
                            setV1(e.target.value)
                        }} value={valor1} placeholder="DNI" name="gmail" />
                        {/* <p className="pAsunt">Contraseña</p> */}
                        <input type="email" onChange={(e) => {
                            setV2(e.target.value)


                        }}
                            value={valor2} id="input" className="input2" placeholder="Email" name="asunto"
                        />


                        <div className="btnsEnviar">
                            <button className='inpSub2' onClick={() => {
                                setCam(false)
                                setV1('')
                                setV2('')



                            }}>Cancelar</button>
                            <button className='inpSub' onClick={() => {

                                const tester = /\w+\@gmail\.\w+/;
                                if (tester.test(valor2) && valor1.length >= 3) {
                                    conseguirContraseña({ "DNI": valor1, "Email": `${valor2}` })

                                } else {
                                    alert('coloque parametros validos')
                                }

                            }}>Enviar </button>
                        </div>
                    </div>
            }

        </>
    );
}

export default Registrarse1;