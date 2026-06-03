import pool from "../config/db.js";

export const getTablaPosicionesModel = async (id_torneo) => {
  const [rows] = await pool.query(
    `
    SELECT 
        t.id_torneo,
        t.nombre_torneo,

        eq.id_equipo,
        eq.nombre_equipo,

        COUNT(r.id_resultado) AS partidos_jugados,

        SUM(CASE 
            WHEN (e.id_equipo_local = eq.id_equipo AND r.goles_local > r.goles_visitante)
              OR (e.id_equipo_visitante = eq.id_equipo AND r.goles_visitante > r.goles_local)
            THEN 1 ELSE 0 
        END) AS ganados,

        SUM(CASE 
            WHEN r.goles_local = r.goles_visitante THEN 1 ELSE 0 
        END) AS empatados,

        SUM(CASE 
            WHEN (e.id_equipo_local = eq.id_equipo AND r.goles_local < r.goles_visitante)
              OR (e.id_equipo_visitante = eq.id_equipo AND r.goles_visitante < r.goles_local)
            THEN 1 ELSE 0 
        END) AS perdidos,

        SUM(CASE 
            WHEN e.id_equipo_local = eq.id_equipo THEN r.goles_local
            ELSE r.goles_visitante
        END) AS goles_favor,

        SUM(CASE 
            WHEN e.id_equipo_local = eq.id_equipo THEN r.goles_visitante
            ELSE r.goles_local
        END) AS goles_contra,

        (
            SUM(CASE 
                WHEN e.id_equipo_local = eq.id_equipo THEN r.goles_local
                ELSE r.goles_visitante
            END)
            -
            SUM(CASE 
                WHEN e.id_equipo_local = eq.id_equipo THEN r.goles_visitante
                ELSE r.goles_local
            END)
        ) AS diferencia_gol,

        SUM(CASE 
            WHEN (e.id_equipo_local = eq.id_equipo AND r.goles_local > r.goles_visitante)
              OR (e.id_equipo_visitante = eq.id_equipo AND r.goles_visitante > r.goles_local)
            THEN 3
            WHEN r.goles_local = r.goles_visitante THEN 1
            ELSE 0
        END) AS puntos

    FROM equipos eq

    JOIN encuentros e 
        ON eq.id_equipo = e.id_equipo_local 
        OR eq.id_equipo = e.id_equipo_visitante

    JOIN torneos t
        ON e.id_torneo = t.id_torneo

    JOIN resultados r 
        ON e.id_encuentro = r.id_encuentro

    WHERE e.id_torneo = ?

    GROUP BY 
        t.id_torneo,
        t.nombre_torneo,
        eq.id_equipo,
        eq.nombre_equipo

    ORDER BY puntos DESC, diferencia_gol DESC, goles_favor DESC
    `,
    [id_torneo],
  );

  return rows;
};
