package com.example.ventas

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.ventas.adapter.JugadorAdapter
import com.example.ventas.model.Jugador
import com.google.android.material.floatingactionbutton.FloatingActionButton

class ListarJugadoresActivity : AppCompatActivity() {

    private lateinit var rvJugadores: RecyclerView
    private lateinit var fabAgregar: FloatingActionButton

    private val listaJugadores = mutableListOf(
        Jugador(1, 1, "Portero", 1, 1),
        Jugador(2, 1, "Defensa", 4, 1),
        Jugador(3, 1, "Delantero", 9, 1)
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_listar_jugadores)

        rvJugadores = findViewById(R.id.rvJugadores)
        fabAgregar = findViewById(R.id.fabAgregar)

        rvJugadores.layoutManager = LinearLayoutManager(this)

        rvJugadores.adapter = JugadorAdapter(listaJugadores) { jugador ->
            mostrarOpciones(jugador)
        }

        fabAgregar.setOnClickListener {

            // Abrir activity para crear jugador
            startActivity(
                Intent(this, CrearJugadorActivity::class.java)
            )

        }
    }

    private fun mostrarOpciones(jugador: Jugador) {

        AlertDialog.Builder(this)
            .setTitle("Jugador")
            .setItems(arrayOf("Editar", "Eliminar")) { _, which ->

                when (which) {

                    0 -> {
                        val intent =
                            Intent(this, EditarJugadorActivity::class.java)

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

                // Aquí llamarías a tu API o BD
                listaJugadores.remove(jugador)

                rvJugadores.adapter =
                    JugadorAdapter(listaJugadores) {
                        mostrarOpciones(it)
                    }
            }
            .setNegativeButton("No", null)
            .show()
    }
}