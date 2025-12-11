import '../styles/itemUser.css'
import { contextoGood } from '../App';
import { useContext } from 'react';



function ItemUser5({ data }) {

    // console.log(data)

    return (
        <tr>
            <td>{data.fechaI}</td>
            <td>{data.dia}</td>
            <td>{data.hs}</td>
            <td>{data.entrenamiento}</td>

        </tr>
    );
}

export default ItemUser5;