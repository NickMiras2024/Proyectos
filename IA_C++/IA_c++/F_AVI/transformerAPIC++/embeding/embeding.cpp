#include <vector>
#include <iostream>
#include "../redes_neuronales/redes_neuronales.h"
#include <unordered_map>
#include "embeding.h"

std::vector<Red_neuronal> red;

Capa_embeding::Capa_embeding(int cantidad_de_capas,
                    std::vector<int> cantidad_de_neuronas_por_capa,
                    std::vector<int> cantidad_de_pesos_por_capa,
                    std::vector<Funcion_de_activacion*> funciones_de_activacion,
                    double TDA,std::vector<std::string> ruta){
                
red.reserve(1);
red.emplace_back(
                cantidad_de_capas,
                cantidad_de_neuronas_por_capa,
                cantidad_de_pesos_por_capa,
                funciones_de_activacion,
                TDA,ruta);                            
                    
};


std::vector<double> Capa_embeding::utilizar_capa_embeding(std::vector<double> &palabra_one_hot){
    return red[0].calcular_salida_de_red(palabra_one_hot);
};

void Capa_embeding::entrenar_capa_embeding(std::unordered_map<int,std::vector<std::vector<double>>>  objeto_de_err){
    // std::cout << "______________ASDASD__________" << objeto_de_err.size() << std::endl;
    
    for(size_t i = 0; i< objeto_de_err.size();i++){
        // std::cout << "______________2ASDASD__________" << objeto_de_err[i].size() << i << std::endl;
        

        // for(auto &fila : objeto_de_err[i]){
        //     for(auto &ele : fila){
        //         std::cout << ele << ' ';
            
        //     }
        //     std::cout << std::endl;

        // }






        this->red[0].backpropagation_intra_red(objeto_de_err[i],i);
    };
};

void Capa_embeding::reiniciar_memoria(){
    this->red[0].reiniciar_la_memoria_de_red();
}

void Capa_embeding::guardar_embeding(){
    this->red[0].guardar_red();
};


void Capa_embeding::actualizar_embeding(double bach){
    this->red[0].actualizar_red(bach);
};



