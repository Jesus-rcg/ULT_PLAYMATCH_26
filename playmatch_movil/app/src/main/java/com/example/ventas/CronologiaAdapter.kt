package com.example.ventas.ui.cronologias

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
import com.example.ventas.model.Cronologia
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CronologiaAdapter(
    private val lista: MutableList<Cronologia>,
    private val onEliminado: () -> Unit
) : RecyclerView.Adapter<CronologiaAdapter.CronologiaViewHolder>() {

    class CronologiaViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvMinuto: TextView     = itemView.findViewById(R.id.tvMinuto)
        val tvEvento: TextView     = itemView.findViewById(R.id.tvEvento)
        val tvId: TextView         = itemView.findViewById(R.id.tvId)
        val tvJugador: TextView    = itemView.findViewById(R.id.tvJugador)
        val tvEquipoJugador: TextView = itemView.findViewById(R.id.tvEquipoJugador)
        val tvEncuentro: TextView  = itemView.findViewById(R.id.tvEncuentro)
        val btnEditar: Button      = itemView.findViewById(R.id.btnEditar)
        val btnEliminar: Button    = itemView.findViewById(R.id.btnEliminar)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CronologiaViewHolder {
        val vista = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_cronologia, parent, false)
        return CronologiaViewHolder(vista)
    }

    override fun onBindViewHolder(holder: CronologiaViewHolder, position: Int) {
        val c = lista[position]

        holder.tvMinuto.text     = "${c.minuto}'"
        holder.tvEvento.text     = c.evento ?: "-"
        holder.tvId.text         = "#${c.id_cronologia}"
        holder.tvJugador.text    = "👤 ${c.nombre_usuario ?: ""} ${c.apellido_usuario ?: ""}"
        holder.tvEquipoJugador.text = "⚽ ${c.equipo_jugador ?: "-"}"
        holder.tvEncuentro.text  = "${c.equipo_local ?: "Local"} vs ${c.equipo_visitante ?: "Visitante"}"

        // Color del badge según evento
        val color = when (c.evento) {
            "Gol"      -> "#16a34a"
            "Amarilla" -> "#D97706"
            "Roja"     -> "#DC2626"
            else       -> "#6B7280"
        }
        holder.tvMinuto.setBackgroundColor(Color.parseColor(color))

        holder.btnEditar.setOnClickListener {
            val context = holder.itemView.context
            val intent = Intent(context, EditarCronologiaActivity::class.java)
            intent.putExtra("ID",     c.id_cronologia)
            intent.putExtra("EVENTO", c.evento)
            context.startActivity(intent)
        }

        holder.btnEliminar.setOnClickListener {
            val context = holder.itemView.context
            AlertDialog.Builder(context)
                .setTitle("Eliminar cronología")
                .setMessage("¿Eliminar este evento del minuto ${c.minuto}?")
                .setPositiveButton("Sí, eliminar") { _, _ ->
                    eliminar(context, c, holder.adapterPosition)
                }
                .setNegativeButton("Cancelar", null)
                .show()
        }
    }

    private fun eliminar(context: android.content.Context, c: Cronologia, position: Int) {
        val token = context.getSharedPreferences("app", android.content.Context.MODE_PRIVATE)
            .getString("token", "") ?: ""

        ApiClient.instance.deleteCronologia("Bearer $token", c.id_cronologia ?: 0)
            .enqueue(object : Callback<Void> {
                override fun onResponse(call: Call<Void>, response: Response<Void>) {
                    if (response.isSuccessful) {
                        lista.removeAt(position)
                        notifyItemRemoved(position)
                        notifyItemRangeChanged(position, lista.size)
                        Toast.makeText(context, "✅ Eliminado correctamente", Toast.LENGTH_SHORT).show()
                        onEliminado()
                    } else {
                        Toast.makeText(context, "❌ Error al eliminar", Toast.LENGTH_SHORT).show()
                    }
                }
                override fun onFailure(call: Call<Void>, t: Throwable) {
                    Toast.makeText(context, "❌ Error de conexión", Toast.LENGTH_SHORT).show()
                }
            })
    }

    override fun getItemCount() = lista.size
}