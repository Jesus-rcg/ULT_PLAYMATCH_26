package com.example.ventas.api

import com.example.ventas.model.Usuarios
import com.example.ventas.model.LoginRequest
import com.example.ventas.model.LoginResponse
import retrofit2.http.Query
import com.example.ventas.api.ApiClient
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Path
import retrofit2.http.PUT
import retrofit2.http.DELETE

interface ApiService {

    // ================= LOGIN =================

    @POST("/api/auth/login")
    fun login(
        @Body request: LoginRequest
    ): Call<LoginResponse>


    // ================= USUARIOS =================

    @POST("usuarios")
    fun createUsuario(

        @Header("Authorization")
        token: String,

        @Body
        usuarios: Usuarios

    ): Call<Usuarios>


    @GET("usuarios")
    fun getUsuarios(

        @Header("Authorization")
        token: String

    ): Call<List<Usuarios>>


    @GET("usuarios/{id}")
    fun getUsuario(

        @Header("Authorization")
        token: String,

        @Path("id")
        id: Int

    ): Call<Usuarios>


    @PUT("usuarios/{id}")
    fun updateUsuario(

        @Header("Authorization")
        token: String,

        @Path("id")
        id: Int,

        @Body
        usuario: Usuarios

    ): Call<Void>


    @DELETE("usuarios/{id}")
    fun deleteUsuario(

        @Header("Authorization")
        token: String,

        @Path("id")
        id: Int

    ): Call<Void>
}
