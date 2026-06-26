package com.example.ventas

import android.content.Intent
import android.os.Bundle
import android.widget.LinearLayout
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.ui.equipos.ListaEquiposActivity
import com.example.ventas.ui.encuentros.ListaEncuentrosActivity
import com.example.ventas.ui.cronologias.ListaCronologiasActivity
class MenuActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_menu)

        findViewById<LinearLayout>(R.id.cardUsuarios).setOnClickListener {
            abrirUsuarios("Usuarios")
        }

        findViewById<LinearLayout>(R.id.cardEquipos).setOnClickListener {
            startActivity(Intent(this, ListaEquiposActivity::class.java))
        }

        findViewById<LinearLayout>(R.id.cardEncuentros).setOnClickListener {
            startActivity(Intent(this, ListaEncuentrosActivity::class.java))
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

        findViewById<LinearLayout>(R.id.cardCronologias).setOnClickListener {
            startActivity(Intent(this, ListaCronologiasActivity::class.java))
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

    private fun abrirTorneos(modulo: String){
        val intent = Intent(this, TorneosActivity::class.java)
        intent.putExtra("MODULO", modulo)
        startActivity(intent)
    }

}