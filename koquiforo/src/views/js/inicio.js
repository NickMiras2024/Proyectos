let cont = document.getElementById('contenedor');

let resC





async function bi() {
    await fetch('../datos.json')
        .then(res => res.json())
        .then(rep => resC = rep)
    cont.addEventListener('click', () => {
        if (resC.cinematicas) {
            window.location.href = '../index.html';
        } else {
            window.location.href = '../otrosEnlaces/cinematicas.html'
        }
    })
}

bi()