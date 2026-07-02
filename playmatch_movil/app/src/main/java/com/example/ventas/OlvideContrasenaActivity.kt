package com.example.ventas

import android.content.Intent
import android.os.Bundle
import android.util.Patterns
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.loginActivity.LoginActivity2
import com.example.ventas.model.EmailRequest
import com.example.ventas.model.RegistroResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class OlvideContrasenaActivity : AppCompatActivity(){

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_olvide_contrasena)

        val etEmail = findViewById<EditText>(R.id.etEmail)
        val btnEnviarCodigo = findViewById<Button>(R.id.btnEnviarCodigo)
        val btnLogin = findViewById<Button>(R.id.btnLogin)
        val btnVolver = findViewById<ImageButton>(R.id.btnVolver)

        btnVolver.setOnClickListener {
            finish()
        }

        btnLogin.setOnClickListener {
            startActivity(Intent(this, LoginActivity2::class.java))
            finish()
        }

        btnEnviarCodigo.setOnClickListener {
            val email = etEmail.text.toString().trim()

            if (email.isEmpty()){
                Toast.makeText(
                    this,
                    "Ingrese su correo electrónico",
                    Toast.LENGTH_LONG
                ).show()
                return@setOnClickListener
            }

            if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                Toast.makeText(
                    this,
                    "Ingrese un correo valido",
                    Toast.LENGTH_LONG
                ).show()
                return@setOnClickListener
            }

            ApiClient.instance.recuperarPassword(
                EmailRequest(email)
            ).enqueue(object : Callback<RegistroResponse> {

                override fun onResponse(
                    call: Call<RegistroResponse>,
                    response: Response<RegistroResponse>
                ){
                    if (response.isSuccessful){
                        val intent = Intent(
                            this@OlvideContrasenaActivity,
                            VerificarCodigoRecuperacionActivity::class.java
                        )

                        intent.putExtra("EMAIL", email)

                        startActivity(intent)

                        finish()
                    } else {

                        val mensaje = try {
                            val error = response.errorBody()?.string()

                            org.json.JSONObject(error ?: "").getString("message")

                        }catch (e : Exception){
                            "Error al enviar el codigo"
                        }

                        Toast.makeText(
                            this@OlvideContrasenaActivity,
                            mensaje,
                            Toast.LENGTH_LONG
                        ).show()
                    }
                }

                override fun onFailure(
                    call: Call<RegistroResponse>,
                    t: Throwable
                ){
                    Toast.makeText(
                        this@OlvideContrasenaActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()
                }
            })
        }
    }
}