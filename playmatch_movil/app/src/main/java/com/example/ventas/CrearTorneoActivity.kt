package com.example.ventas

import android.app.DatePickerDialog
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.CreateTorneoRequest
import com.example.ventas.model.TipoTorneo
import com.example.ventas.model.ApiResponse
import com.example.ventas.model.CategoriaTorneo
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.Calendar
import android.content.Intent

class CrearTorneoActivity : AppCompatActivity() {

    private lateinit var spTipoTorneo: Spinner
    private lateinit var spCategoria: Spinner

    private lateinit var etFechaInicio: EditText
    private lateinit var etFechaFin: EditText

    private var fechaInicioISO = ""
    private var fechaFinISO = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_crear_torneo)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        spTipoTorneo = findViewById(R.id.spTipoTorneo)
        spCategoria = findViewById(R.id.spCategoria)

        etFechaInicio = findViewById(R.id.etFechaInicio)
        etFechaFin = findViewById(R.id.etFechaFin)

        val prefs = getSharedPreferences("app", MODE_PRIVATE)
        val token = prefs.getString("token", "") ?: ""

        cargarTiposTorneo(token)
        cargarCategoria(token)

        val txtNombre = findViewById<EditText>(R.id.txtNombreTorneo)
        val txtCiudad = findViewById<EditText>(R.id.txtCiudad)
        val btnGuardarTorneo = findViewById<Button>(R.id.btnGuardarTorneo)

        etFechaInicio.setOnClickListener { mostrarDatePicker(true) }
        etFechaFin.setOnClickListener { mostrarDatePicker(false) }

        btnGuardarTorneo.setOnClickListener {

            val nombre = txtNombre.text.toString().trim()
            val ciudad = txtCiudad.text.toString().trim()
            val categoria = spCategoria.selectedItem.toString()
            val tipoTorneo = spTipoTorneo.selectedItem.toString()

            if (nombre.isEmpty()) {
                txtNombre.error = "El nombre es obligatorio"
                return@setOnClickListener
            }

            if (ciudad.isEmpty()) {
                txtCiudad.error = "La ciudad es obligatoria"
                return@setOnClickListener
            }

            if (fechaInicioISO.isEmpty()) {
                etFechaInicio.error = "Selecciona fecha inicio"
                return@setOnClickListener
            }

            if (fechaFinISO.isEmpty()) {
                etFechaFin.error = "Selecciona fecha fin"
                return@setOnClickListener
            }

            val idUsuario = prefs.getInt("id_usuario", 0)

            val torneo = CreateTorneoRequest(
                id_usuario = idUsuario,
                nombre_torneo = nombre,
                categoria = categoria,
                tipo_torneo = tipoTorneo,
                ciudad = ciudad,
                fecha_inicio = fechaInicioISO,
                fecha_fin = fechaFinISO
            )

            ApiClient.instance.createTorneo("Bearer $token", torneo)
                .enqueue(object : Callback<ApiResponse> {

                    override fun onResponse(
                        call: Call<ApiResponse>,
                        response: Response<ApiResponse>
                    ) {

                        if (response.isSuccessful) {

                            Toast.makeText(
                                this@CrearTorneoActivity,
                                " Torneo guardado correctamente",
                                Toast.LENGTH_LONG
                            ).show()

                            val intent = Intent(this@CrearTorneoActivity, TorneosActivity::class.java)
                            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
                            startActivity(intent)
                            finish()

                            txtNombre.text.clear()
                            txtCiudad.text.clear()
                            etFechaInicio.text.clear()
                            etFechaFin.text.clear()

                            fechaInicioISO = ""
                            fechaFinISO = ""

                        } else {

                            Toast.makeText(
                                this@CrearTorneoActivity,
                                " Error ${response.code()}",
                                Toast.LENGTH_LONG
                            ).show()

                        }

                    }

                    override fun onFailure(call: Call<ApiResponse>, t: Throwable) {
                        Toast.makeText(
                            this@CrearTorneoActivity,
                            " Error conexión",
                            Toast.LENGTH_LONG
                        ).show()


                    }
                })
        }
    }


    private fun mostrarDatePicker(esInicio: Boolean) {

        val calendario = Calendar.getInstance()

        DatePickerDialog(
            this,
            { _, year, month, day ->

                val fechaISO = String.format("%04d-%02d-%02d", year, month + 1, day)

                if (esInicio) {
                    fechaInicioISO = fechaISO
                    etFechaInicio.setText(fechaISO)
                } else {
                    fechaFinISO = fechaISO
                    etFechaFin.setText(fechaISO)
                }

            },
            calendario.get(Calendar.YEAR),
            calendario.get(Calendar.MONTH),
            calendario.get(Calendar.DAY_OF_MONTH)
        ).show()
    }


    private fun cargarCategoria(token: String) {

        ApiClient.instance.getCategoria("Bearer $token")
            .enqueue(object : Callback<List<CategoriaTorneo>> {

                override fun onResponse(
                    call: Call<List<CategoriaTorneo>>,
                    response: Response<List<CategoriaTorneo>>
                ) {

                    if (response.isSuccessful) {

                        val lista = response.body() ?: emptyList()
                        val categorias = lista.map { it.categoria }

                        val adapter = ArrayAdapter(
                            this@CrearTorneoActivity,
                            android.R.layout.simple_spinner_item,
                            categorias
                        )

                        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                        spCategoria.adapter = adapter
                    }
                }

                override fun onFailure(call: Call<List<CategoriaTorneo>>, t: Throwable) {}
            })
    }

    // ================= TIPOS =================
    private fun cargarTiposTorneo(token: String) {

        ApiClient.instance.getTipoTorneo("Bearer $token")
            .enqueue(object : Callback<List<TipoTorneo>> {

                override fun onResponse(
                    call: Call<List<TipoTorneo>>,
                    response: Response<List<TipoTorneo>>
                ) {

                    if (response.isSuccessful) {

                        val lista = response.body() ?: emptyList()
                        val tipos = lista.map { it.tipo_torneo }

                        val adapter = ArrayAdapter(
                            this@CrearTorneoActivity,
                            android.R.layout.simple_spinner_item,
                            tipos
                        )

                        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                        spTipoTorneo.adapter = adapter
                    }
                }

                override fun onFailure(call: Call<List<TipoTorneo>>, t: Throwable) {}
            })
    }
}