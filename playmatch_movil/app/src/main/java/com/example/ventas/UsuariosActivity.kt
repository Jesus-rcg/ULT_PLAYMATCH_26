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
import com.example.ventas.model.UsuarioResponse
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
        val edtBuscar   = findViewById<EditText>(R.id.edtBuscar)

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
            .enqueue(object : Callback<UsuarioResponse> {

                override fun onResponse(
                    call: Call<UsuarioResponse>,
                    response: Response<UsuarioResponse>
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

                    val lista = response.body()?.data ?: emptyList()
                    txtContador.text = "${lista.size} registros"
                    recycler.adapter = UsuarioAdapter(lista) {  usuario -> abrirEditar(usuario) }

                    //FILTRAR - BUSCAR.
                    edtBuscar.addTextChangedListener(object : android.text.TextWatcher{
                        override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
                        override fun afterTextChanged(s: android.text.Editable?) {}
                        override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                            val texto = s.toString().lowercase().trim()
                            val filtrada = if (texto.isEmpty()) lista else lista.filter {
                                it.nombre_usuario.lowercase().contains(texto) ||
                                it.apellido_usuario.lowercase().contains(texto) ||
                                it.email.lowercase().contains(texto)
                            }
                            txtContador.text = "${filtrada.size} registros"
                            recycler.adapter = UsuarioAdapter(filtrada) { usuario -> abrirEditar(usuario) }
                        }
                    })
                }

                override fun onFailure(call: Call<UsuarioResponse>, t: Throwable) {
                    progressBar.visibility = View.GONE
                    Toast.makeText(this@UsuariosActivity, t.message, Toast.LENGTH_LONG).show()
                    Log.e("API_ERROR", t.message.toString())
                }
            })
    }


    private fun abrirEditar(usuario: Usuario){
        val intent = Intent(this, EditarUsuarioActivity::class.java)
        intent.putExtra("ID", usuario.id ?: 0)
        intent.putExtra("NOMBRE", usuario.nombre_usuario)
        intent.putExtra("APELLIDO", usuario.apellido_usuario)
        intent.putExtra("EMAIL", usuario.email)
        intent.putExtra("TELEFONO", usuario.telefono)
        startActivityForResult(intent, 100)
    }
    /*
    Recarga la lista una vez se vuelva sea del editar, eliminar o crear.
     */
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 100 && resultCode == RESULT_OK) recreate()
    }
}


class UsuarioAdapter(
    private val lista: List<Usuario>,
    private val onEditar: (Usuario) -> Unit

    ) : RecyclerView.Adapter<UsuarioAdapter.UsuarioViewHolder>() {

    inner class UsuarioViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val txtAvatar = view.findViewById<TextView>(R.id.txtAvatar)
        val txtNombre = view.findViewById<TextView>(R.id.txtNombre)
        val txtEmail = view.findViewById<TextView>(R.id.txtEmail)

        val txtTelefono = view.findViewById<TextView>(R.id.txtTelefono)
        val txtRol     = view.findViewById<TextView>(R.id.txtRol)

        val txtFecha    = view.findViewById<TextView>(R.id.txtFecha)
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
        val u = lista[position]

        val iniciales = "${u.nombre_usuario.first().uppercaseChar()?: "?"}${u.apellido_usuario.first().
        uppercaseChar()?: "?"}"
        holder.txtAvatar.text = iniciales
        holder.txtNombre.text = "${u.nombre_usuario} ${u.apellido_usuario}"
        holder.txtEmail.text  = u.email
        holder.txtTelefono.text = "📞 ${u.telefono}"
        holder.txtRol.text = u.nombre_rol ?: "Sin rol"
        holder.txtFecha.text = "🎂 ${u.fecha_nacimiento}"
        holder.txtId.text = "#${u.id}"

        if ((u.activo ?: 0) == 1) {
            holder.dotEstado.setBackgroundResource(R.drawable.circulo_verde)
            holder.txtEstado.text = "Activo"
        } else {
            holder.dotEstado.setBackgroundResource(R.drawable.circulo_rojo)
            holder.txtEstado.text = "Inactivo"
        }

        holder.btnEditar.setOnClickListener {
            onEditar(u)
        }

        holder.btnEliminar.setOnClickListener {
            android.app.AlertDialog.Builder(holder.itemView.context)
                .setTitle("Eliminar usuario")
                .setMessage("¿Estás seguro de eliminar a ${u.nombre_usuario} ${u.apellido_usuario}?")
                .setPositiveButton("Eliminar"){ _, _ ->

                    val token = holder.itemView.context
                        .getSharedPreferences("app", android.content.Context.MODE_PRIVATE)
                        .getString("token", "") ?: ""

                    ApiClient.instance.deleteUsuario("Bearer $token", u.id?: 0)
                        .enqueue(object : retrofit2.Callback<Void>{

                            override fun onResponse(call: Call<Void?>, response: retrofit2.Response<Void?>) {
                                if (response.isSuccessful){
                                    Toast.makeText(
                                        holder.itemView.context,
                                        "${u.nombre_usuario} ${u.apellido_usuario} eliminado correctamente",
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