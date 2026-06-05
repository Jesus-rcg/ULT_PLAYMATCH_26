    package com.example.ventas.api

import com.example.ventas.model.Usuario
import com.example.ventas.model.Jugador
import com.example.ventas.model.LoginRequest
import com.example.ventas.model.LoginResponse
import com.example.ventas.model.Equipo
import com.example.ventas.model.Torneo
import com.example.ventas.model.Encuentro
import com.example.ventas.model.Resultado
import retrofit2.http.Query
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Posicion
import com.example.ventas.model.PosicionRequest

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

    @POST("login")
    fun login(
        @Body request: LoginRequest
    ): Call<LoginResponse>


    // ================= USUARIOS =================

    @POST("usuarios")
    fun createUsuario(

        @Header("Authorization")
        token: String,

        @Body
        usuario: Usuario

    ): Call<Usuario>


    @GET("usuarios")
    fun getUsuarios(

        @Header("Authorization")
        token: String

    ): Call<List<Usuario>>


    @GET("usuarios/{id}")
    fun getUsuario(

        @Header("Authorization")
        token: String,

        @Path("id")
        id: Int

    ): Call<Usuario>


    @PUT("usuarios/{id}")
    fun updateUsuario(

        @Header("Authorization")
        token: String,

        @Path("id")
        id: Int,

        @Body
        usuario: Usuario

    ): Call<Void>


    @DELETE("usuarios/{id}")
    fun deleteUsuario(

        @Header("Authorization")
        token: String,

        @Path("id")
        id: Int

    ): Call<Void>


    // ================= JUGADORES =================

    @POST("jugadores")
    fun createJugador(

        @Header("Authorization")
        token: String,

        @Body
        jugador: Jugador

    ): Call<Jugador>


    @GET("jugadores")
    fun getJugadores(

        @Header("Authorization")
        token: String

    ): Call<List<Jugador>>


    @GET("jugadores/buscar")
    fun buscarJugador(

        @Header("Authorization")
        token: String,

        @Query("buscar")
        buscar: String

    ): Call<Jugador>


    // ApiService.kt

    @PUT("jugadores/{id}")
    fun actualizarJugadores(

        @Header("Authorization")
        token: String,

        @Path("id")
        id: Int,

        @Body
        jugador: Jugador

    ): Call<Void>


    @DELETE("jugadores/{id}")
    fun deleteJugador(

        @Header("Authorization")
        token: String,

        @Path("id")
        id: Int

    ): Call<Void>


    // ================= EQUIPOS =================

    @POST("equipos")
    fun createEquipo(

        @Header("Authorization")
        token: String,

        @Body
        equipo: Equipo

    ): Call<Equipo>


    @GET("equipos")
    fun getEquipos(

        @Header("Authorization")
        token: String

    ): Call<List<Equipo>>


    @GET("equipos/{id}")
    fun getEquipo(

        @Header("Authorization")
        token: String,

        @Path("id")
        id: Int

    ): Call<Equipo>


    @PUT("equipos/{id}")
    fun updateEquipo(

        @Header("Authorization")
        token: String,

        @Path("id")
        id: Int,

        @Body
        equipo: Equipo

    ): Call<Void>


    @DELETE("equipos/{id}")
    fun deleteEquipo(

        @Header("Authorization")
        token: String,

        @Path("id")
        id: Int

    ): Call<Void>


    // ================= TORNEOS =================

    @POST("torneos")
    fun createTorneo(

        @Header("Authorization")
        token: String,

        @Body
        torneo: Torneo

    ): Call<Torneo>
    @GET("torneos")
    fun getTorneos(
        @Header("Authorization") token: String
    ): Call<List<Torneo>>


    //POSICIONES.


    @POST("posiciones")
    fun createPosicion(

        @Header("Authorization")
        token: String,

        @Body
        posicion: PosicionRequest

    ): Call<Posicion>


    @GET("posiciones")
    fun getPosiciones(

        @Header("Authorization")
        token: String

    ): Call<List<Posicion>>


    @GET("posiciones/{id}")
    fun getPosicion(

        @Header("Authorization")
        token: String,

        @Path("id")
        id: Int

    ): Call<Posicion>


    @PUT("posiciones/{id}")
    fun updatePosicion(

        @Header("Authorization")
        token: String,

        @Path("id")
        id: Int,

        @Body
        posicion: PosicionRequest

    ): Call<Void>


    @DELETE("posiciones/{id}")
    fun deletePosicion(

        @Header("Authorization")
        token: String,

        @Path("id")
        id: Int

    ): Call<Void>

    // ================= ENCUENTROS =================

    @POST("encuentros")
    fun createEncuentro(
        @Header("Authorization") token: String,
        @Body encuentro: Encuentro
    ): Call<Encuentro>

    @GET("encuentros")
    fun getEncuentros(
        @Header("Authorization") token: String
    ): Call<List<Encuentro>>

    @GET("encuentros/{id}")
    fun getEncuentro(
        @Header("Authorization") token: String,
        @Path("id") id: Int
    ): Call<Encuentro>

    @PUT("encuentros/{id}")
    fun updateEncuentro(
        @Header("Authorization") token: String,
        @Path("id") id: Int,
        @Body encuentro: Encuentro
    ): Call<Void>

    @DELETE("encuentros/{id}")
    fun deleteEncuentro(
        @Header("Authorization") token: String,
        @Path("id") id: Int
    ): Call<Void>


    // ================= RESULTADOS =================

    @POST("resultados")
    fun createResultado(
        @Header("Authorization") token: String,
        @Body resultado: Resultado
    ): Call<Resultado>

    @GET("resultados")
    fun getResultados(
        @Header("Authorization") token: String
    ): Call<List<Resultado>>

    @GET("resultados/{id}")
    fun getResultado(
        @Header("Authorization") token: String,
        @Path("id") id: Int
    ): Call<Resultado>

    @PUT("resultados/{id}")
    fun updateResultado(
        @Header("Authorization") token: String,
        @Path("id") id: Int,
        @Body resultado: Resultado
    ): Call<Void>

    @DELETE("resultados/{id}")
    fun deleteResultado(
        @Header("Authorization") token: String,
        @Path("id") id: Int
    ): Call<Void>
}