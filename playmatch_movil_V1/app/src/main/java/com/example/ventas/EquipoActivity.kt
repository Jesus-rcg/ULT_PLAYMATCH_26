package com.example.ventas.ui

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.R
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Equipo
import com.example.ventas.model.Torneo
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EquipoActivity : AppCompatActivity() {

    private lateinit var spinnerTorneo: Spinner
    private lateinit var etNombre: EditText
    private lateinit var etEntrenador: EditText
    private lateinit var btnGuardar: Button

    private var listaTorneos: List<Torneo> = emptyList()
    private var torneoSeleccionado: Torneo? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_equipo)

        spinnerTorneo = findViewById(R.id.spinnerTorneo)
        etNombre = findViewById(R.id.etNombre)
        etEntrenador = findViewById(R.id.etEntrenador)
        btnGuardar = findViewById(R.id.btnGuardar)

        cargarTorneos()

        btnGuardar.setOnClickListener {
            crearEquipo()
        }
    }

    private fun cargarTorneos() {
        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }
        val prefs = getSharedPreferences("app", MODE_PRIVATE)
        val token = prefs.getString("token", "") ?: ""

        ApiClient.instance.getTorneos(
            "Bearer $token"
        ).enqueue(object : Callback<List<Torneo>> {

            override fun onResponse(call: Call<List<Torneo>>, response: Response<List<Torneo>>) {
                if (response.isSuccessful) {
                    listaTorneos = response.body() ?: emptyList()

                    val nombres = listaTorneos.map { it.nombre ?: "Sin nombre" }
                    val adapter = ArrayAdapter(
                        this@EquipoActivity,
                        android.R.layout.simple_spinner_item,
                        nombres
                    )
                    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                    spinnerTorneo.adapter = adapter

                    spinnerTorneo.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                        override fun onItemSelected(parent: AdapterView<*>, view: android.view.View?, position: Int, id: Long) {
                            torneoSeleccionado = listaTorneos[position]
                        }
                        override fun onNothingSelected(parent: AdapterView<*>) {}
                    }

                } else {
                    Toast.makeText(this@EquipoActivity, "Error al cargar torneos", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<Torneo>>, t: Throwable) {
                Toast.makeText(this@EquipoActivity, "Error de conexión", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun crearEquipo() {
        if (torneoSeleccionado == null) {
            Toast.makeText(this, "Selecciona un torneo", Toast.LENGTH_SHORT).show()
            return
        }

        if (etNombre.text.isEmpty()) {
            Toast.makeText(this, "Escribe el nombre del equipo", Toast.LENGTH_SHORT).show()
            return
        }

        if (etEntrenador.text.isEmpty()) {
            Toast.makeText(this, "Escribe el entrenador", Toast.LENGTH_SHORT).show()
            return
        }

        val equipo = Equipo(
            id_torneo = torneoSeleccionado!!.id_torneo!!,
            nombre = etNombre.text.toString(),
            entrenador = etEntrenador.text.toString()
        )

        val prefs = getSharedPreferences("app", MODE_PRIVATE)
        val token = prefs.getString("token", "") ?: ""

        ApiClient.instance.createEquipo(
            "Bearer $token",
            equipo
        ).enqueue(object : Callback<Equipo> {

            override fun onResponse(call: Call<Equipo>, response: Response<Equipo>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@EquipoActivity, "✅ Equipo creado correctamente", Toast.LENGTH_SHORT).show()
                    etNombre.text.clear()
                    etEntrenador.text.clear()
                    spinnerTorneo.setSelection(0)
                } else {
                    Toast.makeText(this@EquipoActivity, "Error al crear", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Equipo>, t: Throwable) {
                Toast.makeText(this@EquipoActivity, "Error de conexión", Toast.LENGTH_SHORT).show()
            }
        })
    }
}