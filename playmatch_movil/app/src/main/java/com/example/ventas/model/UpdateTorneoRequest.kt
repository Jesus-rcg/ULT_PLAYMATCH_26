package com.example.ventas.model

data class UpdateTorneoRequest(
val nombre_torneo: String,
val categoria: String,
val tipo_torneo: String,
val ciudad: String,
val fecha_inicio: String,
val fecha_fin: String
)