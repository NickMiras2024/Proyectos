import '../styles/itemUser.css'
import tachito from '../assets/basura.png'
import { contextoGood } from '../App';
import { useContext, useEffect, useState } from 'react';





function ItemUser({ data }) {

    const { usuario, cargarUsuarios, cargar, ruta, setCarg } = useContext(contextoGood)

    const [cargo, setCargo] = useState(false)
    const [editing, setEditing] = useState(false);
    const [valor, setValor] = useState("");
    const [editing2, setEditing2] = useState(false);
    const [valor2, setValor2] = useState(data.nombre);
    const [editing3, setEditing3] = useState(false);
    const [valor3, setValor3] = useState(data.Email);
    const [editing4, setEditing4] = useState(false);
    const [valor4, setValor4] = useState(data.fechaI);
    const [editing5, setEditing5] = useState(false);
    const [valor5, setValor5] = useState(data.rango);
    const [editing6, setEditing6] = useState(false);
    const [valor6, setValor6] = useState(data.tel);


    const [dataCli, setDC] = useState([]);

    const [res4, setR4] = useState(undefined)
    const [cargarThis, setcargarThis] = useState(true)


    async function obtenerEntrenadores(data2) {
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

    if (cargarThis) {
        obtenerEntrenadores({ COD: "G8&hJ94kLzT3!qWmN2pXcV7@rQbY#5DkF" })
        setcargarThis(false)
    }




    async function obtenerUnUs(data) {
        let res = await fetch(`${ruta}/obtenerUnUsuario`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        try {
            setDC(await res.json())
            // console.log(await res.json())

        } catch (error) {
            console.log(error)
        }

    }



    async function clientOb(data2) {
        let res = await fetch(`${ruta}/obtUE20`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data2)
        });

        try {
            const UDNI = await res.json()
            obtenerUnUs({ "DNI": usuario.DNI, "contrasena": usuario.contrasena, "UDNI": UDNI.entrenadorDNI })

        } catch (error) {
            console.log(error)
        }

    }

    if (!cargo && data.rango == 'cliente') {
        clientOb({ "DNI": usuario.DNI, "contrasena": usuario.contrasena, "DNIU": data.DNI })
        setCargo(true)
    }


    function eliminar(data2, nombre) {
        if (usuario.DNI == data2.DNI || parseInt(data2.DNI) == 123456) {
            alert("No se puede eliminar este usuario")
            return
        } else {
            const confirm = window.confirm('seguro que quieres eliminar a :' + nombre)
            if (confirm) {
                fetch(`${ruta}/eliminar`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data2)
                });
            } else {
                // console.log(data2)
            }


        }
        setCarg(false)
        cargarUsuarios({ "DNI": usuario.DNI, "contrasena": usuario.contrasena })
        // setCarg(true)

    }


    async function actualizar2(data2 = {
        "DNIU": data.DNI,
        "entrenadorDNI": valor.length >= 1?  parseInt(valor): null 
    }) {
        const confirm = window.confirm('seguro que quieres modificar este campo?' + "esto es valor " + valor )
        console.log(valor,"<--- esto es valor")
        if (confirm) {
            let res = await fetch(`${ruta}/updateUsers2`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data2)
            });

            console.log(await res.text())






            cargarUsuarios({ "DNI": usuario.DNI, "contrasena": usuario.contrasena })
        }

        cargarUsuarios({ "DNI": usuario.DNI, "contrasena": usuario.contrasena })

    }





    async function actualizar(data2 = {
        "nombre": valor2,
        "Email": valor3,
        "rango": valor5,
        "tel": parseInt(valor6),
        "fechaI": valor4,
        "DNI": parseInt(data.DNI),
    }) {

        if (data2.DNI == 123456) {
            alert('no puedes modificar ni eliminar este usuario')
            return
        } else {
            const confirm = window.confirm('seguro que quieres modificar este campo?')
            if (confirm) {
                let res = await fetch(`${ruta}/updateUsers`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data2)
                });

                console.log(await res.text())

            } else {
                console.log('-')
            }





            cargarUsuarios({ "DNI": usuario.DNI, "contrasena": usuario.contrasena })
        }

        cargarUsuarios({ "DNI": usuario.DNI, "contrasena": usuario.contrasena })

    }





    return (
        <tr className='.tr1'>
            <td >{data.DNI}</td>
            {
                // data.rango == 'cliente' && dataCli != undefined? <td onClick={()=>console.log(dataCli[0].nombre)}>{dataCli[0].nombre}</td> : <td >Ninguno</td>
                data.rango === 'cliente' && dataCli.length > 0 ? (
                    <td onDoubleClick={() => {

                        setEditing(true);

                    }}>
                        {
                            editing ? (
                                <select
                                    type="text"
                                    value={valor}
                                    onChange={(event) => {
                                        setValor(event.target.value);
                                    }}
                                    onBlur={() => {
                                        setEditing(false);
                                        actualizar2()

                                    }}
                                    autoFocus>
                                    <option value={"Ninguno"} className='op'></option>

                                    {res4 !== undefined ?
                                        res4.map((f, index) => {
                                            cargado = true
                                            // console.log(f)
                                            if (f.rango == "entrenador") {
                                                return <option value={f.DNI} key={index} className='op'>{`${f.nombre} : (${f.DNI})`}</option>

                                            }

                                        })
                                        : <></>
                                    }
                                </select>
                            ) : valor.length >= 1 ? (
                                valor
                            ) : (
                                dataCli[0]?.nombre || "N/A"

                            )
                        }
                    </td>
                ) : (
                    <td onDoubleClick={() => {
                        if (data.rango == 'cliente') {
                            setEditing(true);

                        }

                    }}>
                        {
                            editing ? (
                                <select
                                    type="text"
                                    value={valor}
                                    onChange={(event) => {
                                        console.log(event.target.value)
                                        setValor(event.target.value);
                                    }}
                                    onBlur={() => {
                                        setEditing(false);
                                        actualizar2()

                                    }}
                                    autoFocus>
                                    <option value={"Ninguno"} className='op'></option>

                                    {res4 !== undefined ?
                                        res4.map((f, index) => {
                                            cargado = true
                                            // console.log(f)
                                            if (f.rango == "entrenador") {
                                                return <option value={f.DNI} key={index} className='op'>{`${f.nombre} : (${f.DNI})`}</option>

                                            }

                                        })
                                        : <></>
                                    }
                                </select>
                            ) : valor.length >= 1 ? (
                                valor
                            ) : (
                                "Ninguno"
                            )
                        }

                    </td>
                )

            }
            <td onDoubleClick={() => {
                setEditing2(true);
            }}>
                {editing2 ? (
                    <input
                        type="text"
                        value={valor2}
                        onChange={(event) => {
                            setValor2(event.target.value);
                        }}
                        onBlur={() => {
                            setEditing2(false);
                            actualizar()
                        }}
                        autoFocus
                    />
                ) : (
                    valor2
                )}
            </td>
            <td onDoubleClick={() => {
                setEditing3(true);
            }}>
                {editing3 ? (
                    <input
                        type="text"
                        value={valor3}
                        onChange={(event) => {
                            setValor3(event.target.value);
                        }}
                        onBlur={() => {
                            setEditing3(false);
                            actualizar()

                        }}
                        autoFocus
                    />
                ) : (
                    valor3
                )}
            </td>
            <td onDoubleClick={() => {
                setEditing4(true);
            }}>
                {editing4 ? (
                    <input
                        type="text"
                        value={valor4}
                        onChange={(event) => {
                            setValor4(event.target.value);
                        }}
                        onBlur={() => {
                            setEditing4(false);
                            actualizar()

                        }}
                        autoFocus
                    />
                ) : (
                    valor4
                )}
            </td>
            <td onDoubleClick={() => {
                setEditing5(true);
            }}>
                {editing5 ? (
                    <input
                        type="text"
                        value={valor5}
                        onChange={(event) => {
                            setValor5(event.target.value);
                        }}
                        onBlur={() => {
                            setEditing5(false);
                            actualizar()

                        }}
                        autoFocus
                    />
                ) : (
                    valor5
                )}
            </td>
            <td onDoubleClick={() => {
                setEditing6(true);
            }}>
                {editing6 ? (
                    <input
                        type="text"
                        value={valor6}
                        onChange={(event) => {
                            setValor6(event.target.value);
                        }}
                        onBlur={() => {
                            setEditing6(false);
                            actualizar()

                        }}
                        autoFocus
                    />
                ) : (
                    valor6
                )}
            </td>
            <td>
                <img className="botton" src={tachito}
                    onClick={() => { eliminar({ "DNI": data.DNI, "contrasena": data.contrasena, "rango": data.rango }, data.nombre) }}
                />
            </td>

        </tr>
    );
}

export default ItemUser;