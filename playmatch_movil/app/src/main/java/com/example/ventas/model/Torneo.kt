package com.example.ventas.model
import android.R
import java.util.Date

data class Torneo (

    val id_torneo:Int? = null,
    val nombre: String,
    val descripcion: String,
    val fecha_inicio: String,
    val fecha_fin: String,
    val estado: String

)