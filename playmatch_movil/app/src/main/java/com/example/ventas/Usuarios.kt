package com.example.ventas
import java.sql.Date

data class Usuarios (

    val id_usuario: Int? = null,
    val id_rol: Int,
    val nombre_usuario: String,
    val apellido_usuario: String,
    val fecha_nacimineto: Date,
    val telefono: String,
    val email: String,
    val password: String,
    val activo: Int
)