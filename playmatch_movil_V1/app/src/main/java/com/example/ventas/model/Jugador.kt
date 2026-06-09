package com.example.ventas.model

data class Jugador (
    val id_jugador:Int? = null,
    val id_equipo: Int?,
    val nombre: String,
    val apellido: String,
    val documento: String,
    val numero_camiseta: String,
    val estado: String
)