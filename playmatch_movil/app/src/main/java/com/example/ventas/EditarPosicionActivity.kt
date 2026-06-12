package com.example.ventas

import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.PosicionRequest
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EditarPosicionActivity : AppCompatActivity() {

    private lateinit var etJugados: EditText
    private lateinit var etGanados: EditText
    private lateinit var etEmpatados: EditText
    private lateinit var etPerdidos: EditText
    private lateinit var etGF: EditText
    private lateinit var etGC: EditText
    private lateinit var txtIdPosicion: TextView
    private lateinit var txtTorneo: TextView
    private lateinit var txtEquipo: TextView

    private var idPosicion: Int = 0
    private var idTorneo: Int = 0
    private var idEquipo: Int = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_editar_posicion)

        txtIdPosicion = findViewById(R.id.txtIdPosicion)
        txtTorneo = findViewById(R.id.txtTorneo)
        txtEquipo = findViewById(R.id.txtEquipo)
        etJugados = findViewById(R.id.etJugados)
        etGanados = findViewById(R.id.etGanados)
        etEmpatados = findViewById(R.id.etEmpatados)
        etPerdidos = findViewById(R.id.etPerdidos)
        etGF = findViewById(R.id.etGF)
        etGC = findViewById(R.id.etGC)

        // Recibir datos del intent
        idPosicion = intent.getIntExtra("ID_POSICION", 0)
        idTorneo = intent.getIntExtra("ID_TORNEO", 0)
        idEquipo = intent.getIntExtra("ID_EQUIPO", 0)
        val torneoNombre = intent.getStringExtra("TORNEO") ?: ""
        val equipoNombre = intent.getStringExtra("EQUIPO") ?: ""
        val jugados = intent.getIntExtra("JUGADOS", 0)
        val ganados = intent.getIntExtra("GANADOS", 0)
        val empatados = intent.getIntExtra("EMPATADOS", 0)
        val perdidos = intent.getIntExtra("PERDIDOS", 0)
        val gf = intent.getIntExtra("GF", 0)
        val gc = intent.getIntExtra("GC", 0)

        if (idPosicion == 0) {
            Toast.makeText(this, "ID inválido", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        // Mostrar datos actuales
        txtIdPosicion.text = "ID: #$idPosicion"
        txtTorneo.text = torneoNombre
        txtEquipo.text = equipoNombre
        etJugados.setText(jugados.toString())
        etGanados.setText(ganados.toString())
        etEmpatados.setText(empatados.toString())
        etPerdidos.setText(perdidos.toString())
        etGF.setText(gf.toString())
        etGC.setText(gc.toString())

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        findViewById<Button>(R.id.btnGuardar).setOnClickListener {
            actualizarPosicion()
        }
    }

    private fun actualizarPosicion() {
        val jugados = etJugados.text.toString().toIntOrNull() ?: 0
        val ganados = etGanados.text.toString().toIntOrNull() ?: 0
        val empatados = etEmpatados.text.toString().toIntOrNull() ?: 0
        val perdidos = etPerdidos.text.toString().toIntOrNull() ?: 0
        val gf = etGF.text.toString().toIntOrNull() ?: 0
        val gc = etGC.text.toString().toIntOrNull() ?: 0

        // Crear objeto con los datos actualizados (sin puntos, ni dg, ni posicion_real)
        val posicionRequest = PosicionRequest(
            id_torneo = idTorneo,
            id_equipo = idEquipo,
            jugados = jugados,
            ganados = ganados,
            empatados = empatados,
            perdidos = perdidos,
            gf = gf,
            gc = gc
        )

        val token = getSharedPreferences("app", MODE_PRIVATE)
            .getString("token", "") ?: ""

        ApiClient.instance.updatePosicion("Bearer $token", idPosicion, posicionRequest)
            .enqueue(object : Callback<Void> {
                override fun onResponse(call: Call<Void>, response: Response<Void>) {
                    if (response.isSuccessful) {
                        Toast.makeText(
                            this@EditarPosicionActivity,
                            "Posición actualizada correctamente",
                            Toast.LENGTH_LONG
                        ).show()
                        setResult(RESULT_OK)
                        finish()
                    } else {
                        val errorBody = response.errorBody()?.string() ?: "Error desconocido"
                        Toast.makeText(
                            this@EditarPosicionActivity,
                            "Error ${response.code()}: $errorBody",
                            Toast.LENGTH_LONG
                        ).show()
                        Log.e("API_ERROR", errorBody)
                    }
                }

                override fun onFailure(call: Call<Void>, t: Throwable) {
                    Toast.makeText(
                        this@EditarPosicionActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()
                    Log.e("API_ERROR", t.message.toString())
                }
            })
    }
}