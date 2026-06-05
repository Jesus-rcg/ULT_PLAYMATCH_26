package com.example.ventas

import java.util.Date

data class Torneos (

    val id_torneo:Int? = null,
    val id_usuario: Int,
    val nombre_torneo: String,
    val categoria: String,
    val tipo_torneo: String,
    val ciudad: String,
    val fecha_inicio: Date,
    val fecha_fin: Date,
    val estado: String,
    val activo: Int

)