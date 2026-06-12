package com.example.ventas.model

data class Jugador (
    val id_jugador:Int? = null,
    val id_usuario: Int?,
    val posicion: String,
    val numero_camiseta	: Int,
    val activo: Int
)