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
import com.example.ventas.model.Posicion
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class PosicionesActivity : AppCompatActivity() {

    private lateinit var recycler: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var txtContador: TextView
    private lateinit var edtBuscar: EditText
    private var token: String = ""

    // Guardamos la lista global para que el buscador funcione correctamente
    private var listaOriginal: List<Posicion> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_posiciones)

        recycler     = findViewById(R.id.recyclerPosiciones)
        progressBar  = findViewById(R.id.progressBar)
        txtContador  = findViewById(R.id.txtContador)
        edtBuscar    = findViewById(R.id.edtBuscar)

        recycler.layoutManager = LinearLayoutManager(this)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        findViewById<Button>(R.id.btnAgregar).setOnClickListener {
            startActivityForResult(Intent(this, CrearPosicionActivity::class.java), 100)
        }

        token = getSharedPreferences("app", MODE_PRIVATE)
            .getString("token", "") ?: ""

        configurarBuscador()

        cargarConfiguracionPosiciones()
    }

    // Lógica para traer los datos de la API
    fun cargarConfiguracionPosiciones() {
        progressBar.visibility = View.VISIBLE

        ApiClient.instance.getPosiciones("Bearer $token")
            .enqueue(object : Callback<List<Posicion>> {
                override fun onResponse(call: Call<List<Posicion>>, response: Response<List<Posicion>>) {
                    progressBar.visibility = View.GONE

                    if (!response.isSuccessful) {
                        Toast.makeText(this@PosicionesActivity, "Error ${response.code()}", Toast.LENGTH_LONG).show()
                        return
                    }

                    listaOriginal = response.body() ?: emptyList()

                    // Al cargar o refrescar, limpiamos el buscador para evitar bugs visuales
                    edtBuscar.setText("")
                    actualizarRecycler(listaOriginal)
                }

                override fun onFailure(call: Call<List<Posicion>>, t: Throwable) {
                    progressBar.visibility = View.GONE
                    Toast.makeText(this@PosicionesActivity, t.message, Toast.LENGTH_LONG).show()
                }
            })
    }

    private fun actualizarRecycler(listaAMostrar: List<Posicion>) {
        txtContador.text = "${listaAMostrar.size} registros"
        recycler.adapter = PosicionAdapter(listaAMostrar) { posicion ->
            val intent = Intent(this@PosicionesActivity, EditarPosicionActivity::class.java)
            intent.putExtra("ID_POSICION", posicion.id_posicion)
            intent.putExtra("ID_TORNEO", posicion.id_torneo)
            intent.putExtra("ID_EQUIPO", posicion.id_equipo)
            intent.putExtra("TORNEO", posicion.torneo)
            intent.putExtra("EQUIPO", posicion.equipo)
            intent.putExtra("JUGADOS", posicion.jugados)
            intent.putExtra("GANADOS", posicion.ganados)
            intent.putExtra("EMPATADOS", posicion.empatados)
            intent.putExtra("PERDIDOS", posicion.perdidos)
            intent.putExtra("GF", posicion.gf)
            intent.putExtra("GC", posicion.gc)
            intent.putExtra("PUNTOS", posicion.puntos)
            startActivityForResult(intent, 100)
        }
    }

    // El buscador escucha los cambios de la lista original de forma independiente
    private fun configurarBuscador() {
        edtBuscar.addTextChangedListener(object : android.text.TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val texto = s.toString().lowercase()
                val filtrada = listaOriginal.filter {
                    it.equipo.lowercase().contains(texto) ||
                            it.torneo.lowercase().contains(texto) ||
                            it.id_posicion.toString().contains(texto)
                }
                actualizarRecycler(filtrada)
            }
            override fun afterTextChanged(s: android.text.Editable?) {}
        })
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 100 && resultCode == RESULT_OK){
            cargarConfiguracionPosiciones()
        }
    }
}

class PosicionAdapter(
    private val lista: List<Posicion>,
    private val onEditar: (Posicion) -> Unit

) : RecyclerView.Adapter<PosicionAdapter.PosicionViewHolder>() {

    inner class PosicionViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val txtPosicion = view.findViewById<TextView>(R.id.txtPosicion)
        val txtAvatarEquipo = view.findViewById<TextView>(R.id.txtAvatarEquipo)
        val txtNombreEquipo = view.findViewById<TextView>(R.id.txtNombreEquipo)
        val txtNombreTorneo = view.findViewById<TextView>(R.id.txtNombreTorneo)
        val txtPuntos = view.findViewById<TextView>(R.id.txtPuntos)
        val txtJugados = view.findViewById<TextView>(R.id.txtJugados)
        val txtGanados = view.findViewById<TextView>(R.id.txtGanados)
        val txtEmpatados = view.findViewById<TextView>(R.id.txtEmpatados)
        val txtPerdidos = view.findViewById<TextView>(R.id.txtPerdidos)
        val txtGF = view.findViewById<TextView>(R.id.txtGF)
        val txtGC = view.findViewById<TextView>(R.id.txtGC)
        val txtDG = view.findViewById<TextView>(R.id.txtDG)
        val btnEditar = view.findViewById<Button>(R.id.btnEditar)
        val btnEliminar = view.findViewById<Button>(R.id.btnEliminar)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PosicionViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_posicion, parent, false)
        return PosicionViewHolder(view)
    }

    override fun onBindViewHolder(holder: PosicionViewHolder, position: Int) {
        val posicion = lista[position]

        holder.txtPosicion.text = posicion.posicion_real.toString()

        val iniciales = posicion.equipo
            .split(" ")
            .joinToString("") { it.first().uppercase() }
        holder.txtAvatarEquipo.text = iniciales
        holder.txtNombreEquipo.text = posicion.equipo
        holder.txtNombreTorneo.text = posicion.torneo
        holder.txtPuntos.text = "${posicion.puntos} PTS"
        holder.txtJugados.text = posicion.jugados.toString()
        holder.txtGanados.text = posicion.ganados.toString()
        holder.txtEmpatados.text = posicion.empatados.toString()
        holder.txtPerdidos.text = posicion.perdidos.toString()
        holder.txtGF.text = posicion.gf.toString()
        holder.txtGC.text = posicion.gc.toString()
        holder.txtDG.text = posicion.dg.toString()

        when (posicion.posicion_real) {
            1 -> holder.txtPosicion.setBackgroundResource(R.drawable.circulo_oro)
            2 -> holder.txtPosicion.setBackgroundResource(R.drawable.circulo_plata)
            3 -> holder.txtPosicion.setBackgroundResource(R.drawable.circulo_bronce)
            else -> holder.txtPosicion.setBackgroundResource(R.drawable.circulo_posicion)
        }

        holder.btnEditar.setOnClickListener {
            onEditar(posicion)
        }

        holder.btnEliminar.setOnClickListener {
            android.app.AlertDialog.Builder(holder.itemView.context)
                .setTitle("Eliminar posición")
                .setMessage("¿Estás seguro de eliminar la posición de ${posicion.equipo}?")
                .setPositiveButton("Eliminar") { _, _ ->
                    val token = holder.itemView.context
                        .getSharedPreferences("app", android.content.Context.MODE_PRIVATE)
                        .getString("token", "") ?: ""

                    ApiClient.instance.deletePosicion("Bearer $token", posicion.id_posicion)
                        .enqueue(object : retrofit2.Callback<Void> {
                            override fun onResponse(call: Call<Void?>, response: retrofit2.Response<Void?>) {
                                if (response.isSuccessful) {
                                    Toast.makeText(
                                        holder.itemView.context,
                                        "Posición de ${posicion.equipo} eliminada",
                                        Toast.LENGTH_LONG
                                    ).show()
                                    (holder.itemView.context as PosicionesActivity).cargarConfiguracionPosiciones()
                                } else {
                                    Toast.makeText(
                                        holder.itemView.context,
                                        "Error ${response.code()}",
                                        Toast.LENGTH_LONG
                                    ).show()
                                }
                            }

                            override fun onFailure(call: Call<Void?>, t: Throwable) {
                                Toast.makeText(holder.itemView.context, t.message, Toast.LENGTH_LONG).show()
                            }
                        })
                }
                .setNegativeButton("Cancelar", null)
                .show()
        }
    }

    override fun getItemCount() = lista.size
}