package com.example.ventas.model

data class Jugador(
    val id_jugador: Int,
    val id_usuario: Int,
    val nombre_usuario: String,
    val apellido_usuario: String,
    val posicion: String,
    val numero_camiseta: Int,
    val activo: Int
)

