#include "transformerAPIC++\add_y_norm\add_y_norm.h"
#include "transformerAPIC++\codificador\codificador.h"
#include "transformerAPIC++\codificador_posicional\cod_pos.h"
#include "transformerAPIC++\diccionario\diccionario.h"
#include "transformerAPIC++\embeding\embeding.h"
#include "transformerAPIC++\redes_neuronales\redes_neuronales.h"
#include "transformerAPIC++\Self-attention\self_attencion.h"
#include <vector>
#include <iostream>
#include <string>
#include <filesystem>
#include <fstream>
#include <sstream>
#include <algorithm>
#include <cctype>


class Modelo{
    private:
        //_________________FUNCION_DE_ACTIVACION_____________________
    
        Funcion_de_activacion funcion_lineal;

        Funcion_de_activacion *Funcion_de_activacion_ptr = &funcion_lineal;
    
        int longitud_maxima_de_tokens;
        int dimencion_del_embeding ;  
        int cantidad_de_palabras_en_el_diccionario;  
    
        std::vector<Capa_embeding> embeding;
        std::vector<std::vector<double>> encoder_posicional; 
        std::vector<Codificador> codificadores;
        std::vector<Red_neuronal> capa_lineal;

    
    public:
        Modelo(
            //EMBEDING
            int longitud_maxima_de_tokens,
            int dimencion_del_embeding,
            int cantidad_de_palabras_en_el_diccionario,

            //CODIFICADORES
            int cantidad_de_codificadores,
            //self_attention
            int cantidad_de_cabezas_SA,
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

        
        ){

            //_________________________RUTAS_______________________________
            std::filesystem::path ruta_actual = std::filesystem::current_path();
            std::filesystem::path carpeta_data = "data";




            //NOMBRES DE ARCHIVOS :
            //capa lineal
            std::filesystem::path feedFordward_nombre = "feedFordward.txt";
            std::filesystem::path feedFordward_ruta = ruta_actual / carpeta_data / feedFordward_nombre;
            std::vector<std::string> feedFordward_ruta_final = {feedFordward_ruta.string()};

            //embeding 
            std::filesystem::path embeding_nombre = "embeding.txt";
            std::filesystem::path embeding_ruta = ruta_actual / carpeta_data / embeding_nombre;
            std::vector<std::string> embeding_ruta_final = {embeding_ruta.string()};


            //codificador
            std::filesystem::path codificador_nombre = "codificador";
            std::filesystem::path codificador_ruta = ruta_actual / carpeta_data/codificador_nombre;
            std::string codificador_ruta_final = codificador_ruta.string();
            


            //______________________EMBEDINGS_____________________

            this->longitud_maxima_de_tokens = longitud_maxima_de_tokens;
            this->dimencion_del_embeding = dimencion_del_embeding;
            this->cantidad_de_palabras_en_el_diccionario = cantidad_de_palabras_en_el_diccionario;

            this->embeding.reserve(1);
            std::vector<int> cantidad_de_neuronas_por_capa_EM = {dimencion_del_embeding};
            std::vector<int> cantidad_de_pesos_por_capa_EM = {cantidad_de_palabras_en_el_diccionario};
            std::vector<Funcion_de_activacion*> funcion_de_activacion_EM = {Funcion_de_activacion_ptr};

            this->embeding.emplace_back(Capa_embeding(
                                    1,
                                    cantidad_de_neuronas_por_capa_EM,
                                    cantidad_de_pesos_por_capa_EM,
                                    funcion_de_activacion_EM,
                                    .1,
                                    embeding_ruta_final
                                    ));

            //___________________CODIFICADOR_POSICIONAL_____________________
            // es una matriz que tiene lo que se le tiene que sumar a cada posicion 
            // de palabras para darle un sentido posicional          
            this->encoder_posicional = positional_encoding(longitud_maxima_de_tokens,dimencion_del_embeding);

            //__________________________DECODERs____________________________
            // en este tipo de modelo no se usa el encoder pero como es un modelo auterregresivo
            // al no tener encoder el decoder es igual al encoder (no tiene cross attention)
            // por eso se usa el codificador 

            this->codificadores.reserve(cantidad_de_codificadores);
            for(int codi = 0;cantidad_de_codificadores >codi;codi++){
                std::vector<std::string> rutas_add_y_norm ={ codificador_ruta_final + std::to_string(codi) + "_addYnorm1",codificador_ruta_final + std::to_string(codi) + "_addYnorm2"}; 
                std::vector<std::string> rutas_FNN = {codificador_ruta_final + std::to_string(codi) + "_FNN"};
                std::string ruta_self_attention = codificador_ruta_final + std::to_string(codi) + "_self_attention";
                this->codificadores.emplace_back(
                                    rutas_add_y_norm,
                                    rutas_FNN,
                                    ruta_self_attention,
                                    cantidad_de_cabezas_SA,
                                    dimencion_del_embeding,
                                    cantidad_de_capas_SA,
                                    cantidad_de_neuronas_por_capa__SA,
                                    cantidad_de_pesos_por_capa_SA,
                                    TDA_SA,
                                    funciones_de_activacion_SA,
                                    cantidad_de_capas_FNN,
                                    cantidad_de_neuronas_por_capa_FNN,
                                    cantidad_de_pesos_por_capa_FNN,
                                    TDA_FNN,
                                    funciones_de_activacion_FNN                                                              
                );
            };

            //_______________________CAPA_LINEAL_________________________
            this->capa_lineal.reserve(1);
            std::vector<int> cantidad_de_neuronas_por_capa = {cantidad_de_palabras_en_el_diccionario};
            std::vector<int> cantidad_de_pesos_por_capa = {dimencion_del_embeding};
            std::vector<Funcion_de_activacion*> funcion_de_activacion_CL = {Funcion_de_activacion_ptr};


            this->capa_lineal.emplace_back(
                                          1,
                                          cantidad_de_neuronas_por_capa,
                                          cantidad_de_pesos_por_capa,
                                          funcion_de_activacion_CL,
                                          0.1,
                                          feedFordward_ruta_final
            );
        };

        std::vector<double> softmax(const std::vector<double>& input) {
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


        std::vector<double> crear_embeding_para_palabra(std::vector<double> palabra){
            return embeding[0].utilizar_capa_embeding(palabra);
        };


        std::vector<std::vector<double>> obtener_codificador_pos(){
            return this->encoder_posicional;
        };



        std::vector<double> utilizar_modelo(std::vector<std::vector<double>> matriz_de_embeding){

            std::vector<std::vector<double>> matriz_de_salida = matriz_de_embeding;
            for(int codi = 0;this->codificadores.size() >codi;codi++){
                matriz_de_salida = this->codificadores[codi].calculo_hacia_adelante(matriz_de_salida);
            };

            std::vector<double> pre_res_final = this->capa_lineal[0].calcular_salida_de_red(matriz_de_salida[matriz_de_salida.size()-1]);
            
            return softmax(pre_res_final);
        };


        void entrenar(std::vector<std::vector<double>> matriz_de_errores,int longitud_de_matriz_de_entrada){
            // std::cout << "esto: 1.7" << std::endl;
            

            auto error_para_el_bloque_1_incompleto = this->capa_lineal[0].backpropagation_intra_red(matriz_de_errores,0);

            // std::cout << "esto: 1.8" << std::endl;


            std::unordered_map<int,std::vector<std::vector<double>>> objeto_para_bloque1;

            // std::cout << "esto: 1.9" << std::endl;

            for(int i = 0; i < longitud_de_matriz_de_entrada;i++ ){
                if(i != longitud_de_matriz_de_entrada-1){
                    std::vector<std::vector<double>> matriz_de_errores(error_para_el_bloque_1_incompleto.size(), std::vector<double>(error_para_el_bloque_1_incompleto[0].size(), 0.0));
                    objeto_para_bloque1[i] = matriz_de_errores;
                }else{
                    objeto_para_bloque1[i] = error_para_el_bloque_1_incompleto;
                };
            };

            // std::cout << "esto: 1.10" << std::endl;

            std::unordered_map<int,std::vector<std::vector<double>>> error_para_capa_anterior = objeto_para_bloque1;
            // std::cout << "esto: 1.10.1" << std::endl;
            
            for(int codi = this->codificadores.size()-1;codi>=0;codi--){
                // std::cout << "esto: 1.10.2" <<this->codificadores.size()-1 << codi <<std::endl;
                error_para_capa_anterior = this->codificadores[codi].backpropagation(error_para_capa_anterior);
                // std::cout << codi << std::endl;
                size_t total_doubles = 0;

                // for (const auto& [clave, matriz] : error_para_capa_anterior) {
                //     for (const auto& fila : matriz) {
                //         total_doubles += fila.size();
                //     }
                // }

                // size_t total_bytes = total_doubles * sizeof(double);
                // std::cout << "Memoria estimada usada: " << total_bytes / (1024.0 * 1024.0) << " MB" << std::endl;
                // std::cout << "esto: 1.10.3" <<this->codificadores.size()-1 << codi <<std::endl;
                };


            this->embeding[0].entrenar_capa_embeding(error_para_capa_anterior);
        };

        void reiniciar_memoria_del_modelo(){
            for(int codi = this->codificadores.size()-1;codi>=0;codi--){
                this->codificadores[codi].reiniciar_memoria();
            };
            this->capa_lineal[0].reiniciar_la_memoria_de_red();                       
        };
        void reiniciar_memoria_de_embeding(){
            this->embeding[0].reiniciar_memoria();
        };

        void guardar_parametros_de_codificador(){
            for(int codi = this->codificadores.size();codi>0;codi--){
                this->codificadores[codi].guardar_datos_de_codificador();
            };
            this->capa_lineal[0].guardar_red();
            this->embeding[0].guardar_embeding();    
        };
};



int main(){





    Funcion_de_activacion funcion_lineal;

    Funcion_de_activacion *Funcion_de_activacion_ptr = &funcion_lineal;
    

    //embeding
    int maximo_de_palabras = 100;
    int dimenciones_de_embeding = 10;
    int cantidad_de_palabras_en_el_diccionario = 3;
    //codificadores
    int cantidad_de_codificadores = 4;
    int cantidad_de_caezas_SA = 4;
    int cantidad_de_capas_SA = 3;
    std::vector<int> cantidad_de_neuronas_por_capa_SA = {32,64,dimenciones_de_embeding};
    std::vector<int> cantidad_de_pesos_por_capa_SA = {dimenciones_de_embeding,32,64};
    double TDA = 0.1;
    std::vector<Funcion_de_activacion*> funciones_de_activacion_SA = {Funcion_de_activacion_ptr,Funcion_de_activacion_ptr,Funcion_de_activacion_ptr};
    //feedFordward
    int cantidad_de_capas_FNN = 2;
    std::vector<int> cantidad_de_neuronas_por_capa_FNN = {4*dimenciones_de_embeding,dimenciones_de_embeding};
    std::vector<int> cantidad_de_pesos_por_capa_FNN = {dimenciones_de_embeding,4*dimenciones_de_embeding};
    std::vector<Funcion_de_activacion*> funciones_de_activacion_FN = {Funcion_de_activacion_ptr,Funcion_de_activacion_ptr};

    Modelo Avi(
            maximo_de_palabras,
            dimenciones_de_embeding,
            cantidad_de_palabras_en_el_diccionario,
            cantidad_de_codificadores,
            cantidad_de_caezas_SA,
            cantidad_de_capas_SA,
            cantidad_de_neuronas_por_capa_SA,
            cantidad_de_pesos_por_capa_SA,
            TDA,
            funciones_de_activacion_SA,
            cantidad_de_capas_FNN,
            cantidad_de_neuronas_por_capa_FNN,
            cantidad_de_pesos_por_capa_FNN,
            TDA,
            funciones_de_activacion_FN
    );



    std::vector<double> palabra_a_pasar = {0,1,0};
    std::vector<double> resultado_esperado = {.0,.1,.2,.3,.4,.5,.6,.7,.8,.9,};




    for(int i; i < 10; i++){










    };












    







    return 0;
};

