import mod.self_attention as SA
import numpy as np 
import mod.creacionDeRed as CR
import time 


# __________________FUNCIONES DE ACTIVACION________________
def softmax(x):
    x = x - np.max(x)  # Normaliza restando el máximo valor de la fila
    exp_x = np.exp(x)  # Calcula la exponencial de la fila
    return exp_x / np.sum(exp_x)  # Devuelve la probabilidad normalizada


def funcion_lineal(x):
    return x

def derivada_de_funcion_lineal(x):
    return 1

def leaky_relu(x, alpha=0.01):
    return np.where(x > 0, x, alpha * x)

def leaky_relu_derivative(x, alpha=0.01):
    return np.where(x > 0, 1, alpha)

leaky_relu_function = CR.Funcion_de_activacion(leaky_relu,leaky_relu_derivative)
lineal_function = CR.Funcion_de_activacion(funcion_lineal,derivada_de_funcion_lineal)


bloqueSA = CR.Red_neuronal(
        'hola',
        3,
        [200,300,1],
        [2,200,300],
        0.01,
        [lineal_function,lineal_function,lineal_function],
        12
)

matriz_de_prueba = [0.1,0.2]





inicio = time.perf_counter()

for e in range(100):
    res = bloqueSA.calcular_salida_de_red(matriz_de_prueba)

    err = [ [ 2*(res[0] - 3)]]


    bloqueSA.backpropagation_intrared(err,0)

    print(res[0] ,'esto es error', err[0][0],e)
    bloqueSA.actualizar_red(1)
    # print(res)


final = time.perf_counter()


print('TARDO:',final-inicio,'Seg' )