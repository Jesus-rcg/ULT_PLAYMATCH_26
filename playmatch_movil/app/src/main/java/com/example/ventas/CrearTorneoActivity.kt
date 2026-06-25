package com.example.ventas


import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Spinner
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Torneo
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CrearTorneoActivity : AppCompatActivity() {

    private lateinit var spEstados: Spinner
    private lateinit var spTipoTorneo: Spinner
    private lateinit var spCategoria: Spinner

    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_crear_torneo)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        spEstados = findViewById(R.id.spEstados)
        cargarEstados()

        val txtNombre = findViewById<EditText>(R.id.txtNombreTorneo)
        val txtFecha_inicio = findViewById<EditText>(R.id.txtFecha_inicio)
        val txtFecha_fin = findViewById<EditText>(R.id.txtFecha_fin)
        val btnGuardarTorneo = findViewById<Button>(R.id.btnGuardarTorneo)

        btnGuardarTorneo.setOnClickListener {
            val nombre = txtNombre.text.toString().trim()
            val fecha_inicio = txtFecha_inicio.text.toString().trim()
            val fecha_fin = txtFecha_fin.text.toString().trim()
            val estado = spEstados.selectedItem.toString()

            if (nombre.isEmpty()) { txtNombre.error = "El nombre es obligatorio"; return@setOnClickListener }
            if (fecha_inicio.isEmpty()) { txtFecha_inicio.error = "La fecha inicio es obligatoria"; return@setOnClickListener }
            if (fecha_fin.isEmpty()) { txtFecha_fin.error = "La fecha fin es obligatoria"; return@setOnClickListener }

            val prefs = getSharedPreferences("app", MODE_PRIVATE)
            val token = prefs.getString("token", "") ?: ""
            val idUsuario = prefs.getInt("id_usuario", 0)

            val torneo = Torneo(
                id_torneo = null,
                id_usuario = idUsuario,
                nombre_torneo = nombre,
                categoria = "",
                tipo_torneo = "",
                ciudad = "",
                fecha_inicio = fecha_inicio,
                fecha_fin = fecha_fin,
                estado = estado,
                activo = 1
            )

            ApiClient.instance.createTorneo(
                "Bearer $token",
                torneo
            ).enqueue(object : Callback<Torneo> {

                override fun onResponse(call: Call<Torneo>, response: Response<Torneo>) {
                    if (response.isSuccessful) {
                        Toast.makeText(
                            this@CrearTorneoActivity,
                            "✅ Torneo guardado correctamente",
                            Toast.LENGTH_LONG
                        ).show()
                        txtNombre.text.clear()
                        txtFecha_inicio.text.clear()
                        txtFecha_fin.text.clear()
                        spEstados.setSelection(0)
                    } else {
                        Toast.makeText(
                            this@CrearTorneoActivity,
                            "❌ Error ${response.code()}",
                            Toast.LENGTH_LONG
                        ).show()
                        Log.e("API_ERROR", response.errorBody()?.string() ?: "Error desconocido")
                    }
                }

                override fun onFailure(call: Call<Torneo>, t: Throwable) {
                    Toast.makeText(
                        this@CrearTorneoActivity,
                        "❌ Error de conexión: ${t.message}",
                        Toast.LENGTH_LONG
                    ).show()
                    Log.e("API_ERROR", t.message.toString())
                }
            })
        }
    }

    private fun cargarEstados() {
        val estados = listOf(
            "Inscripciones Abiertas",
            "Comenzo",
            "Finalizado"
        )
        val adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            estados
        )
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spEstados.adapter = adapter
    }
}
