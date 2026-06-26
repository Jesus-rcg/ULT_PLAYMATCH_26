package com.example.ventas

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.View
import android.widget.EditText
import android.widget.ImageButton
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.ventas.adapter.TorneoAdapter
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Torneo
import com.google.android.material.floatingactionbutton.FloatingActionButton
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class TorneosActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)


        setContentView(R.layout.activity_torneos)

        val recycler = findViewById<RecyclerView>(R.id.recyclerTorneos)
        val txtContador = findViewById<TextView>(R.id.txtContadorTorneos)
        val progressBar = findViewById<ProgressBar>(R.id.progressBarTorneos)
        val edtBuscar = findViewById<EditText>(R.id.edtBuscarTorneos)

        val fabAgregar =
            findViewById<FloatingActionButton>(R.id.fabAgregarTorneo)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        fabAgregar.setOnClickListener {
            startActivity(Intent(this, CrearTorneoActivity::class.java))
        }


        recycler.layoutManager = LinearLayoutManager(this)

        cargarTorneos(
            recycler,
            txtContador,
            progressBar,
            edtBuscar
        )
    }

    private fun cargarTorneos(
        recycler: RecyclerView,
        txtContador: TextView,
        progressBar: ProgressBar,
        edtBuscar: EditText
    ) {

        val token = getSharedPreferences("app", MODE_PRIVATE)
            .getString("token", "") ?: ""

        progressBar.visibility = View.VISIBLE

        ApiClient.instance.getTorneo("Bearer $token")
            .enqueue(object : Callback<List<Torneo>> {

                override fun onResponse(
                    call: Call<List<Torneo>>,
                    response: Response<List<Torneo>>
                ) {

                    progressBar.visibility = View.GONE

                    if (!response.isSuccessful) {

                        Toast.makeText(
                            this@TorneosActivity,
                            "Error ${response.code()}",
                            Toast.LENGTH_LONG
                        ).show()

                        Log.e(
                            "API_TORNEOS",
                            response.errorBody()?.string() ?: ""
                        )

                        return
                    }

                    val lista = response.body() ?: emptyList()

                    txtContador.text = "${lista.size} registros"

                    recycler.adapter = TorneoAdapter(
                        lista,
                        onEditar = { torneo ->
                            abrirEditar(torneo)
                        },
                        onEliminar = { torneo ->
                            confirmarEliminar(torneo)
                        }
                    )

                    edtBuscar.addTextChangedListener(object : TextWatcher {

                        override fun beforeTextChanged(
                            s: CharSequence?,
                            start: Int,
                            count: Int,
                            after: Int
                        ) {
                        }

                        override fun afterTextChanged(s: Editable?) {}

                        override fun onTextChanged(
                            s: CharSequence?,
                            start: Int,
                            before: Int,
                            count: Int
                        ) {

                            val texto =
                                s.toString().lowercase().trim()

                            val filtrada =
                                if (texto.isEmpty()) {
                                    lista
                                } else {
                                    lista.filter {

                                        it.nombre_torneo
                                            .lowercase()
                                            .contains(texto)

                                                ||

                                                it.categoria
                                                    .lowercase()
                                                    .contains(texto)

                                                ||

                                                it.tipo_torneo
                                                    .lowercase()
                                                    .contains(texto)

                                                ||

                                                it.ciudad
                                                    .lowercase()
                                                    .contains(texto)

                                                ||

                                                it.estado
                                                    .lowercase()
                                                    .contains(texto)
                                    }
                                }

                            txtContador.text =
                                "${filtrada.size} registros"

                            recycler.adapter = TorneoAdapter(
                                filtrada,
                                onEditar = { torneo ->
                                    abrirEditar(torneo)
                                },
                                onEliminar = { torneo ->
                                    confirmarEliminar(torneo)
                                }
                            )
                        }
                    })
                }

                override fun onFailure(
                    call: Call<List<Torneo>>,
                    t: Throwable
                ) {

                    progressBar.visibility = View.GONE

                    Toast.makeText(
                        this@TorneosActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()

                    Log.e(
                        "API_TORNEOS",
                        t.message ?: "Error"
                    )
                }
            })
    }

    private fun confirmarEliminar(torneo: Torneo) {

        AlertDialog.Builder(this)
            .setTitle("Eliminar torneo")
            .setMessage(
                "¿Seguro que deseas eliminar ${torneo.nombre_torneo}?"
            )
            .setPositiveButton("Eliminar") { _, _ ->

                eliminarTorneo(
                    torneo.id_torneo ?: 0
                )
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }

    private fun eliminarTorneo(id: Int) {

        val token = getSharedPreferences("app", MODE_PRIVATE)
            .getString("token", "") ?: ""

        ApiClient.instance
            .deleteTorneo(
                "Bearer $token",
                id
            )
            .enqueue(object : Callback<Void> {

                override fun onResponse(
                    call: Call<Void>,
                    response: Response<Void>
                ) {

                    if (response.isSuccessful) {

                        Toast.makeText(
                            this@TorneosActivity,
                            "Torneo eliminado correctamente",
                            Toast.LENGTH_SHORT
                        ).show()

                        recreate()

                    } else {

                        Toast.makeText(
                            this@TorneosActivity,
                            "Error al eliminar torneo",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }

                override fun onFailure(
                    call: Call<Void>,
                    t: Throwable
                ) {

                    Toast.makeText(
                        this@TorneosActivity,
                        t.message,
                        Toast.LENGTH_SHORT
                    ).show()
                }
            })
    }

    private fun abrirEditar(torneo: Torneo) {

        val intent =
            Intent(
                this,
                EditarTorneoActivity::class.java
            )

        intent.putExtra(
            "id_torneo",
            torneo.id_torneo ?: 0
        )

        startActivityForResult(intent, 100)
    }

    override fun onResume() {
        super.onResume()
        recreate()
    }
}
