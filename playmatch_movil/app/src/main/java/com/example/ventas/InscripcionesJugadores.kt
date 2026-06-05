package com.example.ventas.model

import java.util.Date

data class InscripcionesJugadores (

    val id_inscripcion_j:Int? = null,
    val id_equipo: Int,
    val id_jugador:Int,
    val fecha_inscripcion: Date, // DataTime
    val estdo: String,
    val activo: Int

)