import '../styles/info.css'




const Info = ({redireccion,dt,dt2,id}) => {
    return (
        <a href={redireccion} className="info" key={id} >
             <p className="p12" key={id*100} >{dt}</p>
            <img  className="p22" key={id*10} src={dt2}/>
        </a>
      );
}
 
export default Info;