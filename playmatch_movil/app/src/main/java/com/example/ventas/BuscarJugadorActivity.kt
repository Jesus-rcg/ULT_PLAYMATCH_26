package com.example.ventas

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Jugador
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class BuscarJugadorActivity : AppCompatActivity() {

    private var jugadorEncontrado: Jugador? = null

    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_buscar_jugador)

        // ================= BOTON VOLVER =================

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        // ================= INPUT =================

        val txtBuscar =
            findViewById<EditText>(R.id.txtIdBuscarJugador)

        // ================= CARD RESULTADO =================

        val cardResultado =
            findViewById<CardView>(R.id.cardResultadoJugador)

        // ================= TEXTVIEWS =================

        val tvNombre =
            findViewById<TextView>(R.id.tvNombreJugador)

        val tvApellido =
            findViewById<TextView>(R.id.tvApellidoJugador)

        val tvDocumento =
            findViewById<TextView>(R.id.tvDocumentoJugador)

        val tvNumero =
            findViewById<TextView>(R.id.tvNumeroJugador)

        // ================= BOTONES =================

        val btnBuscarJugador =
            findViewById<Button>(R.id.btnBuscarJugadores)

        val btnEditarJugador =
            findViewById<Button>(R.id.btnEditarJugador)

        // ================= BUSCAR =================

        btnBuscarJugador.setOnClickListener {

            val buscar =
                txtBuscar.text.toString().trim()

            if (buscar.isEmpty()) {

                Toast.makeText(
                    this,
                    "Ingrese un nombre o documento",
                    Toast.LENGTH_LONG
                ).show()

                return@setOnClickListener
            }

            // ================= TOKEN =================

            val prefs =
                getSharedPreferences("app", MODE_PRIVATE)

            val token =
                prefs.getString("token", "") ?: ""

            // ================= PETICION API =================

            ApiClient.instance.buscarJugador(

                "Bearer $token",
                buscar

            ).enqueue(object : Callback<Jugador> {

                override fun onResponse(
                    call: Call<Jugador>,
                    response: Response<Jugador>
                ) {

                    if (
                        response.isSuccessful &&
                        response.body() != null
                    ) {

                        val jugador = response.body()!!

                        jugadorEncontrado = jugador

                        // MOSTRAR CARD

                        cardResultado.visibility = View.VISIBLE

                        // MOSTRAR DATOS

                        tvNombre.text =
                            "ID Usuario: ${jugador.id_usuario}"

                        tvApellido.text =
                            "Posición: ${jugador.posicion}"

                        tvDocumento.text =
                            "Activo: ${if (jugador.activo == 1) "Sí" else "No"}"

                        tvNumero.text =
                            "Número camiseta: ${jugador.numero_camiseta}"

                    } else {

                        cardResultado.visibility = View.GONE

                        Toast.makeText(
                            this@BuscarJugadorActivity,
                            "Jugador no encontrado",
                            Toast.LENGTH_LONG
                        ).show()

                        Log.e(
                            "API_RESPONSE",
                            "Código: ${response.code()}"
                        )
                    }
                }

                override fun onFailure(
                    call: Call<Jugador>,
                    t: Throwable
                ) {

                    cardResultado.visibility = View.GONE

                    Toast.makeText(
                        this@BuscarJugadorActivity,
                        "Error: ${t.message}",
                        Toast.LENGTH_LONG
                    ).show()

                    Log.e(
                        "API_ERROR",
                        t.message.toString()
                    )
                }
            })
        }

        // ================= EDITAR =================

        btnEditarJugador.setOnClickListener {

            if (jugadorEncontrado == null) {

                Toast.makeText(
                    this,
                    "Primero busque un jugador",
                    Toast.LENGTH_SHORT
                ).show()

                return@setOnClickListener
            }

            val jugador = jugadorEncontrado!!

            val intent = Intent(
                this,
                EditarJugadorActivity::class.java
            )

            intent.putExtra(
                "id_jugador",
                jugador.id_jugador
            )

            intent.putExtra(
                "id_usuario",
                jugador.id_usuario
            )

            intent.putExtra(
                "posicion",
                jugador.posicion
            )

            intent.putExtra(
                "activo",
                jugador.activo
            )

            intent.putExtra(
                "numero_camiseta",
                jugador.numero_camiseta
            )


            startActivity(intent)
        }
    }
}