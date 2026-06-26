package com.example.ventas

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.View
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.ventas.adapter.JugadorAdapter
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Jugador
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class JugadoresActivity : AppCompatActivity() {

    private lateinit var recycler: RecyclerView
    private lateinit var txtContador: TextView
    private lateinit var progressBar: ProgressBar
    private lateinit var edtBuscar: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_jugadores)

        recycler = findViewById(R.id.recyclerJugadores)
        txtContador = findViewById(R.id.txtContadorJugadores)
        progressBar = findViewById(R.id.progressBar)
        edtBuscar = findViewById(R.id.edtBuscar)

        val fabAgregar =
            findViewById<com.google.android.material.floatingactionbutton.FloatingActionButton>(
                R.id.fabAgregar
            )

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        fabAgregar.setOnClickListener {
            startActivity(
                Intent(
                    this,
                    CrearJugadorActivity::class.java
                )
            )
        }

        recycler.layoutManager = LinearLayoutManager(this)

        cargarJugadores()
    }

    override fun onResume() {
        super.onResume()
        cargarJugadores()
    }

    private fun cargarJugadores() {

        val token = getSharedPreferences("app", MODE_PRIVATE)
            .getString("token", "") ?: ""

        progressBar.visibility = View.VISIBLE

        ApiClient.instance.getJugadores("Bearer $token")
            .enqueue(object : Callback<List<Jugador>> {

                override fun onResponse(
                    call: Call<List<Jugador>>,
                    response: Response<List<Jugador>>
                ) {

                    progressBar.visibility = View.GONE

                    if (!response.isSuccessful) {

                        Toast.makeText(
                            this@JugadoresActivity,
                            "Error ${response.code()}",
                            Toast.LENGTH_LONG
                        ).show()

                        Log.e(
                            "API_JUGADORES",
                            response.errorBody()?.string() ?: ""
                        )

                        return
                    }

                    val lista = response.body() ?: emptyList()

                    txtContador.text =
                        "${lista.size} registros"

                    recycler.adapter = JugadorAdapter(
                        lista,
                        onEditar = { jugador ->
                            abrirEditar(jugador)
                        },
                        onEliminar = { jugador ->
                            confirmarEliminar(jugador)
                        }
                    )

                    edtBuscar.addTextChangedListener(object : TextWatcher {

                        override fun beforeTextChanged(
                            s: CharSequence?,
                            start: Int,
                            count: Int,
                            after: Int
                        ) {
                        }

                        override fun afterTextChanged(s: Editable?) {}

                        override fun onTextChanged(
                            s: CharSequence?,
                            start: Int,
                            before: Int,
                            count: Int
                        ) {

                            val texto =
                                s.toString().lowercase().trim()

                            val filtrada =
                                if (texto.isEmpty()) {
                                    lista
                                } else {
                                    lista.filter {
                                        it.posicion.lowercase()
                                            .contains(texto) ||
                                                it.activo
                                                    .toString()
                                                    .contains(texto) ||
                                                it.numero_camiseta
                                                    .toString()
                                                        .contains(texto)

                                    }
                                }

                            txtContador.text =
                                "${filtrada.size} registros"

                            recycler.adapter = JugadorAdapter(
                                filtrada,
                                onEditar = { jugador ->
                                    abrirEditar(jugador)
                                },
                                onEliminar = { jugador ->
                                    confirmarEliminar(jugador)
                                }
                            )
                        }
                    })
                }

                override fun onFailure(
                    call: Call<List<Jugador>>,
                    t: Throwable
                ) {

                    progressBar.visibility = View.GONE

                    Toast.makeText(
                        this@JugadoresActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()

                    Log.e(
                        "API_JUGADORES",
                        t.message ?: "Error"
                    )
                }
            })
    }

    private fun confirmarEliminar(jugador: Jugador) {

        AlertDialog.Builder(this)
            .setTitle("Eliminar jugador")
            .setMessage("¿Seguro que deseas eliminar a ${jugador.posicion}?")
            .setPositiveButton("Eliminar") { _, _ ->
                eliminarJugador(jugador.id_jugador ?: 0)
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }

    private fun eliminarJugador(id: Int) {

        val token = getSharedPreferences("app", MODE_PRIVATE)
            .getString("token", "") ?: ""

        ApiClient.instance.eliminarJugador(
            "Bearer $token",
            id
        ).enqueue(object : Callback<Void> {

            override fun onResponse(
                call: Call<Void>,
                response: Response<Void>
            ) {

                if (response.isSuccessful) {

                    Toast.makeText(
                        this@JugadoresActivity,
                        "Jugador eliminado",
                        Toast.LENGTH_SHORT
                    ).show()

                    cargarJugadores()
                } else {

                    Toast.makeText(
                        this@JugadoresActivity,
                        "Error al eliminar",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(
                call: Call<Void>,
                t: Throwable
            ) {

                Toast.makeText(
                    this@JugadoresActivity,
                    t.message,
                    Toast.LENGTH_SHORT
                ).show()
            }
        })
    }

    private fun abrirEditar(jugador: Jugador) {

        val intent =
            Intent(
                this,
                EditarJugadorActivity::class.java
            )

        intent.putExtra(
            "id_jugador",
            jugador.id_jugador ?: 0
        )

        startActivity(intent)
    }
}