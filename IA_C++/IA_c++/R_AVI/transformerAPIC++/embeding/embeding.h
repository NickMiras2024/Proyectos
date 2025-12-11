#include <vector>
#include <iostream>
#include "../redes_neuronales/redes_neuronales.h"
#include <unordered_map>
#pragma once

class Capa_embeding {
    private: 
        std::vector<Red_neuronal> red;
    public: 
        Capa_embeding(int cantidad_de_capas,
                           std::vector<int> cantidad_de_neuronas_por_capa,
                           std::vector<int> cantidad_de_pesos_por_capa,
                           std::vector<Funcion_de_activacion*> funciones_de_activacion,
                           double TDA,std::vector<std::string> ruta);
        std::vector<double> utilizar_capa_embeding(std::vector<double> &palabra_one_hot);
        void entrenar_capa_embeding(std::unordered_map<int,std::vector<std::vector<double>>>  objeto_de_err);
        void reiniciar_memoria();
        void guardar_embeding();    
        void actualizar_embeding(double bach);    

    };
