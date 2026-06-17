package com.example.ventas

import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Posicion
import com.example.ventas.model.PosicionRequest
import com.example.ventas.model.Torneo
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class CrearPosicionActivity : AppCompatActivity() {

    private lateinit var spinnerTorneo: Spinner
    private lateinit var spinnerEquipo: Spinner
    private lateinit var etJugados: EditText
    private lateinit var etGanados: EditText
    private lateinit var etEmpatados: EditText
    private lateinit var etPerdidos: EditText
    private lateinit var etGF: EditText
    private lateinit var etGC: EditText

    private var listaTorneos: List<Torneo> = emptyList()
    private var listaEquipos: List<Equipo> = emptyList()
    private var torneoSeleccionadoId: Int = 0
    private var equipoSeleccionadoId: Int = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_crear_posicion)

        // Inicializar vistas
        spinnerTorneo = findViewById(R.id.spinnerTorneo)
        spinnerEquipo = findViewById(R.id.spinnerEquipo)
        etJugados = findViewById(R.id.etJugados)
        etGanados = findViewById(R.id.etGanados)
        etEmpatados = findViewById(R.id.etEmpatados)
        etPerdidos = findViewById(R.id.etPerdidos)
        etGF = findViewById(R.id.etGF)
        etGC = findViewById(R.id.etGC)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        val token = getSharedPreferences("app", MODE_PRIVATE)
            .getString("token", "") ?: ""

        // Cargar torneos y equipos
        cargarTorneos(token)
        cargarEquipos(token)

        findViewById<Button>(R.id.btnGuardar).setOnClickListener {
            guardarPosicion(token)
        }
    }

    private fun cargarTorneos(token: String) {
        ApiClient.instance.getTorneos("Bearer $token")
            .enqueue(object : Callback<List<Torneo>> {
                override fun onResponse(call: Call<List<Torneo>>, response: Response<List<Torneo>>) {
                    if (response.isSuccessful) {
                        listaTorneos = response.body() ?: emptyList()
                        val nombres = listaTorneos.map { it.nombre }
                        val adapter = ArrayAdapter(
                            this@CrearPosicionActivity,
                            android.R.layout.simple_spinner_item,
                            nombres
                        )
                        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                        spinnerTorneo.adapter = adapter

                        spinnerTorneo.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                            override fun onItemSelected(parent: AdapterView<*>, view: android.view.View?, position: Int, id: Long) {
                                torneoSeleccionadoId = listaTorneos[position].id_torneo ?: 0
                            }
                            override fun onNothingSelected(parent: AdapterView<*>) {}
                        }
                    }
                }

                override fun onFailure(call: Call<List<Torneo>>, t: Throwable) {
                    Log.e("API_ERROR", t.message.toString())
                }
            })
    }

    private fun cargarEquipos(token: String) {
        ApiClient.instance.getEquipos("Bearer $token")
            .enqueue(object : Callback<List<Equipo>> {
                override fun onResponse(call: Call<List<Equipo>>, response: Response<List<Equipo>>) {
                    if (response.isSuccessful) {
                        listaEquipos = response.body() ?: emptyList()
                        val nombres = listaEquipos.map { it.nombre }
                        val adapter = ArrayAdapter(
                            this@CrearPosicionActivity,
                            android.R.layout.simple_spinner_item,
                            nombres
                        )
                        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                        spinnerEquipo.adapter = adapter

                        spinnerEquipo.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                            override fun onItemSelected(parent: AdapterView<*>, view: android.view.View?, position: Int, id: Long) {
                                equipoSeleccionadoId = listaEquipos[position].id_equipo
                            }
                            override fun onNothingSelected(parent: AdapterView<*>) {}
                        }
                    }
                }

                override fun onFailure(call: Call<List<Equipo>>, t: Throwable) {
                    Log.e("API_ERROR", t.message.toString())
                }
            })
    }

    private fun guardarPosicion(token: String) {
        val jugados = etJugados.text.toString().toIntOrNull() ?: 0
        val ganados = etGanados.text.toString().toIntOrNull() ?: 0
        val empatados = etEmpatados.text.toString().toIntOrNull() ?: 0
        val perdidos = etPerdidos.text.toString().toIntOrNull() ?: 0
        val gf = etGF.text.toString().toIntOrNull() ?: 0
        val gc = etGC.text.toString().toIntOrNull() ?: 0

        if (torneoSeleccionadoId == 0) {
            Toast.makeText(this, "Selecciona un torneo", Toast.LENGTH_SHORT).show()
            return
        }
        if (equipoSeleccionadoId == 0) {
            Toast.makeText(this, "Selecciona un equipo", Toast.LENGTH_SHORT).show()
            return
        }

        val posicionRequest = PosicionRequest(
            id_torneo = torneoSeleccionadoId,
            id_equipo = equipoSeleccionadoId,
            jugados = jugados,
            ganados = ganados,
            empatados = empatados,
            perdidos = perdidos,
            gf = gf,
            gc = gc
        )

        ApiClient.instance.createPosicion("Bearer $token", posicionRequest)
            .enqueue(object : Callback<Posicion> {
                override fun onResponse(call: Call<Posicion>, response: Response<Posicion>) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@CrearPosicionActivity, "Posición guardada correctamente", Toast.LENGTH_LONG).show()
                        setResult(RESULT_OK)
                        finish()
                    } else {
                        Toast.makeText(this@CrearPosicionActivity, "Error ${response.code()}", Toast.LENGTH_LONG).show()
                        Log.e("API_ERROR", response.errorBody()?.string() ?: "")
                    }
                }

                override fun onFailure(call: Call<Posicion>, t: Throwable) {
                    Toast.makeText(this@CrearPosicionActivity, t.message, Toast.LENGTH_LONG).show()
                    Log.e("API_ERROR", t.message.toString())
                }
            })
    }
}