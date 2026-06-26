package com.example.ventas.model

data class InscripcionEquipo(
    val id_inscripcion_e: Int = 0,
    val id_torneo: Int = 0,
    val id_equipo: Int = 0,
    val fecha_ins_equipo: String = "",
    val estado: String = "Pendiente",
    val activo: Int = 1
)