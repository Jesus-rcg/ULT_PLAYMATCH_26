package com.example.ventas.adapter

import android.app.AlertDialog
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.ventas.R
import com.example.ventas.model.Jugador

class JugadorAdapter(
    private val lista: List<Jugador>,
    private val onEditar: (Jugador) -> Unit,
    private val onEliminar: (Jugador) -> Unit
) : RecyclerView.Adapter<JugadorAdapter.JugadorViewHolder>() {

    inner class JugadorViewHolder(view: View) : RecyclerView.ViewHolder(view) {

        val txtNumero = view.findViewById<TextView>(R.id.txtNumero)
        val txtPosicion = view.findViewById<TextView>(R.id.txtPosicion)
        val txtNombre = view.findViewById<TextView>(R.id.txtNombre)
        val txtUsuario = view.findViewById<TextView>(R.id.txtUsuario)
        val txtEstado = view.findViewById<TextView>(R.id.txtEstado)
        val txtId = view.findViewById<TextView>(R.id.txtId)

        val btnEditar = view.findViewById<Button>(R.id.btnEditar)
        val btnEliminar = view.findViewById<Button>(R.id.btnEliminar)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): JugadorViewHolder {

        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_jugador, parent, false)

        return JugadorViewHolder(view)
    }

    override fun onBindViewHolder(holder: JugadorViewHolder, position: Int) {

        val jugador = lista[position]

        holder.txtNumero.text = "⚽ Camiseta #${jugador.numero_camiseta}"
        holder.txtPosicion.text = "📍 ${jugador.posicion}"
        holder.txtUsuario.text = "👤 Usuario ID: ${jugador.id_usuario}"
        holder.txtNombre.text = jugador.nombre_usuario + " " + jugador.apellido_usuario
        holder.txtId.text = "#${jugador.id_jugador}"

        holder.txtEstado.text =
            if (jugador.activo == 1) "🟢 Activo" else "🔴 Inactivo"

        // EDITAR
        holder.btnEditar.setOnClickListener {
            onEditar(jugador)
        }

        // ELIMINAR CON ALERTA + CALLBACK
        holder.btnEliminar.setOnClickListener {

            AlertDialog.Builder(holder.itemView.context)
                .setTitle("Eliminar jugador")
                .setMessage("¿Deseas eliminar al jugador #${jugador.numero_camiseta}?")
                .setPositiveButton("Eliminar") { _, _ ->

                    onEliminar(jugador) // 🔥 aquí se conecta con tu Activity
                }
                .setNegativeButton("Cancelar", null)
                .show()
        }
    }

    override fun getItemCount(): Int = lista.size
}