package com.example.ventas.model

import java.util.Date

data class Usuario (
    val id_usuario:Int? = null,
    val nombre: String,
    val email: String,
    val password: String,
    val rol: String,
    val estado: String,
    val fecha_actualizado: String
)