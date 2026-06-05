package com.example.ventas.model

import com.google.gson.annotations.SerializedName

data class Encuentro(

    @SerializedName("id_encuentro")
    val idEncuentro: Int? = null,

    @SerializedName("id_torneo")
    val idTorneo: Int? = null,

    @SerializedName("id_equipo_local")
    val idEquipoLocal: Int? = null,

    @SerializedName("id_equipo_visitante")
    val idEquipoVisitante: Int? = null,

    @SerializedName("fecha")
    val fecha: String? = null,

    @SerializedName("lugar")
    val lugar: String? = null,

    @SerializedName("jornada")
    val jornada: String? = null,

    @SerializedName("id_arbitro")
    val idArbitro: Int? = null,

    @SerializedName("estado")
    val estado: String? = null
)