package com.example.ventas.model

data class Posicion (

    //IDS
    val id_posicion: Int ,
    val id_torneo: Int,
    val id_equipo: Int,

    //Cambio de ID por nombres.

    val torneo: String,
    val equipo: String,

    //Estadísticas

    val jugados: Int,
    val ganados: Int,
    val empatados: Int,
    val perdidos: Int,
    val gf: Int,
    val gc: Int,
    val puntos: Int,
    val actualizado: String,

    //Calculados (NO BD)

    val dg: Int,
    val posicion_real: Int

)