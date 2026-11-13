<?php
session_start();

$nombre= $_POST["username"];
$contraseña = $_POST["password"];
$repetir_contraseña = $_POST["repeat_password"];
if($contraseña != $repetir_contraseña){
    header("Location: Iniciar_Sesion.php?error=Las contraseñas no coinciden");
    exit;
}
?>