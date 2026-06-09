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
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

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
        val email = intent.getStringExtra("EMAIL") ?: ""
        val rol = intent.getStringExtra("ROL") ?: ""
        val estado = intent.getStringExtra("ESTADO") ?: ""

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        val etNombre = findViewById<EditText>(R.id.etNombre)
        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)

        //Carga los datos actuales del usuario.
        etNombre.setText(nombre)
        etEmail.setText(email)

        //Selecciona el estado y rol actual del usuario.

        val spinnerRol = findViewById<Spinner>(R.id.seleccionRol)
        val roles = listOf("admin", "arbitro", "entrenador", "consultor")
        spinnerRol.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item,roles)
        spinnerRol.setSelection(roles.indexOf(rol).takeIf { it >= 0 } ?: 0 )

        val spinnerEstado = findViewById<Spinner>(R.id.seleccionEstado)
        val estados = listOf("Activo", "Inactivo")
        spinnerEstado.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item,estados)
        spinnerEstado.setSelection(estados.indexOfFirst { it.lowercase() == estado.lowercase() }.takeIf { it >= 0 } ?: 0)

        //Boton guardar cambios

        findViewById<Button>(R.id.btnGuardar).setOnClickListener {
            val nuevoNombre = etNombre.text.toString().trim()
            val nuevoEmail = etEmail.text.toString().trim()
            val nuevoPassword = etPassword.text.toString().trim()
            val nuevoRol = spinnerRol.selectedItem.toString()
            val nuevoEstado = spinnerEstado.selectedItem.toString()

            //Hacemos validaciones para que no hayan errores.

            if (nuevoNombre.isEmpty()) {
                Toast.makeText(this, "El nombre es obligatorio", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            if (nuevoEmail.isEmpty() || !android.util.Patterns.EMAIL_ADDRESS.matcher(nuevoEmail).matches()) {
                Toast.makeText(this, "Ingrese un email valido", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val fecha = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(Date())

            //Cuando no escriben contraseña, se manda vacía (sin cambios).

            val usuario = Usuario(
                id_usuario = id,
                nombre = nuevoNombre,
                email = nuevoEmail,
                password = nuevoPassword,
                rol = nuevoRol,
                estado = nuevoEstado,
                fecha_actualizado = fecha
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
