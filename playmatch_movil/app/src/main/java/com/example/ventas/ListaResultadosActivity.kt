package com.example.ventas.ui.resultados

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.ventas.R
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Resultado
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ListaResultadosActivity : AppCompatActivity() {

    private lateinit var recyclerResultados: RecyclerView
    private lateinit var etBuscar: EditText
    private lateinit var btnBuscar: Button
    private var modo: String = "vertodos"

    // ✅ Lista completa para filtrar
    private var listaCompleta: List<Resultado> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lista_resultados)

        modo = intent.getStringExtra("MODO") ?: "vertodos"

        val tvSubtitulo = findViewById<TextView>(R.id.tvSubtitulo)
        when (modo) {
            "editar" -> tvSubtitulo.text = "Toca el lápiz para editar"
            "eliminar" -> tvSubtitulo.text = "Toca la basura para eliminar"
            "vertodos" -> tvSubtitulo.text = "Lista de todos los resultados"
        }

        recyclerResultados = findViewById(R.id.recyclerResultados)
        recyclerResultados.layoutManager = LinearLayoutManager(this)

        etBuscar = findViewById(R.id.etBuscar)
        btnBuscar = findViewById(R.id.btnBuscar)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        // ✅ Botón buscar por ID de encuentro
        btnBuscar.setOnClickListener {
            val texto = etBuscar.text.toString().trim()
            filtrarPorEncuentro(texto)
        }

        // ✅ Filtros de resultado
        findViewById<Button>(R.id.btnFiltroTodos).setOnClickListener {
            etBuscar.setText("")
            mostrarLista(listaCompleta)
        }
        findViewById<Button>(R.id.btnFiltroLocalGana).setOnClickListener {
            etBuscar.setText("")
            filtrarLocalGana()
        }
        findViewById<Button>(R.id.btnFiltroVisitanteGana).setOnClickListener {
            etBuscar.setText("")
            filtrarVisitanteGana()
        }
        findViewById<Button>(R.id.btnFiltroEmpate).setOnClickListener {
            etBuscar.setText("")
            filtrarEmpate()
        }

        cargarResultados()
    }

    override fun onResume() {
        super.onResume()
        cargarResultados()
    }

    private fun cargarResultados() {
        val prefs = getSharedPreferences("app", MODE_PRIVATE)
        val token = prefs.getString("token", "") ?: ""

        ApiClient.instance.getResultados(
            "Bearer $token"
        ).enqueue(object : Callback<List<Resultado>> {

            override fun onResponse(
                call: Call<List<Resultado>>,
                response: Response<List<Resultado>>
            ) {
                if (response.isSuccessful) {
                    listaCompleta = response.body() ?: emptyList()
                    mostrarLista(listaCompleta)
                } else {
                    Toast.makeText(
                        this@ListaResultadosActivity,
                        "❌ Error al cargar resultados: ${response.code()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<List<Resultado>>, t: Throwable) {
                Toast.makeText(
                    this@ListaResultadosActivity,
                    "❌ Error de conexión: ${t.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }

    // ✅ Filtra por ID de encuentro
    private fun filtrarPorEncuentro(texto: String) {
        if (texto.isEmpty()) {
            mostrarLista(listaCompleta)
            return
        }
        val filtrados = listaCompleta.filter {
            it.id_encuentro.toString().contains(texto)
        }
        if (filtrados.isEmpty()) {
            Toast.makeText(this, "No se encontraron resultados", Toast.LENGTH_SHORT).show()
        }
        mostrarLista(filtrados)
    }

    // ✅ Filtra donde local gana
    private fun filtrarLocalGana() {
        val filtrados = listaCompleta.filter {
            it.goles_local > it.goles_visitante
        }
        if (filtrados.isEmpty()) {
            Toast.makeText(this, "No hay resultados donde gana el local", Toast.LENGTH_SHORT).show()
        }
        mostrarLista(filtrados)
    }

    // ✅ Filtra donde visitante gana
    private fun filtrarVisitanteGana() {
        val filtrados = listaCompleta.filter {
            it.goles_visitante > it.goles_local
        }
        if (filtrados.isEmpty()) {
            Toast.makeText(this, "No hay resultados donde gana el visitante", Toast.LENGTH_SHORT).show()
        }
        mostrarLista(filtrados)
    }

    // ✅ Filtra empates
    private fun filtrarEmpate() {
        val filtrados = listaCompleta.filter {
            it.goles_local == it.goles_visitante
        }
        if (filtrados.isEmpty()) {
            Toast.makeText(this, "No hay empates", Toast.LENGTH_SHORT).show()
        }
        mostrarLista(filtrados)
    }

    // ✅ Muestra la lista en el RecyclerView
    private fun mostrarLista(lista: List<Resultado>) {
        val adapter = ResultadoAdapter(lista.toMutableList(), modo)
        recyclerResultados.adapter = adapter
    }
}