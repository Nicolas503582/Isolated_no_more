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
