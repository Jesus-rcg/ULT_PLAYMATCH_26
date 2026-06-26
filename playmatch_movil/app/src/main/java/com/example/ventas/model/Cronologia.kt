package com.example.ventas.model

data class Cronologia(
    val id_cronologia: Int? = null,
    val id_encuentro: Int? = null,
    val fecha: String? = null,
    val equipo_local: String? = null,
    val equipo_visitante: String? = null,
    val id_jugador: Int? = null,
    val nombre_usuario: String? = null,
    val apellido_usuario: String? = null,
    val equipo_jugador: String? = null,
    val evento: String? = null,
    val minuto: Int? = null
)

data class JugadorEncuentro(
    val id_jugador: Int = 0,
    val nombre_usuario: String = "",
    val apellido_usuario: String = "",
    val nombre_equipo: String = ""
)