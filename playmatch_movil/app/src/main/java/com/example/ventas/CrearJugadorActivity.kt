package com.example.ventas

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Spinner
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Equipo
import com.example.ventas.model.Jugador
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CrearJugadorActivity : AppCompatActivity() {

    private lateinit var spEquipos: Spinner
    private lateinit var spEstadosJugador: Spinner

    private var listaEquipos = mutableListOf<Equipo>()

    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_crear_jugador)

        // BOTON VOLVER

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        // SPINNERS

        spEquipos = findViewById(R.id.spEquipos)
        spEstadosJugador = findViewById(R.id.spEstadosJugador)

        cargarEquipos()
        cargarEstados()

        // INPUTS

        val txtNombre =
            findViewById<EditText>(R.id.txtNombre)

        val txtApellido =
            findViewById<EditText>(R.id.txtApellido)

        val txtDocumento =
            findViewById<EditText>(R.id.txtDocumento)

        val txtNumeroCamiseta =
            findViewById<EditText>(R.id.txtNumeroCamiseta)

        // BOTON GUARDAR

        val btnGuardarJugador =
            findViewById<Button>(R.id.btnGuardarJugador)

        // CLICK BOTON

        btnGuardarJugador.setOnClickListener {

            val posicionEquipo =
                spEquipos.selectedItemPosition

            val idEquipo =
                listaEquipos[posicionEquipo].id_equipo

            val estado =
                spEstadosJugador.selectedItem.toString()

            val jugador = Jugador(

                nombre = txtNombre.text.toString(),

                apellido = txtApellido.text.toString(),

                documento = txtDocumento.text.toString(),

                numero_camiseta =
                    txtNumeroCamiseta.text.toString(),

                estado = estado,

                id_equipo = idEquipo
            )

            // TOKEN

            val prefs =
                getSharedPreferences("app", MODE_PRIVATE)

            val token =
                prefs.getString("token", "") ?: ""

            // PETICION API

            ApiClient.instance.createJugador(
                "Bearer $token",
                jugador

            ).enqueue(object : Callback<Jugador> {

                override fun onResponse(
                    call: Call<Jugador>,
                    response: Response<Jugador>
                ) {

                    if (response.isSuccessful) {

                        Toast.makeText(
                            this@CrearJugadorActivity,
                            "Jugador guardado correctamente",
                            Toast.LENGTH_LONG
                        ).show()

                        // LIMPIAR CAMPOS

                        txtNombre.text.clear()
                        txtApellido.text.clear()
                        txtDocumento.text.clear()
                        txtNumeroCamiseta.text.clear()

                        spEquipos.setSelection(0)
                        spEstadosJugador.setSelection(0)

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
                    call: Call<Jugador>,
                    t: Throwable
                ) {

                    Toast.makeText(
                        this@CrearJugadorActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()

                    Log.e(
                        "API_ERROR",
                        t.message.toString()
                    )
                }
            })
        }
    }

    // CARGAR EQUIPOS DESDE API

    private fun cargarEquipos() {

        val prefs =
            getSharedPreferences("app", MODE_PRIVATE)

        val token =
            prefs.getString("token", "") ?: ""

        ApiClient.instance.getEquipos("Bearer $token")
            .enqueue(object : Callback<List<Equipo>> {

                override fun onResponse(
                    call: Call<List<Equipo>>,
                    response: Response<List<Equipo>>
                ) {

                    if (response.isSuccessful && response.body() != null) {

                        listaEquipos =
                            response.body()!!.toMutableList()

                        val nombres =
                            listaEquipos.map { it.nombre }

                        val adapter = ArrayAdapter(
                            this@CrearJugadorActivity,
                            android.R.layout.simple_spinner_item,
                            nombres
                        )

                        adapter.setDropDownViewResource(
                            android.R.layout.simple_spinner_dropdown_item
                        )

                        spEquipos.adapter = adapter
                    }
                }

                override fun onFailure(
                    call: Call<List<Equipo>>,
                    t: Throwable
                ) {

                    Toast.makeText(
                        this@CrearJugadorActivity,
                        "Error cargando equipos",
                        Toast.LENGTH_LONG
                    ).show()

                    Log.e(
                        "API_ERROR",
                        t.message.toString()
                    )
                }
            })
    }

    // CARGAR ESTADOS MANUALMENTE

    private fun cargarEstados() {

        val estados = listOf(
            "Activo",
            "Lesionado",
            "Suspendido"
        )

        val adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            estados
        )

        adapter.setDropDownViewResource(
            android.R.layout.simple_spinner_dropdown_item
        )

        spEstadosJugador.adapter = adapter
    }
}