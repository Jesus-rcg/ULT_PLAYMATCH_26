package com.example.ventas.ui.resultados

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageButton
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.R

class ResultadosMenuActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_resultados_menu)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        // Botón Crear
        findViewById<Button>(R.id.btnCrear).setOnClickListener {
            startActivity(Intent(this, CrearResultadoActivity::class.java))
        }

        // Botón Ver todos
        findViewById<Button>(R.id.btnVerTodos).setOnClickListener {
            val intent = Intent(this, ListaResultadosActivity::class.java)
            intent.putExtra("MODO", "vertodos")
            startActivity(intent)
        }

        // Botón Editar
        findViewById<Button>(R.id.btnEditar).setOnClickListener {
            val intent = Intent(this, ListaResultadosActivity::class.java)
            intent.putExtra("MODO", "editar")
            startActivity(intent)
        }

        // Botón Eliminar
        findViewById<Button>(R.id.btnEliminar).setOnClickListener {
            val intent = Intent(this, ListaResultadosActivity::class.java)
            intent.putExtra("MODO", "eliminar")
            startActivity(intent)
        }
    }
}