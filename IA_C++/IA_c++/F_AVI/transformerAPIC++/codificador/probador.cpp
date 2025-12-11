#include "../Self-attention/self_attencion.h"
#include "../redes_neuronales/redes_neuronales.h"
#include "../add_y_norm/add_y_norm.h"
#include "codificador.h"
#include <vector>
#include <iostream>
#include <string>

int main(){
    

    std::vector<std::vector<double>> matriz_de_entrada = {{0.001,0.002,0.003,0.005},
                                                          {0.004,0.003,0.002,0.003},
                                                          {0.005,0.005,0.005,0.002}
                                                        };

    
    Funcion_de_activacion funcion_lineal;

    auto *funcion_lineal_ptr = &funcion_lineal;

    std::vector<Funcion_de_activacion*> funciones = {funcion_lineal_ptr,funcion_lineal_ptr,funcion_lineal_ptr};


    std::vector<std::string> rutas_add_norm = {"hola"};
    std::vector<std::string> ruta_fnn = {"hola"};
    std::string ruta_SF = "hola";
    std::vector<int> CDNPCSA = {3,4,4};
    std::vector<int> CDPPC = {4,3,4};



    std::cout << "____________________Creando cod_________________________" << std::endl;
    
    Codificador cod1(
                    rutas_add_norm,
                    ruta_fnn,
                    ruta_SF,
                    2,
                    matriz_de_entrada[0].size(),
                    3,
                    CDNPCSA,
                    CDPPC,
                    0.1,
                    funciones,
                    3,
                    CDNPCSA,
                    CDPPC,
                    0.1,
                    funciones
    );
    
    Codificador cod2(
                    rutas_add_norm,
                    ruta_fnn,
                    ruta_SF,
                    2,
                    matriz_de_entrada[0].size(),
                    3,
                    CDNPCSA,
                    CDPPC,
                    0.1,
                    funciones,
                    3,
                    CDNPCSA,
                    CDPPC,
                    0.1,
                    funciones
    );

    std::cout << "____________________Cod creado_________________________" << std::endl;

    

    std::cout << "VA bien 0 " << std::endl;



    //pruenba de entrenamiento 

   double learning_rate = 0.01;

for(int esp = 0; esp < 1000; esp++) {
    // Forward pass
    std::vector<std::vector<double>> resA = cod1.calculo_hacia_adelante(matriz_de_entrada);
    std::vector<std::vector<double>> res = cod2.calculo_hacia_adelante(resA);
    // Target objetivo fijo (igual tamaño que la salida)
    std::vector<std::vector<double>> target = {
        {0.1, 0.1, 0.1, 0.1},
        {0.1, 0.1, 0.1, 0.1},
        {0.1, 0.1, 0.1, 0.1}
    };



    // Calcular error MSE y preparar gradientes para backpropagation
    double suma_de_err = 0.0;
    std::unordered_map<int, std::vector<std::vector<double>>> errores;

    for (int i = 0; i < (int)res.size(); i++) {
        std::vector<double> error_vector(res[i].size());
        for (int j = 0; j < (int)res[i].size(); j++) {
            double error = res[i][j] - target[i][j];
            error_vector[j] = 2.0 * error; // Derivada del MSE respecto al output
            suma_de_err += error * error;
        }
        errores[i] = { error_vector }; // vector de 1 fila
    }

    // std::cout << "Errores (derivadas del MSE):\n";
    // for (const auto& [indice, matriz] : errores) {
    //     std::cout << "Índice: " << indice << "\n";
    //     for (const auto& fila : matriz) {
    //         std::cout << "  [ ";
    //         for (double val : fila) {
    //             std::cout << val << " ";
    //         }
    //         std::cout << "]\n";
    //     }
    // }





    // Backward pass
    auto errores_para_anteror =  cod2.backpropagation(errores);

    // std::cout << "\n_______errores2_____________:\n";
    // for (const auto& [indice, matriz] : errores_para_anteror) {
    //     std::cout << "Índice: " << indice << "\n";
    //     for (const auto& fila : matriz) {
    //         std::cout << "  [ ";
    //         for (double val : fila) {
    //             std::cout << val << " ";
    //         }
    //         std::cout << "]\n";
    //     }
    // }




    auto errores_para_anteror2 =  cod1.backpropagation(errores_para_anteror);



    // Step de parámetros: importante para que aprenda

    // Mostrar progreso
    std::cout << "Error: " << suma_de_err << " | epoca: " << esp << std::endl;
}


    std::vector<std::vector<double>> res2 = cod1.calculo_hacia_adelante(matriz_de_entrada);



    std::cout << "RESPUESTA:" << std::endl;
        for(auto &i : res2){
            for(auto &i2 : i){
                std::cout << i2 << ' ';
                };
            std::cout << std::endl;
        };




    return 0;
};