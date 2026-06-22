package com.example.ventas.ui.resultados

import android.app.AlertDialog
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.example.ventas.R
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Resultado
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ResultadoAdapter(
    private val listaResultados: MutableList<Resultado>,
    private val modo: String
) : RecyclerView.Adapter<ResultadoAdapter.ResultadoViewHolder>() {

    class ResultadoViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvEncuentro: TextView = itemView.findViewById(R.id.tvEncuentro)
        val tvGolesLocal: TextView = itemView.findViewById(R.id.tvGolesLocal)
        val tvGolesVisitante: TextView = itemView.findViewById(R.id.tvGolesVisitante)
        val btnEditar: ImageButton = itemView.findViewById(R.id.btnEditar)
        val btnEliminar: ImageButton = itemView.findViewById(R.id.btnEliminar)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ResultadoViewHolder {
        val vista = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_resultado, parent, false)
        return ResultadoViewHolder(vista)
    }

    override fun onBindViewHolder(holder: ResultadoViewHolder, position: Int) {
        val resultado = listaResultados[position]

        holder.tvEncuentro.text = "Encuentro #${resultado.id_encuentro}"
        holder.tvGolesLocal.text = resultado.goles_local.toString()
        holder.tvGolesVisitante.text = resultado.goles_visitante.toString()

        holder.btnEditar.visibility = View.GONE
        holder.btnEliminar.visibility = View.GONE

        when (modo) {
            "editar" -> {
                holder.btnEditar.visibility = View.VISIBLE
                holder.btnEditar.setOnClickListener {
                    val context = holder.itemView.context
                    val intent = Intent(context, EditarResultadoActivity::class.java)
                    intent.putExtra("RESULTADO_ID", resultado.id_resultado)
                    intent.putExtra("RESULTADO_ENCUENTRO", resultado.id_encuentro)
                    intent.putExtra("RESULTADO_GOLES_LOCAL", resultado.goles_local)
                    intent.putExtra("RESULTADO_GOLES_VISITANTE", resultado.goles_visitante)
                    context.startActivity(intent)
                }
            }
            "eliminar" -> {
                holder.btnEliminar.visibility = View.VISIBLE
                holder.btnEliminar.setOnClickListener {
                    val context = holder.itemView.context
                    AlertDialog.Builder(context)
                        .setTitle("Eliminar resultado")
                        .setMessage("¿Estás seguro que deseas eliminar este resultado?")
                        .setPositiveButton("Sí, eliminar") { _, _ ->
                            eliminarResultado(context, resultado, holder.adapterPosition)
                        }
                        .setNegativeButton("Cancelar", null)
                        .show()
                }
            }
            "vertodos" -> { }
        }
    }

    private fun eliminarResultado(
        context: android.content.Context,
        resultado: Resultado,
        position: Int
    ) {
        val prefs = context.getSharedPreferences("app", android.content.Context.MODE_PRIVATE)
        val token = prefs.getString("token", "") ?: ""

        ApiClient.instance.deleteResultado(
            "Bearer $token",
            resultado.id_resultado
        ).enqueue(object : Callback<Void> {

            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    listaResultados.removeAt(position)
                    notifyItemRemoved(position)
                    notifyItemRangeChanged(position, listaResultados.size)
                    Toast.makeText(context, "✅ Resultado eliminado correctamente", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(context, "❌ Error al eliminar", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                Toast.makeText(context, "❌ Error de conexión", Toast.LENGTH_SHORT).show()
            }
        })
    }

    override fun getItemCount(): Int = listaResultados.size
}