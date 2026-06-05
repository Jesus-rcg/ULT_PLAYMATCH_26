package com.example.ventas

import java.sql.Time

data class InscripcionesEquipos (

    val id_inscripcion_e:Int? = null,
    val id_torneo: Int,
    val id_equipo: Int,
    val fechas_ins_equipo: Time,  //DataTime
    val estdo: String,
    val activo: Int

)