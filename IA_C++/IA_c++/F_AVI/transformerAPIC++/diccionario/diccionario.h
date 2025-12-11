#include <iostream>
#include <unordered_map>
#include <vector>
#include <string>
#include <sstream>
#include <iomanip>
#pragma once


std::vector<std::string> split(const std::string& texto, char delimitador);
std::unordered_map<std::string, std::vector<double>> obtener_diccionario(const std::vector<std::vector<std::string>> &lote);