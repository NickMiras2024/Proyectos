import '../App.css'
import BarraNav from '../components/barraNav';
import Cards from '../components/cards';
import Info from '../components/info';
import Registrarse1 from '../components/registrarse';
import { useContext, useState } from 'react'
import { contextoGood } from '../App'
import ubicacion from "../assets/ubicacion.png"
import insta from "../assets/instagram.png"
import face from "../assets/facebook.png"



function PagCent({ text }) {
  const [scrollA, setSA] = useState(false)
  const { getI, menu,setMenu,agregar,cargar, cerrar, setI, setC,setCarg, setElij,setA} = useContext(contextoGood)

  const [lastScrollTop, setls] = useState(0)

  window.addEventListener("scroll", function () {
    var currentScroll = document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
      // Scroll hacia abajo
      setSA(true)

      console.log("Scroll hacia abajo");
    } else {
      setSA(false)

      // Scroll hacia arriba
      console.log("Scroll hacia arriba");
    }
    setls(currentScroll <= 0 ? 0 : currentScroll); // For Mobile or negative scrolling
  }, false);


  let tamañoPantalla = screen.availWidth;





  return (
    <div className='contenedorB'>
      <div className='imagen1'>
        {
          !scrollA ?
          
                <BarraNav text={text} />
            : <></>
        }
        {
          getI ? <Registrarse1 /> : <></>
        }

        <h1 className='h1'>Sé tu mejor version</h1>
        <button className='btn1' onClick={ ()  =>{
            setA(true); setCarg(true)
            console.log(cargar,agregar)
        }}>Unete ahora</button>
      </div>

      <div className='bloque2'>
        {/* <h2 className='h2' >Qué ofrecemos?</h2> */}
        <p className='p1'>Nos comprometemos a brindarte con la mejor experiencia de entrenamiento.</p>
        <div className='contCards'>
          <Cards c={"card1"} cont={"Nuestro Gym"} id={1} />
          <Cards c={"card2"} cont={"EXPLORA NUESTRAS CLASES EN GRUPO"} id={1} />
          <Cards c={"card3"} cont={"ENTRENAMIENTOS PERSONALES"} id={1} />
        </div>
      </div>

      <div className='bloque3'>
        <h3 className='h3'>¡Ponte en contacto ahora!</h3>
        <div className='fotter'>
          <Info dt={'ubicacion'} id={3} dt2={ubicacion} redireccion={'https://www.google.com/maps/place/Av.+7+481,+B1906+Tolosa,+Provincia+de+Buenos+Aires/@-34.8963999,-57.9742746,21z/data=!4m6!3m5!1s0x95a2e7a7f58afe6b:0x76619725740dfe9c!8m2!3d-34.8963761!4d-57.9742467!16s%2Fg%2F11rg5_k0q9!5m1!1e2?entry=ttu'} />
          <Info dt={'Instagram'} id={4} dt2={insta} redireccion={'https://www.instagram.com/'} />
          <Info dt={'Facebook'} id={5} dt2={face} redireccion={'https://www.facebook.com/'} />

        </div>
      </div>


    </div>
  );
}

export default PagCent;