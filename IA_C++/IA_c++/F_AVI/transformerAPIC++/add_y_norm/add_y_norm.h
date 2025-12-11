#include <vector>
#include <cmath>
#include <iostream>
#include <numeric>
#pragma once

class LayerNorm {
private:
    double eps;
    std::vector<std::vector<double>> gamma;
    std::vector<std::vector<double>> beta;

    std::vector<std::vector<double>> x;
    std::vector<std::vector<double>> mu;
    std::vector<std::vector<double>> var;
    std::vector<std::vector<double>> std_dev;
    std::vector<std::vector<double>> x_hat;

public:
    std::vector<std::vector<double>> dgamma;
    std::vector<std::vector<double>> dbeta;

    LayerNorm(int dimension_embedding, double eps, const std::string& ruta_archivo = "");
    std::vector<std::vector<double>> add(const std::vector<std::vector<double>>& a,const std::vector<std::vector<double>>& b);
    std::vector<std::vector<double>> normalizado(const std::vector<std::vector<double>>& input);
    std::vector<std::vector<double>> backward(const std::vector<std::vector<double>>& dout);
    void step(double lr);
    void guardar_parametros(const std::string& ruta);
    void cargar_parametros(const std::string& ruta);
};
