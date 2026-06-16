package com.example.ventas

import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Usuario
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CrearUsuarioActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_crear_usuario)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        val spinnerRol = findViewById<Spinner>(R.id.seleccionRol)
        val rolesTexto = listOf("Seleccionar rol", "Administrador", "Organizador", "Usuario")
        val rolesId = listOf(0, 1, 2, 3)
        spinnerRol.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, rolesTexto)

        findViewById<Button>(R.id.btnGuardar).setOnClickListener {
            val nombre   = findViewById<EditText>(R.id.etNombre).text.toString().trim()
            val apellido  = findViewById<EditText>(R.id.etApellido).text.toString().trim()
            val telefono  = findViewById<EditText>(R.id.etTelefono).text.toString().trim()
            val fechaNac  = findViewById<EditText>(R.id.etFechaNacimiento).text.toString().trim()
            val email    = findViewById<EditText>(R.id.etEmail).text.toString().trim()
            val password = findViewById<EditText>(R.id.etPassword).text.toString().trim()
            val rolIndex      = spinnerRol.selectedItemPosition

            if (nombre.isEmpty()) {
                Toast.makeText(this, "El nombre es obligatorio", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (apellido.isEmpty()) {
                Toast.makeText(this, "El apellido es obligatorio", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (telefono.isEmpty()) {
                Toast.makeText(this, "El teléfono es obligatorio", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (fechaNac.isEmpty()) {
                Toast.makeText(this, "La fecha de nacimiento es obligatoria", Toast.LENGTH_SHORT).show()
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

            if (rolIndex == 0) {
                Toast.makeText(this, "Selecciona un rol", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val usuario = Usuario(
                id_rol = rolesId[rolIndex],
                nombre_usuario = nombre,
                apellido_usuario = apellido,
                fecha_nacimiento = fechaNac,
                telefono = telefono,
                email = email,
                password = password


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
                            "Usuario creado correctamente",
                            Toast.LENGTH_LONG
                        ).show()
                        setResult(RESULT_OK)

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