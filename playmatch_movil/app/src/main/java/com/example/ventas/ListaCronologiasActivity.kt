package com.example.ventas.ui.cronologias

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.ventas.R
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Cronologia
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ListaCronologiasActivity : AppCompatActivity() {

    private lateinit var recycler: RecyclerView
    private lateinit var tvContador: TextView
    private lateinit var etBuscar: EditText
    private var listaCompleta: List<Cronologia> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lista_cronologias)

        recycler    = findViewById(R.id.recyclerCronologias)
        tvContador  = findViewById(R.id.tvContador)
        etBuscar    = findViewById(R.id.etBuscar)

        recycler.layoutManager = LinearLayoutManager(this)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        findViewById<Button>(R.id.btnAgregar).setOnClickListener {
            startActivity(Intent(this, CrearCronologiaActivity::class.java))
        }

        etBuscar.addTextChangedListener(object : android.text.TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun afterTextChanged(s: android.text.Editable?) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val texto = s.toString().trim()
                if (texto.isEmpty()) {
                    mostrarLista(listaCompleta)
                } else {
                    val filtrados = listaCompleta.filter {
                        (it.nombre_usuario ?: "").contains(texto, ignoreCase = true) ||
                                (it.apellido_usuario ?: "").contains(texto, ignoreCase = true) ||
                                (it.evento ?: "").contains(texto, ignoreCase = true) ||
                                (it.equipo_local ?: "").contains(texto, ignoreCase = true) ||
                                (it.equipo_visitante ?: "").contains(texto, ignoreCase = true)
                    }
                    mostrarLista(filtrados)
                }
            }
        })

        cargarCronologias()
    }

    override fun onResume() {
        super.onResume()
        cargarCronologias()
    }

    private fun cargarCronologias() {
        val token = getSharedPreferences("app", MODE_PRIVATE).getString("token", "") ?: ""

        ApiClient.instance.getCronologias("Bearer $token")
            .enqueue(object : Callback<List<Cronologia>> {
                override fun onResponse(call: Call<List<Cronologia>>, response: Response<List<Cronologia>>) {
                    if (response.isSuccessful) {
                        listaCompleta = response.body() ?: emptyList()
                        mostrarLista(listaCompleta)
                    } else {
                        Toast.makeText(this@ListaCronologiasActivity,
                            "❌ Error: ${response.code()}", Toast.LENGTH_SHORT).show()
                    }
                }
                override fun onFailure(call: Call<List<Cronologia>>, t: Throwable) {
                    Toast.makeText(this@ListaCronologiasActivity,
                        "❌ Error de conexión: ${t.message}", Toast.LENGTH_LONG).show()
                }
            })
    }

    private fun mostrarLista(lista: List<Cronologia>) {
        tvContador.text = "${lista.size} registros"
        recycler.adapter = CronologiaAdapter(lista.toMutableList()) {
            cargarCronologias()
        }
    }
}