package com.example.ventas

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Resultado
import com.example.ventas.model.ResultadoResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ResultadosActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_resultados)

        val recycler     = findViewById<RecyclerView>(R.id.recyclerResultados)
        val progressBar  = findViewById<ProgressBar>(R.id.progressBar)
        val txtContador  = findViewById<TextView>(R.id.txtContador)
        val edtBuscar   = findViewById<EditText>(R.id.edtBuscar)

        recycler.layoutManager = LinearLayoutManager(this)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        findViewById<Button>(R.id.btnAgregar).setOnClickListener {
            startActivityForResult(Intent(this, CrearResultadoActivity::class.java), 100)
        }

        val token = getSharedPreferences("app", MODE_PRIVATE)
            .getString("token", "") ?: ""

        progressBar.visibility = View.VISIBLE

        ApiClient.instance.getResultados("Bearer $token")
            .enqueue(object : Callback<List<Resultado>> {

                override fun onResponse(
                    call: Call<List<Resultado>>,
                    response: Response<List<Resultado>>
                ) {
                    progressBar.visibility = View.GONE

                    if (!response.isSuccessful) {
                        Toast.makeText(
                            this@ResultadosActivity,
                            "Error ${response.code()}",
                            Toast.LENGTH_LONG
                        ).show()
                        Log.e("API_ERROR", response.errorBody()?.string() ?: "")

                        return
                    }

                    /*
                    Lanza los datos de "X" resultado al editar, para que se pueda ver
                    los datos que tiene antes de modificar.
                     */

                    val lista = response.body() ?: emptyList()
                    txtContador.text = "${lista.size} registros"
                    recycler.adapter = ResultadoAdapter(lista) {  resultado -> abrirEditar(resultado) }

                    //FILTRAR - BUSCAR.
                    edtBuscar.addTextChangedListener(object : android.text.TextWatcher{
                        override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
                        override fun afterTextChanged(s: android.text.Editable?) {}
                        override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                            val texto = s.toString().lowercase().trim()
                            val filtrada = if (texto.isEmpty()) lista else lista.filter {
                                it.equipo_local?.lowercase()?.contains(texto) == true ||
                                it.equipo_visitante?.lowercase()?.contains(texto) == true

                            }
                            txtContador.text = "${filtrada.size} registros"
                            recycler.adapter = ResultadoAdapter(filtrada) { resultado -> abrirEditar(resultado) }
                        }
                    })
                }

                override fun onFailure(call: Call<List<Resultado>>, t: Throwable) {
                    progressBar.visibility = View.GONE
                    Toast.makeText(this@ResultadosActivity, t.message, Toast.LENGTH_LONG).show()
                    Log.e("API_ERROR", t.message.toString())
                }
            })
    }


    private fun abrirEditar(resultado: Resultado){
        val intent = Intent(this, EditarResultadoActivity::class.java)
        intent.putExtra("ID_RESULTADO", resultado.id_resultado ?: 0)
        intent.putExtra("ID_ENCUENTRO", resultado.id_encuentro ?: 0)
        intent.putExtra("GOLES_LOCAL", resultado.goles_local)
        intent.putExtra("GOLES_VISITANTE", resultado.goles_visitante)
        intent.putExtra("EQUIPO_LOCAL", resultado.equipo_local)
        intent.putExtra("EQUIPO_VISITANTE", resultado.equipo_visitante)
        startActivityForResult(intent, 100)
    }
    /*
    Recarga la lista una vez se vuelva sea del editar, eliminar o crear.
     */
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 100 && resultCode == RESULT_OK) {
            finish()
            startActivity(intent)
        }
    }
}


class ResultadoAdapter(


    private val lista: List<Resultado>,
    private val onEditar: (Resultado) -> Unit

) : RecyclerView.Adapter<ResultadoAdapter.ResultadoViewHolder>() {

    inner class ResultadoViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val txtAvatarLocal     = view.findViewById<TextView>(R.id.txtAvatarLocal)
        val txtEquipoLocal     = view.findViewById<TextView>(R.id.txtEquipoLocal)
        val txtGolesLocal      = view.findViewById<TextView>(R.id.txtGolesLocal)
        val txtGolesVisitante  = view.findViewById<TextView>(R.id.txtGolesVisitante)
        val txtAvatarVisitante = view.findViewById<TextView>(R.id.txtAvatarVisitante)
        val txtEquipoVisitante = view.findViewById<TextView>(R.id.txtEquipoVisitante)
        val txtFecha           = view.findViewById<TextView>(R.id.txtFecha)
        val txtGanador         = view.findViewById<TextView>(R.id.txtGanador)
        val txtId              = view.findViewById<TextView>(R.id.txtId)
        val btnEditar          = view.findViewById<Button>(R.id.btnEditar)
        val btnEliminar        = view.findViewById<Button>(R.id.btnEliminar)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ResultadoViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_resultado, parent, false)
        return ResultadoViewHolder(view)
    }

    override fun onBindViewHolder(holder: ResultadoViewHolder, position: Int) {
        val r = lista[position]

        holder.txtAvatarLocal.text     = r.equipo_local?.take(2)?.uppercase() ?: "??"
        holder.txtAvatarVisitante.text = r.equipo_visitante?.take(2)?.uppercase() ?: "??"
        holder.txtEquipoLocal.text     = r.equipo_local ?: "-"
        holder.txtEquipoVisitante.text = r.equipo_visitante ?: "-"
        holder.txtGolesLocal.text      = (r.goles_local ?: 0).toString()
        holder.txtGolesVisitante.text  = (r.goles_visitante ?: 0).toString()
        holder.txtFecha.text           = formatearFecha(r.fecha)
        holder.txtId.text              = "#${r.id_resultado}"

        // Ganador según goles
        val gl = r.goles_local ?: 0
        val gv = r.goles_visitante ?: 0
        holder.txtGanador.text = when {
            gl > gv -> "Local gana"
            gv > gl -> "Visitante gana"
            else    -> "Empate"
        }

        holder.btnEditar.setOnClickListener {
            onEditar(r)
        }

        // Eliminar con confirmación
        holder.btnEliminar.setOnClickListener {
            android.app.AlertDialog.Builder(holder.itemView.context)
                .setTitle("Eliminar resultado")
                .setMessage("¿Estás seguro de eliminar el resultado #${r.id_resultado}?")
                .setPositiveButton("Eliminar") { _, _ ->
                    val token = holder.itemView.context
                        .getSharedPreferences("app", android.content.Context.MODE_PRIVATE)
                        .getString("token", "") ?: ""

                    ApiClient.instance.deleteResultado("Bearer $token", r.id_resultado ?: 0)
                        .enqueue(object : retrofit2.Callback<Void> {
                            override fun onResponse(call: retrofit2.Call<Void>, response: retrofit2.Response<Void>) {
                                if (response.isSuccessful) {
                                    Toast.makeText(
                                        holder.itemView.context,
                                        "Resultado eliminado correctamente",
                                        Toast.LENGTH_LONG
                                    ).show()
                                    val activity = holder.itemView.context as? ResultadosActivity
                                    activity?.runOnUiThread { activity.recreate() }
                                } else {
                                    Toast.makeText(
                                        holder.itemView.context,
                                        "Error ${response.code()}",
                                        Toast.LENGTH_LONG
                                    ).show()
                                }
                            }
                            override fun onFailure(call: retrofit2.Call<Void>, t: Throwable) {
                                Toast.makeText(holder.itemView.context, t.message, Toast.LENGTH_LONG).show()
                            }
                        })
                }
                .setNegativeButton("Cancelar", null)
                .show()
        }
    }

    private fun formatearFecha(fechaISO: String?): String {
        if (fechaISO == null) return "-"
        return try {
            val parser = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.getDefault())
            parser.timeZone = java.util.TimeZone.getTimeZone("UTC")
            val fecha = parser.parse(fechaISO)
            val formatter = java.text.SimpleDateFormat("dd/MM/yyyy HH:mm", java.util.Locale.getDefault())
            formatter.timeZone = java.util.TimeZone.getDefault()
            formatter.format(fecha!!)
        } catch (e: Exception) {
            fechaISO // si falla muestra la original
        }
    }
    override fun getItemCount() = lista.size
}
