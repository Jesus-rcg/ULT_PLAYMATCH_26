package com.example.ventas.model

import java.util.Date

data class Usuario (
    val id_usuario:Int? = null,
    val id_rol: Int,
    val nombre_usuario: String,
    val apellido_usuario: String,
    val fecha_nacimiento : String,
    val telefono: String,
    val email: String,
    val password: String,
    val activo: String
)