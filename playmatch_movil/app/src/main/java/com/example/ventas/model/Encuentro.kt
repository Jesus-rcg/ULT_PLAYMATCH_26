package com.example.ventas.model

data class Encuentro(
    val id_encuentro: Int = 0,
    val id_torneo: Int = 0,
    val id_equipo_local: Int = 0,
    val id_equipo_visitante: Int = 0,
    val jornada: Int = 0,
    val lugar: String = "",
    val fecha: String = "",
    val hora: String = "",
    val estado: String = "Pendiente",
    val activo: Int = 1
)