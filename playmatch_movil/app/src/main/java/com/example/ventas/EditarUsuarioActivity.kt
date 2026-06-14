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

class EditarUsuarioActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_editar_usuario)

        //Recibe los datos del usuario a editar.
        val id = intent.getIntExtra("ID", 0)
            .takeIf { it != 0 } ?: run{
            Toast.makeText(this, "ID invalido", Toast.LENGTH_SHORT).show()
            finish()
            return
        }
        val nombre = intent.getStringExtra("NOMBRE") ?: ""
        val apellido = intent.getStringExtra("APELLIDO") ?: ""
        val email = intent.getStringExtra("EMAIL") ?: ""
        val telefono = intent.getStringExtra("TELEFONO") ?: ""

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        val etNombre = findViewById<EditText>(R.id.etNombre)
        val etApellido = findViewById<EditText>(R.id.etApellido)
        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etTelefono = findViewById<EditText>(R.id.etTelefono)

        //Carga los datos actuales del usuario.
        etNombre.setText(nombre)
        etApellido.setText(apellido)
        etEmail.setText(email)
        etTelefono.setText(telefono)

        //Boton guardar cambios

        findViewById<Button>(R.id.btnGuardar).setOnClickListener {
            val nuevoNombre = etNombre.text.toString().trim()
            val nuevoApellido = etApellido.text.toString().trim()
            val nuevoEmail = etEmail.text.toString().trim()
            val nuevoTelefono = etTelefono.text.toString().trim()

            //Hacemos validaciones para que no hayan errores.

            if (nuevoNombre.isEmpty()) {
                Toast.makeText(this, "El nombre es obligatorio", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (nuevoApellido.isEmpty()) {
                Toast.makeText(this, "El apellido es obligatorio", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (nuevoEmail.isEmpty() || !android.util.Patterns.EMAIL_ADDRESS.matcher(nuevoEmail).matches()) {
                Toast.makeText(this, "Ingrese un email valido", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (nuevoTelefono.isEmpty()) {
                Toast.makeText(this, "El teléfono es obligatorio", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            //Cuando no escriben contraseña, se manda vacía (sin cambios).

            val usuario = Usuario(
                nombre_usuario = nuevoNombre,
                apellido_usuario = nuevoApellido,
                email = nuevoEmail,
                telefono = nuevoTelefono,
                fecha_nacimiento = "",   // no se edita
                password = null  // no se edita
            )

            //Token y conectamos con la api para que se realicen los cambios.

            val token = getSharedPreferences("app", MODE_PRIVATE)
                .getString("token", "") ?: ""

            ApiClient.instance.updateUsuario("Bearer $token", id, usuario)
                .enqueue(object : Callback<Void>{

                    override fun onResponse(call: Call<Void?>, response: Response<Void?>) {
                        if (response.isSuccessful){
                            Toast.makeText(
                                this@EditarUsuarioActivity,
                                "Usuario editado correctamente",
                                Toast.LENGTH_LONG
                            ).show()
                            setResult(RESULT_OK) //Acá avisamos a la página de Usuarios que se recargue.
                            finish()
                        } else {
                            Toast.makeText(
                                this@EditarUsuarioActivity,
                                "Error ${response.code()}",
                                Toast.LENGTH_LONG
                            ).show()
                            Log.e("API_ERROR", response.errorBody()?.string() ?: "")
                        }
                    }

                    override fun onFailure(call: Call<Void?>, t: Throwable) {
                        Toast.makeText(this@EditarUsuarioActivity, t.message, Toast.LENGTH_LONG).show()
                        Log.e("API ERROR", t.message.toString())
                    }
                })
        }
    }
}
