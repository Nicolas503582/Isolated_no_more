<?php
session_start();

$_SESSION["color_general"] = $_POST["color_general"];
$_SESSION["saturacion"] = $_POST["saturacion"];
$_SESSION["tono"] = $_POST["tono"];


$color_cabeza = $_POST["color_cabeza"] ?? 0;
$color_torso = $_POST["color_torso"] ?? 0;
$color_brazo = $_POST["color_brazo"] ?? 0;
$color_pierna = $_POST["color_pierna"] ?? 0;

$id_cabeza = $_POST["id_cabeza"] ?? 0;
$id_torso =  $_POST["id_torso"] ?? 0;
$id_brazo =  $_POST["id_brazo"] ?? 0;
$id_pierna = $_POST["id_pierna"] ?? 0;
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
    <canvas id = "juego">

    </canvas>

    <script type="module" src ="juegojs.php"></script>
    
</body>
</html>
</script>
    
</body>
</html>
</script>
    
</body>
</html>
</script>
    
</body>
</html>
