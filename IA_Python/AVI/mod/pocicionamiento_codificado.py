import numpy as np

def positional_encoding(max_len=100, d_model=100):
    # Matriz para almacenar el encoding (max_len, d_model)
    pos_enc = np.zeros((max_len, d_model))
    
    # Vector de posiciones (0, 1, ..., max_len-1)
    positions = np.arange(max_len).reshape(-1, 1)
    
    # Calculamos las frecuencias para cada dimensión
    div_term = np.power(10000, -2 * (np.arange(d_model) // 2) / d_model)
    
    # Aplicamos sin() a las dimensiones pares y cos() a las impares
    pos_enc[:, 0::2] = np.sin(positions * div_term[0::2])  # pares (0, 2, 4, ...)
    pos_enc[:, 1::2] = np.cos(positions * div_term[1::2])  # impares (1, 3, 5, ...)
    
    return pos_enc
