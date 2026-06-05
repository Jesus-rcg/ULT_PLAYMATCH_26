package com.example.ventas

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Encuentro
import com.example.ventas.databinding.ActivityListaEncuentrosBinding
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ListaEncuentrosActivity : AppCompatActivity() {

    private lateinit var binding: ActivityListaEncuentrosBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityListaEncuentrosBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val token = intent.getStringExtra("token") ?: ""

        ApiClient.instance.getEncuentros("Bearer $token")
            .enqueue(object : Callback<List<Encuentro>> {
                override fun onResponse(
                    call: Call<List<Encuentro>>,
                    response: Response<List<Encuentro>>
                ) {
                    if (response.isSuccessful) {
                        val lista = response.body()
                        if (!lista.isNullOrEmpty()) {
                            val sb = StringBuilder()
                            for (e in lista) {
                                sb.append("━━━━━━━━━━━━━━━━━━━━\n")
                                sb.append("ID: ${e.idEncuentro}\n")
                                sb.append("Torneo: ${e.idTorneo}\n")
                                sb.append("Local: ${e.idEquipoLocal}\n")
                                sb.append("Visitante: ${e.idEquipoVisitante}\n")
                                sb.append("Fecha: ${e.fecha}\n")
                                sb.append("Lugar: ${e.lugar}\n")
                                sb.append("Jornada: ${e.jornada}\n")
                                sb.append("Árbitro: ${e.idArbitro}\n")
                                sb.append("Estado: ${e.estado}\n\n")
                            }
                            binding.tvLista.text = sb.toString()
                        } else {
                            binding.tvLista.text = "No hay encuentros registrados"
                        }
                    } else {
                        Toast.makeText(this@ListaEncuentrosActivity,
                            "Error: ${response.code()}", Toast.LENGTH_SHORT).show()
                    }
                }
                override fun onFailure(call: Call<List<Encuentro>>, t: Throwable) {
                    Toast.makeText(this@ListaEncuentrosActivity,
                        "Fallo de conexión: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
    }
}