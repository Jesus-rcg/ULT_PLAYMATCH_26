package com.example.ventas.ui.equipos

import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.EditText
import android.widget.ListView
import android.widget.Spinner
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.R
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Equipo
import com.example.ventas.model.Torneo
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class InscribirEquipoActivity : AppCompatActivity() {

    private lateinit var spTorneos: Spinner
    private lateinit var etBuscarEquipo: EditText
    private lateinit var btnBuscarEquipo: Button
    private lateinit var listaEquipos: ListView
    private lateinit var btnInscribir: Button

    private var listaTorneos = mutableListOf<Torneo>()
    private var listaEquiposCompleta = mutableListOf<Equipo>()
    private var equipoSeleccionado: Equipo? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_inscribir_equipo)

        spTorneos = findViewById(R.id.spTorneos)
        etBuscarEquipo = findViewById(R.id.etBuscarEquipo)
        btnBuscarEquipo = findViewById(R.id.btnBuscarEquipo)
        listaEquipos = findViewById(R.id.listaEquipos)
        btnInscribir = findViewById(R.id.btnInscribir)

        cargarTorneos()
        cargarEquipos()

        btnBuscarEquipo.setOnClickListener {
            Toast.makeText(this, "La búsqueda la programaremos en el siguiente paso", Toast.LENGTH_SHORT).show()
        }

        btnInscribir.setOnClickListener {
            Toast.makeText(this, "La inscripción la programaremos en el siguiente paso", Toast.LENGTH_SHORT).show()
        }
    }

    private fun cargarTorneos() {

        val token = getSharedPreferences("app", MODE_PRIVATE)
            .getString("token", "") ?: ""

        ApiClient.instance.getTorneo("Bearer $token")
            .enqueue(object : Callback<List<Torneo>> {

                override fun onResponse(
                    call: Call<List<Torneo>>,
                    response: Response<List<Torneo>>
                ) {

                    if (response.isSuccessful) {

                        listaTorneos =
                            (response.body() ?: emptyList()).toMutableList()

                        val adapter = ArrayAdapter(
                            this@InscribirEquipoActivity,
                            android.R.layout.simple_spinner_item,
                            listaTorneos.map { it.nombre_torneo }
                        )

                        adapter.setDropDownViewResource(
                            android.R.layout.simple_spinner_dropdown_item
                        )

                        spTorneos.adapter = adapter

                    } else {

                        Toast.makeText(
                            this@InscribirEquipoActivity,
                            "Error al cargar torneos",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }

                override fun onFailure(
                    call: Call<List<Torneo>>,
                    t: Throwable
                ) {

                    Toast.makeText(
                        this@InscribirEquipoActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()
                }
            })
    }

    private fun cargarEquipos() {

        val token = getSharedPreferences("app", MODE_PRIVATE)
            .getString("token", "") ?: ""

        ApiClient.instance.getEquipos("Bearer $token")
            .enqueue(object : Callback<List<Equipo>> {

                override fun onResponse(
                    call: Call<List<Equipo>>,
                    response: Response<List<Equipo>>
                ) {

                    if (response.isSuccessful) {

                        listaEquiposCompleta =
                            (response.body() ?: emptyList()).toMutableList()

                    } else {

                        Toast.makeText(
                            this@InscribirEquipoActivity,
                            "Error al cargar equipos",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }

                override fun onFailure(
                    call: Call<List<Equipo>>,
                    t: Throwable
                ) {

                    Toast.makeText(
                        this@InscribirEquipoActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()
                }
            })
    }
}