package com.example.ventas.ui.equipos

import android.app.AlertDialog
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.example.ventas.R
import com.example.ventas.api.ApiClient
import com.example.ventas.model.Equipo
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EquipoAdapter(
    private val listaEquipos: MutableList<Equipo>,
    private val modo: String,
    private val onListaActualizada: (() -> Unit)? = null
) : RecyclerView.Adapter<EquipoAdapter.EquipoViewHolder>() {

    class EquipoViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvAvatar: TextView  = itemView.findViewById(R.id.tvAvatar)
        val tvNombre: TextView  = itemView.findViewById(R.id.tvNombreEquipo)
        val tvEscudo: TextView  = itemView.findViewById(R.id.tvEscudo)
        val tvNumero: TextView  = itemView.findViewById(R.id.tvNumero)
        val btnEditar: Button   = itemView.findViewById(R.id.btnEditar)
        val btnEliminar: Button = itemView.findViewById(R.id.btnEliminar)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EquipoViewHolder {
        val vista = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_equipo, parent, false)
        return EquipoViewHolder(vista)
    }

    override fun onBindViewHolder(holder: EquipoViewHolder, position: Int) {
        val equipo = listaEquipos[position]

        // Avatar con iniciales
        val iniciales = equipo.nombre_equipo
            .split(" ")
            .take(2)
            .joinToString("") { it.first().uppercaseChar().toString() }
        holder.tvAvatar.text = iniciales

        holder.tvNombre.text = equipo.nombre_equipo
        holder.tvEscudo.text = "Escudo: ${equipo.escudo}"
        holder.tvNumero.text = "#${position + 1}"

        // Ocultar ambos botones por defecto
        holder.btnEditar.visibility  = View.GONE
        holder.btnEliminar.visibility = View.GONE

        when (modo) {

            "vertodos" -> {
                // Sin botones, solo muestra la info
            }

            "editar" -> {
                holder.btnEditar.visibility = View.VISIBLE
                holder.btnEditar.setOnClickListener {
                    val context = holder.itemView.context
                    val intent = Intent(context, EditarEquipoActivity::class.java)
                    intent.putExtra("EQUIPO_ID",      equipo.id_equipo)
                    intent.putExtra("EQUIPO_NOMBRE",  equipo.nombre_equipo)
                    intent.putExtra("EQUIPO_ESCUDO",  equipo.escudo)
                    intent.putExtra("EQUIPO_USUARIO", equipo.id_usuario)
                    context.startActivity(intent)
                }
            }

            "eliminar" -> {
                holder.btnEliminar.visibility = View.VISIBLE
                holder.btnEliminar.setOnClickListener {
                    val context = holder.itemView.context
                    AlertDialog.Builder(context)
                        .setTitle("Eliminar equipo")
                        .setMessage("¿Eliminar ${equipo.nombre_equipo}?")
                        .setPositiveButton("Sí, eliminar") { _, _ ->
                            eliminarEquipo(context, equipo, holder.adapterPosition)
                        }
                        .setNegativeButton("Cancelar", null)
                        .show()
                }
            }
        }
    }

    private fun eliminarEquipo(
        context: android.content.Context,
        equipo: Equipo,
        position: Int
    ) {
        val prefs = context.getSharedPreferences("app", android.content.Context.MODE_PRIVATE)
        val token = prefs.getString("token", "") ?: ""

        ApiClient.instance.deleteEquipo("Bearer $token", equipo.id_equipo)
            .enqueue(object : Callback<Void> {
                override fun onResponse(call: Call<Void>, response: Response<Void>) {
                    if (response.isSuccessful) {
                        listaEquipos.removeAt(position)
                        notifyItemRemoved(position)
                        notifyItemRangeChanged(position, listaEquipos.size)
                        onListaActualizada?.invoke()
                        Toast.makeText(context, "✅ Equipo eliminado", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(context, "❌ Error al eliminar", Toast.LENGTH_SHORT).show()
                    }
                }
                override fun onFailure(call: Call<Void>, t: Throwable) {
                    Toast.makeText(context, "❌ Error de conexión", Toast.LENGTH_SHORT).show()
                }
            })
    }

    override fun getItemCount(): Int = listaEquipos.size
}