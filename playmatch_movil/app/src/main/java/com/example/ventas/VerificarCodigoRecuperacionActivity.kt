package com.example.ventas

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.CambiarPasswordRequest
import com.example.ventas.model.EmailRequest
import com.example.ventas.model.RegistroResponse
import com.example.ventas.model.VerificarCodigoRequest
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class VerificarCodigoRecuperacionActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_verificar_codigo_recuperacion)

        val email = intent.getStringExtra("EMAIL") ?: ""

        findViewById<TextView>(R.id.txtCorreo).text =
            "Enviamos un código a \n$email"

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        val etCodigo = findViewById<EditText>(R.id.etCodigo)

        findViewById<Button>(R.id.btnVerificar).setOnClickListener {
            val codigo = etCodigo.text.toString().trim()

            if (codigo.length < 6){
                Toast.makeText(
                    this,
                    "Ingrese los 6 dígitos",
                    Toast.LENGTH_LONG
                ).show()

                return@setOnClickListener
            }

            ApiClient.instance.verificarCodigoRecuperacion(
                VerificarCodigoRequest(
                    email,
                    codigo
                )
            ).enqueue(object: Callback<RegistroResponse>{
                override fun onResponse(call: Call<RegistroResponse?>, response: Response<RegistroResponse?>)
                {
                    if (response.isSuccessful){
                        val intent = Intent(
                            this@VerificarCodigoRecuperacionActivity,
                            NuevaContrasenaActivity::class.java
                        )

                        intent.putExtra("EMAIL", email)
                        intent.putExtra("CODIGO", codigo)

                        startActivity(intent)
                    }else{
                        val mensaje = try {
                            val error = response.errorBody()?.string()

                            org.json.JSONObject(error ?: "").getString("message")
                        }catch (e : Exception){
                            "Código incorrecto"
                        }

                        Toast.makeText(
                            this@VerificarCodigoRecuperacionActivity,
                            mensaje,
                            Toast.LENGTH_LONG
                        ).show()
                    }
                }

                override fun onFailure(call: Call<RegistroResponse?>, t: Throwable) {
                    Toast.makeText(
                        this@VerificarCodigoRecuperacionActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()
                }
            })

        }

        findViewById<Button>(R.id.btnReenviar).setOnClickListener {

            ApiClient.instance.recuperarPassword(
                EmailRequest(email)
            ).enqueue(object : Callback<RegistroResponse>{
                override fun onResponse(call: Call<RegistroResponse?>, response: Response<RegistroResponse?>) {
                    if (response.isSuccessful){
                        Toast.makeText(
                            this@VerificarCodigoRecuperacionActivity,
                            "Código reenviado",
                            Toast.LENGTH_LONG
                        ).show()
                    }else{

                        val mensaje = try {

                            val error = response.errorBody()?.string()

                            org.json.JSONObject(error ?: "").getString("message")


                        }catch (e : Exception){
                            "No fue posible reenviar el código"
                        }

                        Toast.makeText(
                            this@VerificarCodigoRecuperacionActivity,
                            mensaje,
                            Toast.LENGTH_LONG
                        ).show()
                    }
                }

                override fun onFailure(call: Call<RegistroResponse?>, t: Throwable) {
                    Toast.makeText(
                        this@VerificarCodigoRecuperacionActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()
                }
            })
        }
    }
}