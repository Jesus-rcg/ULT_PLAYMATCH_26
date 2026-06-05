package com.example.ventas

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Encuentro
import com.example.ventas.databinding.ActivityEditarEncuentroBinding
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EditarEncuentroActivity : AppCompatActivity() {

    private lateinit var binding: ActivityEditarEncuentroBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEditarEncuentroBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val token = intent.getStringExtra("token") ?: ""

        // Primero buscamos el encuentro por ID
        binding.btnCargar.setOnClickListener {

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
                                binding.etIdTorneo.setText(e.idTorneo.toString())
                                binding.etIdEquipoLocal.setText(e.idEquipoLocal.toString())
                                binding.etIdEquipoVisitante.setText(e.idEquipoVisitante.toString())
                                binding.etFecha.setText(e.fecha)
                                binding.etLugar.setText(e.lugar)
                                binding.etJornada.setText(e.jornada)
                                binding.etIdArbitro.setText(e.idArbitro?.toString())
                                binding.etEstado.setText(e.estado)
                            }
                        } else {
                            Toast.makeText(this@EditarEncuentroActivity,
                                "No encontrado: ${response.code()}", Toast.LENGTH_SHORT).show()
                        }
                    }
                    override fun onFailure(call: Call<Encuentro>, t: Throwable) {
                        Toast.makeText(this@EditarEncuentroActivity,
                            "Fallo de conexión: ${t.message}", Toast.LENGTH_SHORT).show()
                    }
                })
        }

        // Luego guardamos los cambios
        binding.btnGuardar.setOnClickListener {

            val id          = binding.etId.text.toString().toIntOrNull()
            val idTorneo    = binding.etIdTorneo.text.toString().toIntOrNull()
            val idLocal     = binding.etIdEquipoLocal.text.toString().toIntOrNull()
            val idVisitante = binding.etIdEquipoVisitante.text.toString().toIntOrNull()
            val fecha       = binding.etFecha.text.toString()
            val lugar       = binding.etLugar.text.toString()
            val jornada     = binding.etJornada.text.toString()
            val idArbitro   = binding.etIdArbitro.text.toString().toIntOrNull()
            val estado      = binding.etEstado.text.toString()

            if (id == null || idTorneo == null || idLocal == null || idVisitante == null || fecha.isEmpty()) {
                Toast.makeText(this, "Completa los campos obligatorios", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val encuentro = Encuentro(
                idTorneo          = idTorneo,
                idEquipoLocal     = idLocal,
                idEquipoVisitante = idVisitante,
                fecha             = fecha,
                lugar             = lugar,
                jornada           = jornada,
                idArbitro         = idArbitro,
                estado            = estado
            )

            ApiClient.instance.updateEncuentro("Bearer $token", id, encuentro)
                .enqueue(object : Callback<Void> {
                    override fun onResponse(call: Call<Void>, response: Response<Void>) {
                        if (response.isSuccessful) {
                            Toast.makeText(this@EditarEncuentroActivity,
                                "Encuentro actualizado correctamente", Toast.LENGTH_SHORT).show()
                            finish()
                        } else {
                            Toast.makeText(this@EditarEncuentroActivity,
                                "Error: ${response.code()}", Toast.LENGTH_SHORT).show()
                        }
                    }
                    override fun onFailure(call: Call<Void>, t: Throwable) {
                        Toast.makeText(this@EditarEncuentroActivity,
                            "Fallo de conexión: ${t.message}", Toast.LENGTH_SHORT).show()
                    }
                })
        }
    }
}