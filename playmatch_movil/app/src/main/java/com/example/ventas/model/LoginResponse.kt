package com.example.ventas.model

data class LoginResponse(
    val success: Boolean,
    val token: String,
    val user: UserData?
)

data class UserData(
    val id_usuario: Int?,
    val nombre_usuario: String?,
    val apellido_usuario: String?,
    val email: String?,
    val rol: Int?
)