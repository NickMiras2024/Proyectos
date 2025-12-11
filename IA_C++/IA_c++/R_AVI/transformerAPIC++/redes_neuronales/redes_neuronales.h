#pragma once
#include <vector>
#include <string>
#include <fstream>
#include <sstream>



double clamp(double x, double min, double max);
void sumador_de_columnas(std::vector<std::vector<double>>& matriz, std::vector<double>& resultado);
std::vector<double> sumador_con_hilos(std::vector<std::vector<double>>& matriz);

// std::vector<std::string> expresor_regular(std::string texto, std::vector<std::string> patron);



class Funcion_de_activacion {
public:
    double funcion(double x);
    double derivada(double x);
};

class Neurona {
private:
    std::vector<double> pesos;
    std::vector<double> pesos_actualizados;
    std::vector<std::vector<double>> entradas;
    std::vector<double> ultimas_salidas_dadas;
    std::vector<double> m;
    std::vector<double> v;
    int t;
    double alpha = 0.01;
    double beta1 = 0.9;
    double beta2 = 0.999;
    double epsilon = 1e-8;
    double sesgo;
    double sesgo_actualizado;
    int cantidad_de_pesos;
    Funcion_de_activacion* funcion_de_activacion;
    double TDA;
    std::string ruta_de_guardado;

public:
    Neurona(int cantidad_de_pesos, Funcion_de_activacion* funcion_de_activacion, double TDA,std::string ruta_de_guardado);
    void guardar_datos_entrantes(std::vector<double> datos);
    void guardar_ultimas_salidas(double salida_dada);
    void reiniciar_la_memoria();
    void actualizar_neurona(double bach);
    double calculo_neuronal(std::vector<double>& vector_de_entrada);
    std::vector<double> backpropagation(double error, int numero_de_pasada);
    void guardar_datos_neuronales_de_neurona();
};

class Capa_neuronal {
private:
    int cantidad_de_neuronas;
    int cantidad_de_pesos;
    std::vector<Neurona> neuronas;

public:
    Capa_neuronal(int cantidad_de_neuronas, int cantidad_de_pesos, Funcion_de_activacion* funcion_de_activacion, double TDA, std::string ruta);
    int get_cantidad_de_neuronas();
    void reiniciar_la_memoria_de_capa();
    std::vector<double> procesamiento_en_capa(std::vector<double> vector_de_entrada);
    std::vector<std::vector<double>> backpropagation_intra_capa(std::vector<double> errores_para_cada_neurona, int numero_de_pasada);
    void compilar_y_textear_capa();
    void mostrar_cantidad_de_neuronas();
    void actualizar_capa(double bach);

};

class Red_neuronal {
private:
    int cantidad_de_capas;
    std::vector<Capa_neuronal> capas;
    std::string ruta_de_guardado;
public:
    Red_neuronal(int cantidad_de_capas,
                 std::vector<int> cantidad_de_neuronas_por_capa,
                 std::vector<int> cantidad_de_pesos_por_capa,
                 std::vector<Funcion_de_activacion*> funciones_de_activacion,
                 double TDA,
                 std::vector<std::string> &ruta_de_guardado
                );
    void reiniciar_la_memoria_de_red();
    std::vector<double> calcular_salida_de_red(std::vector<double> entrada);
    std::vector<std::vector<double>> backpropagation_intra_red(std::vector<std::vector<double>> matriz_de_errores, int numero_de_pasada);
    void guardar_red();
    void mostrar();

    void actualizar_red(double bach);

};
