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
import com.example.ventas.model.Torneo
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CrearTorneoActivity : AppCompatActivity() {

    private lateinit var spEstados: Spinner

    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_crear_torneo)

        // BOTON VOLVER

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        // SPINNER

        spEstados = findViewById(R.id.spEstados)

        cargarEstados()

        // INPUTS

        val txtNombre =
            findViewById<EditText>(R.id.txtNombre)

        val txtDescripcion =
            findViewById<EditText>(R.id.txtDescripcion)

        val txtFecha_inicio =
            findViewById<EditText>(R.id.txtFecha_inicio)

        val txtFecha_fin =
            findViewById<EditText>(R.id.txtFecha_fin)

        // BOTON

        val btnGuardarTorneo =
            findViewById<Button>(R.id.btnGuardarTorneo)

        // CLICK BOTON

        btnGuardarTorneo.setOnClickListener {

            val estado =
                spEstados.selectedItem.toString()

            val torneo = Torneo(

                nombre = txtNombre.text.toString(),

                descripcion = txtDescripcion.text.toString(),

                fecha_inicio = txtFecha_inicio.text.toString(),

                fecha_fin = txtFecha_fin.text.toString(),

                estado = estado
            )

            // TOKEN

            val prefs =
                getSharedPreferences("app", MODE_PRIVATE)

            val token =
                prefs.getString("token", "") ?: ""

            // PETICION API

            ApiClient.instance.createTorneo(

                "Bearer $token",
                torneo

            ).enqueue(object : Callback<Torneo> {

                override fun onResponse(
                    call: Call<Torneo>,
                    response: Response<Torneo>
                ) {

                    if (response.isSuccessful) {

                        Toast.makeText(
                            this@CrearTorneoActivity,
                            "Torneo guardado correctamente",
                            Toast.LENGTH_LONG
                        ).show()

                        // LIMPIAR CAMPOS

                        txtNombre.text.clear()
                        txtDescripcion.text.clear()
                        txtFecha_inicio.text.clear()
                        txtFecha_fin.text.clear()

                        spEstados.setSelection(0)

                    } else {

                        Toast.makeText(
                            this@CrearTorneoActivity,
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
                    call: Call<Torneo>,
                    t: Throwable
                ) {

                    Toast.makeText(
                        this@CrearTorneoActivity,
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

    // CARGAR ESTADOS MANUALMENTE

    private fun cargarEstados() {

        val estados = listOf(
            "Activo",
            "En curso",
            "Finalizado"
        )

        val adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            estados
        )

        adapter.setDropDownViewResource(
            android.R.layout.simple_spinner_dropdown_item
        )

        spEstados.adapter = adapter
    }
}