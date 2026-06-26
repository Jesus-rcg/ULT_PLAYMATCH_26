package com.example.ventas.ui.encuentros

import android.app.AlertDialog
import android.content.Intent
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.example.ventas.R
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Encuentro
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EncuentroAdapter(
    private val listaEncuentros: MutableList<Encuentro>,
    private val modo: String
) : RecyclerView.Adapter<EncuentroAdapter.EncuentroViewHolder>() {

    class EncuentroViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvJornada: TextView   = itemView.findViewById(R.id.tvJornada)
        val tvEstado: TextView    = itemView.findViewById(R.id.tvEstado)
        val tvEquipos: TextView   = itemView.findViewById(R.id.tvEquipos)
        val tvFechaHora: TextView = itemView.findViewById(R.id.tvFechaHora)
        val tvLugar: TextView     = itemView.findViewById(R.id.tvLugar)
        val btnEditar: Button     = itemView.findViewById(R.id.btnEditar)
        val btnEliminar: Button   = itemView.findViewById(R.id.btnEliminar)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EncuentroViewHolder {
        val vista = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_encuentro, parent, false)
        return EncuentroViewHolder(vista)
    }

    override fun onBindViewHolder(holder: EncuentroViewHolder, position: Int) {
        val encuentro = listaEncuentros[position]

        holder.tvJornada.text   = "Jornada ${encuentro.jornada}"
        holder.tvEquipos.text   = "${encuentro.equipo_local ?: "Local"} vs ${encuentro.equipo_visitante ?: "Visitante"}"
        holder.tvFechaHora.text = "${encuentro.fecha} — ${encuentro.hora}"
        holder.tvLugar.text     = encuentro.lugar

        holder.tvEstado.text = encuentro.estado
        val colorEstado = when (encuentro.estado) {
            "Jugando"    -> "#0284C7"
            "Finalizado" -> "#16a34a"
            "Aplazado"   -> "#DC2626"
            else         -> "#D97706"
        }
        holder.tvEstado.setBackgroundColor(Color.parseColor(colorEstado))

        // Siempre visibles
        holder.btnEditar.visibility   = View.VISIBLE
        holder.btnEliminar.visibility = View.VISIBLE

        holder.btnEditar.setOnClickListener {
            val context = holder.itemView.context
            val intent = Intent(context, EditarEncuentroActivity::class.java)
            intent.putExtra("ENCUENTRO_ID",        encuentro.id_encuentro)
            intent.putExtra("ENCUENTRO_JORNADA",   encuentro.jornada)
            intent.putExtra("ENCUENTRO_LUGAR",     encuentro.lugar)
            intent.putExtra("ENCUENTRO_FECHA",     encuentro.fecha)
            intent.putExtra("ENCUENTRO_HORA",      encuentro.hora)
            intent.putExtra("ENCUENTRO_ESTADO",    encuentro.estado)
            intent.putExtra("ENCUENTRO_TORNEO",    encuentro.id_torneo)
            intent.putExtra("ENCUENTRO_LOCAL",     encuentro.id_equipo_local)
            intent.putExtra("ENCUENTRO_VISITANTE", encuentro.id_equipo_visitante)
            context.startActivity(intent)
        }

        holder.btnEliminar.setOnClickListener {
            val context = holder.itemView.context
            AlertDialog.Builder(context)
                .setTitle("Eliminar encuentro")
                .setMessage("¿Estás seguro que deseas eliminar este encuentro?")
                .setPositiveButton("Sí, eliminar") { _, _ ->
                    eliminarEncuentro(context, encuentro, holder.adapterPosition)
                }
                .setNegativeButton("Cancelar", null)
                .show()
        }
    }

    private fun eliminarEncuentro(
        context: android.content.Context,
        encuentro: Encuentro,
        position: Int
    ) {
        val prefs = context.getSharedPreferences("app", android.content.Context.MODE_PRIVATE)
        val token = prefs.getString("token", "") ?: ""

        ApiClient.instance.deleteEncuentro("Bearer $token", encuentro.id_encuentro)
            .enqueue(object : Callback<Void> {
                override fun onResponse(call: Call<Void>, response: Response<Void>) {
                    if (response.isSuccessful) {
                        listaEncuentros.removeAt(position)
                        notifyItemRemoved(position)
                        notifyItemRangeChanged(position, listaEncuentros.size)
                        Toast.makeText(context, "✅ Encuentro eliminado", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(context, "❌ Error al eliminar", Toast.LENGTH_SHORT).show()
                    }
                }
                override fun onFailure(call: Call<Void>, t: Throwable) {
                    Toast.makeText(context, "❌ Error de conexión", Toast.LENGTH_SHORT).show()
                }
            })
    }

    override fun getItemCount(): Int = listaEncuentros.size
}