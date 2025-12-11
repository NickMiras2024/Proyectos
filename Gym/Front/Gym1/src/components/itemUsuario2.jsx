import '../styles/itemUser.css'
import { contextoGood } from '../App';
import { useContext } from 'react';



function ItemUser2({ data }) {

    const {usuarioAC,setUAC,cargarEntrenamiento}= useContext(contextoGood)


    return (
        <tr className='tr' onClick={()=> {
            setUAC(data);
            cargarEntrenamiento({"userDNI":data.clienteDNI})
        
        }}>

            <td>{data.nombreU}</td>
            <td>{data.clienteDNI}</td>

        </tr>
    );
}

export default ItemUser2;