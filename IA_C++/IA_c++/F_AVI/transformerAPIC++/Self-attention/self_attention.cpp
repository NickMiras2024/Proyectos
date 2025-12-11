#include <iostream>
#include <vector>
#include "../redes_neuronales/redes_neuronales.h"
#include <cmath>  
#include <numeric>   
#include <algorithm>  
#include <unordered_map>
#include <chrono>
#include "self_attencion.h"




std::vector<std::vector<double>> Self_attention::M(
    std::vector<std::vector<double>> &queris,
    std::vector<std::vector<double>> &keys
){
    std::vector<std::vector<double>> M;
    M.reserve(queris.size());
    for(size_t q = 0;q < queris.size();q++){
        std::vector<double> palabra_completa;
        palabra_completa.reserve(keys.size());
        for(size_t k = 0;k < keys.size();k++){
            palabra_completa.emplace_back(dot_product(queris[q],keys[k]));
        };
        M.emplace_back(palabra_completa);
    };
    return M;
};

double Self_attention::dot_product(std::vector<double> &vector1,std::vector<double> &vector2){
    double res;
    for(size_t i = 0;i < vector1.size();i++){
        res += vector1[i] * vector2[i];
    };
    return res;
};

std::vector<double> Self_attention::multiplicador_de_vector_por_escalar(std::vector<double> &vector, double escalar){
    std::vector<double> vector_escalado;
    vector_escalado.reserve(vector.size());
    for(size_t i = 0;i < vector.size();i++){
        vector_escalado.emplace_back(vector[i] * escalar);                
    };
    return vector_escalado;
}

std::vector<std::vector<double>> Self_attention::A(std::vector<std::vector<double>> &Mult,double DM){

    std::vector<std::vector<double>> matriz_de_atencion;
    matriz_de_atencion.reserve(Mult.size());
    for(size_t i = 0;i < Mult.size();i++){
        std::vector<double> vector_dividido = this->multiplicador_de_vector_por_escalar(Mult[i],1/sqrt(DM));
        
        matriz_de_atencion.emplace_back(this->softmax(vector_dividido));
    };

    return matriz_de_atencion;
};

std::vector<std::vector<double>> Self_attention::multiplicacion_de_matrices(std::vector<std::vector<double>> &matriz_a,std::vector<std::vector<double>> &matriz_b){

    std::vector<std::vector<double>> matriz_de_atencion ;
    matriz_de_atencion.reserve(matriz_a.size());

    for(size_t fila_de_a = 0;fila_de_a < matriz_a.size();fila_de_a++){
        std::vector<std::vector<double>> matriz_de_values_con_att;
        matriz_de_values_con_att.reserve(matriz_a[0].size());

        for(size_t elemento_de_a = 0;elemento_de_a < matriz_a[fila_de_a].size();elemento_de_a++){
            matriz_de_values_con_att.emplace_back(this->multiplicador_de_vector_por_escalar(matriz_b[fila_de_a],matriz_a[fila_de_a][elemento_de_a]));
        };
        
        std::vector<double> vector_de_atencion = matriz_de_values_con_att[0];

        for(size_t FMA = 0;FMA < matriz_de_values_con_att.size();FMA++){
            for(size_t EDV = 0;EDV < matriz_de_values_con_att[0].size();EDV++){
                if(FMA == 0){
                    continue;
                }else{
                    vector_de_atencion[EDV] += matriz_de_values_con_att[FMA][EDV];
                };
            };
        };


        matriz_de_atencion.emplace_back(vector_de_atencion);

    };

    return matriz_de_atencion;
};


std::vector<double> Self_attention::obtener_keys(std::vector<double> &datos_de_entrada){
    std::vector<double> salida = this->KRed[0].calcular_salida_de_red(datos_de_entrada);
    this->ultima_salida_k.reserve(this->ultima_salida_k.size()+1);
    this->ultima_salida_k.emplace_back(salida);
    return salida;
};

std::vector<double> Self_attention::obtener_queris(std::vector<double> &datos_de_entrada){
    std::vector<double> salida = this->QRed[0].calcular_salida_de_red(datos_de_entrada);
    this->ultima_salida_q.reserve(this->ultima_salida_q.size()+1);
    this->ultima_salida_q.emplace_back(salida);
    return salida;
};

std::vector<double> Self_attention::obtener_values(std::vector<double> &datos_de_entrada){
    std::vector<double> salida = this->VRed[0].calcular_salida_de_red(datos_de_entrada);
    this->ultima_salida_v.reserve(this->ultima_salida_v.size()+1);
    this->ultima_salida_v.emplace_back(salida);
    return salida;
};

Self_attention::Self_attention(
    int cantidad_capas,
    std::vector<int> cantidad_de_neuronas_por_capa,
    std::vector<int> cantidad_de_pesos_por_capa,
    double TDA,
    std::vector<Funcion_de_activacion*> funciones_de_activacion,
    std::string ruta
){


    // std::cout<<cantidad_de_neuronas_por_capa[cantidad_de_neuronas_por_capa.size()-1]<< ' ';



    this->ruta = ruta;    
    
    std::vector<std::vector<std::string>> rutas = {{ruta + "_q.txt"},{ruta + "_v.txt"},{ruta + "_k.txt"}};

    
    QRed.reserve(1);
    VRed.reserve(1);
    KRed.reserve(1);

    QRed.emplace_back(
        cantidad_capas,
        cantidad_de_neuronas_por_capa,
        cantidad_de_pesos_por_capa,
        funciones_de_activacion,
        TDA,
        rutas[0]
    );

    VRed.emplace_back(
        cantidad_capas,
        cantidad_de_neuronas_por_capa,
        cantidad_de_pesos_por_capa,
        funciones_de_activacion,
        TDA,
        rutas[1]

    );

    KRed.emplace_back(
        cantidad_capas,
        cantidad_de_neuronas_por_capa,
        cantidad_de_pesos_por_capa,
        funciones_de_activacion,
        TDA,
        rutas[2]
    );
};



void Self_attention::reiniciar_memoria(){
    this->QRed[0].reiniciar_la_memoria_de_red();
    this->KRed[0].reiniciar_la_memoria_de_red();
    this->VRed[0].reiniciar_la_memoria_de_red();
}

void Self_attention::actualizar_SF(double bach){
    this->QRed[0].actualizar_red(bach);
    this->KRed[0].actualizar_red(bach);
    this->VRed[0].actualizar_red(bach);
}

std::vector<std::vector<double>> Self_attention::utilizar_SF(std::vector<std::vector<double>> matriz_de_emeding){

    std::vector<std::vector<double>> queris;
    std::vector<std::vector<double>> keys;
    std::vector<std::vector<double>> values;

    queris.reserve(matriz_de_emeding.size());
    keys.reserve(matriz_de_emeding.size());
    values.reserve(matriz_de_emeding.size());

    for(size_t i = 0;i < matriz_de_emeding.size();i++){
        queris.emplace_back(this->obtener_queris(matriz_de_emeding[i]));
        keys.emplace_back(this->obtener_keys(matriz_de_emeding[i]));
        values.emplace_back(this->obtener_values(matriz_de_emeding[i]));
    };

    std::vector<std::vector<double>> Mult = this->M(queris,keys);
    this->ultima_salida_M = Mult;

    this->dimencion_de_K = keys[0].size();
    
    std::vector<std::vector<double>> Att = this->A(Mult,this->dimencion_de_K);

    this->ultima_salida_A = Att;

    
    std::vector<std::vector<double>> resultado = this->multiplicacion_de_matrices(Att,values);

    return resultado;

};



void Self_attention::guardar_SF(){
    this->QRed[0].guardar_red();
    this->KRed[0].guardar_red();
    this->VRed[0].guardar_red();
}




std::vector<double> Self_attention::softmax(const std::vector<double>& input) {
    std::vector<double> output(input.size());
    
    // Paso 1: encontrar el valor máximo (para estabilidad numérica)
    double max_val = *max_element(input.begin(), input.end());

    // Paso 2: calcular e^(x_i - max)
    double sum = 0.0;
    for (size_t i = 0; i < input.size(); ++i) {
        output[i] = std::exp(input[i] - max_val);
        sum += output[i];
    }

    // Paso 3: dividir cada valor por la suma total
    for (double& val : output) {
        val /= sum;
    }

    return output;
}


// Derivada de softmax (Jacobian matrix)
std::vector<std::vector<double>> Self_attention::derivada_softmax(const std::vector<double>& input) {
    std::vector<double> s = softmax(input);
    size_t n = s.size();

    std::vector<std::vector<double>> jacobiano(n, std::vector<double>(n, 0.0));

    for (size_t i = 0; i < n; ++i) {
        for (size_t j = 0; j < n; ++j) {
            if (i == j) {
                jacobiano[i][j] = s[i] * (1 - s[i]);
            } else {
                jacobiano[i][j] = -s[i] * s[j];
            }
        }
    }

    return jacobiano;
}


std::unordered_map<int,std::vector<std::vector<double>>> Self_attention::backpropagation( std::vector<double> &vector_de_errores, int numero_de_pasada ){

    std::unordered_map<int,std::vector<std::vector<double>>> error_de_capa_por_palabra;

    //  ________________________Values_________________________
    // en este pedazo del codigo se entrena la red de valores, para esto se accede a cada uno de los valores de la matriz A 
    // y se lo envia como error multiplicado por el error proveniente de la capa siguiente (por lo tanto el error tiene que ser 
    // un vector de n elementos, siendo n la dimencion del embeding), para todas las neuronas de una misma pasada, y así sucesivamente.
    int fila = numero_de_pasada;
    for(size_t col = 0; col < this->ultima_salida_A[fila].size();col++){
        std::vector<double> vector_de_errores_v;
        vector_de_errores_v.reserve(this->ultima_salida_v[0].size());

        for(size_t y = 0; y < this->ultima_salida_v[0].size();y++){
            vector_de_errores_v.emplace_back(this->ultima_salida_A[fila][col] * vector_de_errores[y]);
        };

        std::vector<std::vector<double>>  errror_de_esta_capa = this->VRed[0].backpropagation_intra_red({vector_de_errores_v},fila);

        // // std::cout<<"__________V_______\n";
        // for(auto &f : errror_de_esta_capa){
        //     for(auto &c : f){
        //         // std::cout<< c << ' ';
        //     };
        //     // std::cout<< std::endl;
        // };



        error_de_capa_por_palabra[col] = errror_de_esta_capa;
    };

    // ________________________Queris_________________________
    // en esta seccion se van a calcular las derivadas necesarias para la red query para esto se necesitan:
    // la derivada de la funcion softmax, la dimension de los vectores de las palabras (creo),los valores de V 
    // la idea seria hacer un bulcle igual al que se uso en values pero dentro hacer otro bloque para calcular las
    // derivadas que faltan (va a quedar un bloque bastante largo)

    std::vector<double> vectores_v_condensados;
    vectores_v_condensados.reserve(this->ultima_salida_v.size());

    for(size_t Fv = 0; Fv < this->ultima_salida_v.size();Fv++){
        double suma = 0;
        for(size_t Cv = 0; Cv < this->ultima_salida_v[Fv].size();Cv++){
            suma += this->ultima_salida_v[Fv][Cv];
        };
        vectores_v_condensados.emplace_back(suma);
    };  

    double escalar = 1 / this->dimencion_de_K;

    std::vector<std::vector<double>> pre_parte_del_back = this->derivada_softmax(this->ultima_salida_A[fila]);

    for(size_t col = 0; col < this->ultima_salida_A[fila].size();col++){
        double v_actual = vectores_v_condensados[col];
        std::vector<double> k_actual = this->ultima_salida_k[col];
        std::vector<double> q_actual = this->ultima_salida_q[fila];

        double v_escalado = v_actual * escalar; 


        std::vector<double> vector_de_errores_parcial = this->multiplicador_de_vector_por_escalar(k_actual,v_escalado);
        std::vector<double> vector_de_errores_parcial_para_k = this->multiplicador_de_vector_por_escalar(q_actual,v_escalado);

        for(size_t elemento = 0; elemento <  pre_parte_del_back[col].size();elemento++){
            std::vector<std::vector<double>> matriz_de_errores_completos = { {this->multiplicador_de_vector_por_escalar(vector_de_errores_parcial,pre_parte_del_back[col][elemento])}};
            std::vector<std::vector<double>> matriz_de_errores_completos_para_k = { {this->multiplicador_de_vector_por_escalar(vector_de_errores_parcial_para_k,pre_parte_del_back[col][elemento])}};


            std::vector<std::vector<double>> error = this->QRed[0].backpropagation_intra_red(matriz_de_errores_completos,fila);
            std::vector<std::vector<double>> error_k = this->KRed[0].backpropagation_intra_red(matriz_de_errores_completos_para_k,fila);

            // std::vector<std::vector<double>> error_condensado = sumador_con_hilos(error);


            
            error_de_capa_por_palabra[col].reserve(error_de_capa_por_palabra[col].size() + (error.size() * 2));


            for(size_t i = 0; i <  error.size();i++){
                error_de_capa_por_palabra[col].emplace_back(error[i]);
                error_de_capa_por_palabra[col].emplace_back(error_k[i]);
            };
        };

    };


    return error_de_capa_por_palabra;

};


