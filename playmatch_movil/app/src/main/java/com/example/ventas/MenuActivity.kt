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
            //abrirUsuarios("Usuarios")
        }

        findViewById<ImageButton>(R.id.btnEquipos).setOnClickListener {
            //abrirUsuarios("Equipos")
        }

        findViewById<ImageButton>(R.id.btnVersus).setOnClickListener {
            //abrirUsuarios("Encuentros")
        }

        findViewById<ImageButton>(R.id.btnPosiciones).setOnClickListener {
           // abrirUsuarios("Posiciones")
        }

        findViewById<ImageButton>(R.id.btnJugadores).setOnClickListener {
           // abrirUsuarios("Jugadores")
        }

        findViewById<ImageButton>(R.id.btnTorneo).setOnClickListener {
            // abrirUsuarios("Torneos")
        }

        findViewById<ImageButton>(R.id.btnResultados).setOnClickListener {
           // abrirUsuarios("Resultados")
        }

    }
/*
    private fun abrirUsuarios(modulo: String){
        val intent = Intent(this, UsuariosActivity::class.java)
        intent.putExtra("MODULO", modulo)
        startActivity(intent)
    }

 */
}