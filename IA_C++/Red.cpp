// neurona normal con c++
#include <iostream>
#include <ctime>
#include <vector>
#include <chrono>
#include "IA_c++/transformerAPI/redes_neuronales/redes_neuronales.h"



int main()
{
    auto inicio = std::chrono::high_resolution_clock::now();
    srand(time(nullptr));

    Funcion_de_activacion funcion_lineal;

    auto *funcion_lineal_ptr = &funcion_lineal;

    std::vector<Funcion_de_activacion*> funciones = {funcion_lineal_ptr,funcion_lineal_ptr,funcion_lineal_ptr};


    std::vector<double> vector_de_entradas = {0.01, 0.02};



    std::vector<std::string> ruta = {"ruta"};

    Red_neuronal red1(3,std::vector{200,300,1},std::vector{2,200,300},funciones,0.01,ruta);

    for(int i = 0; i<100;i++ ){

        std::vector<double> resultado = red1.calcular_salida_de_red(vector_de_entradas);

        std::vector<std::vector<double>> matriz_de_error = { {(2*(resultado[0] - 3))} };
        

        std::vector<std::vector<double>> MDE = red1.backpropagation_intra_red(matriz_de_error,0);


        std::cout << resultado[0] << ' ' << ((resultado[0] - 3.0)*(resultado[0] - 3.0))  << ' '  << i << '\n';
        

    };

  // Tomamos el tiempo de fin
    auto fin = std::chrono::high_resolution_clock::now();

    // Calculamos la duración
    std::chrono::duration<double> duracion = fin - inicio;

    std::cout << "Tiempo de ejecución: " << duracion.count() << " segundos\n";




    return 0;
}
