package com.example.ventas.ui.resultados

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.R
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Encuentro
import com.example.ventas.model.Resultado
import com.example.ventas.model.Torneo
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CrearResultadoActivity : AppCompatActivity() {

    private lateinit var spinnerTorneo: Spinner
    private lateinit var spinnerEncuentro: Spinner
    private lateinit var etGolesLocal: EditText
    private lateinit var etGolesVisitante: EditText
    private lateinit var btnGuardar: Button

    private var listaTorneos: List<Torneo> = emptyList()
    private var listaEncuentrosTodos: List<Encuentro> = emptyList()
    private var listaEncuentrosFiltrados: List<Encuentro> = emptyList()
    private var encuentroSeleccionadoId: Int = 0
    private var token: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_crear_resultado)

        spinnerTorneo = findViewById(R.id.spinnerTorneo)
        spinnerEncuentro = findViewById(R.id.spinnerEncuentro)
        etGolesLocal = findViewById(R.id.etGolesLocal)
        etGolesVisitante = findViewById(R.id.etGolesVisitante)
        btnGuardar = findViewById(R.id.btnGuardar)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        // ✅ Placeholders mientras cargan
        val placeholderTorneo = ArrayAdapter(this, android.R.layout.simple_spinner_item, listOf("Cargando torneos..."))
        spinnerTorneo.adapter = placeholderTorneo

        val placeholderEncuentro = ArrayAdapter(this, android.R.layout.simple_spinner_item, listOf("Selecciona un torneo primero"))
        spinnerEncuentro.adapter = placeholderEncuentro

        token = getSharedPreferences("app", MODE_PRIVATE).getString("token", "") ?: ""

        cargarTorneos()
        cargarEncuentros()

        btnGuardar.setOnClickListener { crearResultado() }
    }

    private fun cargarTorneos() {
        ApiClient.instance.getTorneos("Bearer $token")
            .enqueue(object : Callback<List<Torneo>> {
                override fun onResponse(call: Call<List<Torneo>>, response: Response<List<Torneo>>) {
                    if (response.isSuccessful) {
                        listaTorneos = response.body() ?: emptyList()

                        val nombres = listaTorneos
                            .map { it.nombre_torneo }
                            .filter { it.isNotEmpty() }

                        if (nombres.isEmpty()) {
                            Toast.makeText(this@CrearResultadoActivity, "No hay torneos disponibles", Toast.LENGTH_SHORT).show()
                            return
                        }

                        val adapter = ArrayAdapter(
                            this@CrearResultadoActivity,
                            android.R.layout.simple_spinner_item,
                            nombres
                        )
                        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                        spinnerTorneo.adapter = adapter

                        // ✅ Cuando cambia el torneo filtra los encuentros
                        spinnerTorneo.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                            override fun onItemSelected(parent: AdapterView<*>, view: android.view.View?, position: Int, id: Long) {
                                val torneoId = listaTorneos[position].id_torneo ?: 0
                                filtrarEncuentrosPorTorneo(torneoId)
                            }
                            override fun onNothingSelected(parent: AdapterView<*>) {}
                        }
                    }
                }
                override fun onFailure(call: Call<List<Torneo>>, t: Throwable) {
                    Toast.makeText(this@CrearResultadoActivity, "❌ Error cargando torneos", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun cargarEncuentros() {
        ApiClient.instance.getEncuentros("Bearer $token")
            .enqueue(object : Callback<List<Encuentro>> {
                override fun onResponse(call: Call<List<Encuentro>>, response: Response<List<Encuentro>>) {
                    if (response.isSuccessful) {
                        listaEncuentrosTodos = response.body() ?: emptyList()
                    }
                }
                override fun onFailure(call: Call<List<Encuentro>>, t: Throwable) {
                    Toast.makeText(this@CrearResultadoActivity, "❌ Error cargando encuentros", Toast.LENGTH_SHORT).show()
                }
            })
    }

    // ✅ Filtra encuentros por torneo seleccionado
    private fun filtrarEncuentrosPorTorneo(torneoId: Int) {
        listaEncuentrosFiltrados = listaEncuentrosTodos.filter { it.id_torneo == torneoId }

        if (listaEncuentrosFiltrados.isEmpty()) {
            val placeholder = ArrayAdapter(this, android.R.layout.simple_spinner_item, listOf("No hay encuentros en este torneo"))
            spinnerEncuentro.adapter = placeholder
            encuentroSeleccionadoId = 0
            return
        }

        val nombres = listaEncuentrosFiltrados.map {
            "Encuentro #${it.id_encuentro} - Jornada ${it.jornada} | ${it.lugar}"
        }

        val adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            nombres
        )
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinnerEncuentro.adapter = adapter

        spinnerEncuentro.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: android.view.View?, position: Int, id: Long) {
                encuentroSeleccionadoId = listaEncuentrosFiltrados[position].id_encuentro
            }
            override fun onNothingSelected(parent: AdapterView<*>) {}
        }
    }

    private fun crearResultado() {
        val golesLocal = etGolesLocal.text.toString().trim()
        val golesVisitante = etGolesVisitante.text.toString().trim()

        if (golesLocal.isEmpty()) { etGolesLocal.error = "Los goles local son obligatorios"; return }
        if (golesVisitante.isEmpty()) { etGolesVisitante.error = "Los goles visitante son obligatorios"; return }
        if (encuentroSeleccionadoId == 0) {
            Toast.makeText(this, "❌ Selecciona un encuentro", Toast.LENGTH_SHORT).show()
            return
        }

        val resultado = Resultado(
            id_resultado = 0,
            id_encuentro = encuentroSeleccionadoId,
            goles_local = golesLocal.toInt(),
            goles_visitante = golesVisitante.toInt()
        )

        ApiClient.instance.createResultado("Bearer $token", resultado)
            .enqueue(object : Callback<Resultado> {
                override fun onResponse(call: Call<Resultado>, response: Response<Resultado>) {
                    if (response.isSuccessful) {
                        Toast.makeText(
                            this@CrearResultadoActivity,
                            "✅ Resultado registrado correctamente",
                            Toast.LENGTH_SHORT
                        ).show()
                        finish()
                    } else {
                        Toast.makeText(
                            this@CrearResultadoActivity,
                            "❌ Error al registrar: ${response.code()}",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
                override fun onFailure(call: Call<Resultado>, t: Throwable) {
                    Toast.makeText(
                        this@CrearResultadoActivity,
                        "❌ Error de conexión: ${t.message}",
                        Toast.LENGTH_LONG
                    ).show()
                }
            })
    }
}