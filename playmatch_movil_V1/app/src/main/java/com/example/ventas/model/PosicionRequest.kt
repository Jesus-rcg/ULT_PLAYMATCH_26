package com.example.ventas.model

data class PosicionRequest (
    val id_torneo: Int,
    val id_equipo: Int,
    val jugados: Int,
    val ganados: Int,
    val empatados: Int,
    val perdidos: Int,
    val gf: Int,
    val gc: Int
)