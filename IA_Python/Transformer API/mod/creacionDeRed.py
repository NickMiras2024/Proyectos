import json
import numpy as np
from pathlib import Path
import sys
sys.path.append('C:\\Users\\PC\\Desktop\\Nico\\IA\\IA_Python\\AVI\\mod')
from procesamientoConGPU import producto_punto_con_GPU_de_red_completa,sumador_de_columnas_con_GPU


class Red_neuronal():
    def __init__(self, archivo, cantidad_de_capas, cantidad_de_neurona_por_capa,
                 cantidad_de_pesos_por_capa, tasa_de_aprendizaje, funciones_de_activacion, presicion=12):

        self.capas = {}
        self.nombre_de_archivo = Path(archivo)

        if self.nombre_de_archivo.exists():
            print(f"[INFO] Cargando red desde archivo: {self.nombre_de_archivo}")
            with open(self.nombre_de_archivo, "r") as f:
                datos_guardados = json.load(f)
        else:
            print(f"[INFO] No se encontró archivo, creando nueva red.")
            datos_guardados = None

        for i in range(cantidad_de_capas):
            pesos_y_sesgos = datos_guardados[str(i)]["neuronas"] if datos_guardados else None

            self.capas[i] = Capa_neuronal(
                cantidad_de_neurona_por_capa[i],
                cantidad_de_pesos_por_capa[i],
                tasa_de_aprendizaje,
                funciones_de_activacion[i],
                presicion,
                pesos_y_sesgos
            )

    def calcular_salida_de_red(self, datos_de_entrada):
        salida = datos_de_entrada
        for capa in self.capas:
            salida = self.capas[capa].calcular_salida_de_capa(salida)
        return salida

    def backpropagation_intrared(self, errores, numero_de_pasada):
        matriz_de_errores = errores
        for capa in range(len(self.capas)):
            matriz_de_errores = self.capas[(len(self.capas)-1)-capa].backpropagation_intracapa(
                matriz_de_errores, numero_de_pasada)
        return matriz_de_errores

    def convertir_a_serializable(self,obj):
        import numpy as np

        if isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, (np.float32, np.float64)):
            return float(obj)
        elif isinstance(obj, (np.int32, np.int64)):
            return int(obj)
        elif isinstance(obj, dict):
            return {k: self.convertir_a_serializable(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self.convertir_a_serializable(i) for i in obj]
        else:
            return obj


    def gurardar_datos(self):
        datos_para_guardar = {}

        for i, capa in self.capas.items():
            datos_para_guardar[i] = {"neuronas": []}
            for neurona in capa.capa.values():
                datos_para_guardar[i]["neuronas"].append({
                    "pesos": neurona.pesos,
                    "sesgo": neurona.sesgo
                })

        self.nombre_de_archivo.parent.mkdir(parents=True, exist_ok=True)

        datos_convertidos = self.convertir_a_serializable(datos_para_guardar)

        with open(self.nombre_de_archivo, "w") as archivo:
            json.dump(datos_convertidos, archivo, indent=2)
            print(f"[GUARDADO] Red guardada en: {self.nombre_de_archivo}")

    def mostrarUP(self):
        return self.capas[0].mostrarPeso()

    def reiniciar_memoria_de_red(self):
        for capa in self.capas:
            self.capas[capa].reiniciar_memoria_de_capa()

    def actualizar_red(self,batch):
        for capa in range(len(self.capas)):
            self.capas[capa].actualizar_capa(batch)


class Capa_neuronal():
    def __init__(self, cantidad_de_neuronas, pesos_por_neurona, tasa, funcion, presicion=12, pesos_y_sesgos=None):
        self.cantidad_de_neuronas = cantidad_de_neuronas
        self.capa = {}
        for i in range(cantidad_de_neuronas):
            pesos = pesos_y_sesgos[i]["pesos"] if pesos_y_sesgos else None
            sesgo = pesos_y_sesgos[i]["sesgo"] if pesos_y_sesgos else None

            self.capa[i] = Neurona(pesos_por_neurona, tasa, presicion, funcion, pesos, sesgo)

    def calcular_salida_de_capa(self, datos):
        matriz_de_pesos = [self.capa[n].pesos for n in self.capa]
        pre_res = producto_punto_con_GPU_de_red_completa(np.array(matriz_de_pesos), datos)

        salida = []
        for n in self.capa:
            self.capa[n].gurdar_ultimos_datos(datos)
            r = pre_res[n] + self.capa[n].sesgo
            self.capa[n].guardar_ultima_respuesta(r)
            salida.append(r)
        return salida

    def backpropagation_intracapa(self, errores, numero_de_pasada):
        matriz_de_errores = []
        errores_np = np.array(errores)
        if errores_np.ndim > 1:
            for y in range(len(errores[0])):
                error_total = sum(errores[x][y] for x in range(len(errores)))
                matriz_de_errores.append(self.capa[y].backpropagation(error_total, numero_de_pasada))
        else:
            for y in range(len(errores)):
                matriz_de_errores.append(self.capa[y].backpropagation(errores[y], numero_de_pasada))
        return matriz_de_errores

    def actualizar_capa(self,batch):
        for neurona in range(len(self.capa)):
            self.capa[neurona].actualizar_neurona(batch)


    def reiniciar_memoria_de_capa(self):
        for neurona in self.capa.values():
            neurona.reiniciar_memoria_de_neurona()

    def mostrarPeso(self):
        return self.capa[0].mostrarpeso1()


class Neurona():
    def __init__(self, cantidad_de_pesos, tasa, presicion, funcion, pesos=None, sesgo=None):
        self.funcion = funcion
        self.tasa_de_aprendizaje = tasa
        self.presicion = presicion
        self.sesgo = sesgo if sesgo is not None else np.random.rand()
        self.pesos = pesos if pesos is not None else [np.random.uniform(-0.05, 0.05) for _ in range(cantidad_de_pesos)]
        self.gradiente_sumado = np.zeros(len(self.pesos))
        self.gradiente_sumado_sesgo = 0

        self.ultimos_datos_entrantes = []
        self.ultima_respuestas = []

    def funcion_de_activacion(self, dato):
        return self.funcion.funcion_de_act(dato)

    def derivada_de_funcion_de_activacion(self, dato):
        return self.funcion.derivada_de_funcion_de_act(dato)

    def gurdar_ultimos_datos(self, arr):
        self.ultimos_datos_entrantes.append(arr)

    def guardar_ultima_respuesta(self, res):
        self.ultima_respuestas.append(res)

    def reiniciar_memoria_de_neurona(self):
        self.ultimos_datos_entrantes = []
        self.ultima_respuestas = []

    def mostrarpeso1(self):
        return f'{self.sesgo} y {self.pesos[0]}'

    def backpropagation(self, error, numero_de_pasada):
        error = max(min(error, 5), -5)
        derivada = error * self.derivada_de_funcion_de_activacion(self.ultima_respuestas[numero_de_pasada])
        erroresDCN = []
        self.gradiente_sumado_sesgo -= round(self.tasa_de_aprendizaje * derivada, self.presicion)

        for i in range(len(self.pesos)):
            erroresDCN.append(round(self.pesos[i] * derivada, self.presicion))
            self.gradiente_sumado[i] -= self.tasa_de_aprendizaje * derivada * self.ultimos_datos_entrantes[numero_de_pasada][i]
        return erroresDCN

    def actualizar_neurona(self,batch):

        self.sesgo += self.gradiente_sumado_sesgo / batch
        self.gradiente_sumado_sesgo = 0

        for i in range(len(self.pesos)):
            self.pesos[i] += self.gradiente_sumado[i] / batch
            self.gradiente_sumado[i] = 0



class Funcion_de_activacion():
    def __init__(self, funcion, derivada):
        self.funcion = funcion
        self.derivada = derivada

    def funcion_de_act(self, datos):
        return self.funcion(datos)

    def derivada_de_funcion_de_act(self, datos):
        return self.derivada(datos)
