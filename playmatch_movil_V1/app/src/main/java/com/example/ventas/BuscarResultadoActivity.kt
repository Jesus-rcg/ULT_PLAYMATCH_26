package com.example.ventas

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Resultado
import com.example.ventas.databinding.ActivityBuscarResultadoBinding
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class BuscarResultadoActivity : AppCompatActivity() {

    private lateinit var binding: ActivityBuscarResultadoBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityBuscarResultadoBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val token = intent.getStringExtra("token") ?: ""

        binding.btnBuscar.setOnClickListener {

            val id = binding.etId.text.toString().toIntOrNull()

            if (id == null) {
                Toast.makeText(this, "Ingresa un ID válido", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            ApiClient.instance.getResultado("Bearer $token", id)
                .enqueue(object : Callback<Resultado> {
                    override fun onResponse(call: Call<Resultado>, response: Response<Resultado>) {
                        if (response.isSuccessful) {
                            val r = response.body()
                            if (r != null) {
                                binding.tvResultado.text =
                                    "ID: ${r.idResultado}\n" +
                                            "ID Encuentro: ${r.idEncuentro}\n" +
                                            "Goles Local: ${r.golesLocal}\n" +
                                            "Goles Visitante: ${r.golesVisitante}\n" +
                                            "Faltas Local: ${r.faltasLocal}\n" +
                                            "Faltas Visitante: ${r.faltasVisitante}\n" +
                                            "Tarjetas Amarillas: ${r.tarjetasAmarillas}\n" +
                                            "Tarjetas Rojas: ${r.tarjetasRojas}\n" +
                                            "Observaciones: ${r.observaciones}\n" +
                                            "Fecha Creación: ${r.fechaCreacion}"
                            }
                        } else {
                            Toast.makeText(this@BuscarResultadoActivity,
                                "No encontrado: ${response.code()}", Toast.LENGTH_SHORT).show()
                        }
                    }
                    override fun onFailure(call: Call<Resultado>, t: Throwable) {
                        Toast.makeText(this@BuscarResultadoActivity,
                            "Fallo de conexión: ${t.message}", Toast.LENGTH_SHORT).show()
                    }
                })
        }
    }
}