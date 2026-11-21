<?php
session_start();

$error = $_GET["error"] ?? null;
if ($error) {
    echo "<p style='color: red;'>$error</p>";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav>
        <div class="logo">
            <h2>Logo</h2>
        </div>
        <div class="menu">
            <a href="#" class = "nav-link">Inicio</a>
            <a href="#" class = "nav-link">About</a>
            <a href="#" class = "nav-link">Contact</a>
            <a href="registro.html" class = "nav-link">Registrate</a>
        </div>
    </nav>

    <div class="contenedor">
        <div class="login-container">
            <h1>Login</h1>
            <form action="back.php" method="post" class="login-form">

                <input type="hidden" name="accion" value="login">

                <label for="mail">E-mail:</label>
                <input type="email" id="mail" name="mail" required>

                <label for="clave">Clave:</label>
                <input type="password" id="clave" name="clave" required>

                <button type="submit">Login</button>
                <p>¿No tienes cuenta? <a href="registro.html">Regístrate aquí</a></p>

            </form>

        </div>
    </div>
</body>
</html>