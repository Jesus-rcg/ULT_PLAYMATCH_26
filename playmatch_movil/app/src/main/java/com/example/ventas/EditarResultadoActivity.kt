package com.example.ventas

import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Encuentro
import com.example.ventas.model.Resultado
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
class EditarResultadoActivity: AppCompatActivity() {

    private lateinit var spinnerEncuentro: Spinner

    private val listaEncuentros = mutableListOf<Encuentro>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_editar_resultado)

        val idResultado = intent.getIntExtra("ID_RESULTADO", 0)
        val idEncuentro = intent.getIntExtra("ID_ENCUENTRO", 0)
        val golesLocalActual = intent.getIntExtra("GOLES_LOCAL", 0)
        val golesVisitanteActual = intent.getIntExtra("GOLES_VISITANTE", 0)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        spinnerEncuentro = findViewById(R.id.spEncuentro)

        val etGolesLocal = findViewById<EditText>(R.id.etGolesLocal)
        val etGolesVisitante = findViewById<EditText>(R.id.etGolesVisitante)

        etGolesLocal.setText(golesLocalActual.toString())
        etGolesVisitante.setText(golesVisitanteActual.toString())

        cargarEncuentros(idEncuentro)

        findViewById<Button>(R.id.btnGuardar).setOnClickListener {

            val golesLocal = etGolesLocal.text.toString().trim()
            val golesVisitante = etGolesVisitante.text.toString().trim()

            if (golesLocal.isEmpty()){
                Toast.makeText(this, "Ingrese goles del equipo local", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }

            if (golesVisitante.isEmpty()){
                Toast.makeText(this, "Ingrese goles del equipo visitante", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }

            val encuentro = listaEncuentros[spinnerEncuentro.selectedItemPosition]

            val resultado = Resultado(
                id_resultado = idResultado,
                id_encuentro = encuentro.id_encuentro,
                goles_local = golesLocal.toInt(),
                goles_visitante = golesVisitante.toInt()
            )

            val token = getSharedPreferences(
                "app",
                MODE_PRIVATE
            ).getString("token", "") ?: ""

            ApiClient.instance.updateResultado(
                "Bearer $token",
                idResultado,
                resultado
            ).enqueue(object: Callback<Void>{

                override fun onResponse(call: Call<Void?>, response: Response<Void?>) {

                    if(response.isSuccessful){
                        Toast.makeText(
                            this@EditarResultadoActivity,
                            "Resultado actualizado",
                            Toast.LENGTH_LONG
                        ).show()

                        setResult(RESULT_OK)
                        finish()
                    }else{
                        Toast.makeText(
                            this@EditarResultadoActivity,
                            "Error ${response.code()}",
                            Toast.LENGTH_LONG
                        ).show()

                        Log.e(
                            "API",
                            response.errorBody()?.string() ?: ""
                        )
                    }
                }

                override fun onFailure(call: Call<Void?>, t: Throwable) {
                    Toast.makeText(
                        this@EditarResultadoActivity,
                        t.message,
                        Toast.LENGTH_LONG
                    ).show()
                }
            })

        }
    }

    private fun cargarEncuentros(idSeleccionado:Int){
        val token = getSharedPreferences(
            "app",
            MODE_PRIVATE
        ).getString("token", "") ?: ""

        ApiClient.instance.getEncuentros(
            "Bearer $token"
        ).enqueue(object: Callback<List<Encuentro>>{
            override fun onResponse(call: Call<List<Encuentro>?>, response: Response<List<Encuentro>?>) {
                if(response.isSuccessful){
                    listaEncuentros.clear()

                    listaEncuentros.addAll(
                        response.body() ?: emptyList()
                    )

                    val nombres = listaEncuentros.map {
                        "${it.equipo_local} vs ${it.equipo_visitante}"
                    }

                    spinnerEncuentro.adapter = ArrayAdapter(
                        this@EditarResultadoActivity,
                        android.R.layout.simple_spinner_dropdown_item,
                        nombres
                    )

                    val posicion = listaEncuentros.indexOfFirst {
                        it.id_encuentro == idSeleccionado
                    }

                    if(posicion!=-1){
                        spinnerEncuentro.setSelection(posicion)
                    }
                }
            }

            override fun onFailure(call: Call<List<Encuentro>?>, t: Throwable) {
                Toast.makeText(
                    this@EditarResultadoActivity,
                    t.message,
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }
}

