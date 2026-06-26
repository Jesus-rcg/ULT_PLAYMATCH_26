package com.example.ventas.ui.equipos

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
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
    private lateinit var tvContador: TextView
    private lateinit var etBuscar: EditText
    private var modo: String = "vertodos"
    private var listaCompleta: MutableList<Equipo> = mutableListOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lista_equipos)

        modo = intent.getStringExtra("MODO") ?: "vertodos"

        recyclerEquipos = findViewById(R.id.recyclerEquipos)
        tvContador = findViewById(R.id.tvContador)
        etBuscar = findViewById(R.id.etBuscar)

        recyclerEquipos.layoutManager = LinearLayoutManager(this)

        // Botón volver
        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        // Botón agregar
        findViewById<Button>(R.id.btnAgregar).setOnClickListener {
            startActivity(Intent(this, CrearEquipoActivity::class.java))
        }

        // Botón Inscribir
        findViewById<Button>(R.id.btnIrInscripcion).setOnClickListener {
            startActivity(Intent(this, InscribirEquipoActivity::class.java))
        }

        // Botón buscar
        findViewById<Button>(R.id.btnBuscar).setOnClickListener {
            val texto = etBuscar.text.toString().trim().lowercase()

            if (texto.isEmpty()) {
                mostrarEquipos(listaCompleta)
            } else {
                val filtrada = listaCompleta.filter {
                    it.nombre_equipo.lowercase().contains(texto)
                }.toMutableList()

                mostrarEquipos(filtrada)
            }
        }

        cargarEquipos()
    }

    override fun onResume() {
        super.onResume()
        cargarEquipos()
    }

    private fun cargarEquipos() {

        val prefs = getSharedPreferences("app", MODE_PRIVATE)
        val token = prefs.getString("token", "") ?: ""

        ApiClient.instance.getEquipos("Bearer $token")
            .enqueue(object : Callback<List<Equipo>> {

                override fun onResponse(
                    call: Call<List<Equipo>>,
                    response: Response<List<Equipo>>
                ) {

                    if (response.isSuccessful) {
                        listaCompleta =
                            (response.body() ?: emptyList()).toMutableList()

                        mostrarEquipos(listaCompleta)

                    } else {

                        Toast.makeText(
                            this@ListaEquiposActivity,
                            "Error al cargar equipos",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }

                override fun onFailure(
                    call: Call<List<Equipo>>,
                    t: Throwable
                ) {

                    Toast.makeText(
                        this@ListaEquiposActivity,
                        "Error: ${t.message}",
                        Toast.LENGTH_LONG
                    ).show()
                }
            })
    }

    private fun mostrarEquipos(lista: MutableList<Equipo>) {

        tvContador.text = "${lista.size} registros"

        val adapter = EquipoAdapter(lista, modo) {

            tvContador.text = "${lista.size} registros"

        }

        recyclerEquipos.adapter = adapter
    }
}