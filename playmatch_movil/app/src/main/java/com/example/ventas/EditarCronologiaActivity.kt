package com.example.ventas.ui.cronologias

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.R
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Cronologia
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EditarCronologiaActivity : AppCompatActivity() {

    private lateinit var spEvento: Spinner
    private var idCronologia: Int = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_editar_cronologia)

        spEvento     = findViewById(R.id.spEvento)
        idCronologia = intent.getIntExtra("ID", 0)
        val eventoActual = intent.getStringExtra("EVENTO") ?: "Gol"

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener { finish() }

        val eventos = listOf("Gol", "Amarilla", "Roja")
        val adapter = ArrayAdapter(this,
            android.R.layout.simple_spinner_dropdown_item, eventos)
        spEvento.adapter = adapter
        spEvento.setSelection(eventos.indexOf(eventoActual).coerceAtLeast(0))

        findViewById<Button>(R.id.btnGuardar).setOnClickListener {
            guardar()
        }
    }

    private fun guardar() {
        val token = getSharedPreferences("app", MODE_PRIVATE).getString("token", "") ?: ""
        val cronologia = Cronologia(evento = spEvento.selectedItem.toString())

        ApiClient.instance.updateCronologia("Bearer $token", idCronologia, cronologia)
            .enqueue(object : Callback<Void> {
                override fun onResponse(call: Call<Void>, response: Response<Void>) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@EditarCronologiaActivity,
                            "✅ Cronología actualizada", Toast.LENGTH_LONG).show()
                        setResult(RESULT_OK)
                        finish()
                    } else {
                        Toast.makeText(this@EditarCronologiaActivity,
                            "❌ Error ${response.code()}", Toast.LENGTH_LONG).show()
                    }
                }
                override fun onFailure(call: Call<Void>, t: Throwable) {
                    Toast.makeText(this@EditarCronologiaActivity,
                        "❌ Error de conexión: ${t.message}", Toast.LENGTH_LONG).show()
                }
            })
    }
}