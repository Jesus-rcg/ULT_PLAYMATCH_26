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

    // ================= REGISTRO =================

    @POST("/api/usuarios/registrar")

    fun registrarUsuario(

        @Body

        request: VerificarCodigoRequest

    ): Call<RegistroResponse>

    @POST("/api/usuarios/enviar-codigo")
    fun enviarCodigo(
        @Body usuario: Usuario
    ): Call<RegistroResponse>

    @POST("/api/usuarios/reenviar-codigo")
    fun reenviarCodigo(
        @Body request: EmailRequest
    ): Call<RegistroResponse>

    // ================= JUGADORES =================

    @POST("/api/jugadores")
    fun createJugador(
        @Header("Authorization")
        token: String,
        @Body
        jugador: Jugador
    ): Call<ApiResponse>


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

        @GET("/api/jugadores/{id}")
        fun getJugador(
            @Header("Authorization")
            token: String,
            @Path("id")
            id: Int
        ): Call<Jugador>

        @GET("/api/jugadores/usuarios-disponibles")
        fun getUsuariosDisponibles(
            @Header("Authorization")
            token: String
        ): Call<UsuarioResponse>

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
    fun getTorneo(
        @Header("Authorization")
        token: String
    ): Call<List<Torneo>>

    @GET("/api/torneos/{id}")
    fun getTorneo(
        @Header("Authorization")
        token: String,
        @Path("id")
        id: Int
    ): Call<Torneo>

    @PUT("/api/torneos/{id}")
    fun updateTorneo(
        @Header("Authorization")
        token: String,
        @Path("id")
        id: Int,
        @Body
        torneo: Torneo
    ): Call<Void>

    @DELETE("/api/torneos/{id}")
    fun deleteTorneo(
        @Header("Authorization")
        token: String,
        @Path("id")
        id: Int
    ): Call<Void>

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

    // ================= RESULTADOS =================

    @GET("/api/resultados")
    fun getResultados(
        @Header("Authorization")
        token: String
    ): Call<List<Resultado>>

    @GET("/api/resultados/{id}")
    fun getResultado(
        @Header("Authorization")
        token: String,

        @Path("id")
        id: Int
    ): Call<Resultado>

    @POST("/api/resultados")
    fun createResultado(
        @Header("Authorization")
        token: String,

        @Body
        resultado: Resultado
    ): Call<Resultado>

    @PUT("/api/resultados/{id}")
    fun updateResultado(
        @Header("Authorization")
        token: String,

        @Path("id")
        id: Int,

        @Body
        resultado: Resultado
    ): Call<Void>

    @DELETE("/api/resultados/{id}")
    fun deleteResultado(
        @Header("Authorization")
        token: String,

        @Path("id")
        id: Int
    ): Call<Void>

    // ================= INSCRIPCIONES EQUIPOS =================

    @POST("/api/inscripcionesequipos")
    fun inscribirEquipo(
        @Header("Authorization") token: String,
        @Body inscripcion: InscripcionEquipo
    ): Call<InscripcionEquipo>

    @GET("/api/inscripcionesequipos")
    fun getInscripciones(
        @Header("Authorization") token: String
    ): Call<List<InscripcionEquipo>>

    @DELETE("/api/inscripcionesequipos/{id}")
    fun deleteInscripcion(
        @Header("Authorization") token: String,
        @Path("id") id: Int
    ): Call<Void>

// ================= CRONOLOGÍAS =================

    @GET("/api/cronologias")
    fun getCronologias(
        @Header("Authorization") token: String
    ): Call<List<Cronologia>>

    @GET("/api/cronologias/{id}")
    fun getCronologia(
        @Header("Authorization") token: String,
        @Path("id") id: Int
    ): Call<Cronologia>

    @POST("/api/cronologias")
    fun createCronologia(
        @Header("Authorization") token: String,
        @Body cronologia: Cronologia
    ): Call<Cronologia>

    @PUT("/api/cronologias/{id}")
    fun updateCronologia(
        @Header("Authorization") token: String,
        @Path("id") id: Int,
        @Body cronologia: Cronologia
    ): Call<Void>

    @DELETE("/api/cronologias/{id}")
    fun deleteCronologia(
        @Header("Authorization") token: String,
        @Path("id") id: Int
    ): Call<Void>

    @GET("/api/cronologias/encuentro/{id_encuentro}/jugadores")
    fun getJugadoresByEncuentro(
        @Header("Authorization") token: String,
        @Path("id_encuentro") idEncuentro: Int
    ): Call<List<JugadorEncuentro>>

}