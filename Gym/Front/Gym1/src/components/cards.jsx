import '../styles/cads.css'



const Cards = ({ cont, c, id ,c2 = 'p1231'}) => {

    return (
            <div className={`${c} ${c}2 `} id='cards-container' key={id}>
                <p className={`h1C ${c2}`}  key={id * 100}>{cont}</p>
            </div>

    );
}

export default Cards;