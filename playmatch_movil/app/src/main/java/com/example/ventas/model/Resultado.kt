package com.example.ventas.model

data class Resultado(
    val id_resultado: Int? = null,
    val id_encuentro: Int? = null,
    val goles_local: Int? = null,
    val goles_visitante: Int? = null,
    val fecha: String? = null,
    val id_equipo_local: Int? = null,
    val equipo_local: String? = null,
    val id_equipo_visitante: Int? = null,
    val equipo_visitante: String? = null
)

data class ResultadoResponse(
    val success: Boolean,
    val data: List<Resultado>
)