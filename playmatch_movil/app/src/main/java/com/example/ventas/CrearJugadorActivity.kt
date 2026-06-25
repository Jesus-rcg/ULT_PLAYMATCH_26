package com.example.ventas

import android.os.Bundle
import android.util.Log
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Spinner
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.ApiResponse
import com.example.ventas.model.Jugador
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CrearJugadorActivity : AppCompatActivity() {

    private lateinit var spActivo: Spinner

    private lateinit var spUsuario: Spinner

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_crear_jugador)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        val txtIdUsuario =
            findViewById<EditText>(R.id.txtIdUsuario)

        val etNombreUsuario =
            findViewById<EditText>(R.id.etNombre_usuario)

        val txtPosicion =
            findViewById<EditText>(R.id.txtPosicion)

        val txtNumero =
            findViewById<EditText>(R.id.txtNumero)

        val btnGuardar =
            findViewById<Button>(R.id.btnGuardarJugador)

        spActivo =
            findViewById(R.id.spActivo)

        cargarEstados()

        btnGuardar.setOnClickListener {

            if (
                txtIdUsuario.text.isEmpty() ||
                etNombreUsuario.text.isEmpty() ||
                txtPosicion.text.isEmpty() ||
                txtNumero.text.isEmpty()
            ) {

                Toast.makeText(
                    this,
                    "Complete todos los campos",
                    Toast.LENGTH_LONG
                ).show()

                return@setOnClickListener
            }

            val activo =
                if (spActivo.selectedItem.toString() == "Activo")
                    1
                else
                    0

            val jugador = Jugador(

                id_usuario =
                    txtIdUsuario.text.toString().toInt(),

                nombre_usuario =
                    etNombreUsuario.text.toString(),

                posicion =
                    txtPosicion.text.toString(),

                numero_camiseta =
                    txtNumero.text.toString().toInt(),

                activo = activo
            )

            val prefs =
                getSharedPreferences("app", MODE_PRIVATE)

            val token =
                prefs.getString("token", "") ?: ""

            ApiClient.instance.createJugador(
                "Bearer $token",
                jugador
            ).enqueue(object : Callback<ApiResponse> {

                override fun onResponse(
                    call: Call<ApiResponse>,
                    response: Response<ApiResponse>
                ) {

                    if (response.isSuccessful) {

                        Toast.makeText(
                            this@CrearJugadorActivity,
                            "Jugador creado correctamente",
                            Toast.LENGTH_LONG
                        ).show()

                        txtIdUsuario.text.clear()
                        etNombreUsuario.text.clear()
                        txtPosicion.text.clear()
                        txtNumero.text.clear()

                        spActivo.setSelection(0)

                    } else {

                        Toast.makeText(
                            this@CrearJugadorActivity,
                            "Error ${response.code()}",
                            Toast.LENGTH_LONG
                        ).show()

                        Log.e(
                            "API_ERROR",
                            response.errorBody()?.string()
                                ?: "Error desconocido"
                        )
                    }
                }

                override fun onFailure(
                    call: Call<ApiResponse>,
                    t: Throwable
                ) {

                    Toast.makeText(
                        this@CrearJugadorActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()

                    Log.e(
                        "API_ERROR",
                        t.message ?: "Error"
                    )
                }
            })
        }
    }

    private fun cargarEstados() {

        val estados = listOf(
            "Activo",
            "Inactivo"
        )

        val adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            estados
        )

        adapter.setDropDownViewResource(
            android.R.layout.simple_spinner_dropdown_item
        )

        spActivo.adapter = adapter
    }
}