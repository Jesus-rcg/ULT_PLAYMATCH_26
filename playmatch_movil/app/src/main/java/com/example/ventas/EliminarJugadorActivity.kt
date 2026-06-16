package com.example.ventas

import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class EliminarJugadorActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_eliminar_jugador)

        val txtIdJugador =
            findViewById<EditText>(R.id.txtIdJugador)

        val btnEliminar =
            findViewById<Button>(R.id.btnEliminarJugador)

        findViewById<ImageButton>(R.id.btnVolver)
            .setOnClickListener {
                finish()
            }

        btnEliminar.setOnClickListener {

            if (txtIdJugador.text.isEmpty()) {

                Toast.makeText(
                    this,
                    "Ingrese un ID",
                    Toast.LENGTH_SHORT
                ).show()

                return@setOnClickListener
            }

            val idJugador =
                txtIdJugador.text.toString().toInt()

            AlertDialog.Builder(this)
                .setTitle("Eliminar")
                .setMessage("¿Desea eliminar este jugador?")
                .setPositiveButton("Sí") { _, _ ->

                    eliminarJugador(idJugador)
                }
                .setNegativeButton("No", null)
                .show()
        }
    }

    private fun eliminarJugador(idJugador: Int) {

        val prefs =
            getSharedPreferences("app", MODE_PRIVATE)

        val token =
            prefs.getString("token", "") ?: ""

        ApiClient.instance.eliminarJugador(

            "Bearer $token",

            idJugador

        ).enqueue(object : Callback<Void> {

            override fun onResponse(
                call: Call<Void>,
                response: Response<Void>
            ) {

                if (response.isSuccessful) {

                    Toast.makeText(
                        this@EliminarJugadorActivity,
                        "Jugador eliminado",
                        Toast.LENGTH_LONG
                    ).show()

                    finish()

                } else {

                    Toast.makeText(
                        this@EliminarJugadorActivity,
                        "Error ${response.code()}",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }

            override fun onFailure(
                call: Call<Void>,
                t: Throwable
            ) {

                Toast.makeText(
                    this@EliminarJugadorActivity,
                    t.message,
                    Toast.LENGTH_LONG
                ).show()

                Log.e(
                    "DELETE_ERROR",
                    t.message.toString()
                )
            }
        })
    }
}