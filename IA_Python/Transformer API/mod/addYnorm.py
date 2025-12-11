import numpy as np
import json
from pathlib import Path

# ✅ Función auxiliar, ahora fuera de la clase para reutilizarla en otros lados
def convertir_a_serializable(obj):
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, (np.float32, np.float64)):
        return float(obj)
    elif isinstance(obj, (np.int32, np.int64)):
        return int(obj)
    elif isinstance(obj, dict):
        return {k: convertir_a_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convertir_a_serializable(i) for i in obj]
    else:
        return obj

class LayerNorm:
    def __init__(self, dimencion_del_embeding, eps=1e-5, ruta_de_archivo=None):
        self.eps = eps
        self.ruta_de_archivo = Path(ruta_de_archivo) if ruta_de_archivo else None

        if self.ruta_de_archivo and self.ruta_de_archivo.exists():
            print(f"[INFO] Cargando parámetros desde {self.ruta_de_archivo}")
            with open(self.ruta_de_archivo, 'r') as archivo:
                datos = json.load(archivo)
                self.gamma = np.array(datos["gamma"])
                self.beta = np.array(datos["beta"])
        else:
            self.gamma = np.ones((1, dimencion_del_embeding))
            self.beta = np.zeros((1, dimencion_del_embeding))

        self.dgamma = 0
        self.dbeta = 0

    def add(self, matriz_a_sumar, matriz_sumando):
        matriz_final = []
        for num_de_vector in range(len(matriz_a_sumar)):
            vector_final = []
            for i in range(len(matriz_a_sumar[num_de_vector])):
                vector_final.append(matriz_a_sumar[num_de_vector][i] + matriz_sumando[num_de_vector][i])
            matriz_final.append(vector_final)
        return matriz_final

    def normalizado(self, x):
        self.x = x
        self.mu = np.mean(x, axis=1, keepdims=True)
        self.var = np.var(x, axis=1, keepdims=True)
        self.std = np.sqrt(self.var + self.eps)
        self.x_hat = (x - self.mu) / self.std
        out = self.gamma * self.x_hat + self.beta
        return out

    def backward(self, dout):
        N, D = np.array(self.x).shape
        self.dgamma = np.sum(dout * self.x_hat, axis=0, keepdims=True)
        self.dbeta = np.sum(dout, axis=0, keepdims=True)

        dxhat = dout * self.gamma
        dvar = np.sum(dxhat * (self.x - self.mu) * -0.5 * (self.std ** -3), axis=1, keepdims=True)
        dmu = np.sum(dxhat * -1 / self.std, axis=1, keepdims=True) + dvar * np.mean(-2 * (self.x - self.mu), axis=1, keepdims=True)
        dx = dxhat / self.std + dvar * 2 * (self.x - self.mu) / D + dmu / D
        return dx

    def step(self, lr,batch):
        self.gamma -= lr * self.dgamma / batch
        self.beta -= lr * self.dbeta   / batch

    def guardar(self):
        if not self.ruta_de_archivo:
            raise ValueError("No se definió ruta de guardado para LayerNorm.")
        
        self.ruta_de_archivo.parent.mkdir(parents=True, exist_ok=True)

        datos = {
            "gamma": convertir_a_serializable(self.gamma),
            "beta": convertir_a_serializable(self.beta)
        }

        with open(self.ruta_de_archivo, 'w') as archivo:
            json.dump(datos, archivo, indent=2)
            print(f"[GUARDADO] Parámetros LayerNorm guardados en {self.ruta_de_archivo}")
