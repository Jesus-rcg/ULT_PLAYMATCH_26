package com.example.ventas.ui

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
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

    private lateinit var recyclerBuscar: RecyclerView
    private lateinit var etBuscar: EditText
    private var listaCompleta: List<Equipo> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_buscar_equipo)

        recyclerBuscar = findViewById(R.id.recyclerBuscar)
        recyclerBuscar.layoutManager = LinearLayoutManager(this)
        etBuscar = findViewById(R.id.etBuscar)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        cargarEquipos()

        etBuscar.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                filtrar(s.toString())
            }
            override fun afterTextChanged(s: Editable?) {}
        })
    }

    private fun cargarEquipos() {
        val prefs = getSharedPreferences("app", MODE_PRIVATE)
        val token = prefs.getString("token", "") ?: ""

        ApiClient.instance.getEquipos(
            "Bearer $token"
        ).enqueue(object : Callback<List<Equipo>> {

            override fun onResponse(call: Call<List<Equipo>>, response: Response<List<Equipo>>) {
                if (response.isSuccessful) {
                    listaCompleta = response.body() ?: emptyList()
                    mostrarLista(listaCompleta)
                } else {
                    Toast.makeText(this@BuscarEquipoActivity, "Error al cargar equipos", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<Equipo>>, t: Throwable) {
                Toast.makeText(this@BuscarEquipoActivity, "Error de conexión", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun filtrar(texto: String) {
        val listaFiltrada = if (texto.isEmpty()) {
            listaCompleta
        } else {
            listaCompleta.filter {
                it.nombre.contains(texto, ignoreCase = true) ||
                        it.id_equipo.toString().contains(texto)
            }
        }
        mostrarLista(listaFiltrada)
    }

    private fun mostrarLista(lista: List<Equipo>) {
        val adapter = EquipoAdapter(lista.toMutableList(), "vertodos")
        recyclerBuscar.adapter = adapter
    }
}