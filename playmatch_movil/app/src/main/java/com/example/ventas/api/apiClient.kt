    package com.example.ventas.api

    import com.google.gson.GsonBuilder
    import com.google.gson.JsonDeserializer
    import retrofit2.Retrofit
    import retrofit2.converter.gson.GsonConverterFactory

    object ApiClient {

        private const val BASE_URL = "http://10.0.2.2:3001/"

        private val gson = GsonBuilder()
            .registerTypeAdapter(Int::class.java, JsonDeserializer { json, _, _ ->
                try {
                    val str = json.asString
                    if (str.isNullOrEmpty()) null else str.toInt()
                } catch (e: Exception) {
                    try { json.asInt } catch (e2: Exception) { null }
                }
            })
            .serializeNulls()
            .create()

        val instance: ApiService by lazy {
            Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .build()
                .create(ApiService::class.java)
        }
    }