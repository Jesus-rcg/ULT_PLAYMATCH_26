package com.example.ventas.ui.encuentros

import android.os.Bundle
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.ventas.R
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Encuentro
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ListaEncuentrosActivity : AppCompatActivity() {

    private lateinit var recyclerEncuentros: RecyclerView
    private var modo: String = "vertodos"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lista_encuentros)

        modo = intent.getStringExtra("MODO") ?: "vertodos"

        val tvSubtitulo = findViewById<TextView>(R.id.tvSubtitulo)
        when (modo) {
            "editar" -> tvSubtitulo.text = "Toca el lápiz para editar"
            "eliminar" -> tvSubtitulo.text = "Toca la basura para eliminar"
            "vertodos" -> tvSubtitulo.text = "Lista de todos los encuentros"
        }

        recyclerEncuentros = findViewById(R.id.recyclerEncuentros)
        recyclerEncuentros.layoutManager = LinearLayoutManager(this)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        cargarEncuentros()
    }

    override fun onResume() {
        super.onResume()
        cargarEncuentros()
    }

    private fun cargarEncuentros() {
        val prefs = getSharedPreferences("app", MODE_PRIVATE)
        val token = prefs.getString("token", "") ?: ""

        ApiClient.instance.getEncuentros(
            "Bearer $token"
        ).enqueue(object : Callback<List<Encuentro>> {

            override fun onResponse(
                call: Call<List<Encuentro>>,
                response: Response<List<Encuentro>>
            ) {
                if (response.isSuccessful) {
                    val encuentros = response.body() ?: emptyList()
                    val adapter = EncuentroAdapter(encuentros.toMutableList(), modo)
                    recyclerEncuentros.adapter = adapter
                } else {
                    Toast.makeText(
                        this@ListaEncuentrosActivity,
                        "❌ Error al cargar encuentros: ${response.code()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<List<Encuentro>>, t: Throwable) {
                Toast.makeText(
                    this@ListaEncuentrosActivity,
                    "❌ Error de conexión: ${t.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }
}