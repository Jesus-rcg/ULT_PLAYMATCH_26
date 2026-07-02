package com.example.ventas

import android.app.DatePickerDialog
import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Torneo
import com.example.ventas.model.UpdateTorneoRequest
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.Calendar

class EditarTorneoActivity : AppCompatActivity() {

    private lateinit var etNombreTorneo: EditText
    private lateinit var spCategoria: Spinner
    private lateinit var spTipoTorneo: Spinner
    private lateinit var etCiudad: EditText
    private lateinit var etFechaInicio: EditText
    private lateinit var etFechaFin: EditText
    private lateinit var btnActualizar: Button

    private var fechaInicioISO = ""
    private var fechaFinISO = ""
    private var idTorneo = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_editar_torneo)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        etNombreTorneo = findViewById(R.id.etNombreTorneo)
        spCategoria = findViewById(R.id.spCategoria)
        spTipoTorneo = findViewById(R.id.spTipoTorneo)
        etCiudad = findViewById(R.id.etCiudad)
        etFechaInicio = findViewById(R.id.etFechaInicio)
        etFechaFin = findViewById(R.id.etFechaFin)
        btnActualizar = findViewById(R.id.btnActualizar)

        idTorneo = intent.getIntExtra("id_torneo", 0)

        if (idTorneo == 0) {
            Toast.makeText(this, "ID inválido", Toast.LENGTH_LONG).show()
            finish()
            return
        }

        cargarSpinners()

        etFechaInicio.setOnClickListener { mostrarDatePicker(true) }
        etFechaFin.setOnClickListener { mostrarDatePicker(false) }

        cargarTorneo()

        btnActualizar.setOnClickListener {
            actualizarTorneo()
        }
    }

    // ================= SPINNERS =================
    private fun cargarSpinners() {
        val categorias = listOf("Amateur", "Profesional", "Semiprofesional")
        val tipos = listOf("Liga", "Grupos", "Eliminacion Directa")

        spCategoria.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, categorias)
        spTipoTorneo.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, tipos)
    }

    // ================= CARGAR =================
    private fun cargarTorneo() {

        val token = getSharedPreferences("app", MODE_PRIVATE)
            .getString("token", "") ?: ""

        ApiClient.instance.getTorneo("Bearer $token", idTorneo)
            .enqueue(object : Callback<Torneo> {

                override fun onResponse(call: Call<Torneo>, response: Response<Torneo>) {

                    val torneo = response.body() ?: return

                    etNombreTorneo.setText(torneo.nombre_torneo)
                    etCiudad.setText(torneo.ciudad)

                    // 🔥 sincronizar SIEMPRE variables + UI
                    fechaInicioISO = torneo.fecha_inicio
                    fechaFinISO = torneo.fecha_fin

                    etFechaInicio.setText(fechaInicioISO)
                    etFechaFin.setText(fechaFinISO)

                    seleccionarItem(spCategoria, torneo.categoria)
                    seleccionarItem(spTipoTorneo, torneo.tipo_torneo)
                }

                override fun onFailure(call: Call<Torneo>, t: Throwable) {
                    Toast.makeText(this@EditarTorneoActivity, t.message, Toast.LENGTH_LONG).show()
                }
            })
    }

    // ================= ACTUALIZAR =================
    private fun actualizarTorneo() {

        if (
            etNombreTorneo.text.isEmpty() ||
            etCiudad.text.isEmpty() ||
            fechaInicioISO.isEmpty() ||
            fechaFinISO.isEmpty()
        ) {
            Toast.makeText(this, "Complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        val torneo = UpdateTorneoRequest(
            nombre_torneo = etNombreTorneo.text.toString(),
            categoria = spCategoria.selectedItem.toString(),
            tipo_torneo = spTipoTorneo.selectedItem.toString(),
            ciudad = etCiudad.text.toString(),
            fecha_inicio = fechaInicioISO,
            fecha_fin = fechaFinISO
        )

        val token = getSharedPreferences("app", MODE_PRIVATE)
            .getString("token", "") ?: ""

        ApiClient.instance.updateTorneo("Bearer $token", idTorneo, torneo)
            .enqueue(object : Callback<Void> {

                override fun onResponse(call: Call<Void>, response: Response<Void>) {

                    Toast.makeText(
                        this@EditarTorneoActivity,
                        if (response.isSuccessful) "Actualizado OK" else "Error ${response.code()}",
                        Toast.LENGTH_LONG
                    ).show()

                    if (response.isSuccessful) finish()
                }

                override fun onFailure(call: Call<Void>, t: Throwable) {
                    Toast.makeText(this@EditarTorneoActivity, t.message, Toast.LENGTH_LONG).show()
                }
            })
    }

    // ================= DATE PICKER (FIX REAL) =================
    private fun mostrarDatePicker(esInicio: Boolean) {

        val calendario = Calendar.getInstance()

        DatePickerDialog(
            this,
            { _, year, month, day ->

                // 🔥 SIEMPRE ISO (backend)
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

    private fun seleccionarItem(spinner: Spinner, valor: String) {
        for (i in 0 until spinner.count) {
            if (spinner.getItemAtPosition(i).toString() == valor) {
                spinner.setSelection(i)
                break
            }
        }
    }
}