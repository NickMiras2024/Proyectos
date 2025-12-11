#include "../Self-attention/self_attencion.h"
#include "../redes_neuronales/redes_neuronales.h"
#include "../add_y_norm/add_y_norm.h"
#include <vector>
#include <iostream>
#include <string>
#pragma once

class Codificador{
    private:
        std::vector<Self_attention> cabezas;
        std::vector<LayerNorm> addYnorms;
        std::vector<std::string> rutas_add_y_norm;
        std::vector<Red_neuronal> red;
        double TDA;
    public:
        Codificador(
            //rutas
            std::vector<std::string> rutas_add_y_norm,
            std::vector<std::string> ruta_FNN,
            std::string ruta_self_attention,

            //self_attention
            int cantidad_de_cabezas_SA,
            int dimencion_del_embeding,
            int cantidad_de_capas_SA,
            std::vector<int> cantidad_de_neuronas_por_capa__SA,
            std::vector<int> cantidad_de_pesos_por_capa_SA,
            double TDA_SA,
            std::vector<Funcion_de_activacion*> funciones_de_activacion_SA,
            // feedFordward
            int cantidad_de_capas_FNN,
            std::vector<int> cantidad_de_neuronas_por_capa_FNN,
            std::vector<int> cantidad_de_pesos_por_capa_FNN,
            double TDA_FNN,
            std::vector<Funcion_de_activacion*> funciones_de_activacion_FNN

        );
        void guardar_datos_de_codificador();
        void reiniciar_memoria();
        void actualizar_codificador(double bach);

        std::vector<std::vector<double>> calculo_hacia_adelante(std::vector<std::vector<double>> frase_matriz);
        std::unordered_map<int,std::vector<std::vector<double>>> backpropagation( std::unordered_map<int,std::vector<std::vector<double>>>  errores);
};




