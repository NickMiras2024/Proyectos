import creacionDeRed as CR
import self_attention as SLFA
import addYnorm as AN
import mostrador_de_matrices as MDM
import numpy as np
import procesamientoConGPU as PCGPU

class Codificador():
    #este es el codigo encargado de crear cada codificador, primero se crean las cabezas del multi-head-self-attention
    #encargadas de repartir la atencion que se le va a dar a cada palabra cuando se este enfocando una 
    #posterirormente se crea el primer addYnorm, luego se crea la red feedFordward encargada de "armonizar" el resultado
    #que devuelve el multi-head-self-atencion, ya que devuelve un vector concatenado, por ultimo se crea otro addYNorm.  
    def __init__(self,
                 #rutas
                 ruta_ADD_NORM_1,
                 ruta_ADD_NORM_2,
                 ruta_FNF,
                 rutas,
                 #self_attention
                 cantidad_de_cabezas_SLFA,dimencion_del_embeding,
                 cantidad_de_capas_SLFA,cantidad_de_neurona_por_capa_SLFA,
                 cantidad_de_pesos_por_capa_SLFA,tasa_de_aprendizaje_SLFA,
                 funciones_de_activacion_SLFA,precicion_SLFA,
                 
                 #feedFordward 
                 cantidad_de_capas_FFN,cantidad_de_neurona_por_capa_FFN,
                 cantidad_de_pesos_por_capa_FFN,tasa_de_aprendizaje_FFN,
                 funciones_de_activacion_FFN,presicion_FFN  
                
                ):
        #self-attention
        self.cabezas = []
        if(dimencion_del_embeding%cantidad_de_cabezas_SLFA == 0):
            print('se puede continuar con tranquilidad :)')
            cantidad_de_neurona_por_capa_SLFA[-1] = int(dimencion_del_embeding/cantidad_de_cabezas_SLFA) 
            print(cantidad_de_neurona_por_capa_SLFA)
        else:
            print('no se puede continuar, el embeding no es divisible por la cantidad de cabezas :(')
            return 
        for cabeza in range(cantidad_de_cabezas_SLFA):
            rutas_finales = []
            for i in range(len(rutas)):
                rutas_finales.append(f'{rutas[i]}_cabeza{cabeza}.txt')
            print(rutas_finales)
            self.cabezas.append(SLFA.Self_attention(
                            rutas_finales,
                            cantidad_de_capas_SLFA,
                            cantidad_de_neurona_por_capa_SLFA,
                            cantidad_de_pesos_por_capa_SLFA,
                            tasa_de_aprendizaje_SLFA,
                            funciones_de_activacion_SLFA,
                            precicion_SLFA
                            ))

        #addYnorm1
        self.addYnomr1 = AN.LayerNorm(dimencion_del_embeding,1e-5,ruta_ADD_NORM_1)

        #FeedFordward
        self.feedFordward = CR.Red_neuronal(
            #ruta
            ruta_FNF,
            #red
            cantidad_de_capas_FFN,
            cantidad_de_neurona_por_capa_FFN,
            cantidad_de_pesos_por_capa_FFN,
            tasa_de_aprendizaje_FFN,
            funciones_de_activacion_FFN,
            presicion_FFN
        )

        #addYnorm2
        self.addYnomr2 = AN.LayerNorm(dimencion_del_embeding,1e-5,ruta_ADD_NORM_2)


        print(self.cabezas,self.addYnomr1,self.feedFordward,self.addYnomr2)


    def guardar_datos_de_codificador(self):
        for i in range(len(self.cabezas)):
            self.cabezas[i].guardar_datos_de_redes()
        
        self.feedFordward.gurardar_datos()
        self.addYnomr1.guardar()
        self.addYnomr2.guardar()



    #acá frases tiene que ser una matriz 2D
    def calculo_hacia_adelante(self,frase):
        
        #___________________self_attention__________________:
        resultado_de_las_cabezas = []

        for cabeza in range(len(self.cabezas)):
            resultado_de_cabeza = self.cabezas[cabeza].utilizar_SF(frase)
            # print('m',resultado_de_cabeza)
            resultado_de_las_cabezas.append(resultado_de_cabeza)

        #concatenacion de las semi_palabras
        palabras_completas_con_atencion = []
        # print(resultado_de_las_cabezas)

        for cabeza in range(len(resultado_de_las_cabezas)):
            for semi_palabra in range(len(resultado_de_las_cabezas[cabeza])):
                if cabeza == 0:
                    palabras_completas_con_atencion = resultado_de_las_cabezas[cabeza]
                    break
                else:
                    palabras_completas_con_atencion[semi_palabra] = palabras_completas_con_atencion[semi_palabra] + resultado_de_las_cabezas[cabeza][semi_palabra]
        
        # print('\nPC', palabras_completas_con_atencion)


        #__________________addYNomr1______________

        #suma
        resultado_de_add_1 = self.addYnomr1.add(palabras_completas_con_atencion,frase)

        #normalizado
        resultado_de_normalizacion_1 = self.addYnomr1.normalizado(resultado_de_add_1)

        #__________________feedFordward__________________

        #pasada de palabras (se le pasan 1 por 1)

        palabras_procesadas = []

        for palabra in range(len(resultado_de_normalizacion_1)):
            palabras_procesadas.append(self.feedFordward.calcular_salida_de_red(resultado_de_normalizacion_1[palabra]))

        # print('\n',palabras_procesadas)

        #_________________addYNorm2_______________________

        #suma
        resultado_de_add_2 = self.addYnomr2.add(palabras_procesadas,resultado_de_normalizacion_1)

        #normalizado
        resultado_final_del_codificador = self.addYnomr2.normalizado(resultado_de_add_2)


        return resultado_final_del_codificador


    def sumador_de_columnas(self, matriz):
        return PCGPU.sumador_de_columnas_con_GPU(matriz)

    def backpropagation(self,errores):
        #se itera sobre cada palabra actualizando la red y derivando el error 

        objeto_con_errores = {}
        palabras_errores = {}

        #___________________addYNorm2_______________________
        for palabra in range(len(errores)):
            # print('___________________addYNorm2_______________________\n')
            vector_de_error_para_add_y_norm2 = self.sumador_de_columnas(errores[palabra])
            
            vector_de_error_para_add_y_norm2_np = np.array(vector_de_error_para_add_y_norm2)
            error_para_feedFordward = self.addYnomr2.backward(vector_de_error_para_add_y_norm2_np)


        #___________________FEEDFORDWARD____________________
            # print('___________________FEEDFORDWARD____________________\n')

            errores_para_add_y_norm1 = self.feedFordward.backpropagation_intrared(error_para_feedFordward,palabra)
            
        #___________________addYNorm1________________________
            # print('___________________addYNorm1________________________\n')
            
            vector_de_error_para_add_y_norm1 = self.sumador_de_columnas(errores_para_add_y_norm1)

            vector_de_error_para_add_y_norm1_np = np.array(vector_de_error_para_add_y_norm1)
            error_para_self_attention = self.addYnomr2.backward(vector_de_error_para_add_y_norm1_np)

        #___________________SELF_ATTENTION________________________    
            # print('___________________SELF_ATTENTION________________________\n')

            errores_para_cada_una_de_las_cabezas = {}

            #se separa el error de columpnas para enviarselas a las respectivas cabezas
            for cabeza in range(len(self.cabezas)):
                # print(error_para_self_attention)
                errores_sf = []
                for fila in range(len(error_para_self_attention)):
                    vector = []
                    for col in range(int(len(error_para_self_attention[0])/len(self.cabezas))):
                        # print('hola',len(self.cabezas),int(len(error_para_self_attention[0])/len(self.cabezas)),col)
                        vector.append(error_para_self_attention[fila][col+len(self.cabezas)*cabeza])
                    errores_sf.append(vector)
                errores_para_cada_una_de_las_cabezas[cabeza] = errores_sf



            #se entrenan las cabezas con los errores  
            for cabeza in range(len(self.cabezas)):
                vector_de_error_para_self_attention_cabeza = self.sumador_de_columnas(errores_para_cada_una_de_las_cabezas[cabeza])
                error_para_capa_anterior = self.cabezas[cabeza].backpropagation(vector_de_error_para_self_attention_cabeza,palabra)


               #se guarda en el objeto de errores los errores que devolvieron cada una de las cabezas 
                objeto_con_errores[cabeza] = error_para_capa_anterior

                # MDM.mostrar_matriz(error_para_capa_anterior[0])
            

            #convierte el objeto (que en un inicio era del tamaño de las cabezas) en uno solo para que se pueda enviar a la capa anterior
            for numero_de_cabeza in range(len(objeto_con_errores)):
                for numero_de_palabra in range(len(objeto_con_errores[numero_de_cabeza])):
                    if numero_de_cabeza == 0:
                        palabras_errores = objeto_con_errores[numero_de_cabeza]
                        break
                    else: 
                        for fila in range(len(objeto_con_errores[numero_de_cabeza][numero_de_palabra])):
                            palabras_errores[numero_de_palabra].append(objeto_con_errores[numero_de_cabeza][numero_de_palabra][fila])


        return palabras_errores
    
    def reiniciar_memoria_del_bloque(self):
        for cabeza in range(len(self.cabezas)):
            self.cabezas[cabeza].reinciar_memoria()
        self.feedFordward.reiniciar_memoria_de_red()

    def actualizar_codificador(self,batch):
        for cabeza in range(len(self.cabezas)):
            self.cabezas[cabeza].actualizar_redes(batch)
        self.feedFordward.actualizar_red(batch)
        self.addYnomr1.step(0.1,batch)
        self.addYnomr2.step(0.1,batch)

    def mostrar_data(self):
        return self.feedFordward.mostrarUP()
  