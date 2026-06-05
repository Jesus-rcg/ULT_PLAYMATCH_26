package com.example.ventas

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Encuentro
import com.example.ventas.databinding.ActivityCrearEncuentroBinding
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CrearEncuentroActivity : AppCompatActivity() {

    private lateinit var binding: ActivityCrearEncuentroBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCrearEncuentroBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val token = intent.getStringExtra("token") ?: ""

        binding.btnGuardar.setOnClickListener {

            val idTorneo    = binding.etIdTorneo.text.toString().toIntOrNull()
            val idLocal     = binding.etIdEquipoLocal.text.toString().toIntOrNull()
            val idVisitante = binding.etIdEquipoVisitante.text.toString().toIntOrNull()
            val fecha       = binding.etFecha.text.toString()
            val lugar       = binding.etLugar.text.toString()
            val jornada     = binding.etJornada.text.toString()
            val idArbitro   = binding.etIdArbitro.text.toString().toIntOrNull()
            val estado      = binding.etEstado.text.toString()

            if (idTorneo == null || idLocal == null || idVisitante == null || fecha.isEmpty()) {
                Toast.makeText(this, "Completa los campos obligatorios", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val encuentro = Encuentro(
                idTorneo         = idTorneo,
                idEquipoLocal    = idLocal,
                idEquipoVisitante = idVisitante,
                fecha            = fecha,
                lugar            = lugar,
                jornada          = jornada,
                idArbitro        = idArbitro,
                estado           = estado
            )

            ApiClient.instance.createEncuentro("Bearer $token", encuentro)
                .enqueue(object : Callback<Encuentro> {
                    override fun onResponse(call: Call<Encuentro>, response: Response<Encuentro>) {
                        if (response.isSuccessful) {
                            Toast.makeText(this@CrearEncuentroActivity,
                                "Encuentro creado correctamente", Toast.LENGTH_SHORT).show()
                            finish()
                        } else {
                            Toast.makeText(this@CrearEncuentroActivity,
                                "Error: ${response.code()}", Toast.LENGTH_SHORT).show()
                        }
                    }
                    override fun onFailure(call: Call<Encuentro>, t: Throwable) {
                        Toast.makeText(this@CrearEncuentroActivity,
                            "Fallo de conexión: ${t.message}", Toast.LENGTH_SHORT).show()
                    }
                })
        }
    }
}