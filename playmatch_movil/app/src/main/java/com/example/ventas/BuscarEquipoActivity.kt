package com.example.ventas.ui.equipos

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
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

class BuscarEquipoActivity : AppCompatActivity() {

    private lateinit var etBuscar: EditText
    private lateinit var btnBuscar: Button
    private lateinit var recyclerBusqueda: RecyclerView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_buscar_equipo)

        etBuscar = findViewById(R.id.etBuscar)
        btnBuscar = findViewById(R.id.btnBuscar)
        recyclerBusqueda = findViewById(R.id.recyclerBusqueda)
        recyclerBusqueda.layoutManager = LinearLayoutManager(this)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        btnBuscar.setOnClickListener {
            val texto = etBuscar.text.toString().trim()
            if (texto.isEmpty()) {
                etBuscar.error = "Ingresa un nombre para buscar"
                return@setOnClickListener
            }
            buscarEquipos(texto)
        }
    }

    private fun buscarEquipos(texto: String) {
        val prefs = getSharedPreferences("app", MODE_PRIVATE)
        val token = prefs.getString("token", "") ?: ""

        // Cargamos todos los equipos y filtramos por nombre
        ApiClient.instance.getEquipos(
            "Bearer $token"
        ).enqueue(object : Callback<List<Equipo>> {

            override fun onResponse(
                call: Call<List<Equipo>>,
                response: Response<List<Equipo>>
            ) {
                if (response.isSuccessful) {
                    val todos = response.body() ?: emptyList()

                    // Filtrar por nombre
                    val filtrados = todos.filter {
                        it.nombre_equipo.contains(texto, ignoreCase = true)
                    }

                    if (filtrados.isEmpty()) {
                        Toast.makeText(
                            this@BuscarEquipoActivity,
                            "No se encontraron equipos con ese nombre",
                            Toast.LENGTH_SHORT
                        ).show()
                    }

                    val adapter = EquipoAdapter(filtrados.toMutableList(), "vertodos")
                    recyclerBusqueda.adapter = adapter

                } else {
                    Toast.makeText(
                        this@BuscarEquipoActivity,
                        "❌ Error al buscar: ${response.code()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<List<Equipo>>, t: Throwable) {
                Toast.makeText(
                    this@BuscarEquipoActivity,
                    "❌ Error de conexión: ${t.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }
}