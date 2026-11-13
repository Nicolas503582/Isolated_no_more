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
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav>
        <div class="logo">
            <h2>Logo</h2>
        </div>
        <div class="menu">
            <a href="#" class = "nav-link">Home</a>
            <a href="#" class = "nav-link">About</a>
            <a href="#" class = "nav-link">Contact</a>
            <a href="Iniciar_Sesion.php" class = "nav-link">Login</a>
        </div>
    </nav>

    <div class="contenedor">
        <div class="login-container">
            <h1>Login</h1>
            <form action="back.php" method="post" class="login-form">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
                <label for="repeat_password">Repeat Password:</label>
                <input type="password" id="repeat_password" name="repeat_password" required>
                <button type="submit">Login</button>
            </form>

        </div>
    </div>
</body>
</html>