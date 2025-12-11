#include <vector>
#include "../redes_neuronales/redes_neuronales.h"
#include <numeric>   
#include <algorithm>  
#include <unordered_map>
#include <chrono>
#pragma once

class Self_attention{
    private:
        std::vector<Red_neuronal> QRed;
        std::vector<Red_neuronal> VRed;
        std::vector<Red_neuronal> KRed;
        std::vector<std::vector<double>> ultima_salida_v;
        std::vector<std::vector<double>> ultima_salida_q;   
        std::vector<std::vector<double>> ultima_salida_k; 
        std::vector<std::vector<double>> ultima_salida_A;   
        std::vector<std::vector<double>> ultima_salida_M;   
        int dimencion_de_K;
        std::string ruta; 



        std::vector<std::vector<double>> M(std::vector<std::vector<double>> &queris,std::vector<std::vector<double>> &keys);
        double dot_product(std::vector<double> &vector1,std::vector<double> &vector2);
        std::vector<double> multiplicador_de_vector_por_escalar(std::vector<double> &vector, double escalar);           
        std::vector<std::vector<double>> A(std::vector<std::vector<double>> &Mult,double DM);
        std::vector<std::vector<double>> multiplicacion_de_matrices(std::vector<std::vector<double>> &matriz_a,std::vector<std::vector<double>> &matriz_b);
        std::vector<double> obtener_keys(std::vector<double> &datos_de_entrada);
        std::vector<double> obtener_queris(std::vector<double> &datos_de_entrada);
        std::vector<double> obtener_values(std::vector<double> &datos_de_entrada);

    public:   
        Self_attention(
            int cantidad_capas,
            std::vector<int> cantidad_de_neuronas_por_capa,
            std::vector<int> cantidad_de_pesos_por_capa,
            double TDA,
            std::vector<Funcion_de_activacion*> funciones_de_activacion,
            std::string ruta
            );

        void reiniciar_memoria();
        void actualizar_SF(double bach);

        void guardar_SF();

        std::vector<std::vector<double>> utilizar_SF(std::vector<std::vector<double>> matriz_de_emeding);
        std::vector<double> softmax(const std::vector<double>& input);
        std::vector<std::vector<double>> derivada_softmax(const std::vector<double>& input);


        std::unordered_map<int,std::vector<std::vector<double>>> backpropagation( std::vector<double> &vector_de_errores, int numero_de_pasada );
};
