package com.example.ventas

import android.content.Intent
import android.os.Bundle
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.ui.equipos.BuscarEquipoActivity
import com.example.ventas.ui.equipos.CrearEquipoActivity
import com.example.ventas.ui.equipos.ListaEquiposActivity
//import com.example.ventas.ui.encuentros.CrearEncuentroActivity
import com.example.ventas.ui.encuentros.ListaEncuentrosActivity

class OperacionesActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.menu_usuarios)

        val modulo = intent.getStringExtra("MODULO") ?: "Módulo"

        val txtTitulo = findViewById<TextView>(R.id.txtTituloModulo)
        txtTitulo.text = modulo

        val btnVolver = findViewById<ImageButton>(R.id.btnVolver)
        btnVolver.setOnClickListener { finish() }

        val cardGuardar = findViewById<LinearLayout>(R.id.tarjetaGuardar)
        val cardBuscar = findViewById<LinearLayout>(R.id.tarjetaBuscar)
        val cardEditar = findViewById<LinearLayout>(R.id.tarjetaEditar)
        val cardEliminar = findViewById<LinearLayout>(R.id.tarjetaEliminar)
        val cardVerTodos = findViewById<LinearLayout>(R.id.tarjetaVerTodos)

        // ================= GUARDAR =================
        cardGuardar.setOnClickListener {
            when (modulo) {
                "Jugadores" -> startActivity(Intent(this, CrearJugadorActivity::class.java))
                "Equipos" -> startActivity(Intent(this, CrearEquipoActivity::class.java))
                //"Encuentros" -> startActivity(Intent(this, CrearEncuentroActivity::class.java))
                // ✅ Agregado Resultados
                "Usuarios" -> startActivity(Intent(this, CrearUsuarioActivity::class.java))
                "Torneos" -> startActivity(Intent(this, CrearTorneoActivity::class.java))
                else -> Toast.makeText(this, "Formulario no disponible", Toast.LENGTH_SHORT).show()
            }
        }

        // ================= BUSCAR =================
        cardBuscar.setOnClickListener {
            when (modulo) {

                "Equipos" -> startActivity(Intent(this, BuscarEquipoActivity::class.java))
                "Encuentros" -> {
                    val intent = Intent(this, ListaEncuentrosActivity::class.java)
                    intent.putExtra("MODO", "vertodos")
                    startActivity(intent)
                }
                else -> Toast.makeText(this, "Buscar no disponible", Toast.LENGTH_SHORT).show()
            }
        }

        // ================= EDITAR =================
        cardEditar.setOnClickListener {
            when (modulo) {
                "Jugadores" -> startActivity(Intent(this, EditarJugadorActivity::class.java))
                "Equipos" -> {
                    val intent = Intent(this, ListaEquiposActivity::class.java)
                    intent.putExtra("MODO", "editar")
                    startActivity(intent)
                }

                "Encuentros" -> {
                    val intent = Intent(this, ListaEncuentrosActivity::class.java)
                    intent.putExtra("MODO", "editar")
                    startActivity(intent)
                }
                else -> Toast.makeText(this, "Editar no disponible", Toast.LENGTH_SHORT).show()
            }
        }

        // ================= ELIMINAR =================
        cardEliminar.setOnClickListener {
            when (modulo) {

                "Equipos" -> {
                    val intent = Intent(this, ListaEquiposActivity::class.java)
                    intent.putExtra("MODO", "eliminar")
                    startActivity(intent)
                }
                "Encuentros" -> {
                    val intent = Intent(this, ListaEncuentrosActivity::class.java)
                    intent.putExtra("MODO", "eliminar")
                    startActivity(intent)
                }

                else -> Toast.makeText(this, "Eliminar no disponible", Toast.LENGTH_SHORT).show()
            }
        }

        // ================= VER TODOS =================
        cardVerTodos.setOnClickListener {
            when (modulo) {
                "Jugadores" -> startActivity(Intent(this, JugadoresActivity::class.java))
                "Equipos" -> {
                    val intent = Intent(this, ListaEquiposActivity::class.java)
                    intent.putExtra("MODO", "vertodos")
                    startActivity(intent)
                }

                "Encuentros" -> {
                    val intent = Intent(this, ListaEncuentrosActivity::class.java)
                    intent.putExtra("MODO", "vertodos")
                    startActivity(intent)
                }

                "Usuarios" -> startActivity(Intent(this, UsuariosActivity::class.java))
                else -> Toast.makeText(this, "Lista no disponible", Toast.LENGTH_SHORT).show()
            }
        }
    }
}