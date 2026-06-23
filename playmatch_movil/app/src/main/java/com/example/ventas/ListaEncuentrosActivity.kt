package com.example.ventas.ui.encuentros

import android.os.Bundle
import android.widget.*
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
    private lateinit var etBuscar: EditText
    private lateinit var btnBuscar: Button
    private var modo: String = "vertodos"

    // ✅ Lista completa para filtrar
    private var listaCompleta: List<Encuentro> = emptyList()

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

        etBuscar = findViewById(R.id.etBuscar)
        btnBuscar = findViewById(R.id.btnBuscar)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        // ✅ Botón buscar
        btnBuscar.setOnClickListener {
            val texto = etBuscar.text.toString().trim()
            filtrarPorTexto(texto)
        }

        // ✅ Filtros de estado
        findViewById<Button>(R.id.btnFiltroTodos).setOnClickListener {
            etBuscar.setText("")
            mostrarLista(listaCompleta)
        }
        findViewById<Button>(R.id.btnFiltroPendiente).setOnClickListener {
            filtrarPorEstado("Pendiente")
        }
        findViewById<Button>(R.id.btnFiltroJugando).setOnClickListener {
            filtrarPorEstado("Jugando")
        }
        findViewById<Button>(R.id.btnFiltroFinalizado).setOnClickListener {
            filtrarPorEstado("Finalizado")
        }
        findViewById<Button>(R.id.btnFiltroAplazado).setOnClickListener {
            filtrarPorEstado("Aplazado")
        }

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
                    listaCompleta = response.body() ?: emptyList()
                    mostrarLista(listaCompleta)
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

    // ✅ Filtra por texto en lugar o jornada
    private fun filtrarPorTexto(texto: String) {
        if (texto.isEmpty()) {
            mostrarLista(listaCompleta)
            return
        }
        val filtrados = listaCompleta.filter {
            it.lugar.contains(texto, ignoreCase = true) ||
                    it.jornada.toString().contains(texto)
        }
        if (filtrados.isEmpty()) {
            Toast.makeText(this, "No se encontraron encuentros", Toast.LENGTH_SHORT).show()
        }
        mostrarLista(filtrados)
    }

    // ✅ Filtra por estado
    private fun filtrarPorEstado(estado: String) {
        etBuscar.setText("")
        val filtrados = listaCompleta.filter {
            it.estado.equals(estado, ignoreCase = true)
        }
        if (filtrados.isEmpty()) {
            Toast.makeText(this, "No hay encuentros con estado: $estado", Toast.LENGTH_SHORT).show()
        }
        mostrarLista(filtrados)
    }

    // ✅ Muestra la lista en el RecyclerView
    private fun mostrarLista(lista: List<Encuentro>) {
        val adapter = EncuentroAdapter(lista.toMutableList(), modo)
        recyclerEncuentros.adapter = adapter
    }
}