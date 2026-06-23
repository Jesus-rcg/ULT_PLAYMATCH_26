package com.example.ventas.model

data class Torneo(
    val id_torneo: Int? = null,
    val id_usuario: Int? = null,
    val nombre_torneo: String = "",
    val categoria: String = "",
    val tipo_torneo: String = "",
    val ciudad: String = "",
    val fecha_inicio: String = "",
    val fecha_fin: String = "",
    val estado: String = "",
    val activo: Int = 1
)