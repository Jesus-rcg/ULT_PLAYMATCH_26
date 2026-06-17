package com.example.ventas.model

data class Equipo(
    val id_equipo: Int = 0,
    val id_usuario: Int = 0,
    val escudo: String = "",
    val nombre_equipo: String = "",
    val activo: Int = 1
)