#include "redes_neuronales.h"
#include <algorithm>
#include <cstdlib>
#include <cmath>
#include <iostream>

//________________________FUNCIONES LIBRES____________________

double clamp(double x, double min, double max) {
    return std::max(min, std::min(x, max));
}

void sumador_de_columnas(std::vector<std::vector<double>>& matriz, std::vector<double>& resultado) {
    int filas = matriz.size();
    int columnas = matriz[0].size();

    for (size_t col = 0; col < matriz[0].size(); col++) {
        double res = 0;
        for (int fil = 0; fil < filas; fil++) {
            res += matriz[fil][col];
        }
        resultado[col] = res;
    }
}

std::vector<double> sumador_con_hilos(std::vector<std::vector<double>>& matriz) {
    int columnas = matriz[0].size();


    std::vector<double> resultados(columnas);
    sumador_de_columnas(matriz, resultados);
    return resultados;
}

//__________________FUNCION_DE_ACTIVACION__________________

double Funcion_de_activacion::funcion(double x) {
     return x > 0 ? x : 0.01 * x;
}

double Funcion_de_activacion::derivada(double x) {
    return x > 0 ? 1.0 : 0.01;
}

//________________________NEURONA_________________________

Neurona::Neurona(int cantidad_de_pesos, Funcion_de_activacion* funcion_de_activacion, double TDA,std::string ruta_de_guardado)
    : cantidad_de_pesos(cantidad_de_pesos), funcion_de_activacion(funcion_de_activacion), TDA(TDA) {
    
    std::ifstream archivo(ruta_de_guardado);
    this->ruta_de_guardado = ruta_de_guardado;


    if(archivo.is_open()){
        std::string datos;
        std::getline(archivo,datos);

        
        std::vector<double> sesgo_y_pesos;
        std::string dato = "";
        sesgo_y_pesos.reserve(cantidad_de_pesos);
        for(size_t l = 0; l< datos.size();l++){
            if(datos[l] == ';'){
                sesgo_y_pesos.emplace_back(std::stod(dato));
                dato = "";
            }else{
                dato += datos[l];
            };
        };



        sesgo = sesgo_y_pesos[0];

        pesos.reserve(sesgo_y_pesos.size()-1);
        // // std::cout<< sesgo_y_pesos.size()-1 << std::endl;

        for(size_t peso= 1; peso< sesgo_y_pesos.size();peso++ ){
            pesos.emplace_back(sesgo_y_pesos[peso]);
        };



    }else{
        // // std::cout<< "INICIALZANDO SESGO "<< '\n';

        sesgo = (((double)rand() / RAND_MAX) - 0.5) * 0.01;

        // //// std::cout<< "INICIALZANDO PESOS "<< cantidad_de_pesos << '\n';
        pesos.reserve(cantidad_de_pesos);

        for (int i = 0; i < cantidad_de_pesos; i++) {
            // //// std::cout<< "PESO: "<< i << '\n';
            pesos.emplace_back((((double)rand() / RAND_MAX) - 0.5 )* 0.01);
        }
    }

    // // std::cout<< "inicializacndo pesos y sesgos actualizados\n";
    sesgo_actualizado = 0.0;
    pesos_actualizados.resize(cantidad_de_pesos);
    m.resize(cantidad_de_pesos+1);
    v.resize(cantidad_de_pesos+1);

    
    archivo.close();


}

void Neurona::guardar_datos_entrantes(std::vector<double> datos) {
    entradas.reserve(entradas.size() + 1);
    entradas.emplace_back(datos);
}

void Neurona::guardar_ultimas_salidas(double salida_dada) {
    ultimas_salidas_dadas.emplace_back(salida_dada);
}

void Neurona::reiniciar_la_memoria() {
    std::vector<std::vector<double>>().swap(entradas);
    std::vector<double>().swap(ultimas_salidas_dadas);
}

void Neurona::guardar_datos_neuronales_de_neurona(){
    std::string neurona_str = "";

    neurona_str = neurona_str + std::to_string(this->sesgo);


    for (size_t i = 0; i < pesos.size() ; i++) {
        neurona_str = neurona_str + ";" + std::to_string(pesos[i]);
    }

    neurona_str = neurona_str + ";";

    std::ofstream archivo(this->ruta_de_guardado);

    archivo << neurona_str;

    archivo.close();
}

double Neurona::calculo_neuronal(std::vector<double>& vector_de_entrada) {
    double res = sesgo;
    guardar_datos_entrantes(vector_de_entrada);

    for (size_t i = 0; i < pesos.size(); i++) {
        res += vector_de_entrada[i] * pesos[i];
    }

    double resF = funcion_de_activacion->funcion(res);


    guardar_ultimas_salidas(resF);
    return resF;
}

std::vector<double> Neurona::backpropagation(double error, int numero_de_pasada) {
    t++;

    std::vector<double> errores_de_cada_neurona;
    errores_de_cada_neurona.reserve(pesos.size());

    double derivada = error * funcion_de_activacion->derivada(ultimas_salidas_dadas[numero_de_pasada]);

    //ACTUALIZACION CON ADAM
    // Actualización de momentos
    m[0] = beta1 * m[0] + (1 - beta1) * derivada;
    v[0] = beta2 * v[0] + (1 - beta2) * (derivada * derivada);

    // Corrección de sesgo
    double m_hat = m[0] / (1 - pow(beta1, t));
    double v_hat = v[0] / (1 - pow(beta2, t));

    sesgo_actualizado -= alpha * m_hat / (sqrt(v_hat) + epsilon);

    // // std::cout<<pesos.size() << std::endl;

    for (size_t i = 0; i < pesos.size(); i++) {
        errores_de_cada_neurona.emplace_back(derivada * pesos[i]);
       
       
        //ACTUALIZACION CON ADAM
        // Actualización de momentos
        m[i+1] = beta1 * m[i+1] + (1 - beta1) * derivada;
        v[i+1] = beta2 * v[i+1] + (1 - beta2) * (derivada * derivada);

        // Corrección de sesgo
        double m_hat = m[i+1] / (1 - pow(beta1, t));
        double v_hat = v[i+1] / (1 - pow(beta2, t));

        pesos_actualizados[i] -= alpha * m_hat / (sqrt(v_hat) + epsilon);
    }


    return errores_de_cada_neurona;
}

void Neurona::actualizar_neurona(double bach){
    if(bach <= 0){
        bach = 1;
    };
    // if(sesgo_actualizado == 0){
    //     // // std::cout<< "es cero ______ " << std::endl;
    // }
    sesgo += sesgo_actualizado / bach;
    sesgo_actualizado = 0.0;
    for (size_t i = 0; i < pesos.size(); i++) {
        pesos[i] += pesos_actualizados[i] / bach;
        pesos_actualizados[i] = 0.0;
    };

};


//________________________CAPA__________________________

Capa_neuronal::Capa_neuronal(int cantidad_de_neuronas, int cantidad_de_pesos, Funcion_de_activacion* funcion_de_activacion, double TDA , std::string ruta)
    : cantidad_de_neuronas(cantidad_de_neuronas), cantidad_de_pesos(cantidad_de_pesos) {
    

    for (int i = 0; i < cantidad_de_neuronas; i++) {
        //// std::cout<< cantidad_de_neuronas << " "<< neuronas_txt.size() << " "  << i+1 << '\n';
        std::string ruta_para_neurona = ruta + "_neurona" + std::to_string(i+1) + ".txt";
        neuronas.emplace_back(Neurona(cantidad_de_pesos, funcion_de_activacion, TDA,ruta_para_neurona));
        // // std::cout<< "Tasdasd21"<< i << '\n';
    }



}

int Capa_neuronal::get_cantidad_de_neuronas() {
    return cantidad_de_neuronas;
}

void Capa_neuronal::actualizar_capa(double bach){
    for (size_t i = 0; i < neuronas.size(); i++) {
        neuronas[i].actualizar_neurona(bach);
    };

};


std::vector<double> Capa_neuronal::procesamiento_en_capa(std::vector<double> vector_de_entrada) {
    std::vector<double> resultado(neuronas.size());

    for (size_t i = 0; i < neuronas.size(); i++) {
        resultado[i] = neuronas[i].calculo_neuronal(vector_de_entrada);
    }

    return resultado;
}

std::vector<std::vector<double>> Capa_neuronal::backpropagation_intra_capa(std::vector<double> errores_para_cada_neurona, int numero_de_pasada) {
    std::vector<std::vector<double>> matriz_de_errores;
    matriz_de_errores.reserve(neuronas.size());

    for (size_t i = 0; i < neuronas.size(); i++) {
        matriz_de_errores.emplace_back(neuronas[i].backpropagation(errores_para_cada_neurona[i], numero_de_pasada));
    }

    return matriz_de_errores;
}

void Capa_neuronal::reiniciar_la_memoria_de_capa(){
    for(size_t i =0; i < this->neuronas.size(); i++ ){
        this->neuronas[i].reiniciar_la_memoria();
    };
};

void Capa_neuronal::compilar_y_textear_capa(){

    for(size_t i =0; i < this->neuronas.size(); i++ ){
        this->neuronas[i].guardar_datos_neuronales_de_neurona();
    };

};


void Capa_neuronal::mostrar_cantidad_de_neuronas(){

    std::cout<< cantidad_de_pesos << std::endl;


};



//________________________RED__________________________

Red_neuronal::Red_neuronal(int cantidad_de_capas,
                           std::vector<int> cantidad_de_neuronas_por_capa,
                           std::vector<int> cantidad_de_pesos_por_capa,
                           std::vector<Funcion_de_activacion*> funciones_de_activacion,
                           double TDA,
                           std::vector<std::string> &ruta_de_guardado
                        )
    : cantidad_de_capas(cantidad_de_capas) {
        
    // std::cout<< cantidad_de_pesos_por_capa[0]<<std::endl; 
   

    for (int i = 0; i < cantidad_de_capas; i++) {
        // // std::cout<< "INTENTANDO CREAR CAPA CON ARCH "<< cantidad_de_capas<< '\n';

        std::string ruta_para_cada_capa = ruta_de_guardado[0] + "_capa" + std::to_string(i+1);

        capas.emplace_back(Capa_neuronal(cantidad_de_neuronas_por_capa[i], cantidad_de_pesos_por_capa[i], funciones_de_activacion[i], TDA,ruta_para_cada_capa));        
    };


}

void Red_neuronal::reiniciar_la_memoria_de_red(){
    for(size_t i =0; i < this->capas.size(); i++ ){
        this->capas[i].reiniciar_la_memoria_de_capa();
    };
}

void Red_neuronal::actualizar_red(double bach){
    for(size_t i =0; i < this->capas.size(); i++ ){
        capas[i].actualizar_capa(bach);
    };

};


std::vector<double> Red_neuronal::calcular_salida_de_red(std::vector<double> entrada) {
    std::vector<double> salida = entrada;

    for (size_t i = 0; i < capas.size(); i++) {
        salida = capas[i].procesamiento_en_capa(salida);
    }

    return salida;
}

std::vector<std::vector<double>> Red_neuronal::backpropagation_intra_red(std::vector<std::vector<double>> matriz_de_errores, int numero_de_pasada) {
    std::vector<std::vector<double>> matriz = matriz_de_errores;

    // //// std::cout<< "algo"  ;

    for (int i = capas.size() - 1; i >= 0; i--) {
        std::vector<double> errores = sumador_con_hilos(matriz);

        // //// std::cout<< "C" << i << std::endl;

        matriz = capas[i].backpropagation_intra_capa(errores, numero_de_pasada);
    }


    std::vector<std::vector<double>> matriz_final = {sumador_con_hilos(matriz)};

    // capas[0].mostrar_cantidad_de_neuronas();
    // // std::cout<< "esto es la dimencion de matriz funal " <<matriz_final[0].size() << std::endl;

    return matriz_final;
}


void Red_neuronal::mostrar(){
    for(size_t i = 0; i < capas.size();i++){
        capas[i].mostrar_cantidad_de_neuronas();
    };
}

void  Red_neuronal::guardar_red(){
    for (size_t i = 0 ; i < capas.size(); i++) {
        this->capas[i].compilar_y_textear_capa();
    }

};

