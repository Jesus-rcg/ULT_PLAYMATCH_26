package com.example.ventas

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Encuentro
import com.example.ventas.databinding.ActivityBuscarEncuentroBinding
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class BuscarEncuentroActivity : AppCompatActivity() {

    private lateinit var binding: ActivityBuscarEncuentroBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityBuscarEncuentroBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val token = intent.getStringExtra("token") ?: ""

        binding.btnBuscar.setOnClickListener {

            val id = binding.etId.text.toString().toIntOrNull()

            if (id == null) {
                Toast.makeText(this, "Ingresa un ID válido", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            ApiClient.instance.getEncuentro("Bearer $token", id)
                .enqueue(object : Callback<Encuentro> {
                    override fun onResponse(call: Call<Encuentro>, response: Response<Encuentro>) {
                        if (response.isSuccessful) {
                            val e = response.body()
                            if (e != null) {
                                binding.tvResultado.text =
                                    "ID: ${e.idEncuentro}\n" +
                                            "Torneo: ${e.idTorneo}\n" +
                                            "Local: ${e.idEquipoLocal}\n" +
                                            "Visitante: ${e.idEquipoVisitante}\n" +
                                            "Fecha: ${e.fecha}\n" +
                                            "Lugar: ${e.lugar}\n" +
                                            "Jornada: ${e.jornada}\n" +
                                            "Árbitro: ${e.idArbitro}\n" +
                                            "Estado: ${e.estado}"
                            }
                        } else {
                            Toast.makeText(this@BuscarEncuentroActivity,
                                "No encontrado: ${response.code()}", Toast.LENGTH_SHORT).show()
                        }
                    }
                    override fun onFailure(call: Call<Encuentro>, t: Throwable) {
                        Toast.makeText(this@BuscarEncuentroActivity,
                            "Fallo de conexión: ${t.message}", Toast.LENGTH_SHORT).show()
                    }
                })
        }
    }
}