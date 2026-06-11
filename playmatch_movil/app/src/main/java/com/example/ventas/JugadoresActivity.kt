package com.example.ventas

import android.content.Intent
import android.os.Bundle
import android.widget.LinearLayout
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class JugadoresActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_jugadores)

        // TARJETAS

        val btnGuardar =
            findViewById<LinearLayout>(R.id.tarjetaGuardar)

        val btnBuscar =
            findViewById<LinearLayout>(R.id.tarjetaBuscar)

        val btnEditar =
            findViewById<LinearLayout>(R.id.tarjetaEditar)

        val btnEliminar =
            findViewById<LinearLayout>(R.id.tarjetaEliminar)

        val btnVerTodos =
            findViewById<LinearLayout>(R.id.tarjetaVerTodos)



        // ===== GUARDAR =====

        btnGuardar.setOnClickListener {

            startActivity(
                Intent(
                    this,
                    CrearJugadorActivity::class.java
                )
            )
        }



        // ===== BUSCAR =====

        btnBuscar.setOnClickListener {

            Toast.makeText(
                this,
                "Pantalla buscar jugador",
                Toast.LENGTH_SHORT
            ).show()

            // DESPUES:
            // startActivity(Intent(this, BuscarJugadorActivity::class.java))
        }



        // ===== EDITAR =====

        btnEditar.setOnClickListener {

            Toast.makeText(
                this,
                "Pantalla editar jugador",
                Toast.LENGTH_SHORT
            ).show()

            // DESPUES:
            // startActivity(Intent(this, EditarJugadorActivity::class.java))
        }



        // ===== ELIMINAR =====

        btnEliminar.setOnClickListener {

            Toast.makeText(
                this,
                "Pantalla eliminar jugador",
                Toast.LENGTH_SHORT
            ).show()

            // DESPUES:
            // startActivity(Intent(this, EliminarJugadorActivity::class.java))
        }



        // ===== VER TODOS =====

        btnVerTodos.setOnClickListener {

            Toast.makeText(
                this,
                "Lista de jugadores",
                Toast.LENGTH_SHORT
            ).show()

            // DESPUES:
            // startActivity(Intent(this, ListaJugadoresActivity::class.java))
        }
    }
}