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
    import com.example.ventas.model.Jugador
    import retrofit2.Call
    import retrofit2.Callback
    import retrofit2.Response

    class EditarJugadorActivity : AppCompatActivity() {

        private lateinit var etIdUsuario: EditText

        private lateinit var etNombreUsuario: EditText

        private lateinit var etPosicion: EditText
        private lateinit var etNumero: EditText
        private lateinit var spActivo: Spinner
        private lateinit var btnActualizar: Button

        private var idJugador = 0

        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            setContentView(R.layout.activity_editar_jugador)

            findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
                finish()
            }

            etIdUsuario = findViewById(R.id.etIdUsuario)
            etNombreUsuario = findViewById(R.id.etNombre_usuario)
            etPosicion = findViewById(R.id.etPosicion)
            etNumero = findViewById(R.id.etNumero)
            spActivo = findViewById(R.id.spActivo)
            btnActualizar = findViewById(R.id.btnActualizar)

            cargarEstados()

            // Solo recibimos el ID
            idJugador = intent.getIntExtra("id_jugador", 0)

            if (idJugador == 0) {
                Toast.makeText(
                    this,
                    "ID de jugador inválido",
                    Toast.LENGTH_LONG
                ).show()
                finish()
                return
            }

            // Cargar datos desde la BD
            cargarJugador()

            btnActualizar.setOnClickListener {
                actualizarJugador()
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

        private fun cargarJugador() {

            val prefs =
                getSharedPreferences("app", MODE_PRIVATE)

            val token =
                prefs.getString("token", "") ?: ""

            ApiClient.instance.getJugador(
                "Bearer $token",
                idJugador
            ).enqueue(object : Callback<Jugador> {



                override fun onResponse(
                    call: Call<Jugador>,
                    response: Response<Jugador>
                ) {

                    if (response.isSuccessful) {

                        val jugador = response.body()

                        if (jugador != null) {

                            etIdUsuario.setText(
                                jugador.id_usuario.toString()
                            )

                            etNombreUsuario.setText(
                                jugador.nombre_usuario
                            )

                            etPosicion.setText(
                                jugador.posicion
                            )

                            etNumero.setText(
                                jugador.numero_camiseta.toString()
                            )

                            spActivo.setSelection(
                                if (jugador.activo == 1) 0 else 1
                            )
                        }

                    } else {

                        Toast.makeText(
                            this@EditarJugadorActivity,
                            "Error al cargar jugador",
                            Toast.LENGTH_LONG
                        ).show()

                        Log.e(
                            "GET_JUGADOR",
                            response.errorBody()?.string()
                                ?: "Error desconocido"
                        )
                    }
                }

                override fun onFailure(
                    call: Call<Jugador>,
                    t: Throwable
                ) {

                    Toast.makeText(
                        this@EditarJugadorActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()

                    Log.e(
                        "GET_JUGADOR",
                        t.message ?: "Error"
                    )
                }
            })
        }

        private fun actualizarJugador() {

            if (
                etIdUsuario.text.isEmpty() ||
                etPosicion.text.isEmpty() ||
                etNumero.text.isEmpty()
            ) {

                Toast.makeText(
                    this,
                    "Complete todos los campos",
                    Toast.LENGTH_SHORT
                ).show()

                return
            }

            val activo =
                if (spActivo.selectedItem.toString() == "Activo")
                    1
                else
                    0

            val jugador = Jugador(
                id_jugador = idJugador,
                id_usuario = etIdUsuario.text.toString().toInt(),
                nombre_usuario = etNombreUsuario.text.toString(),
                posicion = etPosicion.text.toString(),
                numero_camiseta = etNumero.text.toString().toInt(),
                activo = activo
            )

            val prefs =
                getSharedPreferences("app", MODE_PRIVATE)

            val token =
                prefs.getString("token", "") ?: ""

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
                            Toast.LENGTH_LONG
                        ).show()

                        finish()

                    } else {

                        Toast.makeText(
                            this@EditarJugadorActivity,
                            "Error ${response.code()}",
                            Toast.LENGTH_LONG
                        ).show()

                        Log.e(
                            "UPDATE_ERROR",
                            response.errorBody()?.string()
                                ?: "Error desconocido"
                        )
                    }
                }

                override fun onFailure(
                    call: Call<Void>,
                    t: Throwable
                ) {

                    Toast.makeText(
                        this@EditarJugadorActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()

                    Log.e(
                        "UPDATE_ERROR",
                        t.message ?: "Error"
                    )
                }
            })
        }
    }