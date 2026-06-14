package com.example.ventas.model

data class Equipo(
    val id_equipo: Int = 0,
    val id_torneo: Int,

    val nombre: String,

    val entrenador: String
)