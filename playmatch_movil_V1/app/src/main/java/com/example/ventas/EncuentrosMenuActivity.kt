package com.example.ventas

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.databinding.ActivityEncuentrosMenuBinding

class EncuentrosMenuActivity : AppCompatActivity() {

    private lateinit var binding: ActivityEncuentrosMenuBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEncuentrosMenuBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val token = intent.getStringExtra("token") ?: ""

        binding.btnGuardar.setOnClickListener {
            val intent = Intent(this, CrearEncuentroActivity::class.java)
            intent.putExtra("token", token)
            startActivity(intent)
        }

        binding.btnBuscar.setOnClickListener {
            val intent = Intent(this, BuscarEncuentroActivity::class.java)
            intent.putExtra("token", token)
            startActivity(intent)
        }

        binding.btnEditar.setOnClickListener {
            val intent = Intent(this, EditarEncuentroActivity::class.java)
            intent.putExtra("token", token)
            startActivity(intent)
        }

        binding.btnEliminar.setOnClickListener {
            val intent = Intent(this, EliminarEncuentroActivity::class.java)
            intent.putExtra("token", token)
            startActivity(intent)
        }

        binding.btnVerTodos.setOnClickListener {
            val intent = Intent(this, ListaEncuentrosActivity::class.java)
            intent.putExtra("token", token)
            startActivity(intent)
        }
    }
}