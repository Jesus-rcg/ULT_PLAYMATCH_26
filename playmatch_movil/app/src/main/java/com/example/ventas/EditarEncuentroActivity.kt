package com.example.ventas.ui.encuentros

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.R
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Encuentro
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EditarEncuentroActivity : AppCompatActivity() {

    private lateinit var etJornada: EditText
    private lateinit var etLugar: EditText
    private lateinit var etFecha: EditText
    private lateinit var etHora: EditText
    private lateinit var spinnerEstado: Spinner
    private lateinit var btnActualizar: Button

    private var encuentroId: Int = 0
    private var idTorneo: Int = 0
    private var idLocal: Int = 0
    private var idVisitante: Int = 0
    private var estadoSeleccionado: String = "Pendiente"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_editar_encuentro)

        etJornada = findViewById(R.id.etJornadaEditar)
        etLugar = findViewById(R.id.etLugarEditar)
        etFecha = findViewById(R.id.etFechaEditar)
        etHora = findViewById(R.id.etHoraEditar)
        spinnerEstado = findViewById(R.id.spinnerEstadoEditar)
        btnActualizar = findViewById(R.id.btnActualizar)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        // Recibir datos del encuentro
        encuentroId = intent.getIntExtra("ENCUENTRO_ID", 0)
        idTorneo = intent.getIntExtra("ENCUENTRO_TORNEO", 0)
        idLocal = intent.getIntExtra("ENCUENTRO_LOCAL", 0)
        idVisitante = intent.getIntExtra("ENCUENTRO_VISITANTE", 0)
        estadoSeleccionado = intent.getStringExtra("ENCUENTRO_ESTADO") ?: "Pendiente"

        etJornada.setText(intent.getIntExtra("ENCUENTRO_JORNADA", 0).toString())
        etLugar.setText(intent.getStringExtra("ENCUENTRO_LUGAR"))
        etFecha.setText(intent.getStringExtra("ENCUENTRO_FECHA"))
        etHora.setText(intent.getStringExtra("ENCUENTRO_HORA"))

        // Cargar estados
        val estados = listOf("Pendiente", "Jugando", "Finalizado", "Aplazado")
        val estadoAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, estados)
        estadoAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinnerEstado.adapter = estadoAdapter

        // Seleccionar el estado actual
        val index = estados.indexOf(estadoSeleccionado)
        if (index >= 0) spinnerEstado.setSelection(index)

        spinnerEstado.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: android.view.View?, position: Int, id: Long) {
                estadoSeleccionado = estados[position]
            }
            override fun onNothingSelected(parent: AdapterView<*>) {}
        }

        btnActualizar.setOnClickListener { actualizarEncuentro() }
    }

    private fun actualizarEncuentro() {
        val jornada = etJornada.text.toString().trim()
        val lugar = etLugar.text.toString().trim()
        val fecha = etFecha.text.toString().trim()
        val hora = etHora.text.toString().trim()

        if (jornada.isEmpty()) { etJornada.error = "La jornada es obligatoria"; return }
        if (lugar.isEmpty()) { etLugar.error = "El lugar es obligatorio"; return }
        if (fecha.isEmpty()) { etFecha.error = "La fecha es obligatoria"; return }
        if (hora.isEmpty()) { etHora.error = "La hora es obligatoria"; return }

        val prefs = getSharedPreferences("app", MODE_PRIVATE)
        val token = prefs.getString("token", "") ?: ""

        val encuentro = Encuentro(
            id_encuentro = encuentroId,
            id_torneo = idTorneo,
            id_equipo_local = idLocal,
            id_equipo_visitante = idVisitante,
            jornada = jornada.toInt(),
            lugar = lugar,
            fecha = fecha,
            hora = hora,
            estado = estadoSeleccionado,
            activo = 1
        )

        ApiClient.instance.updateEncuentro(
            "Bearer $token",
            encuentroId,
            encuentro
        ).enqueue(object : Callback<Void> {

            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    Toast.makeText(
                        this@EditarEncuentroActivity,
                        "✅ Encuentro actualizado correctamente",
                        Toast.LENGTH_SHORT
                    ).show()
                    finish()
                } else {
                    Toast.makeText(
                        this@EditarEncuentroActivity,
                        "❌ Error al actualizar: ${response.code()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                Toast.makeText(
                    this@EditarEncuentroActivity,
                    "❌ Error de conexión: ${t.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }
}