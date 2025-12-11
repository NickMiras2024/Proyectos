#include <iostream>
#include <unordered_map>
#include <vector>
#include <string>
#include <sstream>
#include <iomanip>
#include "diccionario.h"

// Función para separar string por un delimitador
std::vector<std::string> split(const std::string& texto, char delimitador) {
    std::vector<std::string> resultado;
    std::stringstream ss(texto);
    std::string palabra;

    while (std::getline(ss, palabra, delimitador)) {
        resultado.push_back(palabra);
    }

    return resultado;
}

// Función que devuelve el diccionario con one-hot encoding usando vector<double>
std::unordered_map<std::string, std::vector<double>> obtener_diccionario(const std::vector<std::vector<std::string>> &lote) {
    std::unordered_map<std::string, std::vector<double>> palabras;

    // 1. obtener las palabras separadas
    std::vector<std::string> palabras_separadas;
    for(size_t fila = 0 ; fila< lote.size();fila++){    
        palabras_separadas.reserve(lote[fila].size());
        for(size_t col = 0 ; col< lote[fila].size();col++){
            palabras_separadas.emplace_back(lote[fila][col]);
        };      
    };

    // 2. Mostrar palabras separadas
    std::cout << "Palabras separadas:\n";
    for (const auto& palabra : palabras_separadas) {
        std::cout << palabra << " ";
    }
    std::cout << "\n";

    // 3. Crear claves únicas en el diccionario
    for (const std::string& palabra : palabras_separadas) {
        if (palabras.find(palabra) == palabras.end()) {
            palabras[palabra] = {};  // Inicialmente vacío
        }
    }

    // 4. Asignar vector one-hot
    int index = 0;
    for (auto& par : palabras) {
        int total = palabras.size();
        par.second = std::vector<double>(total, 0.0);
        par.second[index] = 1.0;
        ++index;
    }

    return palabras;
}
