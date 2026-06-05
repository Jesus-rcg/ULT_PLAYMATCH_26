package com.example.ventas

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.databinding.ActivityEliminarResultadoBinding
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EliminarResultadoActivity : AppCompatActivity() {

    private lateinit var binding: ActivityEliminarResultadoBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEliminarResultadoBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val token = intent.getStringExtra("token") ?: ""

        binding.btnEliminar.setOnClickListener {

            val id = binding.etId.text.toString().toIntOrNull()

            if (id == null) {
                Toast.makeText(this, "Ingresa un ID válido", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            ApiClient.instance.deleteResultado("Bearer $token", id)
                .enqueue(object : Callback<Void> {
                    override fun onResponse(call: Call<Void>, response: Response<Void>) {
                        if (response.isSuccessful) {
                            Toast.makeText(this@EliminarResultadoActivity,
                                "Resultado eliminado correctamente", Toast.LENGTH_SHORT).show()
                            finish()
                        } else {
                            Toast.makeText(this@EliminarResultadoActivity,
                                "Error: ${response.code()}", Toast.LENGTH_SHORT).show()
                        }
                    }
                    override fun onFailure(call: Call<Void>, t: Throwable) {
                        Toast.makeText(this@EliminarResultadoActivity,
                            "Fallo de conexión: ${t.message}", Toast.LENGTH_SHORT).show()
                    }
                })
        }
    }
}