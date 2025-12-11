import matplotlib.pyplot as plt
import os 


numero = 45

def cargar_archivo(ruta,numL):
    contenido_del_archivo = ''

    with open(ruta,'r')as archivo:
        contenido_del_archivo = archivo.read()

    contenido_dividido = contenido_del_archivo.split(',')

    contenido_dividido.pop(-1)

    x = []
    y = []

    divisor = len(contenido_dividido) / numL


    for i,num in enumerate(contenido_dividido):
        x.append(i /divisor)
        y.append(float(num))



    return x,y


EPP_x,EPP_y = cargar_archivo('C:\\Users\\PC\\Desktop\\Nico\\IA\\IA_Python\\AVI\\muestreo_de_errores_Recientes_palabra.txt',numero-1)
EPF_x,EPF_y = cargar_archivo('C:\\Users\\PC\\Desktop\\Nico\\IA\\IA_Python\\AVI\\muestreo_de_errores_Recientes.txt',numero-1)
EPE_x,EPE_y = cargar_archivo('C:\\Users\\PC\\Desktop\\Nico\\IA\\IA_Python\\AVI\\muestreo_de_errores.txt',numero)


print(len(EPE_x),EPE_y)
# print(x,y)


# x = [1, 2, 3, 4]
# y = [2, 3, 5, 7]

plt.plot(EPP_x, EPP_y, label="Error por palabra", color="green", linestyle="-", linewidth=2)
plt.plot(EPF_x, EPF_y, label="Error por frase", color="blue", linestyle="-", linewidth=2)
plt.plot(EPE_x, EPE_y, label="Error por epoca", color="red", linestyle="-", linewidth=2)




plt.title("grafico de errores ")
plt.xlabel("numero de elemento")
plt.ylabel("error")
plt.grid(True)
plt.show()
