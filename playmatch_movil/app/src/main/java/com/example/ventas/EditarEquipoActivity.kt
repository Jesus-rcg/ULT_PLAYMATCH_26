package com.example.ventas.ui.equipos

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.R
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Equipo
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EditarEquipoActivity : AppCompatActivity() {

    private lateinit var etNombre: EditText
    private lateinit var etEscudo: EditText
    private lateinit var btnActualizar: Button
    private var equipoId: Int = 0
    private var idUsuario: Int = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_editar_equipo)

        etNombre = findViewById(R.id.etNombreEditar)
        etEscudo = findViewById(R.id.etEscudoEditar)
        btnActualizar = findViewById(R.id.btnActualizar)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        // Recibir datos del equipo seleccionado
        equipoId = intent.getIntExtra("EQUIPO_ID", 0)
        idUsuario = intent.getIntExtra("EQUIPO_USUARIO", 0)
        etNombre.setText(intent.getStringExtra("EQUIPO_NOMBRE"))
        etEscudo.setText(intent.getStringExtra("EQUIPO_ESCUDO"))

        btnActualizar.setOnClickListener {
            actualizarEquipo()
        }
    }

    private fun actualizarEquipo() {
        val nombre = etNombre.text.toString().trim()
        val escudo = etEscudo.text.toString().trim()

        // Validar campos vacíos
        if (nombre.isEmpty()) {
            etNombre.error = "El nombre es obligatorio"
            return
        }
        if (escudo.isEmpty()) {
            etEscudo.error = "El escudo es obligatorio"
            return
        }

        val prefs = getSharedPreferences("app", MODE_PRIVATE)
        val token = prefs.getString("token", "") ?: ""

        val equipo = Equipo(
            id_equipo = equipoId,
            id_usuario = idUsuario,
            escudo = escudo,
            nombre_equipo = nombre,
            activo = 1
        )

        ApiClient.instance.updateEquipo(
            "Bearer $token",
            equipoId,
            equipo
        ).enqueue(object : Callback<Void> {

            override fun onResponse(
                call: Call<Void>,
                response: Response<Void>
            ) {
                if (response.isSuccessful) {
                    Toast.makeText(
                        this@EditarEquipoActivity,
                        "✅ Equipo actualizado correctamente",
                        Toast.LENGTH_SHORT
                    ).show()
                    finish()
                } else {
                    Toast.makeText(
                        this@EditarEquipoActivity,
                        "❌ Error al actualizar: ${response.code()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                Toast.makeText(
                    this@EditarEquipoActivity,
                    "❌ Error de conexión: ${t.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }
}