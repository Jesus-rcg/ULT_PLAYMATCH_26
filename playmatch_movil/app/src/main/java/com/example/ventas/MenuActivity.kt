package com.example.ventas

import android.content.Intent
import android.os.Bundle
import android.widget.LinearLayout
import androidx.appcompat.app.AppCompatActivity

class MenuActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_menu)

        findViewById<LinearLayout>(R.id.cardUsuarios).setOnClickListener {
            abrirUsuarios("Usuarios")
        }

        findViewById<LinearLayout>(R.id.cardEquipos).setOnClickListener {
            abrirOperaciones("Equipos")
        }

        findViewById<LinearLayout>(R.id.cardEncuentros).setOnClickListener {
            abrirOperaciones("Encuentros")
        }

        findViewById<LinearLayout>(R.id.cardPosiciones).setOnClickListener {
            abrirPosiciones("Posiciones")
        }

        findViewById<LinearLayout>(R.id.cardJugadores).setOnClickListener {
            abrirJugadores("Jugadores")
        }

        findViewById<LinearLayout>(R.id.cardTorneos).setOnClickListener {
            abrirTorneos("Torneos")
        }

        findViewById<LinearLayout>(R.id.cardResultados).setOnClickListener {
            abrirResultados("Resultados")
        }

    }

    private fun abrirUsuarios(modulo: String){
        val intent = Intent(this, UsuariosActivity::class.java)
        intent.putExtra("MODULO", modulo)
        startActivity(intent)
    }

    private fun abrirResultados(modulo: String){
        val intent = Intent(this, ResultadosActivity::class.java)
        intent.putExtra("MODULO", modulo)
        startActivity(intent)
    }

    private fun abrirJugadores(modulo: String){
        val intent = Intent(this, JugadoresActivity::class.java)
        intent.putExtra("MODULO", modulo)
        startActivity(intent)
    }

    private fun abrirPosiciones(modulo: String){
        val intent = Intent(this, PosicionesActivity::class.java)
        intent.putExtra("MODULO", modulo)
        startActivity(intent)
    }

    private fun abrirOperaciones(modulo: String){
        val intent = Intent(this, OperacionesActivity::class.java)
        intent.putExtra("MODULO", modulo)
        startActivity(intent)
    }

    private fun abrirTorneos(modulo: String){
        val intent = Intent(this, TorneosActivity::class.java)
        intent.putExtra("MODULO", modulo)
        startActivity(intent)
    }

}