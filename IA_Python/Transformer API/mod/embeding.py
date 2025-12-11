import creacionDeRed as CR

class Crear_capa_embeding():
    def __init__(self,ruta,dimencion,dimencion_de_one_hot_encoding,tasa_de_aprendizaje,funcionDeActivacion):
        self.capa_embeding = CR.Red_neuronal(
                                ruta,
                                1,
                                [dimencion],
                                [dimencion_de_one_hot_encoding],
                                tasa_de_aprendizaje,
                                [funcionDeActivacion],
                                12
                            )
    

    def utilizar_capa_embeding(self,palabra_en_one_hot):
        return self.capa_embeding.calcular_salida_de_red(palabra_en_one_hot)

    def entrenar_capa_embeding(self,objetos_de_errores):
        #errores debe ser un array dentro de otro con cada uno de los errores cada neurona esa neurona
        for palabra in range(len(objetos_de_errores)):
            self.capa_embeding.backpropagation_intrared(objetos_de_errores[palabra],palabra)

    def reiniciar_memoria(self):
        self.capa_embeding.reiniciar_memoria_de_red()

    def mostrar_un_peso(self):
        return self.capa_embeding.mostrarUP()
    
    def guardar_datos_de_em(self):
        self.capa_embeding.gurardar_datos()

    def actualizar_embeding(self,batch):
        self.capa_embeding.actualizar_red(batch)
    