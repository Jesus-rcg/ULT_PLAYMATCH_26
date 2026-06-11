package com.example.ventas

import android.content.Intent
import android.os.Bundle
import android.widget.LinearLayout
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class TorneoActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_torneos)

        // TARJETAS

        val btnGuardar =
            findViewById<LinearLayout>(R.id.tarjetaGuardar)

        val btnBuscar =
            findViewById<LinearLayout>(R.id.tarjetaBuscar)

        val btnEditar =
            findViewById<LinearLayout>(R.id.tarjetaEditar)

        val btnEliminar =
            findViewById<LinearLayout>(R.id.tarjetaEliminar)

        val btnVerTodos =
            findViewById<LinearLayout>(R.id.tarjetaVerTodos)



      

        btnGuardar.setOnClickListener {

            startActivity(
                Intent(
                    this,
                    CrearTorneoActivity::class.java
                )
            )
        }





        btnBuscar.setOnClickListener {

            Toast.makeText(
                this,
                "Pantalla buscar torneo",
                Toast.LENGTH_SHORT
            ).show()    
        }



        

        btnEditar.setOnClickListener {

            Toast.makeText(
                this,
                "Pantalla editar torneo",
                Toast.LENGTH_SHORT
            ).show()    
        }




        btnEliminar.setOnClickListener {

            Toast.makeText(
                this,
                "Pantalla eliminar torneo",
                Toast.LENGTH_SHORT
            ).show()
        }



        

        btnVerTodos.setOnClickListener {

            Toast.makeText(
                this,
                "Lista de torneos",
                Toast.LENGTH_SHORT
            ).show()
        }
    }
}