package com.example.ventas

import android.content.Intent
import android.os.Bundle
import android.util.Patterns
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.loginActivity.LoginActivity2
import com.example.ventas.model.EmailRequest
import com.example.ventas.model.RegistroResponse
import com.example.ventas.model.Usuario
import com.example.ventas.model.UsuarioResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import org.json.JSONObject

class RegistrarseActivity : AppCompatActivity(){

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_registrarse)

        val etNombre = findViewById<EditText>(R.id.etNombre)
        val etApellido = findViewById<EditText>(R.id.etApellido)
        val etFecha = findViewById<EditText>(R.id.etFechaNacimiento)
        val etTelefono = findViewById<EditText>(R.id.etTelefono)
        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)

        val btnRegistrar = findViewById<Button>(R.id.btnRegistrarse)
        val btnVolver = findViewById<ImageButton>(R.id.btnVolver)
        val btnYaTengoCuenta = findViewById<Button>(R.id.btnYaTengoCuenta)

        btnYaTengoCuenta.setOnClickListener {
            startActivity(Intent(this, LoginActivity2::class.java))
        }

        etFecha.setOnClickListener {

            val calendario = java.util.Calendar.getInstance()

            val dialog = android.app.DatePickerDialog(
                this, { _, year, month, day ->
                    val fecha =
                        String.format(
                            "%04d-%02d-%02d",
                            year,
                            month + 1,
                            day
                        )

                    etFecha.setText(fecha)
                },

                calendario.get(java.util.Calendar.YEAR),
                calendario.get(java.util.Calendar.MONTH),
                calendario.get(java.util.Calendar.DAY_OF_MONTH)
            )

            dialog.show()
        }

        btnVolver.setOnClickListener {
            finish()
        }

        btnRegistrar.setOnClickListener {
            val nombre = etNombre.text.toString().trim()
            val apellido = etApellido.text.toString().trim()
            val fecha = etFecha.text.toString().trim()
            val telefono = etTelefono.text.toString().trim()
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()

            if ( nombre.isEmpty() ||
                apellido.isEmpty() ||
                fecha.isEmpty() ||
                telefono.isEmpty() ||
                email.isEmpty() ||
                password.isEmpty()
            ){
                Toast.makeText(
                    this,
                    "Complete todos los campos",
                    Toast.LENGTH_LONG
                ).show()
                return@setOnClickListener
            }

            if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()){
                Toast.makeText(
                    this,
                    "El correo no es válido",
                    Toast.LENGTH_LONG
                ).show()
                return@setOnClickListener
            }

            if (password.length < 6){
                Toast.makeText(
                    this,
                    "La contraseña debe tener al menos 6 caracteres",
                    Toast.LENGTH_LONG
                ).show()
                return@setOnClickListener
            }

            val usuario = Usuario (
                nombre_usuario = nombre,
                apellido_usuario = apellido,
                fecha_nacimiento = fecha,
                telefono = telefono,
                email = email,
                password = password
            )

            ApiClient.instance.enviarCodigo(usuario)
                .enqueue(object : Callback<RegistroResponse> {
                    override fun onResponse(call: Call<RegistroResponse>, response: Response<RegistroResponse>) {

                        if (response.isSuccessful){
                            Toast.makeText(
                                this@RegistrarseActivity,
                                "Código enviado al correo",
                                Toast.LENGTH_SHORT
                            ).show()

                            val intent = Intent(
                                this@RegistrarseActivity,
                                VerificarCodigoActivity::class.java
                            )

                            intent.putExtra("NOMBRE", nombre)
                            intent.putExtra("APELLIDO", apellido)
                            intent.putExtra("FECHA", fecha)
                            intent.putExtra("TELEFONO", telefono)
                            intent.putExtra("EMAIL", email)
                            intent.putExtra("PASSWORD", password)

                            startActivity(intent)

                            finish()
                        } else {

                            val error = response.errorBody()?.string()

                            try {
                                val json = JSONObject(error ?: "")

                                Toast.makeText(
                                    this@RegistrarseActivity,
                                    json.getString("message"),
                                    Toast.LENGTH_LONG
                                ).show()
                            } catch (e : Exception){

                                Toast.makeText(
                                    this@RegistrarseActivity,
                                    "Error ${response.code()}",
                                    Toast.LENGTH_LONG
                                ).show()
                            }
                        }
                    }

                    override fun onFailure(call: Call<RegistroResponse>, t: Throwable) {
                        Toast.makeText(
                            this@RegistrarseActivity,
                            t.message,
                            Toast.LENGTH_LONG
                        ).show()
                    }
                    
                })
        }
    }
}