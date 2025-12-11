def mostrar_matriz(matriz):
    import numpy as np
    
    print('\n________MOSTRANDO MATRIZ_______\n')
    
    matriz = np.array(matriz)  # Aseguramos que sea numpy para usar ndim
    
    if matriz.ndim == 2:
        for fila in matriz:
            fila_str = '       '
            for val in fila:
                fila_str += str(round(float(val), 6)) + '   '
            # print(fila_str)
    
    elif matriz.ndim == 1:
        fila_str = '       '
        for val in matriz:
            fila_str += str(round(float(val), 6)) + '   '
        # print(fila_str)

    elif matriz.ndim == 0:  # Escalar
        # print('       ' + str(round(float(matriz), 6)))
        pass

    else:
        # print('⚠️ Formato de matriz no compatible.')
        pass
