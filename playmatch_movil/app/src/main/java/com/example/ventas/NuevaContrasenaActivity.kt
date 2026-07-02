package com.example.ventas

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.loginActivity.LoginActivity2
import com.example.ventas.model.CambiarPasswordRequest
import com.example.ventas.model.RegistroResponse
import retrofit2.Callback
import retrofit2.Call
import retrofit2.Response

class NuevaContrasenaActivity : AppCompatActivity(){
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_nueva_contrasena)

        val email = intent.getStringExtra("EMAIL") ?: ""
        val codigo = intent.getStringExtra("CODIGO") ?: ""

        val etPassword = findViewById<EditText>(R.id.etPassword)
        val etConfirmar = findViewById<EditText>(R.id.etConfirmarPassword)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        findViewById<Button>(R.id.btnGuardar).setOnClickListener {

            val password = etPassword.text.toString().trim()
            val confirmar = etConfirmar.text.toString().trim()

            if (password.isEmpty() || confirmar.isEmpty() ){
                Toast.makeText(
                    this,
                    "Complete los campos",
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

            if (password != confirmar){
                Toast.makeText(
                    this,
                    "Las contraseñas no coinciden",
                    Toast.LENGTH_LONG
                ).show()

                return@setOnClickListener
            }

            val request = CambiarPasswordRequest(
                email,
                codigo,
                password
            )

            ApiClient.instance.cambiarPassword(request).enqueue(object : Callback<RegistroResponse>{

                override fun onResponse(call: Call<RegistroResponse?>, response: Response<RegistroResponse?>) {
                    if (response.isSuccessful){
                        Toast.makeText(
                            this@NuevaContrasenaActivity,
                            "Contraseña actualizada correctamente",
                            Toast.LENGTH_LONG
                        ).show()

                        val intent = Intent(
                            this@NuevaContrasenaActivity,
                            LoginActivity2::class.java
                        )

                        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK

                        startActivity(intent)
                    }else{
                        val mensaje = try {
                            val error = response.errorBody()?.string()

                            org.json.JSONObject(error ?: "").getString("message")
                        }catch (e : Exception){
                            "No fue posible cambiar la contraseña"
                        }

                        Toast.makeText(
                            this@NuevaContrasenaActivity,
                            mensaje,
                            Toast.LENGTH_LONG
                        ).show()
                    }
                }

                override fun onFailure(call: Call<RegistroResponse?>, t: Throwable) {
                    Toast.makeText(
                        this@NuevaContrasenaActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()
                }
            })
        }
    }
}