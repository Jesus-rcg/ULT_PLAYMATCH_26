package com.example.ventas

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Resultado
import com.example.ventas.databinding.ActivityListaResultadosBinding
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ListaResultadosActivity : AppCompatActivity() {

    private lateinit var binding: ActivityListaResultadosBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityListaResultadosBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val token = intent.getStringExtra("token") ?: ""

        ApiClient.instance.getResultados("Bearer $token")
            .enqueue(object : Callback<List<Resultado>> {
                override fun onResponse(
                    call: Call<List<Resultado>>,
                    response: Response<List<Resultado>>
                ) {
                    if (response.isSuccessful) {
                        val lista = response.body()
                        if (!lista.isNullOrEmpty()) {
                            val sb = StringBuilder()
                            for (r in lista) {
                                sb.append("━━━━━━━━━━━━━━━━━━━━\n")
                                sb.append("ID: ${r.idResultado}\n")
                                sb.append("ID Encuentro: ${r.idEncuentro}\n")
                                sb.append("Goles Local: ${r.golesLocal}\n")
                                sb.append("Goles Visitante: ${r.golesVisitante}\n")
                                sb.append("Faltas Local: ${r.faltasLocal}\n")
                                sb.append("Faltas Visitante: ${r.faltasVisitante}\n")
                                sb.append("Tarjetas Amarillas: ${r.tarjetasAmarillas}\n")
                                sb.append("Tarjetas Rojas: ${r.tarjetasRojas}\n")
                                sb.append("Observaciones: ${r.observaciones}\n")
                                sb.append("Fecha Creación: ${r.fechaCreacion}\n\n")
                            }
                            binding.tvLista.text = sb.toString()
                        } else {
                            binding.tvLista.text = "No hay resultados registrados"
                        }
                    } else {
                        Toast.makeText(this@ListaResultadosActivity,
                            "Error: ${response.code()}", Toast.LENGTH_SHORT).show()
                    }
                }
                override fun onFailure(call: Call<List<Resultado>>, t: Throwable) {
                    Toast.makeText(this@ListaResultadosActivity,
                        "Fallo de conexión: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
    }
}