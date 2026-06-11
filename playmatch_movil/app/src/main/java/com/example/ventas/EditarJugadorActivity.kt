package com.example.ventas

import android.content.Context
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Jugador
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import android.util.Log
class EditarJugadorActivity : AppCompatActivity() {

    private lateinit var etNombre: EditText
    private lateinit var etApellido: EditText
    private lateinit var etDocumento: EditText
    private lateinit var etNumero: EditText
    private lateinit var etEstado: EditText

    private lateinit var btnActualizar: Button

    // ================= BOTONES LAPIZ =================

    private lateinit var btnEditarNombre: ImageButton
    private lateinit var btnEditarApellido: ImageButton
    private lateinit var btnEditarDocumento: ImageButton
    private lateinit var btnEditarNumero: ImageButton
    private lateinit var btnEditarEstado: ImageButton

    private var idJugador = 0
    private var idEquipo = 0

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_editar_jugador)

        // ================= VINCULAR XML =================

        etNombre = findViewById(R.id.etNombre)

        etApellido = findViewById(R.id.etApellido)

        etDocumento = findViewById(R.id.etDocumento)

        etNumero = findViewById(R.id.etNumero)

        etEstado = findViewById(R.id.etEstado)

        btnActualizar = findViewById(R.id.btnActualizar)

        // ================= BOTONES EDITAR =================

        btnEditarNombre =
            findViewById(R.id.btnEditarNombre)

        btnEditarApellido =
            findViewById(R.id.btnEditarApellido)

        btnEditarDocumento =
            findViewById(R.id.btnEditarDocumento)

        btnEditarNumero =
            findViewById(R.id.btnEditarNumero)

        btnEditarEstado =
            findViewById(R.id.btnEditarEstado)

        // ================= RECIBIR DATOS =================

        idJugador = intent.getIntExtra(
            "id_jugador",
            0
        )

        idEquipo = intent.getIntExtra(
            "id_equipo",
            0
        )

        etNombre.setText(
            intent.getStringExtra("nombre")
        )

        etApellido.setText(
            intent.getStringExtra("apellido")
        )

        etDocumento.setText(
            intent.getStringExtra("documento")
        )

        etNumero.setText(
            intent.getStringExtra("numero_camiseta")
        )

        etEstado.setText(
            intent.getStringExtra("estado")
        )

        // ================= DESHABILITAR CAMPOS =================

        etNombre.isEnabled = false
        etApellido.isEnabled = false
        etDocumento.isEnabled = false
        etNumero.isEnabled = false
        etEstado.isEnabled = false

        // ================= LAPICES =================

        btnEditarNombre.setOnClickListener {

            etNombre.isEnabled = true
            etNombre.requestFocus()
        }

        btnEditarApellido.setOnClickListener {

            etApellido.isEnabled = true
            etApellido.requestFocus()
        }

        btnEditarDocumento.setOnClickListener {

            etDocumento.isEnabled = true
            etDocumento.requestFocus()
        }

        btnEditarNumero.setOnClickListener {

            etNumero.isEnabled = true
            etNumero.requestFocus()
        }

        btnEditarEstado.setOnClickListener {

            etEstado.isEnabled = true
            etEstado.requestFocus()
        }

        // ================= BOTON ACTUALIZAR =================

        btnActualizar.setOnClickListener {

            actualizarJugador()
        }
    }

    // ================= ACTUALIZAR =================

    private fun actualizarJugador() {

        // ================= TOKEN =================

        val sharedPreferences = getSharedPreferences(
            "login",
            Context.MODE_PRIVATE
        )

        val token = sharedPreferences.getString(
            "token",
            ""
        ) ?: ""

        // ================= VALIDAR =================

        if (
            etNombre.text.toString().trim().isEmpty() ||
            etApellido.text.toString().trim().isEmpty() ||
            etDocumento.text.toString().trim().isEmpty() ||
            etNumero.text.toString().trim().isEmpty() ||
            etEstado.text.toString().trim().isEmpty()
        ) {

            Toast.makeText(
                this,
                "Complete todos los campos",
                Toast.LENGTH_SHORT
            ).show()

            return
        }

        // ================= OBJETO =================

        val jugador = Jugador(

            id_jugador = idJugador,

            id_equipo = idEquipo,

            nombre = etNombre.text.toString(),

            apellido = etApellido.text.toString(),

            documento = etDocumento.text.toString(),

            numero_camiseta = etNumero.text.toString(),

            estado = etEstado.text.toString()
        )

        // ================= PETICION =================

        ApiClient.instance.actualizarJugadores(

            "Bearer $token",

            idJugador,

            jugador

        ).enqueue(object : Callback<Void> {

            override fun onResponse(
                call: Call<Void>,
                response: Response<Void>
            ) {

                if (response.isSuccessful) {

                    Toast.makeText(
                        this@EditarJugadorActivity,
                        "Jugador actualizado correctamente",
                        Toast.LENGTH_SHORT
                    ).show()

                    finish()

                } else {

                    Toast.makeText(
                        this@EditarJugadorActivity,
                        "Error: ${response.code()}",
                        Toast.LENGTH_LONG
                    ).show()

                    Log.e(
                        "UPDATE_ERROR",
                        response.errorBody()?.string() ?: "Sin error body"
                    )
                }
            }

            override fun onFailure(
                call: Call<Void>,
                t: Throwable
            ) {

                Toast.makeText(
                    this@EditarJugadorActivity,
                    "Error: ${t.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }
}