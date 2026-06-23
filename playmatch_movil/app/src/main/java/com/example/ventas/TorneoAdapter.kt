package com.example.ventas.adapter

import android.app.AlertDialog
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.ventas.R
import com.example.ventas.model.Torneo

class TorneoAdapter(
    private val lista: List<Torneo>,
    private val onEditar: (Torneo) -> Unit,
    private val onEliminar: (Torneo) -> Unit
) : RecyclerView.Adapter<TorneoAdapter.TorneoViewHolder>() {

    inner class TorneoViewHolder(view: View) : RecyclerView.ViewHolder(view) {

        val txtNombreTorneo = view.findViewById<TextView>(R.id.txtNombreTorneo)
        val txtCategoria = view.findViewById<TextView>(R.id.txtCategoria)
        val txtTipo = view.findViewById<TextView>(R.id.txtTipo)
        val txtCiudad = view.findViewById<TextView>(R.id.txtCiudad)
        val txtFechas = view.findViewById<TextView>(R.id.txtFechas)
        val txtUsuario = view.findViewById<TextView>(R.id.txtUsuario)
        val txtEstado = view.findViewById<TextView>(R.id.txtEstado)
        val txtId = view.findViewById<TextView>(R.id.txtId)

        val btnEditar = view.findViewById<Button>(R.id.btnEditar)
        val btnEliminar = view.findViewById<Button>(R.id.btnEliminar)
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): TorneoViewHolder {

        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_torneo, parent, false)

        return TorneoViewHolder(view)
    }

    override fun onBindViewHolder(
        holder: TorneoViewHolder,
        position: Int
    ) {

        val torneo = lista[position]

        holder.txtNombreTorneo.text = "🏆 ${torneo.nombre_torneo}"
        holder.txtCategoria.text = "📂 ${torneo.categoria}"
        holder.txtTipo.text = "⚔️ ${torneo.tipo_torneo}"
        holder.txtCiudad.text = "📍 ${torneo.ciudad}"
        holder.txtFechas.text = "📅 ${torneo.fecha_inicio} → ${torneo.fecha_fin}"
        holder.txtUsuario.text = "👤 Usuario ID: ${torneo.id_usuario}"
        holder.txtId.text = "#${torneo.id_torneo}"
        holder.txtEstado.text = torneo.estado

        holder.btnEditar.setOnClickListener {
            onEditar(torneo)
        }

        holder.btnEliminar.setOnClickListener {

            AlertDialog.Builder(holder.itemView.context)
                .setTitle("Eliminar torneo")
                .setMessage(
                    "¿Deseas eliminar el torneo ${torneo.nombre_torneo}?"
                )
                .setPositiveButton("Eliminar") { _, _ ->
                    onEliminar(torneo)
                }
                .setNegativeButton("Cancelar", null)
                .show()
        }
    }

    override fun getItemCount(): Int = lista.size
}