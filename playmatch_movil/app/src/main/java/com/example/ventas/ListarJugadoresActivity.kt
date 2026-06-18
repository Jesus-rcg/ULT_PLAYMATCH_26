    package com.example.ventas

    import android.content.Intent
    import android.os.Bundle
    import androidx.appcompat.app.AlertDialog
    import androidx.appcompat.app.AppCompatActivity
    import androidx.recyclerview.widget.LinearLayoutManager
    import androidx.recyclerview.widget.RecyclerView
    import com.example.ventas.adapter.JugadorAdapter
    import com.example.ventas.api.ApiClient
    import com.example.ventas.model.Jugador
    import com.google.android.material.floatingactionbutton.FloatingActionButton
    import retrofit2.Call
    import retrofit2.Callback
    import retrofit2.Response

    class ListarJugadoresActivity : AppCompatActivity() {

        private lateinit var rvJugadores: RecyclerView
        private lateinit var fabAgregar: FloatingActionButton
        private lateinit var adapter: JugadorAdapter

        private val listaJugadores = mutableListOf<Jugador>()

        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            setContentView(R.layout.activity_listar_jugadores)

            rvJugadores = findViewById(R.id.rvJugadores)
            fabAgregar = findViewById(R.id.fabAgregar)

            rvJugadores.layoutManager = LinearLayoutManager(this)

            adapter = JugadorAdapter(listaJugadores) { jugador ->
                mostrarOpciones(jugador)
            }

            rvJugadores.adapter = adapter

            cargarJugadores()

            fabAgregar.setOnClickListener {
                startActivity(
                    Intent(this, CrearJugadorActivity::class.java)
                )
            }
        }

        override fun onResume() {
            super.onResume()
            cargarJugadores()
        }

        private fun cargarJugadores() {

            val token = getSharedPreferences("app", MODE_PRIVATE)
                .getString("token", null)

            android.util.Log.d("JUGADORES", "TOKEN: $token")

            if (token == null) {
                android.util.Log.d("JUGADORES", "TOKEN NULL")
                return
            }

            ApiClient.instance
                .getJugadores("Bearer $token")
                .enqueue(object : Callback<List<Jugador>> {

                    override fun onResponse(
                        call: Call<List<Jugador>>,
                        response: Response<List<Jugador>>
                    ) {

                        android.util.Log.d(
                            "JUGADORES",
                            "CODIGO HTTP: ${response.code()}"
                        )

                        android.util.Log.d(
                            "JUGADORES",
                            "BODY: ${response.body()}"
                        )

                        if (response.isSuccessful) {

                            listaJugadores.clear()

                            response.body()?.let {
                                listaJugadores.addAll(it)
                            }

                            android.util.Log.d(
                                "JUGADORES",
                                "TOTAL JUGADORES: ${listaJugadores.size}"
                            )

                            adapter.notifyDataSetChanged()

                        } else {

                            android.util.Log.d(
                                "JUGADORES",
                                "ERROR HTTP: ${response.code()}"
                            )
                        }
                    }

                    override fun onFailure(
                        call: Call<List<Jugador>>,
                        t: Throwable
                    ) {

                        android.util.Log.e(
                            "JUGADORES",
                            "ERROR: ${t.message}"
                        )
                    }
                })
        }

        private fun mostrarOpciones(jugador: Jugador) {

            AlertDialog.Builder(this)
                .setTitle("Jugador")
                .setItems(arrayOf("Editar", "Eliminar")) { _, which ->

                    when (which) {

                        0 -> {

                            val intent = Intent(
                                this,
                                EditarJugadorActivity::class.java
                            )

                            intent.putExtra(
                                "id_jugador",
                                jugador.id_jugador
                            )

                            startActivity(intent)
                        }

                        1 -> {
                            confirmarEliminar(jugador)
                        }
                    }
                }
                .show()
        }

        private fun confirmarEliminar(jugador: Jugador) {

            AlertDialog.Builder(this)
                .setTitle("Eliminar")
                .setMessage("¿Deseas eliminar este jugador?")
                .setPositiveButton("Sí") { _, _ ->

                    listaJugadores.remove(jugador)
                    adapter.notifyDataSetChanged()

                    // Aquí después conectaremos el endpoint eliminarJugador()
                }
                .setNegativeButton("No", null)
                .show()
        }
    }