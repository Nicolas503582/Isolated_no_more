<?php
session_start();

$_SESSION["color_general"] = $_POST["color_general"];
$_SESSION["saturacion"] = $_POST["saturacion"];
$_SESSION["tono"] = $_POST["tono"];


$_SESSION["color_cabeza"] = $_POST["color_cabeza"] ?? 0;
$_SESSION["color_torso"] = $_POST["color_torso"] ?? 0;
$_SESSION["color_brazo"] = $_POST["color_brazo"] ?? 0;
$_SESSION["color_pierna"] = $_POST["color_pierna"] ?? 0;

$_SESSION["id_cabeza"] = $_POST["cabeza"] ?? 0;
$_SESSION["id_torso"] = $_POST["torso"] ?? 0;
$_SESSION["id_brazo"] = $_POST["brazo"] ?? 0;
$_SESSION["id_pierna"] = $_POST["pierna"] ?? 0;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id = "Inventario">
        <div id = "Inventario_contenido">
            <div id = "Imagenes_inventario">
                <div id="Equipamiento" class = "equipacion">
                    <canvas id="canvas_equipamiento"></canvas>
                </div>

                <div id="Hamster" class = "equipacion">
                    <canvas id="canvas_hamster"></canvas>
                </div>
            </div>
            
            <div id = "Inv_objetos">
                <div id = "Insumos" class = "objetos">


                    <div class="espacio_inv" id="Insumo1">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>
                    
                    <div class="espacio_inv" id="Insumo2">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>
                    
                    <div class="espacio_inv" id="Insumo3">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>
                    
                    <div class="espacio_inv" id="Insumo4">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>
                    
                    <div class="espacio_inv" id="Insumo5">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>


                </div>

                <div id = "Herramientas" class = "objetos">
                    

                    <div class="espacio_inv" id="Herramienta1">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>
                    
                    <div class="espacio_inv" id="Herramienta2">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>
                    
                    <div class="espacio_inv" id="Herramienta3">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>
                    
                    <div class="espacio_inv" id="Herramienta4">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>
                    
                    <div class="espacio_inv" id="Herramienta5">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>
                    
                    
                </div>
                
                <div id = "Materiales" class = "objetos">
                    
                    
                    <div class="espacio_inv" id="Material1">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>
                    
                    <div class="espacio_inv" id="Material2">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>
                    
                    <div class="espacio_inv" id="Material3">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>
                    
                    <div class="espacio_inv" id="Material4">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>
                    
                    <div class="espacio_inv" id="Material5">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>

                    
                </div>
                
                <div id = "Rapido" class = "objetos">
                    
                    
                    <div class="espacio_inv" id="Rapido1">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>
                    
                    <div class="espacio_inv" id="Rapido2">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>
                    
                    <div class="espacio_inv" id="Rapido3">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>
                    
                    <div class="espacio_inv" id="Rapido4">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>
                    
                    <div class="espacio_inv" id="Rapido5">
                        <p class="seleccionado"> false</p>
                        <p class="id_objeto"></p>
                        <p class="nombre_objeto"></p>
                        <p class="cantidad"></p>
                        <p class="descripcion"></p>
                        <img src="" alt="" class="imagen_Item">
                    </div>

                    
                </div>
            </div>

        </div>
    </div>

    <canvas id = "juego">

    </canvas>

    <script type="module" src ="juegojs.php"></script>

</body>
</html>
