package com.example.ventas

import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Toast
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

        val id = intent.getIntExtra("ID", 0)

        if (id == 0) {
            Toast.makeText(
                this,
                "ID inválido",
                Toast.LENGTH_SHORT
            ).show()

            finish()
            return
        }

        val nombre =
            intent.getStringExtra("NOMBRE") ?: ""

        val apellido =
            intent.getStringExtra("APELLIDO") ?: ""

        val email =
            intent.getStringExtra("EMAIL") ?: ""

        val telefono =
            intent.getStringExtra("TELEFONO") ?: ""

        val idRol =
            intent.getIntExtra("ID_ROL", 1)

        val activo =
            intent.getIntExtra("ACTIVO", 1)

        findViewById<ImageButton>(R.id.btnVolver)
            .setOnClickListener {
                finish()
            }

        val etNombre =
            findViewById<EditText>(R.id.etNombre)

        val etApellido =
            findViewById<EditText>(R.id.etApellido)

        val etEmail =
            findViewById<EditText>(R.id.etEmail)

        val etTelefono =
            findViewById<EditText>(R.id.etTelefono)

        etNombre.setText(nombre)
        etApellido.setText(apellido)
        etEmail.setText(email)
        etTelefono.setText(telefono)

        findViewById<Button>(R.id.btnGuardar)
            .setOnClickListener {

                val nuevoNombre =
                    etNombre.text.toString().trim()

                val nuevoApellido =
                    etApellido.text.toString().trim()

                val nuevoEmail =
                    etEmail.text.toString().trim()

                val nuevoTelefono =
                    etTelefono.text.toString().trim()

                if (nuevoNombre.isEmpty()) {

                    Toast.makeText(
                        this,
                        "El nombre es obligatorio",
                        Toast.LENGTH_SHORT
                    ).show()

                    return@setOnClickListener
                }

                if (nuevoApellido.isEmpty()) {

                    Toast.makeText(
                        this,
                        "El apellido es obligatorio",
                        Toast.LENGTH_SHORT
                    ).show()

                    return@setOnClickListener
                }

                if (
                    nuevoEmail.isEmpty() ||
                    !android.util.Patterns.EMAIL_ADDRESS
                        .matcher(nuevoEmail)
                        .matches()
                ) {

                    Toast.makeText(
                        this,
                        "Ingrese un email válido",
                        Toast.LENGTH_SHORT
                    ).show()

                    return@setOnClickListener
                }

                if (nuevoTelefono.isEmpty()) {

                    Toast.makeText(
                        this,
                        "El teléfono es obligatorio",
                        Toast.LENGTH_SHORT
                    ).show()

                    return@setOnClickListener
                }

                val usuario = Usuario(

                    id_usuario = id,

                    id_rol = idRol,

                    nombre_usuario = nuevoNombre,

                    apellido_usuario = nuevoApellido,

                    fecha_nacimiento = "",

                    telefono = nuevoTelefono,

                    email = nuevoEmail,

                    password = "",

                    activo = activo
                )

                val token =
                    getSharedPreferences(
                        "app",
                        MODE_PRIVATE
                    ).getString(
                        "token",
                        ""
                    ) ?: ""

                ApiClient.instance.updateUsuario(

                    "Bearer $token",

                    id,

                    usuario

                ).enqueue(object : Callback<Void> {

                    override fun onResponse(
                        call: Call<Void>,
                        response: Response<Void>
                    ) {

                        if (response.isSuccessful) {

                            Toast.makeText(
                                this@EditarUsuarioActivity,
                                "Usuario actualizado correctamente",
                                Toast.LENGTH_LONG
                            ).show()

                            setResult(RESULT_OK)
                            finish()

                        } else {

                            Toast.makeText(
                                this@EditarUsuarioActivity,
                                "Error ${response.code()}",
                                Toast.LENGTH_LONG
                            ).show()

                            Log.e(
                                "API_ERROR",
                                response.errorBody()?.string()
                                    ?: ""
                            )
                        }
                    }

                    override fun onFailure(
                        call: Call<Void>,
                        t: Throwable
                    ) {

                        Toast.makeText(
                            this@EditarUsuarioActivity,
                            t.message,
                            Toast.LENGTH_LONG
                        ).show()

                        Log.e(
                            "API_ERROR",
                            t.message.toString()
                        )
                    }
                })
            }
    }
}