
#include <chrono>
#include <iostream>
#include <vector>
#include "../transformerAPI/Self-attention/self_attencion.h"



int main() {
    auto inicio = std::chrono::high_resolution_clock::now();

    // Paso 1: Crear función de activación (sigmoide, ReLU, etc.)
    Funcion_de_activacion funcion;

    auto *funcion_lineal_ptr = &funcion;


    
    std::vector<Funcion_de_activacion*> funciones = {funcion_lineal_ptr,funcion_lineal_ptr,funcion_lineal_ptr};

    // Paso 2: Definir arquitectura de la red
    int cantidad_capas = 3;
    std::vector<int> cantidad_neuronas_por_capa = {12,24,3};  // Por ejemplo, embeddings de 4 dimensiones
    std::vector<int> cantidad_pesos_por_capa = {3,12,24};     // Mismo tamaño
    double tasa_de_aprendizaje = 0.001;

    // Paso 3: Crear instancia de Self_attention
    Self_attention atencion(
        cantidad_capas,
        cantidad_neuronas_por_capa,
        cantidad_pesos_por_capa,
        tasa_de_aprendizaje,
        funciones
    );

    // Paso 4: Crear un conjunto de vectores de embedding (por ejemplo 3 palabras)
    std::vector<std::vector<double>> embedding_de_entrada = {
        {0.01, 0.04, 0.02},
        {0.04, 0.01, 0.02}
    };

    std::vector<std::vector<double>> salida_esperada = {
        {0.2, 0.3, 0.25},
        {0.3, 0.2, 0.25},
    };


    for(int e = 0; e < 3000;e++){

        double error_total = 0;
        // Paso 5: Usar el mecanismo de self-attention
        std::vector<std::vector<double>> salida = atencion.utilizar_SF(embedding_de_entrada);

        for(int i = 0; i<salida.size();i++){
            
            std::vector<double> errores = {
                2*(salida[i][0] - salida_esperada[i][0]),
                2*(salida[i][1] - salida_esperada[i][1]),
                2*(salida[i][2] - salida_esperada[i][2]),

             };



        

            double errtotal = 0;
            for(auto &sal: errores){
                errtotal += sal * sal;
            };

            error_total += errtotal;


            // std::cout << error_total  << 'e' << e << std::endl;

            atencion.backpropagation(errores,i);
        
        };

        std::cout << error_total  << ' ' << e << std::endl;
    }






    std::vector<std::vector<double>> salida = atencion.utilizar_SF(embedding_de_entrada);


    // Paso 6: Imprimir salida
    std::cout << "Salida del mecanismo de Self-Attention:" << std::endl;
    for (const auto& vector : salida) {
        for (double valor : vector) {
            std::cout << valor << " ";
        }
        std::cout << std::endl;
    }

    // Tomamos el tiempo de fin
    auto fin = std::chrono::high_resolution_clock::now();

    // Calculamos la duración
    std::chrono::duration<double> duracion = fin - inicio;

    std::cout << "Tiempo de ejecución: " << duracion.count() << " segundos\n";



    return 0;
}