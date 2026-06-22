package com.example.ventas.ui.equipos

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageButton
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.R

class EquiposMenuActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_equipos_menu)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        // Botón Crear
        findViewById<Button>(R.id.btnCrear).setOnClickListener {
            startActivity(Intent(this, CrearEquipoActivity::class.java))
        }

        // Botón Ver todos
        findViewById<Button>(R.id.btnVerTodos).setOnClickListener {
            val intent = Intent(this, ListaEquiposActivity::class.java)
            intent.putExtra("MODO", "vertodos")
            startActivity(intent)
        }

        // Botón Editar
        findViewById<Button>(R.id.btnEditar).setOnClickListener {
            val intent = Intent(this, ListaEquiposActivity::class.java)
            intent.putExtra("MODO", "editar")
            startActivity(intent)
        }

        // Botón Eliminar
        findViewById<Button>(R.id.btnEliminar).setOnClickListener {
            val intent = Intent(this, ListaEquiposActivity::class.java)
            intent.putExtra("MODO", "eliminar")
            startActivity(intent)
        }

        // Botón Buscar
        findViewById<Button>(R.id.btnBuscar).setOnClickListener {
            startActivity(Intent(this, BuscarEquipoActivity::class.java))
        }
    }
}