#include <vector>
#include <cmath>
#include <iostream>
#include "cod_pos.h"

std::vector<std::vector<double>> positional_encoding(int max_len, int d_model) {
    std::vector<std::vector<double>> pos_enc(max_len, std::vector<double>(d_model, 0.0));
    for (int pos = 0; pos < max_len; ++pos) {
        for (int i = 0; i < d_model; ++i) {
            double angle = pos / std::pow(10000.0, (2.0 * (i / 2)) / d_model);
            if (i % 2 == 0)
                pos_enc[pos][i] = std::sin(angle);  // dimensiones pares
            else
                pos_enc[pos][i] = std::cos(angle);  // dimensiones impares
        }
    }

    return pos_enc;
}
