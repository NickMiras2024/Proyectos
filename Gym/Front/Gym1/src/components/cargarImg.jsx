import "../styles/cargarImgs.css"


function CargarImgs(src1,ie) {
    console.log(src1.src1.infoI.data)

    let arch = src1.src1.puntoA

    function arrayBufferToBase64(buffer) {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    const base64Image = arrayBufferToBase64(src1.src1.infoI.data);


    // Crear una URL de datos con la cadena Base64
    let imageUrl = `data:image/${arch};base64,${base64Image}`;




    return (
        <img src={imageUrl} id={ie} className="imgs1" alt=""
            draggable={true} onDragStart={
                ('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', src1.src1.url);
                })}

        />
    );
}

export default CargarImgs;