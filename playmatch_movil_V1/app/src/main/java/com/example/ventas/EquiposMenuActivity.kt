package com.example.ventas.ui

import android.content.Intent
import android.os.Bundle
import android.widget.LinearLayout
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.R

class EquiposMenuActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_equipos_menu)

        val btnGuardar = findViewById<LinearLayout>(R.id.tarjetaGuardar)
        val btnBuscar = findViewById<LinearLayout>(R.id.tarjetaBuscar)
        val btnEditar = findViewById<LinearLayout>(R.id.tarjetaEditar)
        val btnEliminar = findViewById<LinearLayout>(R.id.tarjetaEliminar)
        val btnVerTodos = findViewById<LinearLayout>(R.id.tarjetaVerTodos)

        btnGuardar.setOnClickListener {
            startActivity(Intent(this, EquipoActivity::class.java))
        }

        btnBuscar.setOnClickListener {
            // Lo conectamos después
        }

        btnEditar.setOnClickListener {
            startActivity(Intent(this, ListaEquiposActivity::class.java))
        }

        btnEliminar.setOnClickListener {
            // Lo conectamos después
        }

        btnVerTodos.setOnClickListener {
            startActivity(Intent(this, ListaEquiposActivity::class.java))
        }
    }
}