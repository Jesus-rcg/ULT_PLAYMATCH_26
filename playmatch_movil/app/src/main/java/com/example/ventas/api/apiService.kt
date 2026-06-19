package com.example.ventas.api

import com.example.ventas.model.*
import retrofit2.Call
import retrofit2.http.*
import com.example.ventas.model.UsuarioResponse

interface ApiService {

    // ================= LOGIN =================

    @POST("/api/auth/login")
    fun login(
        @Body request: LoginRequest
    ): Call<LoginResponse>

    // ================= USUARIOS =================

    @POST("/api/usuarios")
    fun createUsuario(
        @Header("Authorization")
        token: String,
        @Body
        usuario: Usuario
    ): Call<Usuario>

    @GET("/api/usuarios")
    fun getUsuarios(
        @Header("Authorization")
        token: String
    ): Call<UsuarioResponse>

    @GET("/api/usuarios/{id}")
    fun getUsuario(
        @Header("Authorization")
        token: String,
        @Path("id")
        id: Int
    ): Call<Usuario>

    @PUT("/api/usuarios/{id}")
    fun updateUsuario(
        @Header("Authorization")
        token: String,
        @Path("id")
        id: Int,
        @Body
        usuario: Usuario
    ): Call<Void>

    @DELETE("/api/usuarios/{id}")
    fun deleteUsuario(
        @Header("Authorization")
        token: String,
        @Path("id")
        id: Int
    ): Call<Void>

    // ================= JUGADORES =================

    @POST("/api/jugadores")
    fun createJugador(
        @Header("Authorization")
        token: String,
        @Body
        jugador: Jugador
    ): Call<Jugador>

    @GET("/api/jugadores")
    fun getJugadores(
        @Header("Authorization")
        token: String
    ): Call<List<Jugador>>

    @GET("/api/jugadores/buscar")
    fun buscarJugador(
        @Header("Authorization")
        token: String,
        @Query("buscar")
        buscar: String
    ): Call<Jugador>

    @PUT("/api/jugadores/{id}")
    fun actualizarJugadores(
        @Header("Authorization")
        token: String,
        @Path("id")
        id: Int,
        @Body
        jugador: Jugador
    ): Call<Void>

    @DELETE("/api/jugadores/{id}")
    fun eliminarJugador(
        @Header("Authorization")
        token: String,
        @Path("id")
        id: Int
    ): Call<Void>

    // ================= EQUIPOS =================

    @POST("/api/equipos")
    fun createEquipo(
        @Header("Authorization")
        token: String,
        @Body
        equipo: Equipo
    ): Call<Equipo>

    @GET("/api/equipos")
    fun getEquipos(
        @Header("Authorization")
        token: String
    ): Call<List<Equipo>>

    @GET("/api/equipos/{id}")
    fun getEquipo(
        @Header("Authorization")
        token: String,
        @Path("id")
        id: Int
    ): Call<Equipo>

    @PUT("/api/equipos/{id}")
    fun updateEquipo(
        @Header("Authorization")
        token: String,
        @Path("id")
        id: Int,
        @Body
        equipo: Equipo
    ): Call<Void>

    @DELETE("/api/equipos/{id}")
    fun deleteEquipo(
        @Header("Authorization")
        token: String,
        @Path("id")
        id: Int
    ): Call<Void>

    // ================= TORNEOS =================

    @POST("/api/torneos")
    fun createTorneo(
        @Header("Authorization")
        token: String,
        @Body
        torneo: Torneo
    ): Call<Torneo>

    @GET("/api/torneos")
    fun getTorneos(
        @Header("Authorization")
        token: String
    ): Call<List<Torneo>>

    // ================= POSICIONES =================

    @POST("/api/posiciones")
    fun createPosicion(
        @Header("Authorization")
        token: String,
        @Body
        posicion: PosicionRequest
    ): Call<Posicion>

    @GET("/api/posiciones")
    fun getPosiciones(
        @Header("Authorization")
        token: String
    ): Call<List<Posicion>>

    @GET("/api/posiciones/{id}")
    fun getPosicion(
        @Header("Authorization")
        token: String,
        @Path("id")
        id: Int
    ): Call<Posicion>

    @PUT("/api/posiciones/{id}")
    fun updatePosicion(
        @Header("Authorization")
        token: String,
        @Path("id")
        id: Int,
        @Body
        posicion: PosicionRequest
    ): Call<Void>

    @DELETE("/api/posiciones/{id}")
    fun deletePosicion(
        @Header("Authorization")
        token: String,
        @Path("id")
        id: Int
    ): Call<Void>

    // ================= ENCUENTROS =================

    @POST("/api/encuentros")
    fun createEncuentro(
        @Header("Authorization")
        token: String,
        @Body
        encuentro: Encuentro
    ): Call<Encuentro>

    @GET("/api/encuentros")
    fun getEncuentros(
        @Header("Authorization")
        token: String
    ): Call<List<Encuentro>>

    @GET("/api/encuentros/{id}")
    fun getEncuentro(
        @Header("Authorization")
        token: String,
        @Path("id")
        id: Int
    ): Call<Encuentro>

    @PUT("/api/encuentros/{id}")
    fun updateEncuentro(
        @Header("Authorization")
        token: String,
        @Path("id")
        id: Int,
        @Body
        encuentro: Encuentro
    ): Call<Void>

    @DELETE("/api/encuentros/{id}")
    fun deleteEncuentro(
        @Header("Authorization")
        token: String,
        @Path("id")
        id: Int
    ): Call<Void>
}