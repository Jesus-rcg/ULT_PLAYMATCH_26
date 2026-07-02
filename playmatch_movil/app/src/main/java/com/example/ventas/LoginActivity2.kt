package com.example.ventas.loginActivity

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.MenuActivity
import com.example.ventas.OlvideContrasenaActivity
import com.example.ventas.R
import com.example.ventas.RegistrarseActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.api.ApiService
import com.example.ventas.model.LoginRequest
import com.example.ventas.model.LoginResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginActivity2 : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login2)

        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)
        val btnLogin = findViewById<Button>(R.id.btnLogin)
        val message = findViewById<TextView>(R.id.message)
        val btnRegistrarse = findViewById<Button>(R.id.btnRegistrarse)
        val btnOlvideContrasena = findViewById<Button>(R.id.btnOlvideContrasena)

        btnRegistrarse.setOnClickListener {
            startActivity(Intent(this, RegistrarseActivity::class.java))
        }

        btnOlvideContrasena.setOnClickListener {
            startActivity(Intent(this, OlvideContrasenaActivity::class.java))
        }

        btnLogin.setOnClickListener {

            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()

            if (email.isNotEmpty() && password.isNotEmpty()) {

                val api = ApiClient.instance
                val request = LoginRequest(email, password)

                api.login(request).enqueue(object : Callback<LoginResponse> {

                    override fun onResponse(
                        call: Call<LoginResponse>,
                        response: Response<LoginResponse>
                    ) {
                            val token = response.body()?.token

                            // ✅ guardar token
                            val prefs = getSharedPreferences("app", MODE_PRIVATE)
                            prefs.edit().putString("token", token).apply()

                            val body = response.body()
                            val rol = body?.user?.rol
                            when(rol){

                                1 -> {
                                    message.setTextColor(Color.GREEN)
                                    message.text = "Bienvenido administrador"

                                    startActivity(Intent(this@LoginActivity2, MenuActivity::class.java))
                                    finish()
                                }

//                                3 -> {
//                                    message.setTextColor(Color.GREEN)
//                                    message.text = "Bienvenido"
//
//                                    startActivity(Intent(this@LoginActivity2, UserHomeActivity::class.java))
//                                    finish()
//                                }

                                else -> {
                                    message.setTextColor(Color.RED)
                                    message.text = "Usuario no permitido"
                                }

                            }
                    }

                    override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                        message.setTextColor(Color.RED)
                        message.text = t.message
                        t.printStackTrace()
                    }
                })

            } else {
                message.setTextColor(Color.RED)
                message.text = "Campos vacíos"
            }
        }
    }
}