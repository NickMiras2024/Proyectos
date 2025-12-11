import mod.creacionDeRed as CR
import mod.pocicionamiento_codificado as PCD
import mod.embeding as EMB
import numpy as np
import mod.self_attention as SLFA
import mod.addYnorm as ADDNORM
import mod.codifiicador as COD
import mod.mostrador_de_matrices as MDM
import mod.decodificador as DECOD
import mod.diccionario as DICCS
import mod.procesamientoConGPU as PCGPU
import os 

#__________________ESTABLECER_RUTAS_DE_GUARDADO__________

#ruta absoluta de archivo principal
ruta_actual = os.getcwd()

#ruta con carpeta

carpeta_nombre = os.path.join(ruta_actual,'data')


#__rutas relativas de los archivos

#capa lineal
capa_linear_ruta = os.path.join(carpeta_nombre,'capa_lineal.txt')

#bloque_1
bloqeu_1_ADDNORM1_ruta = os.path.join(carpeta_nombre,'bloqeu_1_ADDNORM1_ruta.txt')
bloqeu_1_ADDNORM2_ruta = os.path.join(carpeta_nombre,'bloqeu_1_ADDNORM2_ruta.txt')
bloqeu_1_FNF_ruta = os.path.join(carpeta_nombre,'bloque_1_FNF_ruta.txt')
bloqeu_1_q_ruta = os.path.join(carpeta_nombre,'bloque_1_q_ruta')
bloqeu_1_v_ruta = os.path.join(carpeta_nombre,'bloque_1_v_ruta')
bloqeu_1_k_ruta = os.path.join(carpeta_nombre,'bloque_1_k_ruta')


#bloque_2
bloqeu_2_ADDNORM1_ruta = os.path.join(carpeta_nombre,'bloqeu_2_ADDNORM1_ruta.txt')
bloqeu_2_ADDNORM2_ruta = os.path.join(carpeta_nombre,'bloqeu_2_ADDNORM2_ruta.txt')
bloqeu_2_FNF_ruta = os.path.join(carpeta_nombre,'bloque_2_FNF_ruta.txt')
bloqeu_2_q_ruta = os.path.join(carpeta_nombre,'bloque_2_q_ruta')
bloqeu_2_v_ruta = os.path.join(carpeta_nombre,'bloque_2_v_ruta')
bloqeu_2_k_ruta = os.path.join(carpeta_nombre,'bloque_2_k_ruta')


#bloque_3
bloqeu_3_ADDNORM1_ruta = os.path.join(carpeta_nombre,'bloqeu_3_ADDNORM1_ruta.txt')
bloqeu_3_ADDNORM2_ruta = os.path.join(carpeta_nombre,'bloqeu_3_ADDNORM2_ruta.txt')
bloqeu_3_FNF_ruta = os.path.join(carpeta_nombre,'bloque_3_FNF_ruta.txt')
bloqeu_3_q_ruta = os.path.join(carpeta_nombre,'bloque_3_q_ruta')
bloqeu_3_v_ruta = os.path.join(carpeta_nombre,'bloque_3_v_ruta')
bloqeu_3_k_ruta = os.path.join(carpeta_nombre,'bloque_3_k_ruta')


#bloque_4
bloqeu_4_ADDNORM1_ruta = os.path.join(carpeta_nombre,'bloqeu_4_ADDNORM1_ruta.txt')
bloqeu_4_ADDNORM2_ruta = os.path.join(carpeta_nombre,'bloqeu_4_ADDNORM2_ruta.txt')
bloqeu_4_FNF_ruta = os.path.join(carpeta_nombre,'bloque_4_FNF_ruta.txt')
bloqeu_4_q_ruta = os.path.join(carpeta_nombre,'bloque_4_q_ruta')
bloqeu_4_v_ruta = os.path.join(carpeta_nombre,'bloque_4_v_ruta')
bloqeu_4_k_ruta = os.path.join(carpeta_nombre,'bloque_4_k_ruta')

#embeding
embeding_ruta = os.path.join(carpeta_nombre,'embegin_ruta.txt')






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


#_______________________DATOS_DE_ENTRENAMIENTO_Y_DICCIONARIO_____________
#este es el texto que se va a utilizar para generar el diccionario

texto_para_el_entrenamiento = """<usr> Hola <bot> Hola, soy AVI, ¿en qué puedo ayudarte? <eos>
<usr> ¿Cómo estás? <bot> Estoy bien, gracias por preguntar. ¿Y tú? <eos>
<usr> ¿Cuál es tu nombre? <bot> Mi nombre es AVI, un asistente inteligente. <eos>
<usr> ¿Qué puedes hacer? <bot> Puedo ayudarte a responder preguntas y realizar tareas básicas. <eos>
<usr> ¿Puedes contarme un chiste? <bot> Claro, ¿por qué el programador odiaba el océano? Porque tenía demasiados bugs. <eos>
<usr> ¿Cuál es la capital de Argentina? <bot> La capital de Argentina es Buenos Aires. <eos>
<usr> ¿Qué hora es? <bot> No tengo acceso al tiempo real, pero puedo ayudarte con otras cosas. <eos>
<usr> ¿Puedes ayudarme a programar? <bot> Sí, puedo ayudarte con código en varios lenguajes y explicarte conceptos. <eos>
<usr> ¿Quién te creó? <bot> Fui creado por desarrolladores dedicados para asistirte. <eos>
<usr> Gracias <bot> ¡De nada! Si necesitas algo más, aquí estoy. <eos>
"""

#se prepara el texto en pregunta respuesta para el entrenamiento 
def preparacion_de_datos(texto):
    texto_minuscula = texto.lower()
    texto_sin_saltos = texto_minuscula.replace('\n','')

    texto_divido_por_user =  texto_sin_saltos.split('<usr> ')

    del texto_divido_por_user[0]

    print(texto_divido_por_user)
  

    frase_datos = {}
    for i in range(len(texto_divido_por_user)):
        frase_divida = texto_divido_por_user[i].split('<bot>')
        frase_datos[i] = {'pregunta': frase_divida[0], 'respuesta': frase_divida[1], }

    return frase_datos

datos_para_entrenar = preparacion_de_datos(texto_para_el_entrenamiento)

#se refina el texto para crear el diccionario para el embeding
def refinacion_del_texto(texto):
    texto_minuscula = texto.lower()
    texto_sin_sub = texto_minuscula.replace('<usr>','')
    texto_sin_bot = texto_sin_sub.replace('<bot>','')
    texto_sin_saltos = texto_sin_bot.replace('\n','')
    texto_sin_espacios = texto_sin_saltos.replace(' ', '-')
    texto_final = texto_sin_espacios.replace('--', '-')


    return texto_final

texto_refinado = refinacion_del_texto(texto_para_el_entrenamiento)

print(texto_refinado)

diccionario_one_hot = DICCS.obtener_diccionario(texto_refinado)


#_______________________EMBEDING_______________________

longitud_maxima_de_tokens = 100
dimencion_del_embeding = 32
cantidad_de_palabras_en_el_diccionario = len(diccionario_one_hot)



capa_embeding = EMB.Crear_capa_embeding(embeding_ruta,dimencion_del_embeding,cantidad_de_palabras_en_el_diccionario,0.1,leaky_relu_function)

def crear_embeding_para_palabra(palabra):  
    return capa_embeding.utilizar_capa_embeding(diccionario_one_hot[palabra] )


#____________________CODIFICADOR_POSICIONAL_______________________ 
#es una matriz que tiene lo que sele tiene que sumar a cada posicion 
#de palabras para darle un sentido posicional
posicional_encodign = PCD.positional_encoding(longitud_maxima_de_tokens,dimencion_del_embeding)


#____________________DECODERs_______________________ 
#en este tipo de modelo no se usa el encoder pero como es un modelo auterregresivo
#al no tener encoder el decoder es igual al encoder (no tiene cross attention)
#por eso se usa el codificador 

cantidad_de_neuronas1 = 32
cantidad_de_neuronas2 = 64
multiplicador_de_FNF = 4

bloque_1 = COD.Codificador(
                            #ruta
                            bloqeu_1_ADDNORM1_ruta,
                            bloqeu_1_ADDNORM2_ruta,
                            bloqeu_1_FNF_ruta,
                            [bloqeu_1_q_ruta,bloqeu_1_k_ruta,bloqeu_1_v_ruta],
                            #multi-head-attention
                            4,
                            dimencion_del_embeding,
                            3,
                            [cantidad_de_neuronas1,cantidad_de_neuronas2,dimencion_del_embeding],
                            [dimencion_del_embeding,cantidad_de_neuronas1,cantidad_de_neuronas2],
                            0.01,
                            [leaky_relu_function,leaky_relu_function,leaky_relu_function],
                            12,
                            #feedFordward

                            2,
                            [multiplicador_de_FNF*dimencion_del_embeding,dimencion_del_embeding],
                            [dimencion_del_embeding,multiplicador_de_FNF*dimencion_del_embeding],
                            0.01,
                            [leaky_relu_function,leaky_relu_function],
                            12
)

bloque_2 = COD.Codificador(
                            #ruta
                            bloqeu_2_ADDNORM1_ruta,
                            bloqeu_2_ADDNORM2_ruta,
                            bloqeu_2_FNF_ruta,
                            [bloqeu_2_q_ruta,bloqeu_2_k_ruta,bloqeu_2_v_ruta],
                            
                            #multi-head-attention
                            4,
                            dimencion_del_embeding,
                            3,
                            [cantidad_de_neuronas1,cantidad_de_neuronas2,dimencion_del_embeding],
                            [dimencion_del_embeding,cantidad_de_neuronas1,cantidad_de_neuronas2],
                            0.01,
                            [leaky_relu_function,leaky_relu_function,leaky_relu_function],
                            12,
                            #feedFordward

                            2,
                            [multiplicador_de_FNF*dimencion_del_embeding,dimencion_del_embeding],
                            [dimencion_del_embeding,multiplicador_de_FNF*dimencion_del_embeding],
                            0.01,
                            [leaky_relu_function,leaky_relu_function],
                            12
)


bloque_3 = COD.Codificador(
                            #ruta
                            bloqeu_3_ADDNORM1_ruta,
                            bloqeu_3_ADDNORM2_ruta,
                            bloqeu_3_FNF_ruta,
                            [bloqeu_3_q_ruta,bloqeu_3_k_ruta,bloqeu_3_v_ruta],
                            
                            #multi-head-attention
                            4,
                            dimencion_del_embeding,
                            3,
                            [cantidad_de_neuronas1,cantidad_de_neuronas2,dimencion_del_embeding],
                            [dimencion_del_embeding,cantidad_de_neuronas1,cantidad_de_neuronas2],
                            0.01,
                            [leaky_relu_function,leaky_relu_function,leaky_relu_function],
                            12,
                            #feedFordward

                            2,
                            [multiplicador_de_FNF*dimencion_del_embeding,dimencion_del_embeding],
                            [dimencion_del_embeding,multiplicador_de_FNF*dimencion_del_embeding],
                            0.01,
                            [leaky_relu_function,leaky_relu_function],
                            12
)


bloque_4 = COD.Codificador(
                            #ruta
                            bloqeu_4_ADDNORM1_ruta,
                            bloqeu_4_ADDNORM2_ruta,
                            bloqeu_4_FNF_ruta,
                            [bloqeu_4_q_ruta,bloqeu_4_k_ruta,bloqeu_4_v_ruta],
                            
                            #multi-head-attention
                            4,
                            dimencion_del_embeding,
                            3,
                            [cantidad_de_neuronas1,cantidad_de_neuronas2,dimencion_del_embeding],
                            [dimencion_del_embeding,cantidad_de_neuronas1,cantidad_de_neuronas2],
                            0.01,
                            [leaky_relu_function,leaky_relu_function,leaky_relu_function],
                            12,
                            #feedFordward

                            2,
                            [multiplicador_de_FNF*dimencion_del_embeding,dimencion_del_embeding],
                            [dimencion_del_embeding,multiplicador_de_FNF*dimencion_del_embeding],
                            0.01,
                            [leaky_relu_function,leaky_relu_function],
                            12
)





#____________________CAPA_LINEAL_______________________ 
capa_linear = CR.Red_neuronal(
                                #ruta
                                capa_linear_ruta,
                                1,
                                [cantidad_de_palabras_en_el_diccionario],
                                [dimencion_del_embeding],
                                0.01,
                                [lineal_function],
                                12
                            )




#_____________________________ENTRENAMIENTO________________________


def sumar_vectores(matriz):
       return PCGPU.sumador_de_columnas_con_GPU(matriz)


def entrenar(objeto_pre_res):

    # print(objeto_pre_res)

    pregunta_divida = objeto_pre_res['pregunta'].split()
    respuesta_divida = objeto_pre_res['respuesta'].split()

    # print(pregunta_divida)
    # print(respuesta_divida)



    matriz_de_embeding = []

    #agregamos a la matriz de embeing (+ la posicion) de la pregunta 
    for numero_de_palabra in range(len(pregunta_divida)):
        palabra_en_embeding = crear_embeding_para_palabra(pregunta_divida[numero_de_palabra])

        matriz = []
        matriz.append(palabra_en_embeding)
        matriz.append(posicional_encodign[numero_de_palabra])

        palabra_con_posicion = sumar_vectores(matriz)

        matriz_de_embeding.append(palabra_con_posicion)

    # print('matriz',matriz_de_embeding)

    #se va pasando por cada una de las palabras de la respuesta
    #pasandole al modelo las palabras anteriroes a esta, si él 
    #responde con la palabra actual está bien, sino se entrana.
    #al final de cada palabra se agrega esta palabra a la matriz_de_embeding

    respuesta_de_red = []
    error_promedio = 0

    for numero_de_palabra_de_respuesta in range(len(respuesta_divida)):
        resultado_del_bloque_4 = bloque_4.calculo_hacia_adelante(matriz_de_embeding)

        resultado_del_bloque_3 = bloque_3.calculo_hacia_adelante(resultado_del_bloque_4)

        resultado_del_bloque_2 = bloque_2.calculo_hacia_adelante(resultado_del_bloque_3)

        resultado_del_bloque_1 = bloque_1.calculo_hacia_adelante(resultado_del_bloque_2)
        
        resultado_casi_final = capa_linear.calcular_salida_de_red(resultado_del_bloque_1[-1])

        resultado_final = softmax(resultado_casi_final)

        #se separa el token final 
        token_final = 0
        max = 0
        for i in range(len(resultado_final)):
            if resultado_final[i] > max:
                token_final = i
                max = resultado_final[i]
        
        #se traduce ese token en palabra
        vector_de_respuestas_esperadas = []
        palabra_final = ''
        for indice,palabra in enumerate(diccionario_one_hot):
            if palabra == respuesta_divida[numero_de_palabra_de_respuesta]:
                vector_de_respuestas_esperadas.append(1)
            else:
                vector_de_respuestas_esperadas.append(0)

            if indice == token_final:
                palabra_final = palabra
            

        respuesta_de_red.append(palabra_final)
        
        #_________calculo_de_errores_y_derivadas__________

        vector_de_errores= [[]]
        for elemento in range(len(resultado_final)):
            error_promedio += resultado_final[elemento]-vector_de_respuestas_esperadas[elemento]
            vector_de_errores[0].append(resultado_final[elemento]-vector_de_respuestas_esperadas[elemento])

        # print('VECTOR DE ERRORES \n',vector_de_errores)

        error_para_el_bloque_1_incompleto = capa_linear.backpropagation_intrared(vector_de_errores,0)

        objeto_para_bloque1 = {}

        for i in range(len(pregunta_divida)+numero_de_palabra_de_respuesta):
            if i != numero_de_palabra_de_respuesta+len(pregunta_divida)-1:
                matriz = []
                matriz.append(np.zeros(len(error_para_el_bloque_1_incompleto[0])))
                objeto_para_bloque1[i] = matriz
            else :
                objeto_para_bloque1[i] = error_para_el_bloque_1_incompleto



        error_para_el_bloque_2 = bloque_1.backpropagation(objeto_para_bloque1)

        error_para_el_bloque_3 = bloque_2.backpropagation(error_para_el_bloque_2)
        error_para_el_bloque_4 = bloque_3.backpropagation(error_para_el_bloque_3)
        error_para_el_embeding = bloque_4.backpropagation(error_para_el_bloque_4)


        capa_embeding.entrenar_capa_embeding(error_para_el_embeding)


        #_________reinicio_de_memorias__________

        bloque_1.reiniciar_memoria_del_bloque()
        bloque_2.reiniciar_memoria_del_bloque()
        bloque_3.reiniciar_memoria_del_bloque()
        bloque_4.reiniciar_memoria_del_bloque()

        capa_linear.reiniciar_memoria_de_red()


        #se agrega la ultima palabra a la matriz de embeding para seguir con el proceso 
        palabra_en_embeding = crear_embeding_para_palabra(respuesta_divida[numero_de_palabra_de_respuesta])

        matriz = []
        matriz.append(palabra_en_embeding)
        matriz.append(posicional_encodign[numero_de_palabra_de_respuesta + len(pregunta_divida)])

        palabra_con_posicion = sumar_vectores(matriz)

        matriz_de_embeding.append(palabra_con_posicion)

        print(100 * (len(respuesta_divida) /( 1+numero_de_palabra_de_respuesta)),numero_de_palabra_de_respuesta)
        print(bloque_1.mostrar_data())

    capa_linear.actualizar_red(len(respuesta_divida))
    capa_embeding.actualizar_embeding(len(respuesta_divida))
    bloque_1.actualizar_codificador(len(respuesta_divida))
    bloque_2.actualizar_codificador(len(respuesta_divida))
    bloque_3.actualizar_codificador(len(respuesta_divida))
    bloque_4.actualizar_codificador(len(respuesta_divida))

    capa_embeding.reiniciar_memoria()
    print('_____________________________________________')
    print('err:',error_promedio / len(respuesta_divida))
    return respuesta_de_red


#__________administrador del entrenamiento___________

espoch= 201
conteo = 0


for i in range(espoch):
  
    for dato in range(len(datos_para_entrenar)):
        if conteo == 1: 
            capa_linear.gurardar_datos()
            capa_embeding.guardar_datos_de_em()
            bloque_1.guardar_datos_de_codificador()
            bloque_2.guardar_datos_de_codificador()
            bloque_3.guardar_datos_de_codificador()
            bloque_4.guardar_datos_de_codificador()

            conteo = 0
        res = entrenar(datos_para_entrenar[dato])
        print(res)
        print(datos_para_entrenar[dato]['respuesta'])
        print(bloque_1.mostrar_data())
        print('_____________________________________________')
        conteo+= 1
    print(i ,'de',espoch-1)



# 43716540691687317 y 0.016168734130674735
# 4373619073968731 y 0.015910512225882818
# 437564618857873 y 0.015571976234401494
# frase_de_prueba = [
#                         [0.1,0.2,0.3,0.2],#hola
#                         [0.2,0.4,0.6,0.2],#como
#                         [0.3,0.5,0.7,0.2],#estas?
#                      ]

# errores_de_prueba = {
#                         0:[[10,10,10,10],[10,10,10,10]],
#                         1: [[10,10,10,10],[10 ,10,10,10]],
#                         2 : [[10,10,10,10],[10,10,10,10]],
#                     }





#____________________DECODER_______________________ 

# decodificador_1 = DECOD.Decodificador(
#                             #multi-head-attention
#                             2,
#                             dimencion_del_embeding,
#                             3,
#                             [10,20,dimencion_del_embeding],
#                             [dimencion_del_embeding,10,20],
#                             0.1,
#                             [leaky_relu_function,leaky_relu_function,leaky_relu_function],
#                             12,
#                             #feedFordward

#                             2,
#                             [8*dimencion_del_embeding,dimencion_del_embeding],
#                             [dimencion_del_embeding,8*dimencion_del_embeding],
#                             0.1,
#                             [leaky_relu_function,leaky_relu_function],
#                             12
# )


# resultado_del_decodificador_1 = decodificador_1.calculo_hacia_adelante(frase_de_prueba,resultado_del_codificador_1)



# print('\n _______________________decoduficador_1______________________ \n' , resultado_del_decodificador_1)

# errores_del_decodificador_1,errores_para_el_codificador_1 = decodificador_1.backpropagation(errores_de_prueba)


# # no se usa el embeding todavia porque falta crear el vocabulario
# # capa_embeding.entrenar_capa_embeding(errores_para_la_capa_anterior1)
# # capa_embeding.entrenar_capa_embeding(errores_del_decodificador_1)



# print(errores_para_la_capa_anterior1)
