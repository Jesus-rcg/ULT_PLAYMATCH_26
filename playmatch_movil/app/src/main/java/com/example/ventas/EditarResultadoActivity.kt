package com.example.ventas.ui.resultados

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.R
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Resultado
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EditarResultadoActivity : AppCompatActivity() {

    private lateinit var tvEncuentro: TextView
    private lateinit var etGolesLocal: EditText
    private lateinit var etGolesVisitante: EditText
    private lateinit var btnActualizar: Button

    private var resultadoId: Int = 0
    private var encuentroId: Int = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_editar_resultado)

        tvEncuentro = findViewById(R.id.tvEncuentroEditar)
        etGolesLocal = findViewById(R.id.etGolesLocalEditar)
        etGolesVisitante = findViewById(R.id.etGolesVisitanteEditar)
        btnActualizar = findViewById(R.id.btnActualizar)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        // Recibir datos
        resultadoId = intent.getIntExtra("RESULTADO_ID", 0)
        encuentroId = intent.getIntExtra("RESULTADO_ENCUENTRO", 0)
        val golesLocal = intent.getIntExtra("RESULTADO_GOLES_LOCAL", 0)
        val golesVisitante = intent.getIntExtra("RESULTADO_GOLES_VISITANTE", 0)

        tvEncuentro.text = "Encuentro #$encuentroId"
        etGolesLocal.setText(golesLocal.toString())
        etGolesVisitante.setText(golesVisitante.toString())

        btnActualizar.setOnClickListener { actualizarResultado() }
    }

    private fun actualizarResultado() {
        val golesLocal = etGolesLocal.text.toString().trim()
        val golesVisitante = etGolesVisitante.text.toString().trim()

        if (golesLocal.isEmpty()) { etGolesLocal.error = "Los goles local son obligatorios"; return }
        if (golesVisitante.isEmpty()) { etGolesVisitante.error = "Los goles visitante son obligatorios"; return }

        val prefs = getSharedPreferences("app", MODE_PRIVATE)
        val token = prefs.getString("token", "") ?: ""

        val resultado = Resultado(
            id_resultado = resultadoId,
            id_encuentro = encuentroId,
            goles_local = golesLocal.toInt(),
            goles_visitante = golesVisitante.toInt()
        )

        ApiClient.instance.updateResultado(
            "Bearer $token",
            resultadoId,
            resultado
        ).enqueue(object : Callback<Void> {

            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    Toast.makeText(
                        this@EditarResultadoActivity,
                        "✅ Resultado actualizado correctamente",
                        Toast.LENGTH_SHORT
                    ).show()
                    finish()
                } else {
                    Toast.makeText(
                        this@EditarResultadoActivity,
                        "❌ Error al actualizar: ${response.code()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                Toast.makeText(
                    this@EditarResultadoActivity,
                    "❌ Error de conexión: ${t.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }
}