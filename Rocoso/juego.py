import ursina as ur 
import ursina.prefabs.first_person_controller as person_controller
from random import randint
import time 

app = ur.Ursina()

class blocks(ur.Button):
    def __init__(self,position = (0,1,0)):
        super().__init__(
            parent = ur.scene,
             vida = 10000,
            destroy = False,
            position = position,
            model='Stone',
            texture = 'brick',
            scale = (.2,.3,.2),
            collider = 'mesh',
            color = ur.color.rgb(100,100,100),
            origin_y = 0,
            
        )
    def input(self,key):
            if self.hovered: 
                if key== 'left mouse down':
                    vida_des2 = self.vida_des()
                    if vida_des2 == True:
                        self.color = ur.color.rgb(100,100,100,0)
                        self.destroy = True
                        print('destruido')
    def vida_des(self):
        self.vida += -10
        if self.vida <= 0:
            self.vida = 0
            return True
    vida_jug = 1000
    def volar_jugador(self):
        for i in range(5):
            jugador.position = (jugador.position.x + i,jugador.position.y + i, jugador.position.z)
                
    def descontar_vida_jugador(self):
        print(self.vida_jug)
        self.volar_jugador()
        if self.vida_jug > 0:
            print(self.vida_jug)
            if self.vida_jug <= 0:
               entidad2.position = (1.9,-0.35)
            self.vida_jug += -10
    def saber_si_tiene_vida(self):
        if self.vida_jug >= 0:
            return True
        else: return False        
    def encontrar_jugador(self):
        if self.vida_jug > 0 and self.vida > 0 :
            # movimiento
            if jugador.position.x > self.position.x:
                self.position = (self.position.x +.2,self.position.y,self.position.z)
            elif jugador.position.x < self.position.x:
                self.position = (self.position.x -.2,self.position.y,self.position.z)
            
            # rotacion x abajo 
            if jugador.position.x < self.position.x and jugador.position.z > self.position.z:
                self.rotation = (self.rotation_x,-45,self.rotation_z)
            if jugador.position.x > self.position.x and jugador.position.z > self.position.z:
                self.rotation = (self.rotation_x,45,self.rotation_z)
            if jugador.position.z < self.position.z and jugador.position.x > self.position.x:
                self.rotation = (self.rotation_x,135 ,self.rotation_z)
            if jugador.position.z < self.position.z and jugador.position.x < self.position.x:
                self.rotation = (self.rotation_x,-135,self.rotation_z)    
            
            
            
            # movimiento otra vez xd ( este es en z el anterior es en x)
            if jugador.position.z > self.position.z:
                self.position = (self.position.x,self.position.y,self.position.z + .2) 
                
                
            elif jugador.position.z < self.position.z:
                self.position = (self.position.x,self.position.y,self.position.z - .2) 

            cubo2.position = self.position

    def existe(self):
        if self.destroy == False:
            return True
        else:
            return False



cubo = blocks(position = (randint(-50,50),1,randint(-50,50)))

jugador = person_controller.FirstPersonController(y=100,z=0,model='cube', origin_y=-.5, color=ur.color.rgb(0,0,0,0), has_pickup=False)

entidad2 = ur.Entity(
    model = 'Gun',
    texture = 'Gun2',
    color = ur.color.rgb(100,100,100),
    scale= (1,1,3),
    position = (0.8,-0.35),
    rotation = (-0,-145,-10),
    parent = ur.camera.ui,
)

cubo2 = ur.Entity(
            parent = cubo,
            model='cube',
            position = (cubo.position.x,-10,cubo.position.z),
            scale = (2,3,2),
            collider = 'mesh',
            origin_y = -.5,
            color = ur.color.rgb(0,0,0,0)
            )

def update():
    if jugador.position.y <= -10:
        print('te caiste')
        jugador.position = (0,25,0)

    if ur.held_keys['left mouse']:
        entidad2.position = (0.9,-0.40)
    else:
        if cubo.saber_si_tiene_vida() == True:
            entidad2.position = (0.8,-0.35)
        else: entidad2.position = (1.8,-0.35)                
    if cubo.existe() == True:
        cubo.encontrar_jugador()

    if not jugador.has_pickup and ur.distance(jugador, cubo2) < cubo2.scale_x / 2:
        cubo.descontar_vida_jugador()






class palmera():
    def __init__(self,position = (0,1,0)):
        modelo = ur.Entity(
                position = position,
                model='MapleTreeStem',
                texture = 'maple_bark',
                scale = (.1,.2,.1),
                rotation = (0,-90,0),
                collider = 'mesh',
                color = ur.color.rgb(128, 64, 0),
                )


for i in range(21):
    e = randint(-40,40)
    u = randint(-40,40)
    modelo2 = palmera(position = (u,1,e))


#piso
entidad = ur.Entity(model = 'cube',
                    texture = 'grass',
                    rotation = (0,0,0),
                    scale = (100,1,100),
                    collider= 'mesh', 
                    )



class pared():
    def __init__(self,position = (-50,1,50), scale = (1,1,1),rotate = (0,0,0)):
        ur.Entity(
        position = position,
        model = 'cube',
        rotation = rotate,
        color = ur.color.rgb(200,200,200),
        scale = scale,
        texture = 'brick',
        texture_scale = scale,
        collider= 'mesh', 
        origin_y = 0
    )


pared1 = pared(position=(49,2,0),scale=(100,4,1),rotate=(0,90,0))
pared2 = pared(position=(-49,2,0),scale=(100,4,1),rotate=(0,90,0))
pared3 = pared(position=(0,2,49),scale=(100,4,1),rotate=(0,180,0))
pared4 = pared(position=(0,2,-49),scale=(100,4,1),rotate=(0,180,0))





app.run()