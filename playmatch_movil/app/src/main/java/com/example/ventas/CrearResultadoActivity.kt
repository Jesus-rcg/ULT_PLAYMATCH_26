package com.example.ventas

import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Encuentro
import com.example.ventas.model.Resultado
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CrearResultadoActivity : AppCompatActivity() {

    private lateinit var spinnerEncuentro: Spinner

    private val listaEncuentros = mutableListOf<Encuentro>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_crear_resultado)

        findViewById<ImageButton>(R.id.btnVolver)
            .setOnClickListener { finish() }

        spinnerEncuentro = findViewById(R.id.spEncuentro)

        cargarEncuentros()

        findViewById<Button>(R.id.btnGuardar).setOnClickListener {

            val golesLocal =
                findViewById<EditText>(R.id.etGolesLocal)
                    .text.toString().trim()

            val golesVisitante =
                findViewById<EditText>(R.id.etGolesVisitante)
                    .text.toString().trim()

            if (golesLocal.isEmpty()) {
                Toast.makeText(
                    this,
                    "Ingrese los goles del local",
                    Toast.LENGTH_SHORT
                ).show()
                return@setOnClickListener
            }

            if (golesVisitante.isEmpty()) {
                Toast.makeText(
                    this,
                    "Ingrese los goles del visitante",
                    Toast.LENGTH_SHORT
                ).show()
                return@setOnClickListener
            }

            if (listaEncuentros.isEmpty()) {
                Toast.makeText(
                    this,
                    "No hay encuentros disponibles",
                    Toast.LENGTH_SHORT
                ).show()
                return@setOnClickListener
            }

            val posicion = spinnerEncuentro.selectedItemPosition

            if (posicion == 0) {
                Toast.makeText(
                    this,
                    "Selecciona un encuentro",
                    Toast.LENGTH_SHORT
                ).show()
                return@setOnClickListener
            }

            val encuentroSeleccionado =
                listaEncuentros[posicion - 1]

            val resultado = Resultado(
                id_encuentro = encuentroSeleccionado.id_encuentro,
                goles_local = golesLocal.toInt(),
                goles_visitante = golesVisitante.toInt()
            )

            val token = getSharedPreferences(
                "app",
                MODE_PRIVATE
            ).getString("token", "") ?: ""

            ApiClient.instance.createResultado(
                "Bearer $token",
                resultado
            ).enqueue(object : Callback<Resultado> {

                override fun onResponse(
                    call: Call<Resultado>,
                    response: Response<Resultado>
                ) {

                    if (response.isSuccessful) {

                        Toast.makeText(
                            this@CrearResultadoActivity,
                            "Resultado creado correctamente",
                            Toast.LENGTH_LONG
                        ).show()

                        setResult(RESULT_OK)
                        finish()

                    } else {

                        Toast.makeText(
                            this@CrearResultadoActivity,
                            "Error ${response.code()}",
                            Toast.LENGTH_LONG
                        ).show()

                        Log.e(
                            "API ERROR",
                            response.errorBody()?.string()
                                ?: "Error desconocido"
                        )
                    }
                }

                override fun onFailure(
                    call: Call<Resultado>,
                    t: Throwable
                ) {

                    Toast.makeText(
                        this@CrearResultadoActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()

                    Log.e(
                        "API ERROR",
                        t.message.toString()
                    )
                }
            })
        }
    }

    private fun cargarEncuentros() {

        val token = getSharedPreferences(
            "app",
            MODE_PRIVATE
        ).getString("token", "") ?: ""

        ApiClient.instance.getEncuentros(
            "Bearer $token"
        ).enqueue(object : Callback<List<Encuentro>> {

            override fun onResponse(
                call: Call<List<Encuentro>>,
                response: Response<List<Encuentro>>
            ) {

                if (response.isSuccessful) {

                    listaEncuentros.clear()

                    listaEncuentros.addAll(
                        response.body() ?: emptyList()
                    )

                    val opciones = mutableListOf<String>()

                    opciones.add("Seleccionar encuentro")

                    listaEncuentros.forEach {

                        opciones.add(
                            "${it.equipo_local} vs ${it.equipo_visitante}"
                        )
                    }

                    spinnerEncuentro.adapter =
                        ArrayAdapter(
                            this@CrearResultadoActivity,
                            android.R.layout.simple_spinner_dropdown_item,
                            opciones
                        )
                }
            }

            override fun onFailure(
                call: Call<List<Encuentro>>,
                t: Throwable
            ) {

                Toast.makeText(
                    this@CrearResultadoActivity,
                    t.message,
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }

}
