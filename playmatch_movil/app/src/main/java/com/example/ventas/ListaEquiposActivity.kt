package com.example.ventas.ui.equipos

import android.os.Bundle
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.ventas.R
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Equipo
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ListaEquiposActivity : AppCompatActivity() {

    private lateinit var recyclerEquipos: RecyclerView
    private var modo: String = "vertodos"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lista_equipos)

        modo = intent.getStringExtra("MODO") ?: "vertodos"

        val tvSubtitulo = findViewById<TextView>(R.id.tvSubtitulo)
        when (modo) {
            "editar" -> tvSubtitulo.text = "Toca el lápiz para editar"
            "eliminar" -> tvSubtitulo.text = "Toca la basura para eliminar"
            "vertodos" -> tvSubtitulo.text = "Lista de todos los equipos"
        }

        recyclerEquipos = findViewById(R.id.recyclerEquipos)
        recyclerEquipos.layoutManager = LinearLayoutManager(this)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        cargarEquipos()
    }

    override fun onResume() {
        super.onResume()
        cargarEquipos()
    }

    private fun cargarEquipos() {
        val prefs = getSharedPreferences("app", MODE_PRIVATE)
        val token = prefs.getString("token", "") ?: ""

        // ✅ Logs para ver qué está pasando
        android.util.Log.d("EQUIPOS", "Token: $token")
        android.util.Log.d("EQUIPOS", "Cargando equipos...")

        ApiClient.instance.getEquipos(
            "Bearer $token"
        ).enqueue(object : Callback<List<Equipo>> {

            override fun onResponse(
                call: Call<List<Equipo>>,
                response: Response<List<Equipo>>
            ) {
                // ✅ Logs para ver la respuesta
                android.util.Log.d("EQUIPOS", "Código respuesta: ${response.code()}")
                android.util.Log.d("EQUIPOS", "Body: ${response.body()}")
                android.util.Log.d("EQUIPOS", "Error body: ${response.errorBody()?.string()}")

                if (response.isSuccessful) {
                    val equipos = response.body() ?: emptyList()
                    android.util.Log.d("EQUIPOS", "Equipos recibidos: ${equipos.size}")
                    val adapter = EquipoAdapter(equipos.toMutableList(), modo)
                    recyclerEquipos.adapter = adapter
                } else {
                    Toast.makeText(
                        this@ListaEquiposActivity,
                        "❌ Error al cargar equipos: ${response.code()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<List<Equipo>>, t: Throwable) {
                // ✅ Log para ver el error de conexión
                android.util.Log.e("EQUIPOS", "Error de conexión: ${t.message}")
                Toast.makeText(
                    this@ListaEquiposActivity,
                    "❌ Error de conexión: ${t.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }
}