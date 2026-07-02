package com.example.ventas.model

data class CambiarPasswordRequest (

    val email : String,
    val codigo : String,
    val password: String

)