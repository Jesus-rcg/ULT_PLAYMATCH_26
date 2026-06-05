package com.example.ventas

import android.content.Intent
import android.os.Bundle
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class OperacionesActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.menu_usuarios)

        val modulo = intent.getStringExtra("MODULO") ?: "Módulo"
        val token = intent.getStringExtra("token") ?: ""

        val txtTitulo = findViewById<TextView>(R.id.txtTituloModulo)
        txtTitulo.text = modulo

        val btnVolver = findViewById<ImageButton>(R.id.btnVolver)
        btnVolver.setOnClickListener { finish() }

        val cardGuardar  = findViewById<LinearLayout>(R.id.tarjetaGuardar)
        val cardBuscar   = findViewById<LinearLayout>(R.id.tarjetaBuscar)
        val cardEditar   = findViewById<LinearLayout>(R.id.tarjetaEditar)
        val cardEliminar = findViewById<LinearLayout>(R.id.tarjetaEliminar)
        val cardVerTodos = findViewById<LinearLayout>(R.id.tarjetaVerTodos)

        // ================= GUARDAR =================
        cardGuardar.setOnClickListener {
            when (modulo) {
                "Jugadores"  -> startActivity(Intent(this, CrearJugadorActivity::class.java))
                "Equipos"    -> startActivity(Intent(this, com.example.ventas.ui.EquipoActivity::class.java))
                "Usuarios"   -> startActivity(Intent(this, CrearUsuarioActivity::class.java))
                "Torneos"    -> startActivity(Intent(this, CrearTorneoActivity::class.java))
                "Encuentros" -> {
                    val i = Intent(this, CrearEncuentroActivity::class.java)
                    i.putExtra("token", token)
                    startActivity(i)
                }
                "Resultados" -> {
                    val i = Intent(this, CrearResultadoActivity::class.java)
                    i.putExtra("token", token)
                    startActivity(i)
                }
                else -> Toast.makeText(this, "Formulario no disponible", Toast.LENGTH_SHORT).show()
            }
        }

        // ================= BUSCAR =================
        cardBuscar.setOnClickListener {
            when (modulo) {
                "Jugadores"  -> startActivity(Intent(this, BuscarJugadorActivity::class.java))
                "Equipos"    -> startActivity(Intent(this, com.example.ventas.ui.BuscarEquipoActivity::class.java))
                "Encuentros" -> {
                    val i = Intent(this, BuscarEncuentroActivity::class.java)
                    i.putExtra("token", token)
                    startActivity(i)
                }
                "Resultados" -> {
                    val i = Intent(this, BuscarResultadoActivity::class.java)
                    i.putExtra("token", token)
                    startActivity(i)
                }
                else -> Toast.makeText(this, "Buscar no disponible", Toast.LENGTH_SHORT).show()
            }
        }

        // ================= EDITAR =================
        cardEditar.setOnClickListener {
            when (modulo) {
                "Jugadores" -> startActivity(Intent(this, EditarJugadorActivity::class.java))
                "Equipos"   -> {
                    val intent = Intent(this, com.example.ventas.ui.ListaEquiposActivity::class.java)
                    intent.putExtra("MODO", "editar")
                    startActivity(intent)
                }
                "Encuentros" -> {
                    val i = Intent(this, EditarEncuentroActivity::class.java)
                    i.putExtra("token", token)
                    startActivity(i)
                }
                "Resultados" -> {
                    val i = Intent(this, EditarResultadoActivity::class.java)
                    i.putExtra("token", token)
                    startActivity(i)
                }
                else -> Toast.makeText(this, "Editar no disponible", Toast.LENGTH_SHORT).show()
            }
        }

        // ================= ELIMINAR =================
        cardEliminar.setOnClickListener {
            when (modulo) {
                "Jugadores" -> startActivity(Intent(this, EliminarJugadorActivity::class.java))
                "Equipos"   -> {
                    val intent = Intent(this, com.example.ventas.ui.ListaEquiposActivity::class.java)
                    intent.putExtra("MODO", "eliminar")
                    startActivity(intent)
                }
                "Encuentros" -> {
                    val i = Intent(this, EliminarEncuentroActivity::class.java)
                    i.putExtra("token", token)
                    startActivity(i)
                }
                "Resultados" -> startActivity(Intent(this, EliminarResultadoActivity::class.java))
                else -> Toast.makeText(this, "Eliminar no disponible", Toast.LENGTH_SHORT).show()
            }
        }

        // ================= VER TODOS =================
        cardVerTodos.setOnClickListener {
            when (modulo) {
                "Jugadores" -> startActivity(Intent(this, ListaJugadoresActivity::class.java))
                "Equipos"   -> {
                    val intent = Intent(this, com.example.ventas.ui.ListaEquiposActivity::class.java)
                    intent.putExtra("MODO", "vertodos")
                    startActivity(intent)
                }
                "Usuarios"   -> startActivity(Intent(this, UsuariosActivity::class.java))
                "Encuentros" -> {
                    val i = Intent(this, ListaEncuentrosActivity::class.java)
                    i.putExtra("token", token)
                    startActivity(i)
                }
                "Resultados" -> {
                    val i = Intent(this, ListaResultadosActivity::class.java)
                    i.putExtra("token", token)
                    startActivity(i)
                }
                else -> Toast.makeText(this, "Lista no disponible", Toast.LENGTH_SHORT).show()
            }
        }
    }
}