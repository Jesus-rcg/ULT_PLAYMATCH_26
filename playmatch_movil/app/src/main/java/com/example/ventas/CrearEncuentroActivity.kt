package com.example.ventas.ui.encuentros

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.R
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Encuentro
import com.example.ventas.model.Equipo
import com.example.ventas.model.Torneo
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CrearEncuentroActivity : AppCompatActivity() {

    private lateinit var spinnerTorneo: Spinner
    private lateinit var spinnerEquipoLocal: Spinner
    private lateinit var spinnerEquipoVisitante: Spinner
    private lateinit var spinnerEstado: Spinner
    private lateinit var etJornada: EditText
    private lateinit var etLugar: EditText
    private lateinit var etFecha: EditText
    private lateinit var etHora: EditText
    private lateinit var btnGuardar: Button

    private var listaTorneos: List<Torneo> = emptyList()
    private var listaEquipos: List<Equipo> = emptyList()
    private var torneoSeleccionadoId: Int = 0
    private var equipoLocalId: Int = 0
    private var equipoVisitanteId: Int = 0
    private var estadoSeleccionado: String = "Pendiente"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_crear_encuentro)

        spinnerTorneo = findViewById(R.id.spinnerTorneo)
        spinnerEquipoLocal = findViewById(R.id.spinnerEquipoLocal)
        spinnerEquipoVisitante = findViewById(R.id.spinnerEquipoVisitante)
        spinnerEstado = findViewById(R.id.spinnerEstado)
        etJornada = findViewById(R.id.etJornada)
        etLugar = findViewById(R.id.etLugar)
        etFecha = findViewById(R.id.etFecha)
        etHora = findViewById(R.id.etHora)
        btnGuardar = findViewById(R.id.btnGuardar)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        // ✅ Spinner de estados cargado desde el inicio
        val estados = listOf("Pendiente", "Jugando", "Finalizado", "Aplazado")
        val estadoAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, estados)
        estadoAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinnerEstado.adapter = estadoAdapter
        spinnerEstado.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: android.view.View?, position: Int, id: Long) {
                estadoSeleccionado = estados[position]
            }
            override fun onNothingSelected(parent: AdapterView<*>) {}
        }

        // ✅ Spinner de equipos con placeholder mientras carga
        val placeholderLocal = ArrayAdapter(this, android.R.layout.simple_spinner_item, listOf("Cargando..."))
        spinnerEquipoLocal.adapter = placeholderLocal

        val placeholderVisitante = ArrayAdapter(this, android.R.layout.simple_spinner_item, listOf("Cargando..."))
        spinnerEquipoVisitante.adapter = placeholderVisitante

        val placeholderTorneo = ArrayAdapter(this, android.R.layout.simple_spinner_item, listOf("Cargando..."))
        spinnerTorneo.adapter = placeholderTorneo

        val token = getSharedPreferences("app", MODE_PRIVATE).getString("token", "") ?: ""
        cargarTorneos(token)
        cargarEquipos(token)

        btnGuardar.setOnClickListener { crearEncuentro(token) }
    }

    private fun cargarTorneos(token: String) {
        ApiClient.instance.getTorneos("Bearer $token")
            .enqueue(object : Callback<List<Torneo>> {
                override fun onResponse(call: Call<List<Torneo>>, response: Response<List<Torneo>>) {
                    if (response.isSuccessful) {
                        listaTorneos = response.body() ?: emptyList()

                        // ✅ Filtrar nombres nulos o vacíos
                        val nombres = listaTorneos
                            .map { it.nombre_torneo}
                            .filter { it.isNotEmpty() }

                        if (nombres.isEmpty()) {
                            Toast.makeText(this@CrearEncuentroActivity, "No hay torneos disponibles", Toast.LENGTH_SHORT).show()
                            return
                        }

                        val adapter = ArrayAdapter(
                            this@CrearEncuentroActivity,
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
                    Toast.makeText(this@CrearEncuentroActivity, "❌ Error cargando torneos", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun cargarEquipos(token: String) {
        ApiClient.instance.getEquipos("Bearer $token")
            .enqueue(object : Callback<List<Equipo>> {
                override fun onResponse(call: Call<List<Equipo>>, response: Response<List<Equipo>>) {
                    if (response.isSuccessful) {
                        listaEquipos = response.body() ?: emptyList()

                        // ✅ Filtrar nombres nulos o vacíos
                        val nombres = listaEquipos
                            .map { it.nombre_equipo }
                            .filter { it.isNotEmpty() }

                        if (nombres.isEmpty()) {
                            Toast.makeText(this@CrearEncuentroActivity, "No hay equipos disponibles", Toast.LENGTH_SHORT).show()
                            return
                        }

                        // ✅ Adapter separado para cada spinner
                        val adapterLocal = ArrayAdapter(
                            this@CrearEncuentroActivity,
                            android.R.layout.simple_spinner_item,
                            nombres
                        )
                        adapterLocal.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                        spinnerEquipoLocal.adapter = adapterLocal
                        spinnerEquipoLocal.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                            override fun onItemSelected(parent: AdapterView<*>, view: android.view.View?, position: Int, id: Long) {
                                equipoLocalId = listaEquipos[position].id_equipo
                            }
                            override fun onNothingSelected(parent: AdapterView<*>) {}
                        }

                        val adapterVisitante = ArrayAdapter(
                            this@CrearEncuentroActivity,
                            android.R.layout.simple_spinner_item,
                            nombres
                        )
                        adapterVisitante.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                        spinnerEquipoVisitante.adapter = adapterVisitante
                        spinnerEquipoVisitante.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                            override fun onItemSelected(parent: AdapterView<*>, view: android.view.View?, position: Int, id: Long) {
                                equipoVisitanteId = listaEquipos[position].id_equipo
                            }
                            override fun onNothingSelected(parent: AdapterView<*>) {}
                        }
                    }
                }
                override fun onFailure(call: Call<List<Equipo>>, t: Throwable) {
                    Toast.makeText(this@CrearEncuentroActivity, "❌ Error cargando equipos", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun crearEncuentro(token: String) {
        val jornada = etJornada.text.toString().trim()
        val lugar = etLugar.text.toString().trim()
        val fecha = etFecha.text.toString().trim()
        val hora = etHora.text.toString().trim()

        if (jornada.isEmpty()) { etJornada.error = "La jornada es obligatoria"; return }
        if (lugar.isEmpty()) { etLugar.error = "El lugar es obligatorio"; return }
        if (fecha.isEmpty()) { etFecha.error = "La fecha es obligatoria"; return }
        if (hora.isEmpty()) { etHora.error = "La hora es obligatoria"; return }
        if (equipoLocalId == equipoVisitanteId) {
            Toast.makeText(this, "❌ El equipo local y visitante no pueden ser el mismo", Toast.LENGTH_SHORT).show()
            return
        }

        val encuentro = Encuentro(
            id_encuentro = 0,
            id_torneo = torneoSeleccionadoId,
            id_equipo_local = equipoLocalId,
            id_equipo_visitante = equipoVisitanteId,
            jornada = jornada.toInt(),
            lugar = lugar,
            fecha = fecha,
            hora = hora,
            estado = estadoSeleccionado,
            activo = 1
        )

        ApiClient.instance.createEncuentro("Bearer $token", encuentro)
            .enqueue(object : Callback<Encuentro> {
                override fun onResponse(call: Call<Encuentro>, response: Response<Encuentro>) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@CrearEncuentroActivity, "✅ Encuentro creado correctamente", Toast.LENGTH_SHORT).show()
                        finish()
                    } else {
                        Toast.makeText(this@CrearEncuentroActivity, "❌ Error al crear: ${response.code()}", Toast.LENGTH_SHORT).show()
                    }
                }
                override fun onFailure(call: Call<Encuentro>, t: Throwable) {
                    Toast.makeText(this@CrearEncuentroActivity, "❌ Error de conexión: ${t.message}", Toast.LENGTH_LONG).show()
                }
            })
    }
}
