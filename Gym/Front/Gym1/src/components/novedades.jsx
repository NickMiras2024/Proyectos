import CargarImgs from "./cargarImg";
import { contextoGood } from "../App";
import { useContext } from "react";


async function Novedades() {

    const [ruta] = useContext(contextoGood)



    const res =await fetch(`${ruta}/novedades`)


    console.log(res)




    return (

        <div>
            <CargarImgs/>
        
        </div>


     );
}

export default Novedades;