import '../styles/itemUser.css';
import tachito from '../assets/basura.png';
import { contextoGood } from '../App';
import { useContext } from 'react';



function ItemUser7({ data }) {

    console.log(data)

    let usuario = JSON.parse(window.localStorage.getItem('usuario'))

    const {ruta,setElij } = useContext(contextoGood)

    console.log("esto es usuarioACTUAL", usuario)

    async function eliminar(data){
        const response = await fetch(`${ruta}/eliminarPreUsuarios`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
        console.log(await response.json())
    }


    async function aceptar(data){
        const res = await fetch(`${ruta}/registrarse`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
      
          let res2 = await res.text()
      
          if (res2 == 'ya esta registrado') {
            alert("Ya se encuentra registrado ")
          }
          await eliminar({ "DNI": usuario.DNI, "contrasena": usuario.contrasena, "Email": usuario.Email,"CDNI": data.DNI,  "CEmail": data.Email})

        setElij(false)
        }





    return (
        <tr>

            <td>{data.DNI}</td>
            <td>{data.nombre}</td>
            <td>{data.Email}</td>
            <td>{data.rango}</td>
            <td>{data.tel}</td>
            <td>

                <button 
                    onClick={()=>{
                        aceptar(data)
                    }}>
                    Aceptar
                </button>

            </td>
            <td>  
                <img className="botton" src={tachito}
                    onClick={() => { eliminar({ "DNI": usuario.DNI, "contrasena": usuario.contrasena, "Email": usuario.Email,"CDNI": data.DNI,  "CEmail": data.Email}) }}
                />
            </td>


        </tr>
    );
}

export default ItemUser7;