package com.example.ventas.model

data class RegistroRequest(

    val nombre_usuario: String,
    val apellido_usuario: String,
    val fecha_nacimiento: String,
    val telefono: String,
    val email: String,
    val password: String

)