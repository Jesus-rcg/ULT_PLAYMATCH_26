package com.example.ventas.model

import java.math.BigInteger
import java.util.Date

data class Usuario (
    val id:Int? = null,
    val id_rol: Int? = null,
    val nombre_rol: String? = null,
    val nombre_usuario: String = "",
    val apellido_usuario: String = "",
    val fecha_nacimiento: String? = null,
    val telefono: String? = null,
    val email: String = "",
    val password: String? = null,
    val activo: Int? = null
)