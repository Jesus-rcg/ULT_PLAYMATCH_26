package com.example.ventas

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Resultado
import com.example.ventas.databinding.ActivityEditarResultadoBinding
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EditarResultadoActivity : AppCompatActivity() {

    private lateinit var binding: ActivityEditarResultadoBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEditarResultadoBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val token = intent.getStringExtra("token") ?: ""

        // Primero cargamos el resultado por ID
        binding.btnCargar.setOnClickListener {

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
                                binding.etIdEncuentro.setText(r.idEncuentro.toString())
                                binding.etGolesLocal.setText(r.golesLocal.toString())
                                binding.etGolesVisitante.setText(r.golesVisitante.toString())
                                binding.etFaltasLocal.setText(r.faltasLocal.toString())
                                binding.etFaltasVisitante.setText(r.faltasVisitante.toString())
                                binding.etTarjetasAmarillas.setText(r.tarjetasAmarillas)
                                binding.etTarjetasRojas.setText(r.tarjetasRojas)
                                binding.etObservaciones.setText(r.observaciones)
                            }
                        } else {
                            Toast.makeText(this@EditarResultadoActivity,
                                "No encontrado: ${response.code()}", Toast.LENGTH_SHORT).show()
                        }
                    }
                    override fun onFailure(call: Call<Resultado>, t: Throwable) {
                        Toast.makeText(this@EditarResultadoActivity,
                            "Fallo de conexión: ${t.message}", Toast.LENGTH_SHORT).show()
                    }
                })
        }

        // Luego guardamos los cambios
        binding.btnGuardar.setOnClickListener {

            val id              = binding.etId.text.toString().toIntOrNull()
            val idEncuentro     = binding.etIdEncuentro.text.toString().toIntOrNull()
            val golesLocal      = binding.etGolesLocal.text.toString().toIntOrNull() ?: 0
            val golesVisitante  = binding.etGolesVisitante.text.toString().toIntOrNull() ?: 0
            val faltasLocal     = binding.etFaltasLocal.text.toString().toIntOrNull() ?: 0
            val faltasVisitante = binding.etFaltasVisitante.text.toString().toIntOrNull() ?: 0
            val amarillas       = binding.etTarjetasAmarillas.text.toString()
            val rojas           = binding.etTarjetasRojas.text.toString()
            val observaciones   = binding.etObservaciones.text.toString()

            if (id == null || idEncuentro == null) {
                Toast.makeText(this, "Completa los campos obligatorios", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val resultado = Resultado(
                idEncuentro       = idEncuentro,
                golesLocal        = golesLocal,
                golesVisitante    = golesVisitante,
                faltasLocal       = faltasLocal,
                faltasVisitante   = faltasVisitante,
                tarjetasAmarillas = amarillas,
                tarjetasRojas     = rojas,
                observaciones     = observaciones
            )

            ApiClient.instance.updateResultado("Bearer $token", id, resultado)
                .enqueue(object : Callback<Void> {
                    override fun onResponse(call: Call<Void>, response: Response<Void>) {
                        if (response.isSuccessful) {
                            Toast.makeText(this@EditarResultadoActivity,
                                "Resultado actualizado correctamente", Toast.LENGTH_SHORT).show()
                            finish()
                        } else {
                            Toast.makeText(this@EditarResultadoActivity,
                                "Error: ${response.code()}", Toast.LENGTH_SHORT).show()
                        }
                    }
                    override fun onFailure(call: Call<Void>, t: Throwable) {
                        Toast.makeText(this@EditarResultadoActivity,
                            "Fallo de conexión: ${t.message}", Toast.LENGTH_SHORT).show()
                    }
                })
        }
    }
}