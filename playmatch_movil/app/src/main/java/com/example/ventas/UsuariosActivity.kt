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
import com.example.ventas.model.Usuario
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class UsuariosActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_usuarios)

        val recycler     = findViewById<RecyclerView>(R.id.recyclerUsuarios)
        val progressBar  = findViewById<ProgressBar>(R.id.progressBar)
        val txtContador  = findViewById<TextView>(R.id.txtContador)

        recycler.layoutManager = LinearLayoutManager(this)

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        findViewById<Button>(R.id.btnAgregar).setOnClickListener {
            startActivityForResult(Intent(this, CrearUsuarioActivity::class.java), 100)
        }

        val token = getSharedPreferences("app", MODE_PRIVATE)
            .getString("token", "") ?: ""

        progressBar.visibility = View.VISIBLE

        ApiClient.instance.getUsuarios("Bearer $token")
            .enqueue(object : Callback<List<Usuario>> {

                override fun onResponse(
                    call: Call<List<Usuario>>,
                    response: Response<List<Usuario>>
                ) {
                    progressBar.visibility = View.GONE

                    if (!response.isSuccessful) {
                        Toast.makeText(
                            this@UsuariosActivity,
                            "Error ${response.code()}",
                            Toast.LENGTH_LONG
                        ).show()
                        Log.e("API_ERROR", response.errorBody()?.string() ?: "")

                        return
                    }

                    /*
                    Lanza los datos de "X" usuario al editar, para que se pueda ver
                    los datos que tiene antes de modificar.
                     */

                    val lista = response.body() ?: emptyList()
                    txtContador.text = "${lista.size} registros"
                    recycler.adapter = UsuarioAdapter(lista) { usuario ->
                        val intent = Intent (this@UsuariosActivity, EditarUsuarioActivity::class.java)
                        intent.putExtra("ID", usuario.id_usuario ?: 0)
                        intent.putExtra("NOMBRE", usuario.nombre)
                        intent.putExtra("EMAIL", usuario.email)
                        intent.putExtra("ROL", usuario.rol)
                        intent.putExtra("ESTADO", usuario.estado)
                        startActivityForResult(intent, 100)
                    }

                    //FILTRAR - BUSCAR.
                    val edtBuscar = findViewById<EditText>(R.id.edtBuscar)
                    edtBuscar.addTextChangedListener(object : android.text.TextWatcher{
                        override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
                        override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                            val texto = s.toString().lowercase()
                            val filtrada = lista.filter {
                                it.nombre.lowercase().contains(texto) ||
                                it.email.lowercase().contains(texto) ||
                                it.id_usuario.toString().contains(texto)
                            }
                            txtContador.text = "${filtrada.size} registros"
                            recycler.adapter = UsuarioAdapter(filtrada) { usuario->
                                val intent = Intent(this@UsuariosActivity, EditarUsuarioActivity::class.java)
                                intent.putExtra("ID", usuario.id_usuario)
                                intent.putExtra("NOMBRE", usuario.nombre)
                                intent.putExtra("EMAIL", usuario.email)
                                intent.putExtra("ROL", usuario.rol)
                                intent.putExtra("ESTADO", usuario.estado)
                                startActivityForResult(intent, 100)
                            }
                        }

                        override fun afterTextChanged(s: android.text.Editable?) {}
                    })
                }

                override fun onFailure(call: Call<List<Usuario>>, t: Throwable) {
                    progressBar.visibility = View.GONE
                    Toast.makeText(this@UsuariosActivity, t.message, Toast.LENGTH_LONG).show()
                    Log.e("API_ERROR", t.message.toString())
                }
            })
    }

    /*
    Recarga la lista una vez se vuelva sea del editar, eliminar o crear.
     */
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 100 && resultCode == RESULT_OK){
            recreate()
        }
    }
}


class UsuarioAdapter(
    private val lista: List<Usuario>,
    private val onEditar: (Usuario) -> Unit

    ) : RecyclerView.Adapter<UsuarioAdapter.UsuarioViewHolder>() {

    inner class UsuarioViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val txtAvatar  = view.findViewById<TextView>(R.id.txtAvatar)
        val txtNombre  = view.findViewById<TextView>(R.id.txtNombre)
        val txtEmail   = view.findViewById<TextView>(R.id.txtEmail)
        val txtRol     = view.findViewById<TextView>(R.id.txtRol)
        val dotEstado  = view.findViewById<View>(R.id.dotEstado)
        val txtEstado  = view.findViewById<TextView>(R.id.txtEstado)
        val txtId      = view.findViewById<TextView>(R.id.txtId)
        val btnEditar = view.findViewById<Button>(R.id.btnEditar)
        val btnEliminar = view.findViewById<Button>(R.id.btnEliminar)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UsuarioViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_usuario, parent, false)
        return UsuarioViewHolder(view)
    }

    override fun onBindViewHolder(holder: UsuarioViewHolder, position: Int) {
        val usuario = lista[position]

        val iniciales = usuario.nombre
            .split(" ")
            .joinToString("") { it.first().uppercase() }
        holder.txtAvatar.text = iniciales

        holder.txtNombre.text = usuario.nombre
        holder.txtEmail.text  = usuario.email
        holder.txtRol.text    = usuario.rol
        holder.txtId.text     = "#${usuario.id_usuario}"

        if (usuario.estado.lowercase() == "activo") {
            holder.dotEstado.setBackgroundResource(R.drawable.circulo_verde)
            holder.txtEstado.text = "Activo"
        } else {
            holder.dotEstado.setBackgroundResource(R.drawable.circulo_rojo)
            holder.txtEstado.text = "Inactivo"
        }

        holder.btnEditar.setOnClickListener {
            onEditar(usuario)
        }

        holder.btnEliminar.setOnClickListener {
            android.app.AlertDialog.Builder(holder.itemView.context)
                .setTitle("Eliminar usuario")
                .setMessage("¿Estás seguro de eliminar a ${usuario.nombre}?")
                .setPositiveButton("Eliminar"){ _, _ ->

                    val token = holder.itemView.context
                        .getSharedPreferences("app", android.content.Context.MODE_PRIVATE)
                        .getString("token", "") ?: ""

                    ApiClient.instance.deleteUsuario("Bearer $token", usuario.id_usuario ?: 0)
                        .enqueue(object : retrofit2.Callback<Void>{

                            override fun onResponse(call: Call<Void?>, response: retrofit2.Response<Void?>) {
                                if (response.isSuccessful){
                                    Toast.makeText(
                                        holder.itemView.context,
                                        "${usuario.nombre} eliminado correctamente",
                                        Toast.LENGTH_LONG
                                    ).show()
                                    (holder.itemView.context as UsuariosActivity).recreate()
                                } else {
                                    Toast.makeText(
                                        holder.itemView.context,
                                        "Error ${response.code()}",
                                        Toast.LENGTH_LONG
                                    ).show()
                                }
                            }

                            override fun onFailure(call: retrofit2.Call<Void?>, t: Throwable) {
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