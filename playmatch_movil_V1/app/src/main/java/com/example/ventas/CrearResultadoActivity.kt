package com.example.ventas

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Resultado
import com.example.ventas.databinding.ActivityCrearResultadoBinding
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CrearResultadoActivity : AppCompatActivity() {

    private lateinit var binding: ActivityCrearResultadoBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCrearResultadoBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val token = intent.getStringExtra("token") ?: ""

        binding.btnGuardar.setOnClickListener {

            val idEncuentro     = binding.etIdEncuentro.text.toString().toIntOrNull()
            val golesLocal      = binding.etGolesLocal.text.toString().toIntOrNull() ?: 0
            val golesVisitante  = binding.etGolesVisitante.text.toString().toIntOrNull() ?: 0
            val faltasLocal     = binding.etFaltasLocal.text.toString().toIntOrNull() ?: 0
            val faltasVisitante = binding.etFaltasVisitante.text.toString().toIntOrNull() ?: 0
            val amarillas       = binding.etTarjetasAmarillas.text.toString()
            val rojas           = binding.etTarjetasRojas.text.toString()
            val observaciones   = binding.etObservaciones.text.toString()

            if (idEncuentro == null) {
                Toast.makeText(this, "Ingresa el ID del encuentro", Toast.LENGTH_SHORT).show()
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

            ApiClient.instance.createResultado("Bearer $token", resultado)
                .enqueue(object : Callback<Resultado> {
                    override fun onResponse(call: Call<Resultado>, response: Response<Resultado>) {
                        if (response.isSuccessful) {
                            Toast.makeText(this@CrearResultadoActivity,
                                "Resultado creado correctamente", Toast.LENGTH_SHORT).show()
                            finish()
                        } else {
                            Toast.makeText(this@CrearResultadoActivity,
                                "Error: ${response.code()}", Toast.LENGTH_SHORT).show()
                        }
                    }
                    override fun onFailure(call: Call<Resultado>, t: Throwable) {
                        Toast.makeText(this@CrearResultadoActivity,
                            "Fallo de conexión: ${t.message}", Toast.LENGTH_SHORT).show()
                    }
                })
        }
    }
}