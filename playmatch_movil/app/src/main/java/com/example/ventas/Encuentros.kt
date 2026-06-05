package com.example.ventas

import java.util.Date
import java.sql.Time

data class Encuentros (

    val id_encuentro:Int? = null,
    val id_torneo: Int,
    val id_equipo_local: Int,
    val id_equipo_visitante: Int,
    val jornada: Int,
    val lugar: String,
    val fecha: Date,
    val hora: Time,
    val estado: String,
    val activo: Int

)