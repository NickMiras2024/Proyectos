#include <vector>
#include <cmath>
#include <iostream>
#include <numeric>
#include <fstream>  
#include "add_y_norm.h"

double eps;
std::vector<std::vector<double>> gamma1;
std::vector<std::vector<double>> beta;

// Variables para backward
std::vector<std::vector<double>> x;
std::vector<std::vector<double>> mu;
std::vector<std::vector<double>> var;
std::vector<std::vector<double>> std_dev;
std::vector<std::vector<double>> x_hat;

std::vector<std::vector<double>> dgamma;
std::vector<std::vector<double>> dbeta;

LayerNorm::LayerNorm(int dimension_embedding, double eps, const std::string& ruta_archivo)
{
    this->eps = eps;
    
    gamma1 = std::vector<std::vector<double>>(1, std::vector<double>(dimension_embedding, 1.0));
    beta   = std::vector<std::vector<double>>(1, std::vector<double>(dimension_embedding, 0.0));

    if (!ruta_archivo.empty()) {
        cargar_parametros(ruta_archivo);
    }
}


void LayerNorm::cargar_parametros(const std::string& ruta) {
    std::ifstream archivo(ruta);

    if (!archivo.is_open()) {
        std::cerr << "No se pudo abrir el archivo para cargar los parámetros." << std::endl;
        return;
    }

    std::string tipo;
    while (archivo >> tipo) {
        if (tipo == "gamma") {
            for (auto& valor : gamma1[0]) {
                archivo >> valor;
            }
        } else if (tipo == "beta") {
            for (auto& valor : beta[0]) {
                archivo >> valor;
            }
        }
    }

    archivo.close();
    std::cout << "Parámetros cargados desde: " << ruta << std::endl;
}


std::vector<std::vector<double>> LayerNorm::add(
    const std::vector<std::vector<double>>& a,
    const std::vector<std::vector<double>>& b
) {

    std::vector<std::vector<double>> result(a.size(), std::vector<double>(a[0].size()));
    for (size_t i = 0; i < a.size(); ++i){
        for (size_t j = 0; j < a[0].size(); ++j){
            result[i][j] = a[i][j] + b[i][j];

        }
    }

    return result;
}

std::vector<std::vector<double>> LayerNorm::normalizado(const std::vector<std::vector<double>>& input) {

    x = input;
    size_t batch_size = x.size();
    size_t dim = x[0].size();

    mu.resize(batch_size, std::vector<double>(1));
    var.resize(batch_size, std::vector<double>(1));
    std_dev.resize(batch_size, std::vector<double>(1));
    x_hat.resize(batch_size, std::vector<double>(dim));

    std::vector<std::vector<double>> out(batch_size, std::vector<double>(dim));

    for (size_t i = 0; i < batch_size; ++i) {
        // Calcular media
        double sum = std::accumulate(x[i].begin(), x[i].end(), 0.0);
        mu[i][0] = sum / dim;

        // Calcular varianza
        double variance = 0.0;
        for (double val : x[i]) {
            variance += std::pow(val - mu[i][0], 2);
        }
        var[i][0] = variance / dim;

        // Calcular std_dev
        std_dev[i][0] = std::sqrt(var[i][0] + eps);

        // Normalizar y aplicar gamma/beta
        for (size_t j = 0; j < dim; ++j) {
            x_hat[i][j] = (x[i][j] - mu[i][0]) / std_dev[i][0];
            out[i][j] = gamma1[0][j] * x_hat[i][j] + beta[0][j];
        }
    }

    return out;
}

std::vector<std::vector<double>> LayerNorm::backward(const std::vector<std::vector<double>>& dout) {
    // std::cout<< dout.size()  <<' ' << dout[0].size() << std::endl;

    size_t N = x.size();
    size_t D = x[0].size();
    


    dgamma = std::vector<std::vector<double>>(1, std::vector<double>(D, 0.0));
    dbeta  = std::vector<std::vector<double>>(1, std::vector<double>(D, 0.0));
    std::vector<std::vector<double>> dx(N, std::vector<double>(D, 0.0));


    // Calcular dgamma y dbeta
    for (size_t j = 0; j < D; ++j) {
        dgamma[0][j] += dout[0][j] * x_hat[0][j];
        dbeta[0][j]  += dout[0][j];
    };


    // Supongamos que N == 1 (solo un vector)
    std::vector<double> dxhat(D);
    std::vector<double> dvar(D);
    std::vector<double> dmu(D);

    // Cálculo de dxhat
    for (size_t j = 0; j < D; ++j) {
        dxhat[j] = dout[0][j] * gamma1[0][j];
    }

    // Cálculo de dvar_scalar
    double dvar_scalar = 0.0;
    for (size_t j = 0; j < D; ++j) {
        dvar_scalar += dxhat[j] * (x[0][j] - mu[0][0]) * -0.5 * std::pow(std_dev[0][0], -3);
    }

    // Cálculo de dmu_scalar
    double dmu_scalar = 0.0;
    for (size_t j = 0; j < D; ++j) {
        dmu_scalar += dxhat[j] * (-1.0 / std_dev[0][0]);
    }
    dmu_scalar += dvar_scalar * -2.0 * std::accumulate(
        x[0].begin(), x[0].end(), 0.0,
        [&](double acc, double val) {
            return acc + (val - mu[0][0]);
        }) / D;

    // Cálculo final de dx[0]
    for (size_t j = 0; j < D; ++j) {
        dx[0][j] = dxhat[j] / std_dev[0][0]
                + dvar_scalar * 2.0 * (x[0][j] - mu[0][0]) / D
                + dmu_scalar / D;
    }


    return dx;
}

void LayerNorm::step(double lr) {
    for (size_t j = 0; j < gamma1[0].size(); ++j) {
        gamma1[0][j] -= lr * dgamma[0][j];
        beta[0][j]  -= lr * dbeta[0][j];
    }
}



void LayerNorm::guardar_parametros(const std::string& ruta) {
    std::ofstream archivo(ruta);

    if (!archivo.is_open()) {
        std::cerr << "No se pudo abrir el archivo para guardar los parámetros." << std::endl;
        return;
    }

    archivo << "gamma ";
    for (const auto& valor : gamma1[0]) {
        archivo << valor << ' ';
    }
    archivo << '\n';

    archivo << "beta ";
    for (const auto& valor : beta[0]) {
        archivo << valor << ' ';
    }
    archivo << '\n';

    archivo.close();
    std::cout << "Parámetros guardados en: " << ruta << std::endl;
}
