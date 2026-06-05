package com.example.ventas.model

import com.google.gson.annotations.SerializedName

data class Resultado(

    @SerializedName("id_resultado")
    val idResultado: Int? = null,

    @SerializedName("id_encuentro")
    val idEncuentro: Int? = null,

    @SerializedName("goles_local")
    val golesLocal: Int? = null,

    @SerializedName("goles_visitante")
    val golesVisitante: Int? = null,

    @SerializedName("faltas_local")
    val faltasLocal: Int? = null,

    @SerializedName("faltas_visitante")
    val faltasVisitante: Int? = null,

    @SerializedName("tarjetas_amarillas")
    val tarjetasAmarillas: String? = null,

    @SerializedName("tarjetas_rojas")
    val tarjetasRojas: String? = null,

    @SerializedName("observaciones")
    val observaciones: String? = null,

    @SerializedName("id_creador")
    val idCreador: Int? = null,

    @SerializedName("fecha_creacion")
    val fechaCreacion: String? = null
)