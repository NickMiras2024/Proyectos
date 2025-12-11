// COMANDO PARA RE_COMPILAR EL CODIGO DE F_AVI
// g++ -g F_AVI.o "transformerAPIC++\add_y_norm\add_y_norm.o" "transformerAPIC++\codificador\codificador.o" "transformerAPIC++\codificador_posicional\cod_pos.o" "transformerAPIC++\diccionario\diccionario.o" "transformerAPIC++\embeding\embeding.o" "transformerAPIC++\redes_neuronales\redes_neuronales.o" "transformerAPIC++\Self-attention\self_attention.o" -o F_AVI.exe

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
#include <thread>
#include <chrono>


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
                std::vector<std::string> rutas_add_y_norm ={ codificador_ruta_final + std::to_string(codi) + "_addYnorm1.txt",codificador_ruta_final + std::to_string(codi) + "_addYnorm2.txt"}; 
                std::vector<std::string> rutas_FNN = {codificador_ruta_final + std::to_string(codi) + "_FNN.txt"};
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
            if (palabra.empty()) {
                std::cerr << "Error: la palabra está vacía en main()." << std::endl;
                exit(1);
            }
            return embeding[0].utilizar_capa_embeding(palabra);
        };


        std::vector<std::vector<double>> obtener_codificador_pos(){
            return this->encoder_posicional;
        };



        std::vector<double> utilizar_modelo(std::vector<std::vector<double>> matriz_de_embeding){

            std::vector<std::vector<double>> matriz_de_salida = matriz_de_embeding;
            for(size_t codi = 0;codi< this->codificadores.size();codi++){
                auto matriz_actual = this->codificadores[codi].calculo_hacia_adelante(matriz_de_salida);
                matriz_de_salida.clear();
                matriz_de_salida = matriz_actual;
            };

            std::vector<double> pre_res_final = this->capa_lineal[0].calcular_salida_de_red(matriz_de_salida[matriz_de_salida.size()-1]);
            
            // for(auto &i : pre_res_final){
            //     // std::cout<< i << ' '; 
            // };

            return softmax(pre_res_final);
            // return pre_res_final;
        };


        void entrenar(std::vector<std::vector<double>> matriz_de_errores,int longitud_de_matriz_de_entrada){
            // // std::cout<< "esto: 1.7" << std::endl;
            

            auto error_para_el_bloque_1_incompleto = this->capa_lineal[0].backpropagation_intra_red(matriz_de_errores,0);
            // std::vector<std::vector<double>> error_para_el_bloque_1_incompleto = {sumador_con_hilos(matriz_de_errores)};


            // // std::cout<< error_para_el_bloque_1_incompleto.size()<< ' ' <<error_para_el_bloque_1_incompleto[0].size() << std::endl;


            std::unordered_map<int,std::vector<std::vector<double>>> objeto_para_bloque1;

            // // std::cout<< "esto: 1.9" << std::endl;


            for(int i = 0; i < longitud_de_matriz_de_entrada;i++ ){
                if(i != longitud_de_matriz_de_entrada-1){
                    std::vector<std::vector<double>> matriz_de_errores(error_para_el_bloque_1_incompleto.size(), std::vector<double>(error_para_el_bloque_1_incompleto[0].size(), 0.0));
                    objeto_para_bloque1[i] = matriz_de_errores;
                }else{
                    objeto_para_bloque1[i] = error_para_el_bloque_1_incompleto;
                };
            };

            // // std::cout<< "esto: 1.10" << std::endl;

            std::unordered_map<int,std::vector<std::vector<double>>> error_para_capa_anterior = objeto_para_bloque1;
            // // std::cout<< "esto: 1.10.1" << std::endl;
            
            for(int codi = this->codificadores.size()-1; codi>=0 ;codi--){
                // // std::cout<< "entrenando cod : " << codi << std::endl;

                // // std::cout<< "esto: 1.10.2 " <<this->codificadores.size()-1 << codi <<std::endl;
                error_para_capa_anterior = this->codificadores[codi].backpropagation(error_para_capa_anterior);
                // // std::cout<< codi << std::endl;
                // for (const auto& [clave, matriz] : error_para_capa_anterior) {
                //     for (const auto& fila : matriz) {
                //         total_doubles += fila.size();
                //     }
                // }

                // size_t total_bytes = total_doubles * sizeof(double);
                // // std::cout<< "Memoria estimada usada: " << total_bytes / (1024.0 * 1024.0) << " MB" << std::endl;
                // // std::cout<< "esto: 1.10.3" <<this->codificadores.size()-1 << codi <<std::endl;
                };

            // // std::cout<< "esto: 1.11.1" << std::endl;

            // this->embeding[0].entrenar_capa_embeding(error_para_capa_anterior);
        };

        void reiniciar_memoria_del_modelo(){
            for(int codi = this->codificadores.size()-1;codi>=0;codi--){
                this->codificadores[codi].reiniciar_memoria();
            };
            this->capa_lineal[0].reiniciar_la_memoria_de_red();                       
        };

        void actualizar_modelo(double bach){
            for(int codi = this->codificadores.size()-1;codi>=0;codi--){
                this->codificadores[codi].actualizar_codificador(bach);
            };
            this->capa_lineal[0].actualizar_red(bach); 
            // this->embeding[0].actualizar_embeding(bach);                      
        };

        void reiniciar_memoria_de_embeding(){
            this->embeding[0].reiniciar_memoria();
        };

        void guardar_parametros_de_codificador(){
            for(int codi = this->codificadores.size()-1;codi>=0;codi--){

                this->codificadores[codi].guardar_datos_de_codificador();
            };
            this->capa_lineal[0].guardar_red();
            this->embeding[0].guardar_embeding();    
        };
};









// class Funcion_de_activacion {
// public:
//     double funcion(double x){
//         return x;
//     };
//     double derivada(double x){
//         return 1;
//     };
// };

void transformar_texto_a_minusculas(std::string& texto){
        std::transform(texto.begin(), texto.end(), texto.begin(),
                   [](unsigned char c){ return std::tolower(c); });

}





std::vector<std::string> splitPalabras(std::string&texto) { // pasamos por copia para modificar
    // Convertir todo el texto a minúsculas
    std::vector<std::string> palabras;
    std::istringstream stream(texto);
    std::string palabra;

    while (stream >> palabra) {
        palabras.push_back(palabra);
    }

    return palabras;
}







std::vector<std::vector<std::string>> divicion_de_frases(std::string &texto, int maximo) {
    std::vector<std::string> texto_dividido = splitPalabras(texto);
    std::vector<std::vector<std::string>> matriz_de_oraciones;

    int total_palabras = texto_dividido.size();
    int i = 0;

    while (i < total_palabras) {
        int palabras_restantes = total_palabras - i;
        int cantidad_a_tomar = std::min(maximo, palabras_restantes);

        std::vector<std::string> grupo;
        grupo.reserve(cantidad_a_tomar);

        for (int j = 0; j < cantidad_a_tomar; j++) {
            grupo.emplace_back(texto_dividido[i + j]);
        }

        matriz_de_oraciones.emplace_back(grupo);
        i += cantidad_a_tomar;
    }

    return matriz_de_oraciones;
}

std::vector<double> sumador_de_vectores(std::vector<double> v1,std::vector<double> &v2 ){
    // // std::cout<< "esto: 10.1" << std::endl;

    std::vector<double> res = v1;
    // // std::cout<< "esto: 10.2" << v1.size() << v2.size()<< std::endl;

    for(size_t i =0 ; i< v1.size(); i++ ){
        // // std::cout<< "esto: 10.3" << std::endl;

        res[i] = v1[i] + v2[i];
    };
    // // std::cout<< "esto: 10.4" << std::endl;

    return res;
};


// y_pred: vector de probabilidades (salida de softmax)
// y_true: vector one-hot con la clase verdadera
double categorical_cross_entropy(const std::vector<double>& y_pred, const std::vector<double>& y_true) {
    double loss = 0.0;
    for (size_t i = 0; i < y_pred.size(); ++i) {
        if (y_true[i] == 1.0) {
            // Evitar log(0) con un pequeño valor
            loss = -std::log(y_pred[i] + 1e-15);
            break;
        }
    }
    return loss;
}

int main(){


    


    //______________________DATOS_DE_ENTRENAMIENTO_Y_DICCIONARIO___________________
    

    //texto a utilizar para generar el diccionario y entrenar la red de forma general en el idioma 
    std::ifstream archivo("texto_de_entrenamiento.txt");

    std::stringstream buffer;
    buffer << archivo.rdbuf();  // Lee todo el contenido en el stringstream

    std::string  texto_de_entrenamiento = buffer.str();  // Convierte a string
    // std::cout<< "Contenido del archivo:\n" << texto_de_entrenamiento << "\n";

    archivo.close();


    transformar_texto_a_minusculas(texto_de_entrenamiento);

    
    
    std::vector<std::vector<std::string>> lotes_de_entrenamiento = divicion_de_frases(texto_de_entrenamiento,6);
        
    // std::vector<std::vector<std::string>> lotes_de_entrenamiento = {
    //                                                                 {"hola,","como","estas?"},
    //                                                                 {"quien","sos","vos?"},
    //                                                                 {"balto","es","perro"},
    //                                                                 };



    // for(auto &vec : lotes_de_entrenamiento){
    //     for(auto &elemento: vec){
    //         // std::cout<< elemento << ' ';
    //     };
    //     // std::cout<< std::endl;

    // };

    // std::vector<std::vector<std::string>> lotes_de_entrenamiento = {
    // {"Mira", "yo", "no", "queria"},
    // {"ser", "mestizo", "Si", "estas"},
    // {"leyendo", "esto", "porque", "crees"},
    // {"que", "podrias", "estar", "en"},
    // {"la", "misma", "situacion", "mi"},
    // {"consejo", "es", "este", "cierra"},
    // {"el", "libro", "inmediatamente", "Creete"},
    // {"la", "mentira", "que", "tu"},
    // {"padre", "o", "tu", "madre"},
    // {"te", "contaran", "sobre", "tu"},
    // {"nacimiento", "e", "intenta", "llevar"},
    // {"una", "vida", "normal", "Ser"},
    // {"mestizo", "es", "peligroso", "Asusta"},
    // {"La", "mayor", "parte", "del"},
    // {"tiempo", "solo", "sirve", "para"},
    // {"que", "te", "maten", "de"},
    // {"manera", "horrible", "y", "dolorosa"},
    // {"Si", "eres", "un", "nino"},
    // {"normal", "que", "esta", "leyendo"},
    // {"esto", "porque", "cree", "que"},
    // {"es", "ficcion", "fantastico", "Sigue"},
    // {"leyendo", "Te", "envidio", "por"},
    // {"ser", "capaz", "de", "creer"},
    // {"que", "nada", "de", "esto"},
    // {"sucedio", "Pero", "si", "te"},
    // {"reconoces", "en", "estas", "paginas"},
    // {"si", "sientes", "que", "algo"},
    // {"se", "remueve", "en", "tu"},
    // {"interior", "deja", "de", "leer"},
    // {"al", "instante", "Podrias", "ser"},
    // {"uno", "de", "nosotros", "Y"},
    // {"en", "cuanto", "lo", "sepas"},
    // {"solo", "es", "cuestion", "de"},
    // {"tiempo", "que", "tambien", "ellos"},
    // {"lo", "presientan", "y", "entonces"},
    // {"iran", "por", "ti", "No"},
    // {"digas", "que", "no", "estas"},
    // {"avisado", "Me", "llamo", "Percy"},
    // {"Jackson", "Tengo", "doce", "anos"},
    // {"Hasta", "hace", "unos", "meses"},
    // {"estudiaba", "interno", "en", "la"},
    // {"academia", "Yancy", "un", "colegio"},
    // {"privado", "para", "ninos", "con"},
    // {"problemas", "en", "el", "norte"},
    // {"del", "estado", "de", "Nueva"},
    // {"York", "Soy", "un", "nino"},
    // {"con", "problemas", "Si", "Podriamos"},
    // {"llamarlo", "asi", "Podria", "empezar"},
    // {"en", "cualquier", "punto", "de"},
    // {"mi", "corta", "y", "triste"},
    // {"vida", "para", "dar", "prueba"},
    // {"de", "ello", "pero", "las"},
    // {"cosas", "comenzaron", "a", "ir"},
    // {"realmente", "mal", "en", "mayo"},
    // {"del", "ano", "pasado", "cuando"},
    // {"los", "alumnos", "de", "sexto"},
    // {"curso", "fuimos", "de", "excursion"},
    // {"a", "Manhattan", "veintiocho", "crios"},
    // {"tarados", "y", "dos", "profesores"},
    // {"en", "un", "autobus", "escolar"},
    // {"amarillo", "en", "direccion", "al"},
    // {"Museo", "Metropolitano", "de", "Arte"},
    // {"a", "ver", "cosas", "griegas"},
    // {"y", "romanas", "Ya", "lo"},
    // {"se", "suena", "a", "tortura"},
    // {"La", "mayoria", "de", "las"},
    // {"excursiones", "de", "Yancy", "lo"},
    // {"eran", "Pero", "el", "senor"},
    // {"Brunner", "nuestro", "profesor", "de"},
    // {"latin", "dirigia", "la", "excursion"},
    // {"asi", "que", "tenia", "esperanzas"},
    // {"El", "senor", "Brunner", "era"},
    // {"un", "tipo", "de", "mediana"},
    // {"edad", "que", "iba", "en"},
    // {"silla", "de", "ruedas", "motorizada"},
    // {"Le", "clareaba", "el", "cabello"},
    // {"lucia", "una", "barba", "desalinada"},
    // {"y", "una", "chaqueta", "de"},
    // {"tweed", "raida", "que", "siempre"},
    // {"olia", "a", "cafe", "Con"},
    // {"ese", "aspecto", "imposible", "adivinar"},
    // {"que", "era", "guay", "pero"},
    // {"contaba", "historias", "y", "chistes"},
    // {"y", "nos", "dejaba", "jugar"},
    // {"en", "clase", "Tambien", "tenia"},
    // {"una", "coleccion", "alucinante", "de"},
    // {"armaduras", "y", "armas", "romanas"},
    // {"asi", "que", "era", "el"},
    // {"unico", "profesor", "con", "el"},
    // {"que", "no", "me", "dormia"},
    // {"en", "clase", "Esperaba", "que"},
    // {"el", "viaje", "saliera", "bien"},
    // {"Esperaba", "por", "una", "vez"},
    // {"no", "meterme", "en", "problemas"},
    // {"Anda", "que", "no", "estaba"},
    // {"equivocado", "Veras", "en", "las"},
    // {"excursiones", "me", "pasan", "cosas"},
    // {"malas", "Como", "cuando", "en"},
    // {"quinto", "fui", "al", "campo"},
    // {"de", "batalla", "de", "Saratoga"},
    // {"donde", "tuve", "aquel", "accidente"},
    // {"con", "el", "canon", "de"},
    // {"la", "guerra", "de", "la"},
    // {"Independencia", "americana", "Yo", "no"},
    // {"estaba", "apuntando", "al", "autobus"},
    // {"del", "colegio", "pero", "por"},
    // {"supuesto", "me", "expulsaron", "igualmente"},
    // {"Y", "antes", "de", "aquello"},
    // {"en", "cuarto", "curso", "durante"},
    // {"la", "visita", "a", "las"},
    // {"instalaciones", "de", "la", "piscina"},
    // {"para", "tiburones", "en", "Marine"},
    // {"World", "le", "di", "a"},
    // {"la", "palanca", "equivocada", "en"},
    // {"la", "pasarela", "y", "nuestra"},
    // {"clase", "acabo", "dandose", "un"},
    // {"chapuzon", "inesperado", "Y", "la"},
    // {"anterior", "Bueno", "te", "haces"},
    // {"una", "idea", "verdad", "En"},
    // {"aquella", "excursion", "estaba", "decidido"},
    // {"a", "portarme", "bien", "Durante"},
    // {"todo", "el", "viaje", "a"},
    // {"la", "ciudad", "soporte", "a"},
    // {"Nancy", "Bobofit", "la", "pelirroja"},
    // {"pecosa", "y", "cleptomana", "que"},
    // {"le", "lanzaba", "a", "mi"},
    // {"mejor", "amigo", "Grover", "trocitos"},
    // {"de", "sandwich", "de", "mantequilla"},
    // {"de", "cacahuete", "y", "ketchup"},
    // {"al", "cogote", "hola", "como"},
    // {"estas", "quien", "sos", "vos"},
    // {"balto", "es", "perro"}
    // };


    
    std::unordered_map<std::string, std::vector<double>> diccionario = obtener_diccionario(lotes_de_entrenamiento);



    // std::unordered_map<std::string, std::vector<double>> diccionario = obtener_diccionario("hola, como estas? quien sos vos? balto es perro");


    Funcion_de_activacion funcion_lineal;

    Funcion_de_activacion *Funcion_de_activacion_ptr = &funcion_lineal;
    
    //prueba de regracion lineal para ver si funciona el modelo
    std::vector<std::vector<std::vector<double>>> matriz_de_pueba = {
                                                                        {
                                                                            {.1,.2,.6},
                                                                            {.1,.2,.6}
                                                                        },
                                                                        {
                                                                            {.2,.3,.6},
                                                                            {.2,.3,.6}
                                                                        },
                                                                        {
                                                                            {.6,.1,.1},
                                                                            {.6,.1,.1}
                                                                        },
                                                                        {
                                                                            {.6,.6,.6},
                                                                            {.6,.6,.6}
                                                                        }                                                            
                                                                    };

    std::vector<std::vector<double>> vector_de_salida_esperado = {{0,0,1},{0,0,1},{1,0,0},{1,1,1}};





    //embeding
    int maximo_de_palabras = lotes_de_entrenamiento[0].size()+5;
    int dimenciones_de_embeding = 3;
    // diccionario.size()
    int cantidad_de_palabras_en_el_diccionario = 3;
    //codificadores
    int cantidad_de_codificadores =8;
    int cantidad_de_caezas_SA =2;
    int cantidad_de_capas_SA = 3;
    std::vector<int> cantidad_de_neuronas_por_capa_SA = {4,8,dimenciones_de_embeding};
    std::vector<int> cantidad_de_pesos_por_capa_SA = {dimenciones_de_embeding,4,8};
    double TDA = 0.000000001;
    std::vector<Funcion_de_activacion*> funciones_de_activacion_SA = {Funcion_de_activacion_ptr,Funcion_de_activacion_ptr,Funcion_de_activacion_ptr};
    //feedFordward
    int cantidad_de_capas_FNN = 2;
    std::vector<int> cantidad_de_neuronas_por_capa_FNN = {8*dimenciones_de_embeding,dimenciones_de_embeding};
    std::vector<int> cantidad_de_pesos_por_capa_FNN = {dimenciones_de_embeding,8*dimenciones_de_embeding};
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
    std::cout<< "________________________________CREACION_COMPLETA__________________________" << std::endl;


    std::vector<std::vector<double>> EP = Avi.obtener_codificador_pos();


    
    std::vector<double> errores_f;

    errores_f.reserve(1000);

    for(int esp = 0;esp < 1000;esp++){
 
        double errores_de_epoca = 0.0;
        



        for(size_t vec = 0; vec< matriz_de_pueba.size();vec++){
            std::vector<std::vector<double>> matriz_DE = matriz_de_pueba[vec];
            std::vector<double> resultado = Avi.utilizar_modelo(matriz_DE);

            std::vector<double> errores = resultado;
            errores_de_epoca += categorical_cross_entropy(resultado,vector_de_salida_esperado[vec]);
            for(size_t i= 0; i< resultado.size();i++){
                errores[i] = (resultado[i] - vector_de_salida_esperado[vec][i]);
            };

            
            std::vector<std::vector<double>> matriz_de_errores = {errores}; 
            Avi.entrenar(matriz_de_errores,1);
            Avi.reiniciar_memoria_del_modelo();
 
        };
        Avi.actualizar_modelo(4);
        
        std::cout<< errores_de_epoca << " epoca numero: " << esp << " de " << 1000 << std::endl;
 
        errores_f.emplace_back(errores_de_epoca);
 
        // // // std::cout<< "esto: 2" << std::endl;
        // double error_de_esp = 0.0;
        // double bach = 0.0;
        // for(size_t dato= 0;dato< lotes_de_entrenamiento.size();dato++ ){
        //         // // std::cout<< "esto: 3" << std::endl;


        //         double error_de_los_datos = 0;


        //         std::vector<std::vector<double>> matriz_de_embeding = {sumador_de_vectores(Avi.crear_embeding_para_palabra(diccionario[lotes_de_entrenamiento[dato][0]]),EP[0])}; 
        //         // // std::cout<< "esto: 4" << std::endl;

        //         std::vector<std::string> frase_del_modelo = {lotes_de_entrenamiento[dato][0]}; 

        //         // // std::cout<< "esto: 5" << std::endl;
        //         for(size_t palabra = 1;palabra< lotes_de_entrenamiento[dato].size();palabra++){
        //             // // std::cout<< "_____PALABRA____" <<palabra << lotes_de_entrenamiento[dato].size() << lotes_de_entrenamiento[dato][palabra]<< std::endl;
        //             // 
        //             // predecir salida
        //             std::vector<double> resultado = Avi.utilizar_modelo(matriz_de_embeding);

        //             // //mostrar probabilidades
        //             // // std::cout<< "resultado : " << std::endl;
        //             // for(auto &i : resultado){
        //             //     // std::cout<< i << ' '; 
        //             // }
                    
        //             //elejir palabra
        //             int indice =0;
        //             double numero_max = -1.1;
        //             for(size_t i = 0; i< resultado.size();i++ ){
        //                 if(numero_max < resultado[i]){
        //                     indice = i;
        //                     numero_max = resultado[i];
        //                 };
        //             };

        //             int i = 0;
        //             std::string palabra_elegida;
        //             int token_esperado = 0; 
        //             for(auto &palabra_actual : diccionario){
        //                 if(i == indice){
        //                     palabra_elegida = palabra_actual.first;
        //                 };
        //                 if(palabra_actual.first == lotes_de_entrenamiento[dato][palabra]){
        //                     token_esperado = i;
        //                 };
        //                 i++;
        //             };

        //             std::vector<double> error = resultado;
        //             std::vector<double> palabra_esperada_en_one_hot;
        //             palabra_esperada_en_one_hot.resize(error.size()); 

        //             palabra_esperada_en_one_hot[token_esperado] = 1;
        //             error[token_esperado] -= 1;


        //             error_de_los_datos += categorical_cross_entropy(resultado,palabra_esperada_en_one_hot) /lotes_de_entrenamiento[dato].size();


        //             // for(auto &i : error){
        //             //     error_de_los_datos += std::abs(i);
        //             // };


        //             std::vector<std::vector<double>> matriz_de_errores = {error}; 






        //             // // std::cout<< "esto: 6" << std::endl;

        //             Avi.entrenar(matriz_de_errores,matriz_de_embeding.size());
        //             // // std::cout<< "esto: 7" << std::endl;

        //             frase_del_modelo.reserve(frase_del_modelo.size()+1);
        //             // // std::cout<< "esto: 8" << std::endl;

        //             frase_del_modelo.emplace_back(palabra_elegida);
        //             // // std::cout<< "esto: 9" << std::endl;

        //             matriz_de_embeding.reserve(matriz_de_embeding.size()+1);
        //             // // std::cout<< "esto: 10" <<lotes_de_entrenamiento[dato][palabra] << std::endl;



        //             auto em = Avi.crear_embeding_para_palabra(diccionario[lotes_de_entrenamiento[dato][palabra]]);
        //             // // std::cout<< "esto: 10.11 "<< EP[palabra].size()<< ' '<< em.size() << std::endl;

        //             auto sum = sumador_de_vectores(em,EP[palabra]);
        //             // // std::cout<< "esto: 10.12 " << std::endl;


             




        //             matriz_de_embeding.emplace_back(sum);
        //             // // std::cout<< "esto: 11" << std::endl;
        //             // // std::cout<< '\n' << palabra_elegida << ' ' <<numero_max << ' '<< indice ;

        //             Avi.reiniciar_memoria_del_modelo();

        //             // // std::cout<< "1" << std::endl;
        //             // bach += static_cast<double>(lotes_de_entrenamiento[dato].size());
        //             // // std::cout<< "esto: 13" << std::endl;

        //             // bach = 0;



        //             // std::this_thread::sleep_for(std::chrono::milliseconds(1)); // Pausa de 1 ms
        //         };
        //         Avi.reiniciar_memoria_de_embeding();
        //         bach += static_cast<double>(lotes_de_entrenamiento[dato].size());
        //         Avi.actualizar_modelo(bach);
        //         bach = 0.0;


            

        //     //mostrar probabilidades
        //     std::cout<< "\n __________________RESULTADO_________________:" << std::endl;
        //     for(auto &i : frase_del_modelo){
        //         std::cout<< i << ' '; 
        //     }
        //     std::cout<< std::endl;

        //     for(auto &i : lotes_de_entrenamiento[dato]){
        //         std::cout<< i << ' '; 
        //     }
        //     std::cout<< '\n' << error_de_los_datos << std::endl;
    
        //     error_de_esp += error_de_los_datos;
        //     // break;
        //     matriz_de_embeding.shrink_to_fit();
        //     frase_del_modelo.shrink_to_fit();   

        // };

        // // break;
        
        // errores.reserve(errores.size()+1);

        // errores.emplace_back(error_de_esp /lotes_de_entrenamiento.size());
        // std::cout<< "\n________________________" << esp+1 << " de " << 1000 <<  " err "<< error_de_esp /lotes_de_entrenamiento.size()  <<"_________________________________" << std::endl;
        // // std::this_thread::sleep_for(std::chrono::milliseconds(1)); // Pausa de 1 ms

        // std::cout<< std::endl ;
        // for(auto &i : errores){
        //     std::cout<< i << ',';            
        // };
        // std::cout<< std::endl ;

    };



    std::vector<double> resultado = Avi.utilizar_modelo(matriz_de_pueba[0]);

    std::cout << std::endl;
    for(auto &res : resultado){
        std::cout<<res << " ";
    };


    std::cout << std::endl;
     for(auto &err : errores_f){
        std::cout<<err << ",";
    };



    // Avi.guardar_parametros_de_codificador();


    return 0;

};
