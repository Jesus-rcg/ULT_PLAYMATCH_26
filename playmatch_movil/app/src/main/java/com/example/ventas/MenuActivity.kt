package com.example.ventas

import android.content.Intent
import android.os.Bundle
import android.widget.ImageButton
import androidx.appcompat.app.AppCompatActivity

class MenuActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_menu)

        findViewById<ImageButton>(R.id.btnUser).setOnClickListener {
            abrirUsuarios("Usuarios")
        }

        findViewById<ImageButton>(R.id.btnEquipos).setOnClickListener {
            abrirOperaciones("Equipos")
        }

        findViewById<ImageButton>(R.id.btnVersus).setOnClickListener {
            abrirOperaciones("Encuentros")
        }

        findViewById<ImageButton>(R.id.btnPosiciones).setOnClickListener {
            abrirPosiciones("Posiciones")
        }

        findViewById<ImageButton>(R.id.btnJugadores).setOnClickListener {
            abrirJugadores("Jugadores")
        }

        findViewById<ImageButton>(R.id.btnTorneo).setOnClickListener {
            abrirTorneos("Torneos")
        }

        findViewById<ImageButton>(R.id.btnResultados).setOnClickListener {
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