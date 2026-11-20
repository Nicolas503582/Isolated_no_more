<?php
session_start();
require 'conex.php';

if (!empty($_POST['mail'])) {
    $mail = $_POST["mail"];
} else {
    $mail = "";
}
if (!empty($_POST['username'])) {
    $username = $_POST["username"];
} else {
    $username = "";
}
if (!empty($_POST['clave'])) {
    $clave = $_POST['clave'];
} else {
    $clave = "";
}
if (!empty($_POST['accion'])) {
    $accion = $_POST['accion'];
} else {
    $accion = "";
}

if ($accion === "registro") {
    if ($mail === "" || $username === "" || $clave === "") {
        header("Location: registro.html?error=Completá todos los campos");
        exit;
    } else {
        if (!empty($_POST['repetir_clave'])) {
            $repetir_clave = $_POST['repetir_clave'];
        } else {
            $repetir_clave = "";
        }
        if ($clave !== $repetir_clave) {
            header("Location: registro.html?error=Las contraseñas no coinciden");
            exit;
        } else {
            $clave_hash = password_hash($clave, PASSWORD_DEFAULT);
            $query = "INSERT INTO usuarios (mail, username, clave) VALUES ('" . $mail . "', '" . $username . "', '" . $clave_hash . "')"; //guardar los datos al iniciar sesión

            mysqli_query($con, $query);
            header("Location: Iniciar_Sesion.php?success=Usuario registrado correctamente");
            exit;
        }
    }
}

if ($accion === "login") {
    $query = "SELECT * FROM usuarios WHERE mail = '$mail'";
    $result = mysqli_query($con, $query);
    if (mysqli_num_rows($result) > 0) {
        $dato = mysqli_fetch_assoc($result);
        if (password_verify($clave, $dato['clave'])) {
            $nombre = $dato['username'];
            $_SESSION['username'] = $nombre;
            header("Location: index.php");
            exit;
        } else {
            header("Location: Iniciar_Sesion.php?error=Contraseña incorrecta");
            exit;
        }
    } else {
        header("Location: Iniciar_Sesion.php?error=Usuario no encontrado");
        exit;
    }
}

mysqli_close($con);

/*
password_hash("mi_clave123", PASSWORD_DEFAULT)                               encriptar contraseñas
password_verify("mi_clave123", $hash_guardado) (Devuelve true o false)       compara contraseñas sin desencriptarlas
*/
