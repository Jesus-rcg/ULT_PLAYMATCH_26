package com.example.ventas.ui

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.R
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Equipo
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import android.widget.ImageButton

class EditarEquipoActivity : AppCompatActivity() {

    private lateinit var etNombre: EditText
    private lateinit var etEntrenador: EditText
    private lateinit var btnActualizar: Button
    private var equipoId: Int = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_editar_equipo)

        etNombre = findViewById(R.id.etNombreEditar)
        etEntrenador = findViewById(R.id.etEntrenadorEditar)
        btnActualizar = findViewById(R.id.btnActualizar)
        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        // Recibe los datos del equipo que se tocó en la lista
        equipoId = intent.getIntExtra("EQUIPO_ID", 0)
        etNombre.setText(intent.getStringExtra("EQUIPO_NOMBRE"))
        etEntrenador.setText(intent.getStringExtra("EQUIPO_ENTRENADOR"))

        btnActualizar.setOnClickListener {
            actualizarEquipo()
        }
    }

    private fun actualizarEquipo() {

        val equipo = Equipo(
            id_equipo = equipoId,
            id_torneo = 1,
            nombre = etNombre.text.toString(),
            entrenador = etEntrenador.text.toString()
        )

        val prefs = getSharedPreferences("app", MODE_PRIVATE)
        val token = prefs.getString("token", "") ?: ""

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
                        "Equipo actualizado correctamente",
                        Toast.LENGTH_SHORT
                    ).show()
                    finish()
                } else {
                    Toast.makeText(
                        this@EditarEquipoActivity,
                        "Error al actualizar",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                Toast.makeText(
                    this@EditarEquipoActivity,
                    "Error de conexión",
                    Toast.LENGTH_SHORT
                ).show()
            }
        })
    }
}