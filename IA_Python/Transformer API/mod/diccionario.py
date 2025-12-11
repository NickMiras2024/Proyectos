import numpy as np

def obtener_diccionario(parrafo):
    #registro de palabras
    palabras = {}
    palabras_separadas = parrafo.split('-')
    print(palabras_separadas)
    for i in range(len(palabras_separadas)):
        if palabras_separadas[i] in palabras:
            pass
            # print('la palabra ya se encuentra registrada')
        else:
            palabras[palabras_separadas[i]] = []
    #enlace de palabras con su respectivo one-hot encoding 
    for indice,palabra in enumerate(palabras):
        palabras[palabra] = np.zeros(len(palabras))
        palabras[palabra][indice] = 1



    return palabras

