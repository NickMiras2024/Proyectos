import creacionDeRed as CR
import numpy as np
import math as mt
import mostrador_de_matrices as MDM

class Cross_attention(): 
    def __init__(self,rutas,cantidad_de_capas,cantidad_de_neurona_por_capa,cantidad_de_pesos_por_capa,tasa_de_aprendizaje,funciones_de_activacion,presicion=12):      
        self.ultima_salida_q = []
        self.ultima_salida_k = []
        self.ultima_salida_v = []
        self.ultima_salida_a = []
        self.ultima_salida_M = []
        self.dimencion_de_K = 0

       
        self.keys = CR.Red_neuronal(
                                rutas[1],
                                cantidad_de_capas,
                                cantidad_de_neurona_por_capa,
                                cantidad_de_pesos_por_capa,
                                tasa_de_aprendizaje,
                                funciones_de_activacion,
                                presicion
                                )
        self.queris = CR.Red_neuronal(
                                rutas[0],
                                cantidad_de_capas,
                                cantidad_de_neurona_por_capa,
                                cantidad_de_pesos_por_capa,
                                tasa_de_aprendizaje,
                                funciones_de_activacion,
                                presicion
                                )
        self.values = CR.Red_neuronal(
                                rutas[2],
                                cantidad_de_capas,
                                cantidad_de_neurona_por_capa,
                                cantidad_de_pesos_por_capa,
                                tasa_de_aprendizaje,
                                funciones_de_activacion,
                                presicion
                                )
    def actualizar_redes(self,batch):
        self.values.actualizar_red(batch)
        self.queris.actualizar_red(batch)
        self.keys.actualizar_red(batch)

    def obtener_keys(self,datos_de_entrada):
        salida = self.keys.calcular_salida_de_red(datos_de_entrada)
        self.ultima_salida_k.append(salida)
        return salida
    def obtener_queris(self,datos_de_entrada):
        salida = self.queris.calcular_salida_de_red(datos_de_entrada)
        self.ultima_salida_q.append(salida)
        return salida
    
    def obtener_values(self,datos_de_entrada):
        salida = self.values.calcular_salida_de_red(datos_de_entrada)
        self.ultima_salida_v.append(salida)
        return salida
        
    def guardar_datos_de_redes(self):
        self.keys.gurardar_datos()
        self.values.gurardar_datos()
        self.queris.gurardar_datos()

    def desconatminador_de_numpy(self):
        matriz_q_descontaminada = []
        for fila in range(len(self.ultima_salida_q)):
            fila_q_descontaminada = []
            for col in range(len(self.ultima_salida_q[fila])):
                fila_q_descontaminada.append(float(self.ultima_salida_q[fila][col]))
            matriz_q_descontaminada.append(fila_q_descontaminada)
        
        matriz_v_descontaminada = []
        for fila in range(len(self.ultima_salida_v)):
            fila_v_descontaminada = []
            for col in range(len(self.ultima_salida_v[fila])):
                fila_v_descontaminada.append(float(self.ultima_salida_v[fila][col]))
            matriz_v_descontaminada.append(fila_v_descontaminada)
            
        matriz_k_descontaminada = []
        for fila in range(len(self.ultima_salida_k)):
            fila_k_descontaminada = []
            for col in range(len(self.ultima_salida_k[fila])):
                fila_k_descontaminada.append(float(self.ultima_salida_k[fila][col]))
            matriz_k_descontaminada.append(fila_k_descontaminada)
            
        self.ultima_salida_q = matriz_q_descontaminada
        self.ultima_salida_v = matriz_v_descontaminada
        self.ultima_salida_k = matriz_k_descontaminada



    def reinciar_memoria(self):
        self.keys.reiniciar_memoria_de_red()
        self.queris.reiniciar_memoria_de_red()
        self.values.reiniciar_memoria_de_red()

    def utilizar_CF(self,matriz_de_embeding,matriz_de_encoder):

        queris = []
        keys = []
        values = []



        for i in range(len(matriz_de_embeding)):
            queris.append(self.obtener_queris(matriz_de_embeding[i]))
            keys.append(self.obtener_keys(matriz_de_encoder[i]))
            values.append(self.obtener_values(matriz_de_encoder[i]))

        Mult = self.M(queris,keys)

        self.ultima_salida_M = Mult

        Att = self.A(Mult,len(keys[0]))

        self.dimencion_de_K = len(keys[0])
        self.ultima_salida_a = Att


        resultado = self.multiplicar_v_con_matriz_a(Att,values)

        return resultado

    def multiplicacion_de_vector_por_escalar(self,vector,escalar):
        vector_final = []
        for i in range(len(vector)):
            vector_final.append(vector[i] * escalar)
        
        return vector_final


    def multiplicar_v_con_matriz_a(self,matrizA,matrizB):
        # print(matrizA,matrizB)

        matriz_de_atencion = []
        for fila_de_a in range(len(matrizA)):
            matirz_de_values_con_atencion = []

            #calculo de values y atencion
            for elemento_de_a in range(len(matrizA[fila_de_a])):
                matirz_de_values_con_atencion.append(self.multiplicacion_de_vector_por_escalar(matrizB[elemento_de_a],matrizA[fila_de_a][elemento_de_a]))

            #suma de values para conseguir la atencion completa
            vector_de_atencion = []
            for fila_de_matriz in range(len(matirz_de_values_con_atencion)):
                for elemento_de_cada_vector in range(len(matirz_de_values_con_atencion[0])):
                    if fila_de_matriz == 0:
                        vector_de_atencion = matirz_de_values_con_atencion[fila_de_matriz]
                        break
                    else:
                        vector_de_atencion[elemento_de_cada_vector] += matirz_de_values_con_atencion[fila_de_matriz][elemento_de_cada_vector]
            
            matriz_de_atencion.append(vector_de_atencion)
            print('\nv',vector_de_atencion)

        return matriz_de_atencion

    def multiplicacion_de_matrizes(self,matrizA,matrizB):

        print('____________________________RES_______________________________')
        matriz_de_salida= []

        for fil in range(len(matrizA)):
            vector = []
            for colB in range(len(matrizB[0])):
                vectorB = []

                for filB in range(len(matrizB)):
                    vectorB.append(matrizB[filB][colB])

                vector.append(np.dot(matrizA[fil],vectorB))

            # print(vector)
            matriz_de_salida.append(vector)

        return matriz_de_salida

        
    def A(self,Mult,DM):
        # print('____________________________A_______________________________')
        matriz_de_atencion = []
        
        for m in range(len(Mult)):
            vector_dividido = Mult[m] / mt.sqrt(DM)
            # print(vector_dividido)
            matriz_de_atencion.append(self.softmax(vector_dividido))
            # print(matriz_de_atencion[m])


        return matriz_de_atencion



    def M(self,queris,keys):
        M = []
        # print('____________________________M_______________________________')
        for q in range(len(queris)):
            palabra_completa  = []
            for k in range(len(keys)):
                palabra_completa.append(np.dot(queris[q],keys[k]))     
            M.append(np.array(palabra_completa))

            # print(M[q])
        
        return M

        
    def softmax(self, x):
        x = x - np.max(x)  # Normaliza restando el máximo valor de la fila
        exp_x = np.exp(x)  # Calcula la exponencial de la fila
        return exp_x / np.sum(exp_x)  # Devuelve la probabilidad normalizada


    def softmax_derivative(self,softmax_output):
        # """ Calcula la matriz Jacobiana de la función Softmax """
        s = softmax_output.reshape(-1, 1)  # Convertimos a columna
        return np.diagflat(s) - np.dot(s, s.T)  # Jacobiano

    def backpropagation(self,error,numero_de_pasada):
        error_de_capa_anterior_por_palabra = {}
        error_de_codificador = {}
        for i in range(len(self.ultima_salida_a[0])): 
            error_de_capa_anterior_por_palabra[i] = []
            error_de_codificador[i] = []

    
        #se pasan los numero de tipo np.float32 a float 32 para la compativilidad con len()
        self.desconatminador_de_numpy()

        #________________________Values_________________________
        #en este pedazo del codigo se entrena la red de valores, para esto se accede a cada uno de los valores de la matriz A 
        #y se lo envia como error multiplicado por el error proveniente de la capa siguiente (por lo tanto el error tiene que ser 
        #un vector de n elementos, siendo n la dimencion del embeding), para todas las neuronas de una misma pasada, y así sucesivamente.
        # for fila in range(len(self.ultima_salida_a)):
        fila = numero_de_pasada
        for col in range(len(self.ultima_salida_a[fila])):
            matriz_de_errores = []
            for y in range(len(self.ultima_salida_v[0])):
                matriz_de_errores.append(float(self.ultima_salida_a[fila][col] * error[y]))

            # print('________________ENVIADO LOS DATOS A VALUES__________________', col)
            error_de_esta_capa = self.values.backpropagation_intrared(matriz_de_errores,col)
            for i in range(len(error_de_esta_capa)):
               error_de_codificador[col].append(error_de_esta_capa[i]) 


        #________________________Queris_________________________
        #en esta seccion se van a calcular las derivadas necesarias para la red query para esto se necesitan:
        #la derivada de la funcion softmax, la dimension de los vectores de las palabras (creo),los valores de V 
        #la idea seria hacer un bulcle igual al que se uso en values pero dentro hacer otro bloque para calcular las
        #derivadas que faltan (va a quedar un bloque bastante largo)

        #condensacion de los vectores v
        vectores_de_V_condesados = []
        for Fv in range(len(self.ultima_salida_v)):
            suma = 0
            for Cv in range(len(self.ultima_salida_v[Fv])):
                suma+= self.ultima_salida_v[Fv][Cv]
            vectores_de_V_condesados.append(suma)

        escalar = 1 / self.dimencion_de_K 
        

        def entrenar_segunda_parte():
            fila = numero_de_pasada
            pre_parte_a_del_back = self.softmax_derivative(self.ultima_salida_a[fila])
            
            
            
            for col in range(len(self.ultima_salida_a[fila])):
                v_actual = vectores_de_V_condesados[col]
                k_actual = self.ultima_salida_k[col]
                q_actual = self.ultima_salida_q[fila]


                v_escalado = v_actual * escalar     

                q_convertido_a_np = np.array(q_actual)
                k_convertido_a_np = np.array(k_actual)


                vector_de_errores_parcial =  v_escalado * k_convertido_a_np
                vector_de_errores_parcial_para_k = v_escalado * q_convertido_a_np
                
                #mezclar gradientes para conseguir el gradiente entero
                for elemento in range(len(pre_parte_a_del_back[col])):
                    vector_de_errores_completos =  self.multiplicacion_de_vector_por_escalar(escalar=pre_parte_a_del_back[col][elemento],vector=vector_de_errores_parcial)            
                    vector_de_errores_completos_k =  self.multiplicacion_de_vector_por_escalar(escalar=pre_parte_a_del_back[col][elemento],vector=vector_de_errores_parcial_para_k)            
                    
                    # print('vector final :',fila, vector_de_errores_completos)
                    
                    error = self.queris.backpropagation_intrared(vector_de_errores_completos,fila)
                    for i in range(len(error)):
                        error_de_capa_anterior_por_palabra[col].append(error[i]) 

                    error_k = self.queris.backpropagation_intrared(vector_de_errores_completos_k,fila)
                    for i in range(len(error)):
                        error_de_codificador[col].append(error_k[i]) 

        entrenar_segunda_parte()

        # print(error_de_codificador)
        return [error_de_capa_anterior_por_palabra,error_de_codificador]
