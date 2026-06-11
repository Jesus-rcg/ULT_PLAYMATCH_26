package com.example.ventas.ui

import android.os.Bundle
import android.widget.ImageButton
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
import android.widget.TextView

class ListaEquiposActivity : AppCompatActivity() {

    private lateinit var recyclerEquipos: RecyclerView
    private var modo: String = "vertodos"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lista_equipos)

        modo = intent.getStringExtra("MODO") ?: "vertodos"
        val txtSubtitulo = findViewById<TextView>(R.id.tvSubtitulo)
        when (modo) {
            "editar" -> txtSubtitulo.text = "Toca el lápiz para editar"
            "eliminar" -> txtSubtitulo.text = "Toca la basura para eliminar"
            "vertodos" -> txtSubtitulo.text = "Lista de todos los equipos"
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

        ApiClient.instance.getEquipos(
            "Bearer $token"
        ).enqueue(object : Callback<List<Equipo>> {

            override fun onResponse(call: Call<List<Equipo>>, response: Response<List<Equipo>>) {
                if (response.isSuccessful) {
                    val equipos = response.body() ?: emptyList()
                    val adapter = EquipoAdapter(equipos.toMutableList(), modo)
                    recyclerEquipos.adapter = adapter
                } else {
                    Toast.makeText(this@ListaEquiposActivity, "Error al cargar equipos", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<Equipo>>, t: Throwable) {
                Toast.makeText(this@ListaEquiposActivity, "Error de conexión", Toast.LENGTH_SHORT).show()
            }
        })
    }
}