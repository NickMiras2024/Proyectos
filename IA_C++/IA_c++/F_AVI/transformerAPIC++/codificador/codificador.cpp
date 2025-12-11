#include "codificador.h"


Codificador::Codificador(
    //rutas
    std::vector<std::string> rutas_add_y_norm,
    std::vector<std::string> ruta_FNN,
    std::string ruta_self_attention,

    //self_attention
    int cantidad_de_cabezas_SA,
    int dimencion_del_embeding,
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

    TDA = TDA_SA;
    //// // std::cout<< "creando cabezas" << std::endl;

    //// // std::cout<< dimencion_del_embeding << ' '<< cantidad_de_cabezas_SA <<(dimencion_del_embeding% cantidad_de_cabezas_SA) << std::endl;

    if ((dimencion_del_embeding% cantidad_de_cabezas_SA) == 0){
        //// // std::cout<<"utilizando cabezas propuestas " ;
        cantidad_de_neuronas_por_capa__SA[cantidad_de_neuronas_por_capa__SA.size()-1] = (dimencion_del_embeding / cantidad_de_cabezas_SA);
    }else{
        std::cout<< "NO se puede dividir las cabezas utilizando una sola \n";
        cantidad_de_cabezas_SA = 1;
        cantidad_de_neuronas_por_capa__SA[cantidad_de_neuronas_por_capa__SA.size()-1] = dimencion_del_embeding;
    };

    std::vector<std::string> rutas_de_cabezas;
    rutas_de_cabezas.resize(cantidad_de_cabezas_SA);
    this->cabezas.reserve(cantidad_de_cabezas_SA);

    for(int cabeza_num = 0; cabeza_num < cantidad_de_cabezas_SA;cabeza_num++ ){
        rutas_de_cabezas[cabeza_num] = ruta_self_attention + "cabeza_" + std::to_string(cabeza_num);            
        this->cabezas.emplace_back(Self_attention(cantidad_de_capas_SA,cantidad_de_neuronas_por_capa__SA,cantidad_de_pesos_por_capa_SA,TDA_SA,funciones_de_activacion_SA,rutas_de_cabezas[cabeza_num]));
    };

    //// // std::cout<< "creando add Y norms" << std::endl;

    this->addYnorms.reserve(2);

    addYnorms.emplace_back(LayerNorm(dimencion_del_embeding,1e-5,rutas_add_y_norm[0]));
    addYnorms.emplace_back(LayerNorm(dimencion_del_embeding,1e-5,rutas_add_y_norm[1]));

    this->rutas_add_y_norm = rutas_add_y_norm;


    //// // std::cout<< "creando Feedfordward" << std::endl;

    this->red.reserve(1);


    red.emplace_back(Red_neuronal(cantidad_de_capas_FNN,cantidad_de_neuronas_por_capa_FNN,cantidad_de_pesos_por_capa_FNN,funciones_de_activacion_FNN,TDA_FNN,ruta_FNN));

    //// // std::cout<< "Feedfordward creada" << std::endl;

};   


void Codificador::guardar_datos_de_codificador(){
    for(size_t cabeza_num = 0; cabeza_num< this->cabezas.size() ;cabeza_num++ ){
        this->cabezas[cabeza_num].guardar_SF();
    };

    this->addYnorms[0].guardar_parametros(rutas_add_y_norm[0]);
    this->addYnorms[1].guardar_parametros(rutas_add_y_norm[1]);

    this->red[0].guardar_red();
};

void Codificador::reiniciar_memoria(){
    for(size_t cabeza_num = 0;cabeza_num< this->cabezas.size();cabeza_num++ ){
        this->cabezas[cabeza_num].reiniciar_memoria();
    };
    this->red[0].reiniciar_la_memoria_de_red();
};


void Codificador::actualizar_codificador(double bach ){
    for(size_t cabeza_num = 0;cabeza_num< this->cabezas.size();cabeza_num++ ){
        this->cabezas[cabeza_num].actualizar_SF(bach);
    };
    this->red[0].actualizar_red(bach);
    this->addYnorms[1].step(TDA / bach);
    this->addYnorms[0].step(TDA / bach);

};


std::vector<std::vector<double>> Codificador::calculo_hacia_adelante(std::vector<std::vector<double>> frase_matriz){

//_________________________Self_attention________________

std::vector<std::vector<std::vector<double>>> resultado_de_las_cabezas ;
resultado_de_las_cabezas.reserve(this->cabezas.size());

//obtener los resultados de las cabezas 
for(size_t cabeza_num = 0;cabeza_num< this->cabezas.size();cabeza_num++ ){
    resultado_de_las_cabezas.emplace_back(this->cabezas[cabeza_num].utilizar_SF(frase_matriz));
};


std::vector<std::vector<double>>  palabras_completas_con_atencion;


//juntar cada palabra de cada caeza con el resto 
for(size_t cabeza_matriz = 0;cabeza_matriz< resultado_de_las_cabezas.size();cabeza_matriz++ ){
    //cabeza matriz accede a la matriz que devolvio la cabeza y semi_palabra a la fila (la semi palabra):)
    for(size_t semi_palabra = 0;semi_palabra< resultado_de_las_cabezas[0].size();semi_palabra++ ){

        if(cabeza_matriz == 0){
            palabras_completas_con_atencion = resultado_de_las_cabezas[cabeza_matriz];

        }else{

            palabras_completas_con_atencion[semi_palabra].insert(palabras_completas_con_atencion[semi_palabra].end(),resultado_de_las_cabezas[cabeza_matriz][semi_palabra].begin(),resultado_de_las_cabezas[cabeza_matriz][semi_palabra].end());
        };

    }

}



//_________________________ADDYNORM1________________
auto pre_res1 = this->addYnorms[0].add(palabras_completas_con_atencion,frase_matriz);


std::vector<std::vector<double>> resultado_de_normalizacion1 = this->addYnorms[0].normalizado(pre_res1);




//_________________________FeedFordward________________

//pasada de palabras (se le pasan una por una)

std::vector<std::vector<double>> palabras_procesadas;
palabras_procesadas.reserve(resultado_de_normalizacion1.size());

for(size_t palabra = 0;palabra< resultado_de_normalizacion1.size();palabra++){
    palabras_procesadas.emplace_back(this->red[0].calcular_salida_de_red(resultado_de_normalizacion1[palabra]));
};


//_________________________ADDYNORM2________________

return this->addYnorms[1].normalizado(this->addYnorms[1].add(palabras_procesadas,resultado_de_normalizacion1));


};


std::unordered_map<int,std::vector<std::vector<double>>> Codificador::backpropagation( std::unordered_map<int,std::vector<std::vector<double>>>  errores){
// // std::cout<< "___________BACK_____________________" << std::endl;




std::unordered_map<int,std::unordered_map<int,std::vector<std::vector<double>>>> objeto_de_errores_crudos;

std::unordered_map<int,std::vector<std::vector<double>>> palabras_errores;

// // std::cout<< "VA bien 4 " << std::endl;

for(size_t palabra = 0; palabra < errores.size(); palabra++){

    // // std::cout<< "VA bien 5 " << palabra << std::endl;


    //________________________________________ADD_Y_NORM2_______________________________
    std::vector<double> vector_de_errores_para_add_y_norm2 = sumador_con_hilos(errores[palabra]);            
    // // std::cout<< "VA bien 6 " << palabra << std::endl;
    



    std::vector<std::vector<double>> errores_batch_1 = { vector_de_errores_para_add_y_norm2 };
    // // std::cout<< "VA bien 7 " << palabra << std::endl;

    std::vector<std::vector<double>> vector_de_errores_para_feedFordward = this->addYnorms[1].backward(errores_batch_1);
    // // std::cout<< "VA bien 8 " << palabra << std::endl;

    // //// // std::cout<< "VA bien 9 " << palabra << std::endl;


    //________________________________________FeedFordward_______________________________

    // // std::cout<< std::endl;
    // for(auto &vec : vector_de_errores_para_feedFordward){
    
    //     for(auto &val : vec){
    //         // std::cout<< val <<' '; 
    //     };
    // };
    // // std::cout<< std::endl;

    std::vector<std::vector<double>> vector_de_errores_para_add_y_norm1 = this->red[0].backpropagation_intra_red(vector_de_errores_para_feedFordward,palabra);
    // // std::cout<< "VA bien 10 " << palabra << std::endl;

    // // std::cout<< "VA bien 7 " << palabra << std::endl;

    //________________________________________ADD_Y_NORM1_______________________________

    std::vector<double> vector_de_errores_para_add_y_norm1_sumado = sumador_con_hilos(vector_de_errores_para_add_y_norm1);            
    // // std::cout<< "VA bien 11 " << palabra << std::endl;
   
    std::vector<std::vector<double>> matriz_de_errores_para_las_cabezas = this->addYnorms[0].backward({vector_de_errores_para_add_y_norm1_sumado});
    // // std::cout<< "VA bien 12 " << palabra << std::endl;
   
    // //// // std::cout<< "VA bien 13 " << palabra << std::endl;




    // //// // std::cout<< "VA bien 8 " << palabra << std::endl;

    //________________________________________SELF_ATTENTION_______________________________


    //se preparan las columnas para enviarselas a las respectivas cabezas
    std::unordered_map<int,std::vector<std::vector<double>>> errores_para_cada_una_de_las_cabezas;

    for(size_t cabeza = 0;cabeza< this->cabezas.size();cabeza++){
        // // std::cout<< "VA bien 12.1 " << cabeza << ' ' <<this->cabezas.size()<< std::endl;

        std::vector<std::vector<double>> matriz_errores_SF;
        matriz_errores_SF.reserve(matriz_de_errores_para_las_cabezas.size());
        // // std::cout<< "VA bien 12.2 " << cabeza << ' ' <<this->cabezas.size()<< std::endl;

        for(size_t fila = 0;fila<matriz_de_errores_para_las_cabezas.size() ;fila++){
            // // std::cout<< "VA bien 12.3 " << fila << ' ' <<matriz_de_errores_para_las_cabezas.size()<< std::endl;
            std::vector<double> vector_err;
            vector_err.reserve((matriz_de_errores_para_las_cabezas[0].size()/ this->cabezas.size()));
            // // std::cout<< "VA bien 12.4 " << fila << ' ' <<matriz_de_errores_para_las_cabezas.size()<< std::endl;

            for(size_t col = 0;col<(matriz_de_errores_para_las_cabezas[0].size() / this->cabezas.size()) ;col++){
                // // std::cout<< "VA bien 12.5 " << col << ' ' <<(matriz_de_errores_para_las_cabezas[0].size() / this->cabezas.size())<< ' ' <<col + ((matriz_de_errores_para_las_cabezas[0].size() / this->cabezas.size()) * cabeza )<< std::endl;
                vector_err.emplace_back(matriz_de_errores_para_las_cabezas[fila][col + (matriz_de_errores_para_las_cabezas[0].size() / this->cabezas.size() * cabeza )]);
                // // std::cout<< "VA bien 12.6 " << col << ' ' <<(matriz_de_errores_para_las_cabezas[0].size() / this->cabezas.size())<< std::endl;
            
            };
            matriz_errores_SF.emplace_back(vector_err);
        };
    

        errores_para_cada_una_de_las_cabezas[cabeza] = matriz_errores_SF;
    };




    // // std::cout<< "VA bien 9 " << palabra << std::endl;



    //se entrenan las cabezas con los errores y se guarda en objeto crudo de errores para la capa anterior 

    for(size_t cabeza = 0;cabeza< this->cabezas.size();cabeza++){
    

        std::vector<double> vector_de_errores_para_cada_una_de_las_cabezas = sumador_con_hilos(errores_para_cada_una_de_las_cabezas[cabeza]);
        
        objeto_de_errores_crudos[cabeza] = this->cabezas[cabeza].backpropagation(vector_de_errores_para_cada_una_de_las_cabezas,palabra);
        
        // //// // std::cout<< "objeto_de_errores_crudos[cabeza]:\n";
        // for (const auto& [indice, matriz] : objeto_de_errores_crudos[cabeza]) {
        //     //// // std::cout<< "Índice: " << indice << "\n";
        //     for (const auto& fila : matriz) {
        //         //// // std::cout<< "  [ ";
        //         for (double val : fila) {
        //             //// // std::cout<< val << " ";
        //         }
        //         //// // std::cout<< "]\n";
        //     }
        // }

    };
    

    // // std::cout<< "VA bien 10 " << palabra << std::endl;

    //convierte el objeto (que en un inicio era del tamaño de las cabezas) en uno solo para que se pueda enviar a la capa anterior
    for(size_t numero_de_cabeza = 0; numero_de_cabeza< objeto_de_errores_crudos.size();numero_de_cabeza++ ){
        for(size_t numero_de_palabra= 0; numero_de_palabra< objeto_de_errores_crudos[numero_de_cabeza].size();numero_de_palabra++ ){
            if(numero_de_cabeza == 0){
                palabras_errores = objeto_de_errores_crudos[numero_de_cabeza];
                break;
            }else{
                for(size_t fila = 0;fila<objeto_de_errores_crudos[numero_de_cabeza][numero_de_palabra].size() ;fila++){
                    palabras_errores[numero_de_palabra].reserve(palabras_errores[numero_de_palabra].size()+1);
                    palabras_errores[numero_de_palabra].emplace_back(objeto_de_errores_crudos[numero_de_cabeza][numero_de_palabra][fila]);
                };

            };
        
        };
    };
    // // std::cout<< "VA bien 14" << palabra << std::endl;

}; 


// // std::cout<< "VA bien 15 " << std::endl;


return palabras_errores;
};







// int main(){
    

//     std::vector<std::vector<double>> matriz_de_entrada = {{0.01,0.02,0.03,0.05},
//                                                           {0.04,0.03,0.02,0.03},
//                                                           {0.05,0.05,0.05,0.02}
//                                                         };

    
//     Funcion_de_activacion funcion_lineal;

//     auto *funcion_lineal_ptr = &funcion_lineal;

//     std::vector<Funcion_de_activacion*> funciones = {funcion_lineal_ptr,funcion_lineal_ptr,funcion_lineal_ptr};


//     std::vector<std::string> rutas_add_norm = {"hola"};
//     std::vector<std::string> ruta_fnn = {"hola"};
//     std::string ruta_SF = "hola";
//     std::vector<int> CDNPCSA = {3,4,4};
//     std::vector<int> CDPPC = {4,3,4};



//     //// // std::cout<< "____________________Creando cod_________________________" << std::endl;
    
//     Codificador cod1(
//                     rutas_add_norm,
//                     ruta_fnn,
//                     ruta_SF,
//                     2,
//                     matriz_de_entrada[0].size(),
//                     3,
//                     CDNPCSA,
//                     CDPPC,
//                     0.1,
//                     funciones,
//                     3,
//                     CDNPCSA,
//                     CDPPC,
//                     0.1,
//                     funciones
//     );

//     //// // std::cout<< "____________________Cod creado_________________________" << std::endl;

    

//     //// // std::cout<< "VA bien 0 " << std::endl;



//     //pruenba de entrenamiento 

//    double learning_rate = 0.01;

// for(int esp = 0; esp < 1000; esp++) {
//     // Forward pass
//     std::vector<std::vector<double>> res = cod1.calculo_hacia_adelante(matriz_de_entrada);

//     // Target objetivo fijo (igual tamaño que la salida)
//     std::vector<std::vector<double>> target = {
//         {0.1, 0.1, 0.1, 0.1},
//         {0.1, 0.1, 0.1, 0.1},
//         {0.1, 0.1, 0.1, 0.1}
//     };



//     // Calcular error MSE y preparar gradientes para backpropagation
//     double suma_de_err = 0.0;
//     std::unordered_map<int, std::vector<std::vector<double>>> errores;

//     for (int i = 0; i < (int)res.size(); i++) {
//         std::vector<double> error_vector(res[i].size());
//         for (int j = 0; j < (int)res[i].size(); j++) {
//             double error = res[i][j] - target[i][j];
//             error_vector[j] = 2.0 * error; // Derivada del MSE respecto al output
//             suma_de_err += error * error;
//         }
//         errores[i] = { error_vector }; // vector de 1 fila
//     }

//     // Backward pass
//     cod1.backpropagation(errores);

//     // Step de parámetros: importante para que aprenda

//     // Mostrar progreso
//     //// // std::cout<< "Error: " << suma_de_err << " | epoca: " << esp << std::endl;
// }


//     std::vector<std::vector<double>> res2 = cod1.calculo_hacia_adelante(matriz_de_entrada);



//     //// // std::cout<< "RESPUESTA:" << std::endl;
//         for(auto &i : res2){
//             for(auto &i2 : i){
//                 //// // std::cout<< i2 << ' ';
//                 };
//             //// // std::cout<< std::endl;
//         };




//     return 0;
// };