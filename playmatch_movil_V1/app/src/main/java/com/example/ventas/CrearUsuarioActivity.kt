package com.example.ventas

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Usuario
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CrearUsuarioActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_crear_usuario)

        val btnVolver = findViewById<ImageButton>(R.id.btnVolver)

        btnVolver.setOnClickListener {
            val intent = Intent(this, UsuariosActivity::class.java)
            startActivity(intent)
        }

        val seleccionRol = findViewById<Spinner>(R.id.seleccionRol)
        val roles = listOf("Seleccionar rol", "admin", "arbitro", "entrenador", "consultor")
        seleccionRol.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, roles)

        val seleccionEstado = findViewById<Spinner>(R.id.seleccionEstado)
        val estados = listOf("Seleccionar estado", "Activo", "Inactivo")
        seleccionEstado.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, estados)

        findViewById<Button>(R.id.btnGuardar).setOnClickListener {
            val nombre   = findViewById<EditText>(R.id.etNombre).text.toString().trim()
            val email    = findViewById<EditText>(R.id.etEmail).text.toString().trim()
            val password = findViewById<EditText>(R.id.etPassword).text.toString().trim()
            val rol      = seleccionRol.selectedItem.toString()
            val estado   = seleccionEstado.selectedItem.toString()

            if (nombre.isEmpty()) {
                Toast.makeText(this, "El nombre es obligatorio", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (email.isEmpty() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                Toast.makeText(this, "Ingresa un email válido", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            if (password.isEmpty() || password.length < 6) {
                Toast.makeText(this, "La contraseña debe tener al menos 6 caracteres", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            if (rol == "Seleccionar rol") {
                Toast.makeText(this, "Selecciona un rol", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            if (estado == "Seleccionar estado") {
                Toast.makeText(this, "Selecciona un estado", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val fecha = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(Date())

            val usuario = Usuario(
                id_usuario = null,
                nombre = nombre,
                email = email,
                password = password,
                rol = rol,
                estado = estado,
                fecha_actualizado = fecha
            )

            val token = getSharedPreferences("app", MODE_PRIVATE)
                .getString("token", "")?: ""

            ApiClient.instance.createUsuario(
                "Bearer $token",
                usuario
            ).enqueue(object : Callback<Usuario>{

                override fun onResponse(call: Call<Usuario?>, response: Response<Usuario?>) {

                    if(response.isSuccessful){
                        Toast.makeText(
                            this@CrearUsuarioActivity,
                            "Usuario guardado correctamente",
                            Toast.LENGTH_LONG
                        ).show()

                        findViewById<EditText>(R.id.etNombre).text.clear()
                        findViewById<EditText>(R.id.etEmail).text.clear()
                        findViewById<EditText>(R.id.etPassword).text.clear()
                        seleccionRol.setSelection(0)
                        seleccionEstado.setSelection(0)

                    } else {
                        Toast.makeText(
                            this@CrearUsuarioActivity,
                            "Error ${response.code()}",
                            Toast.LENGTH_LONG
                        ).show()

                        Log.e("API ERROR", response.errorBody()?.string() ?: "Error desconocido")
                    }
                }

                override fun onFailure(call: Call<Usuario?>, t: Throwable) {
                    Toast.makeText(
                        this@CrearUsuarioActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()
                    Log.e("API ERROR", t.message.toString())
                }
            })
        }
    }
}