package com.example.ventas

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.loginActivity.LoginActivity2
import com.example.ventas.model.VerificarCodigoRequest
import com.example.ventas.model.EmailRequest
import com.example.ventas.model.RegistroResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class VerificarCodigoActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_verificar_codigo)

        val email = intent.getStringExtra("EMAIL") ?: ""
        val nombre = intent.getStringExtra("NOMBRE") ?: ""
        val apellido = intent.getStringExtra("APELLIDO") ?: ""
        val fecha = intent.getStringExtra("FECHA") ?: ""
        val telefono = intent.getStringExtra("TELEFONO") ?: ""
        val password = intent.getStringExtra("PASSWORD") ?: ""

        findViewById<TextView>(R.id.txtCorreo).text =
            "Enviamos un correo a\n$email"

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener{
            finish()
        }

        val etCodigo = findViewById<EditText>(R.id.etCodigo)

        findViewById<Button>(R.id.btnVerificar).setOnClickListener {
            val codigo = etCodigo.text.toString().trim()
            if (codigo.length != 6){
                Toast.makeText(
                    this,
                    "Ingrese los 6 dígitos",
                    Toast.LENGTH_LONG
                ).show()

                return@setOnClickListener
            }

            val request = VerificarCodigoRequest(
                email,
                codigo
            )

            ApiClient.instance.registrarUsuario(request)
                .enqueue(object : Callback<RegistroResponse> {

                    override fun onResponse(call: Call<RegistroResponse?>, response: Response<RegistroResponse?>) {
                        if (response.isSuccessful){
                            Toast.makeText(
                                this@VerificarCodigoActivity,
                                "Cuenta creada correctamente",
                                Toast.LENGTH_LONG
                            ).show()

                            startActivity(Intent(this@VerificarCodigoActivity, LoginActivity2::class.java))
                            finishAffinity()
                        }else{
                            Toast.makeText(
                                this@VerificarCodigoActivity,
                                "Código incorrecto",
                                Toast.LENGTH_LONG
                            ).show()
                        }

                    }

                    override fun onFailure(call: Call<RegistroResponse?>, t: Throwable) {
                        Toast.makeText(
                            this@VerificarCodigoActivity,
                            t.message,
                            Toast.LENGTH_LONG
                        ).show()
                    }
                    
                })
        }

        findViewById<Button>(R.id.btnReenviar).setOnClickListener {

            ApiClient.instance.reenviarCodigo(EmailRequest(email)
            ).enqueue(object : Callback<RegistroResponse>{

                override fun onResponse(
                    call: Call<RegistroResponse>,
                    response: Response<RegistroResponse>
                ) {

                    if(response.isSuccessful){

                        Toast.makeText(
                            this@VerificarCodigoActivity,
                            "Código reenviado correctamente",
                            Toast.LENGTH_LONG
                        ).show()

                    }else{

                        Toast.makeText(
                            this@VerificarCodigoActivity,
                            "No fue posible reenviar el código",
                            Toast.LENGTH_LONG
                        ).show()

                    }

                }

                override fun onFailure(call: Call<RegistroResponse>, t: Throwable) {

                    Toast.makeText(
                        this@VerificarCodigoActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()

                }

            })

        }

    }
}