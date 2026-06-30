package com.example.ventas

import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.ApiResponse
import com.example.ventas.model.Jugador
import com.example.ventas.model.Usuario
import com.example.ventas.model.UsuarioResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CrearJugadorActivity : AppCompatActivity() {

    private lateinit var spActivo: Spinner
    private lateinit var spUsuario: Spinner
    private lateinit var spPosicion: Spinner

    private lateinit var txtNumero: EditText
    private lateinit var btnGuardar: Button

    private var listaUsuarios: List<Usuario> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_crear_jugador)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        spUsuario = findViewById(R.id.spUsuario)
        spPosicion = findViewById(R.id.spPosicion)
        spActivo = findViewById(R.id.spActivo)

        txtNumero = findViewById(R.id.txtNumero)

        btnGuardar =
            findViewById(R.id.btnGuardarJugador)

        cargarEstados()
        cargarPosiciones()
        cargarUsuarios()

        btnGuardar.setOnClickListener {

            if (listaUsuarios.isEmpty()) {

                Toast.makeText(
                    this,
                    "No hay usuarios disponibles",
                    Toast.LENGTH_LONG
                ).show()

                return@setOnClickListener
            }

            if (txtNumero.text.isEmpty()) {

                Toast.makeText(
                    this,
                    "Ingrese el número de camiseta",
                    Toast.LENGTH_LONG
                ).show()

                return@setOnClickListener
            }

            val numero =
                txtNumero.text.toString().toInt()

            if (numero !in 1..100) {

                Toast.makeText(
                    this,
                    "El número debe estar entre 1 y 100",
                    Toast.LENGTH_LONG
                ).show()

                return@setOnClickListener
            }

            val usuarioSeleccionado =
                listaUsuarios[spUsuario.selectedItemPosition]

            val activo =
                if (spActivo.selectedItem.toString() == "Activo")
                    1
                else
                    0

            val jugador = Jugador(

                id_jugador = 0,

                id_usuario =
                    usuarioSeleccionado.id!!,

                nombre_usuario =
                    usuarioSeleccionado.nombre_usuario,

                apellido_usuario =
                    usuarioSeleccionado.apellido_usuario,

                posicion =
                    spPosicion.selectedItem.toString(),

                numero_camiseta =
                    numero,

                activo =
                    activo
            )

            val prefs =
                getSharedPreferences("app", MODE_PRIVATE)

            val token =
                prefs.getString("token", "") ?: ""

            ApiClient.instance.createJugador(
                "Bearer $token",
                jugador
            ).enqueue(object : Callback<ApiResponse> {

                override fun onResponse(
                    call: Call<ApiResponse>,
                    response: Response<ApiResponse>
                ) {

                    if (response.isSuccessful) {

                        Toast.makeText(
                            this@CrearJugadorActivity,
                            "Jugador creado correctamente",
                            Toast.LENGTH_LONG
                        ).show()

                        txtNumero.text.clear()

                        spUsuario.setSelection(0)
                        spPosicion.setSelection(0)
                        spActivo.setSelection(0)

                    } else {

                        Toast.makeText(
                            this@CrearJugadorActivity,
                            "Error ${response.code()}",
                            Toast.LENGTH_LONG
                        ).show()

                        Log.e(
                            "API_ERROR",
                            response.errorBody()?.string()
                                ?: "Error desconocido"
                        )
                    }
                }

                override fun onFailure(
                    call: Call<ApiResponse>,
                    t: Throwable
                ) {

                    Toast.makeText(
                        this@CrearJugadorActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()

                    Log.e(
                        "API_ERROR",
                        t.message ?: "Error"
                    )
                }
            })
        }
    }

    private fun cargarEstados() {

        val estados = listOf(
            "Activo",
            "Inactivo"
        )

        val adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            estados
        )

        adapter.setDropDownViewResource(
            android.R.layout.simple_spinner_dropdown_item
        )

        spActivo.adapter = adapter
    }

    private fun cargarPosiciones() {

        val posiciones = listOf(
            "Portero",
            "Defensa",
            "Centrocampista",
            "Delantero"
        )

        val adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            posiciones
        )

        adapter.setDropDownViewResource(
            android.R.layout.simple_spinner_dropdown_item
        )

        spPosicion.adapter = adapter
    }

    private fun cargarUsuarios() {

        val prefs =
            getSharedPreferences("app", MODE_PRIVATE)

        val token =
            prefs.getString("token", "") ?: ""

        ApiClient.instance.getUsuariosDisponibles(
            "Bearer $token"
        ).enqueue(object : Callback<UsuarioResponse> {

            override fun onResponse(
                call: Call<UsuarioResponse>,
                response: Response<UsuarioResponse>
            ) {

                if (response.isSuccessful) {

                    listaUsuarios =
                        response.body()?.data ?: emptyList()

                    val nombres = listaUsuarios.map {
                        "${it.nombre_usuario} ${it.apellido_usuario}"

                    }
                    Log.d("USUARIOS_SIZE", listaUsuarios.size.toString())
                    Log.d("USUARIOS_DATA", listaUsuarios.toString())
                    Log.d("NOMBRES", nombres.toString())
                    val adapter = ArrayAdapter(
                        this@CrearJugadorActivity,
                        android.R.layout.simple_spinner_item,
                        nombres
                    )

                    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)

                    spUsuario.adapter = adapter

                } else {

                    Log.e(
                        "USUARIOS",
                        response.errorBody()?.string()
                            ?: "Error"
                    )
                }
            }

            override fun onFailure(
                call: Call<UsuarioResponse>,
                t: Throwable
            ) {

                Log.e(
                    "USUARIOS",
                    t.message ?: "Error"
                )
            }
        })
    }
}