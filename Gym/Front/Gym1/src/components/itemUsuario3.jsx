import '../styles/itemUser.css'
import tachito from '../assets/basura.png'
import { contextoGood } from '../App';
import { useContext } from 'react';



function ItemUser3({ data,url }) {

    const {cargarEntrenamiento,ruta}= useContext(contextoGood)




    let nombreArch;

    if (url) {
        nombreArch = `${ruta}${url}`

    }

    console.log(data, url, nombreArch)
    function eliminar2(data2) {
        const confirm = window.confirm('seguro que quieres eliminar este entrenamiento')
        if (confirm) {
            fetch(`${ruta}/eliminarEntrenamiento`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data2)
            });
        cargarEntrenamiento()
        // {"userDNI":data.UsuarioDNI}
        } else {
            // console.log(data2)
        }

    }




    console.log(data)
    return (
        <tr className="I">
            <td> {data.dia} </td>
            <td> {data.hs} </td>
            <td> {data.entrenamientos} </td>
            <td style={{ position: 'relative' }}>
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0)',
                        zIndex: 1,
                    }}
                    onClick={() => {
                        window.location.href = nombreArch

                    }}
                ></div>
                <iframe src={nombreArch} className='fra' style={{ background: "#fff" }}></iframe>
            </td>

            <td>
                <img className="botton" src={tachito}
                    onClick={() => { eliminar2({"id": data.id})}}
                />
            </td>
            

        </tr>
    );
}

export default ItemUser3;