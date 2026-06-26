package com.example.ventas.ui.cronologias

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.R
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Cronologia
import com.example.ventas.model.Encuentro
import com.example.ventas.model.JugadorEncuentro
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CrearCronologiaActivity : AppCompatActivity() {

    private lateinit var spEncuentro: Spinner
    private lateinit var spJugador: Spinner
    private lateinit var spEvento: Spinner
    private lateinit var etMinuto: EditText

    private var listaEncuentros: List<Encuentro> = emptyList()
    private var listaJugadores: List<JugadorEncuentro> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_crear_cronologia)

        spEncuentro = findViewById(R.id.spEncuentro)
        spJugador   = findViewById(R.id.spJugador)
        spEvento    = findViewById(R.id.spEvento)
        etMinuto    = findViewById(R.id.etMinuto)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        // Spinner Evento fijo
        val eventos = listOf("Seleccionar evento", "Gol", "Amarilla", "Roja")
        spEvento.adapter = ArrayAdapter(this,
            android.R.layout.simple_spinner_dropdown_item, eventos)

        cargarEncuentros()

        // Cuando cambia el encuentro carga los jugadores
        spEncuentro.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: android.view.View?, pos: Int, id: Long) {
                if (pos > 0) {
                    val encuentro = listaEncuentros[pos - 1]
                    cargarJugadores(encuentro.id_encuentro)
                } else {
                    spJugador.adapter = ArrayAdapter(this@CrearCronologiaActivity,
                        android.R.layout.simple_spinner_dropdown_item,
                        listOf("Primero selecciona un encuentro"))
                }
            }
            override fun onNothingSelected(parent: AdapterView<*>) {}
        }

        findViewById<Button>(R.id.btnGuardar).setOnClickListener {
            guardar()
        }
    }

    private fun cargarEncuentros() {
        val token = getSharedPreferences("app", MODE_PRIVATE).getString("token", "") ?: ""

        ApiClient.instance.getEncuentros("Bearer $token")
            .enqueue(object : Callback<List<Encuentro>> {
                override fun onResponse(call: Call<List<Encuentro>>, response: Response<List<Encuentro>>) {
                    if (response.isSuccessful) {
                        listaEncuentros = response.body() ?: emptyList()
                        val opciones = mutableListOf("Seleccionar encuentro")
                        listaEncuentros.forEach {
                            opciones.add("${it.equipo_local} vs ${it.equipo_visitante}")
                        }
                        spEncuentro.adapter = ArrayAdapter(this@CrearCronologiaActivity,
                            android.R.layout.simple_spinner_dropdown_item, opciones)
                    }
                }
                override fun onFailure(call: Call<List<Encuentro>>, t: Throwable) {
                    Toast.makeText(this@CrearCronologiaActivity,
                        "❌ Error cargando encuentros", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun cargarJugadores(idEncuentro: Int) {
        val token = getSharedPreferences("app", MODE_PRIVATE).getString("token", "") ?: ""

        ApiClient.instance.getJugadoresByEncuentro("Bearer $token", idEncuentro)
            .enqueue(object : Callback<List<JugadorEncuentro>> {
                override fun onResponse(call: Call<List<JugadorEncuentro>>, response: Response<List<JugadorEncuentro>>) {
                    if (response.isSuccessful) {
                        listaJugadores = response.body() ?: emptyList()
                        val opciones = mutableListOf("Seleccionar jugador")
                        listaJugadores.forEach {
                            opciones.add("${it.nombre_usuario} ${it.apellido_usuario} - ${it.nombre_equipo}")
                        }
                        spJugador.adapter = ArrayAdapter(this@CrearCronologiaActivity,
                            android.R.layout.simple_spinner_dropdown_item, opciones)
                    }
                }
                override fun onFailure(call: Call<List<JugadorEncuentro>>, t: Throwable) {
                    Toast.makeText(this@CrearCronologiaActivity,
                        "❌ Error cargando jugadores", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun guardar() {
        val posEncuentro = spEncuentro.selectedItemPosition
        val posJugador   = spJugador.selectedItemPosition
        val posEvento    = spEvento.selectedItemPosition
        val minuto       = etMinuto.text.toString().trim()

        if (posEncuentro == 0) {
            Toast.makeText(this, "Selecciona un encuentro", Toast.LENGTH_SHORT).show(); return
        }
        if (posJugador == 0) {
            Toast.makeText(this, "Selecciona un jugador", Toast.LENGTH_SHORT).show(); return
        }
        if (posEvento == 0) {
            Toast.makeText(this, "Selecciona un evento", Toast.LENGTH_SHORT).show(); return
        }
        if (minuto.isEmpty()) {
            Toast.makeText(this, "Ingresa el minuto", Toast.LENGTH_SHORT).show(); return
        }

        val cronologia = Cronologia(
            id_encuentro = listaEncuentros[posEncuentro - 1].id_encuentro,
            id_jugador   = listaJugadores[posJugador - 1].id_jugador,
            evento       = spEvento.selectedItem.toString(),
            minuto       = minuto.toInt()
        )

        val token = getSharedPreferences("app", MODE_PRIVATE).getString("token", "") ?: ""

        ApiClient.instance.createCronologia("Bearer $token", cronologia)
            .enqueue(object : Callback<Cronologia> {
                override fun onResponse(call: Call<Cronologia>, response: Response<Cronologia>) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@CrearCronologiaActivity,
                            "✅ Cronología creada correctamente", Toast.LENGTH_LONG).show()
                        setResult(RESULT_OK)
                        finish()
                    } else {
                        Toast.makeText(this@CrearCronologiaActivity,
                            "❌ Error ${response.code()}", Toast.LENGTH_LONG).show()
                    }
                }
                override fun onFailure(call: Call<Cronologia>, t: Throwable) {
                    Toast.makeText(this@CrearCronologiaActivity,
                        "❌ Error de conexión: ${t.message}", Toast.LENGTH_LONG).show()
                }
            })
    }
}