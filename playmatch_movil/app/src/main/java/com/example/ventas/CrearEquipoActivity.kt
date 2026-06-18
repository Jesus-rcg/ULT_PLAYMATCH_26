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

class CrearEquipoActivity : AppCompatActivity() {

    private lateinit var etNombre: EditText
    private lateinit var etEscudo: EditText
    private lateinit var btnGuardar: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_crear_equipo)

        etNombre = findViewById(R.id.etNombreEquipo)
        etEscudo = findViewById(R.id.etEscudo)
        btnGuardar = findViewById(R.id.btnGuardar)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        btnGuardar.setOnClickListener {
            crearEquipo()
        }
    }

    private fun crearEquipo() {
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
        val idUsuario = prefs.getInt("id_usuario", 0)

        val equipo = Equipo(
            id_equipo = 0,
            id_usuario = idUsuario,
            escudo = escudo,
            nombre_equipo = nombre,
            activo = 1
        )

        ApiClient.instance.createEquipo(
            "Bearer $token",
            equipo
        ).enqueue(object : Callback<Equipo> {

            override fun onResponse(
                call: Call<Equipo>,
                response: Response<Equipo>
            ) {
                if (response.isSuccessful) {
                    Toast.makeText(
                        this@CrearEquipoActivity,
                        "✅ Equipo creado correctamente",
                        Toast.LENGTH_SHORT
                    ).show()
                    finish()
                } else {
                    Toast.makeText(
                        this@CrearEquipoActivity,
                        "❌ Error al crear el equipo: ${response.code()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<Equipo>, t: Throwable) {
                Toast.makeText(
                    this@CrearEquipoActivity,
                    "❌ Error de conexión: ${t.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }
}