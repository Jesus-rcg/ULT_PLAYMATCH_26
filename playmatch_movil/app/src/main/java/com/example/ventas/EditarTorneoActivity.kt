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
import com.example.ventas.model.Torneo
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EditarTorneoActivity : AppCompatActivity() {

    private lateinit var etIdUsuario: EditText
    private lateinit var etNombreTorneo: EditText
    private lateinit var spCategoria: Spinner
    private lateinit var spTipoTorneo: Spinner
    private lateinit var etCiudad: EditText
    private lateinit var etFechaInicio: EditText
    private lateinit var etFechaFin: EditText
    private lateinit var spEstado: Spinner
    private lateinit var spActivo: Spinner
    private lateinit var btnActualizar: Button

    private var idTorneo = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_editar_torneo)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        etIdUsuario = findViewById(R.id.etIdUsuario)
        etNombreTorneo = findViewById(R.id.etNombreTorneo)
        spCategoria = findViewById(R.id.spCategoria)
        spTipoTorneo = findViewById(R.id.spTipoTorneo)
        etCiudad = findViewById(R.id.etCiudad)
        etFechaInicio = findViewById(R.id.etFechaInicio)
        etFechaFin = findViewById(R.id.etFechaFin)
        spEstado = findViewById(R.id.spEstado)
        spActivo = findViewById(R.id.spActivo)
        btnActualizar = findViewById(R.id.btnActualizar)

        cargarSpinners()

        idTorneo = intent.getIntExtra("id_torneo", 0)

        if (idTorneo == 0) {
            Toast.makeText(
                this,
                "ID de torneo inválido",
                Toast.LENGTH_LONG
            ).show()
            finish()
            return
        }

        cargarTorneo()

        btnActualizar.setOnClickListener {
            actualizarTorneo()
        }
    }

    private fun cargarSpinners() {

        val categorias = listOf(
            "Amateur",
            "Profesional",
            "Semiprofesional"
        )

        val tipos = listOf(
            "Liga",
            "Grupos",
            "Eliminacion Directa"
        )

        val estados = listOf(
            "Inscripciones Abiertas",
            "Comenzo",
            "Finalizado"
        )

        val activos = listOf(
            "Activo",
            "Inactivo"
        )

        spCategoria.adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            categorias
        )

        spTipoTorneo.adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            tipos
        )

        spEstado.adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            estados
        )

        spActivo.adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            activos
        )
    }

    private fun cargarTorneo() {

        val token = getSharedPreferences(
            "app",
            MODE_PRIVATE
        ).getString("token", "") ?: ""

        ApiClient.instance.getTorneo(
            "Bearer $token",
            idTorneo
        ).enqueue(object : Callback<Torneo> {

            override fun onResponse(
                call: Call<Torneo>,
                response: Response<Torneo>
            ) {

                if (response.isSuccessful) {

                    val torneo = response.body()

                    torneo?.let {

                        etIdUsuario.setText(it.id_usuario.toString())
                        etNombreTorneo.setText(it.nombre_torneo)
                        etCiudad.setText(it.ciudad)
                        etFechaInicio.setText(it.fecha_inicio)
                        etFechaFin.setText(it.fecha_fin)

                        seleccionarItem(
                            spCategoria,
                            it.categoria
                        )

                        seleccionarItem(
                            spTipoTorneo,
                            it.tipo_torneo
                        )

                        seleccionarItem(
                            spEstado,
                            it.estado
                        )

                        spActivo.setSelection(
                            if (it.activo == 1) 0 else 1
                        )
                    }

                } else {

                    Toast.makeText(
                        this@EditarTorneoActivity,
                        "Error al cargar torneo",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }

            override fun onFailure(
                call: Call<Torneo>,
                t: Throwable
            ) {

                Toast.makeText(
                    this@EditarTorneoActivity,
                    t.message,
                    Toast.LENGTH_LONG
                ).show()

                Log.e(
                    "GET_TORNEO",
                    t.message ?: ""
                )
            }
        })
    }

    private fun actualizarTorneo() {

        if (
            etIdUsuario.text.isEmpty() ||
            etNombreTorneo.text.isEmpty() ||
            etCiudad.text.isEmpty() ||
            etFechaInicio.text.isEmpty() ||
            etFechaFin.text.isEmpty()
        ) {

            Toast.makeText(
                this,
                "Complete todos los campos",
                Toast.LENGTH_SHORT
            ).show()

            return
        }

        val torneo = Torneo(
            id_torneo = idTorneo,
            id_usuario = etIdUsuario.text.toString().toInt(),
            nombre_torneo = etNombreTorneo.text.toString(),
            categoria = spCategoria.selectedItem.toString(),
            tipo_torneo = spTipoTorneo.selectedItem.toString(),
            ciudad = etCiudad.text.toString(),
            fecha_inicio = etFechaInicio.text.toString(),
            fecha_fin = etFechaFin.text.toString(),
            estado = spEstado.selectedItem.toString(),
            activo =
                if (spActivo.selectedItem.toString() == "Activo")
                    1
                else
                    0
        )

        val token = getSharedPreferences(
            "app",
            MODE_PRIVATE
        ).getString("token", "") ?: ""

        ApiClient.instance.updateTorneo(
            "Bearer $token",
            idTorneo,
            torneo
        ).enqueue(object : Callback<Void> {

            override fun onResponse(
                call: Call<Void>,
                response: Response<Void>
            ) {

                if (response.isSuccessful) {

                    Toast.makeText(
                        this@EditarTorneoActivity,
                        "Torneo actualizado correctamente",
                        Toast.LENGTH_LONG
                    ).show()

                    finish()

                } else {

                    Toast.makeText(
                        this@EditarTorneoActivity,
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
                    this@EditarTorneoActivity,
                    t.message,
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }

    private fun seleccionarItem(
        spinner: Spinner,
        valor: String
    ) {

        for (i in 0 until spinner.count) {

            if (
                spinner.getItemAtPosition(i)
                    .toString() == valor
            ) {

                spinner.setSelection(i)
                break
            }
        }
    }
}