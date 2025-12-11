import numpy as np
import pyopencl as cl

def producto_punto_con_GPU_de_red_completa(matriz_de_pesos, array2):
    if len(matriz_de_pesos[0]) != len(array2):
        return "Las columnas no coinciden"

    platform = cl.get_platforms()[0]
    device = platform.get_devices()[0]
    ctx = cl.Context([device])
    cola = cl.CommandQueue(ctx)

    # Load kernel desde string (podés usar open() si lo tenés en archivo)
    kernel_code = """
    __kernel void producto_punto_escalable(
        __global const float *matriz,
        __global const float *array,
        __global float *resultados,
        const int columnas,
        const int saltos_fila,
        __local float *sumas_parciales
    ) {
        int grupo = get_group_id(0);
        int local_id = get_local_id(0);
        int local_size = get_local_size(0);
        int inicio = grupo * saltos_fila;

        float suma = 0.0f;
        for (int i = local_id; i < columnas; i += local_size) {
            suma += matriz[inicio + i] * array[i];
        }

        sumas_parciales[local_id] = suma;
        barrier(CLK_LOCAL_MEM_FENCE);

        if (local_id == 0) {
            float total = 0.0f;
            for (int i = 0; i < local_size; i++) {
                total += sumas_parciales[i];
            }
            resultados[grupo] = total;
        }
    }
    """
    program = cl.Program(ctx, kernel_code).build()

    matriz = np.array(matriz_de_pesos, dtype=np.float32).flatten()
    array = np.array(array2, dtype=np.float32)
    resultados = np.empty(len(matriz_de_pesos), dtype=np.float32)

    mf = cl.mem_flags
    matriz_buf = cl.Buffer(ctx, mf.READ_ONLY | mf.COPY_HOST_PTR, hostbuf=matriz)
    array_buf = cl.Buffer(ctx, mf.READ_ONLY | mf.COPY_HOST_PTR, hostbuf=array)
    resultados_buf = cl.Buffer(ctx, mf.WRITE_ONLY, resultados.nbytes)

    num_filas = len(matriz_de_pesos)
    num_columnas = len(matriz_de_pesos[0])
    local_size = 32  # o 64, o menor si tu GPU tiene límites bajos
    global_size = (num_filas * local_size,)

    # Llamada al kernel
    program.producto_punto_escalable(
        cola,
        global_size,
        (local_size,),
        matriz_buf,
        array_buf,
        resultados_buf,
        np.int32(num_columnas),
        np.int32(num_columnas),
        cl.LocalMemory(np.dtype(np.float32).itemsize * local_size)
    )

    cl.enqueue_copy(cola, resultados, resultados_buf)
    cola.finish()

    return resultados

def sumador_de_columnas_con_GPU(matriz):
    matriz = np.array(matriz, dtype=np.float32)

    if matriz.ndim == 0:
        print("⚠️ Advertencia: Se recibió un escalar.")
        return [float(matriz)]

    elif matriz.ndim == 1:
        print("⚠️ Advertencia: La matriz tiene solo 1 dimensión, devolviendo tal cual.")
        return matriz.tolist()

    elif matriz.ndim != 2:
        raise ValueError("❌ La estructura de entrada no es válida para sumar columnas.")

    filas, columnas = matriz.shape

    # Crear contexto de OpenCL
    platform = cl.get_platforms()[0]
    device = platform.get_devices()[0]
    ctx = cl.Context([device])
    cola = cl.CommandQueue(ctx)

    # Kernel OpenCL: cada hilo suma los valores de una columna
    kernel_code = """
    __kernel void sumar_columnas(
        __global const float *mat,
        __global float *resultado,
        const int filas,
        const int columnas
    ) {
        int col = get_global_id(0);
        float suma = 0.0f;
        for (int i = 0; i < filas; i++) {
            suma += mat[i * columnas + col];
        }
        resultado[col] = suma;
    }
    """

    program = cl.Program(ctx, kernel_code).build()

    matriz_flat = matriz.flatten()
    resultado = np.empty(columnas, dtype=np.float32)

    # Buffers
    mf = cl.mem_flags
    matriz_buf = cl.Buffer(ctx, mf.READ_ONLY | mf.COPY_HOST_PTR, hostbuf=matriz_flat)
    resultado_buf = cl.Buffer(ctx, mf.WRITE_ONLY, resultado.nbytes)

    # Ejecutar kernel: un hilo por columna
    global_size = (columnas,)
    program.sumar_columnas(cola, global_size, None,
                           matriz_buf, resultado_buf,
                           np.int32(filas), np.int32(columnas))

    cl.enqueue_copy(cola, resultado, resultado_buf)
    cola.finish()

    return resultado.tolist()
