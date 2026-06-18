package com.example.ventas.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.ventas.R
import com.example.ventas.model.Jugador

class JugadorAdapter(
    private val jugadores: List<Jugador>,
    private val onClick: (Jugador) -> Unit
) : RecyclerView.Adapter<JugadorAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {

        val txtNumero: TextView = view.findViewById(R.id.txtNumero)
        val txtPosicion: TextView = view.findViewById(R.id.txtPosicion)
        val txtEstado: TextView = view.findViewById(R.id.txtEstado)
        val txtUsuario: TextView = view.findViewById(R.id.txtUsuario)

    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): ViewHolder {

        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_jugador, parent, false)

        return ViewHolder(view)
    }

    override fun getItemCount() = jugadores.size

    override fun onBindViewHolder(
        holder: ViewHolder,
        position: Int
    ) {

        val jugador = jugadores[position]

        holder.txtNumero.text =
            "⚽ Camiseta #${jugador.numero_camiseta}"

        holder.txtPosicion.text =
            "📍 ${jugador.posicion}"

        holder.txtUsuario.text =
            "👤 Usuario ID: ${jugador.id_usuario}"

        holder.txtEstado.text =
            if (jugador.activo == 1)
                "🟢 Activo"
            else
                "🔴 Inactivo"

        holder.itemView.setOnClickListener {
            onClick(jugador)
        }
    }
}