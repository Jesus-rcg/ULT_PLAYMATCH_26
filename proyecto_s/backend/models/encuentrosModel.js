import pool from "../config/db.js";

//Actualizar el estado por fecha
export const actualizarEstadosEncuentrosModel = async () => {
  // PASAR A JUGANDO
  await pool.query(`
    UPDATE encuentros
    SET estado = 'Jugando'
    WHERE activo = 1
      AND estado = 'Pendiente'
      AND CONCAT(fecha, ' ', hora) <= NOW()
  `);

  // PASAR A FINALIZADO
  // (2 HORAS DESPUÉS DEL INICIO)

  await pool.query(`
    UPDATE encuentros
    SET estado = 'Finalizado'
    WHERE activo = 1
      AND estado = 'Jugando'
      AND DATE_ADD(CONCAT(fecha, ' ', hora), INTERVAL 2 HOUR) <= NOW()
  `);
};

// Obtener todas
export const getEncuentrosModel = async () => {
  await actualizarEstadosEncuentrosModel();

  const [rows] = await pool.query(`
    SELECT 
      en.id_encuentro,
      en.id_torneo,
      t.nombre_torneo,

      en.id_equipo_local,
      el.nombre_equipo AS equipo_local,

      en.id_equipo_visitante,
      ev.nombre_equipo AS equipo_visitante,

      en.jornada,
      en.lugar,
      en.fecha,
      en.hora,
      en.estado,
      en.activo

    FROM encuentros en

    INNER JOIN torneos t
      ON en.id_torneo = t.id_torneo

    INNER JOIN equipos el
      ON en.id_equipo_local = el.id_equipo

    INNER JOIN equipos ev
      ON en.id_equipo_visitante = ev.id_equipo

    WHERE en.activo = 1

    ORDER BY en.jornada ASC, en.fecha ASC, en.hora ASC
  `);

  return rows;
};

//Obtener por ID
export const getEncuentroByIdModel = async (id) => {
  await actualizarEstadosEncuentrosModel();

  const [rows] = await pool.query(
    `
    SELECT *
    FROM encuentros
    WHERE id_encuentro = ?
      AND activo = 1
  `,
    [id],
  );

  return rows[0];
};

//Obtener encuentro por id del torneo
export const getEncuentrosByTorneoModel = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT 
      en.id_encuentro,
      en.id_torneo,
      t.nombre_torneo,

      en.id_equipo_local,
      el.nombre_equipo AS equipo_local,

      en.id_equipo_visitante,
      ev.nombre_equipo AS equipo_visitante,

      en.jornada,
      en.lugar,
      en.fecha,
      en.hora,
      en.estado,
      en.activo

    FROM encuentros en

    INNER JOIN torneos t
      ON en.id_torneo = t.id_torneo

    INNER JOIN equipos el
      ON en.id_equipo_local = el.id_equipo

    INNER JOIN equipos ev
      ON en.id_equipo_visitante = ev.id_equipo

    WHERE en.id_torneo = ?
      AND en.activo = 1

    ORDER BY en.jornada ASC, en.fecha ASC, en.hora ASC
  `,
    [id],
  );

  return rows;
};

//Crear encuentro
export const createEncuentroModel = async (encuentro) => {
  const {
    id_torneo,
    id_equipo_local,
    id_equipo_visitante,
    jornada,
    lugar,
    fecha,
    hora,
    estado,
  } = encuentro;

  const [result] = await pool.query(
    `
    INSERT INTO encuentros
    (
      id_torneo,
      id_equipo_local,
      id_equipo_visitante,
      jornada,
      lugar,
      fecha,
      hora,
      estado
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      id_torneo,
      id_equipo_local,
      id_equipo_visitante,
      jornada,
      lugar,
      fecha,
      hora,
      estado || "Pendiente",
    ],
  );

  return result;
};

//Actualizar encuentro
export const updateEncuentroModel = async (id, encuentro) => {
  const {
    id_torneo,
    id_equipo_local,
    id_equipo_visitante,
    jornada,
    lugar,
    fecha,
    hora,
    estado,
  } = encuentro;

  const [result] = await pool.query(
    `
    UPDATE encuentros
    SET
      id_torneo = ?,
      id_equipo_local = ?,
      id_equipo_visitante = ?,
      jornada = ?,
      lugar = ?,
      fecha = ?,
      hora = ?,
      estado = ?
    WHERE id_encuentro = ?
      AND activo = 1
  `,
    [
      id_torneo,
      id_equipo_local,
      id_equipo_visitante,
      jornada,
      lugar,
      fecha,
      hora,
      estado,
      id,
    ],
  );

  return result;
};

//Eliminar
export const deleteEncuentroModel = async (id) => {
  const [result] = await pool.query(
    `
    UPDATE encuentros
    SET activo = 0
    WHERE id_encuentro = ?
  `,
    [id],
  );

  return result;
};

//Generar jornadas auto solo en liga
export const generarJornadasLiga = (equipos) => {
  const jornadas = [];

  const lista = [...equipos];

  // SI ES IMPAR AGREGA DESCANSO

  if (lista.length % 2 !== 0) {
    lista.push(null);
  }

  const totalJornadas = lista.length - 1;

  const mitad = lista.length / 2;

  for (let jornada = 0; jornada < totalJornadas; jornada++) {
    const partidos = [];

    for (let i = 0; i < mitad; i++) {
      const local = lista[i];

      const visitante = lista[lista.length - 1 - i];

      if (local && visitante) {
        partidos.push({
          jornada: jornada + 1,
          local,
          visitante,
        });
      }
    }

    jornadas.push(partidos);

    // ROTAR EQUIPOS

    lista.splice(1, 0, lista.pop());
  }

  return jornadas;
};

//Generar encuentros auto
export const generarEncuentrosAutomaticosModel = async (id_torneo) => {
  // VALIDAR TORNEO

  const [torneoRows] = await pool.query(
    `
    SELECT tipo_torneo
    FROM torneos
    WHERE id_torneo = ?
  `,
    [id_torneo],
  );

  if (torneoRows.length === 0) {
    throw new Error("Torneo no encontrado");
  }

  // VALIDAR SI YA EXISTEN ENCUENTROS

  const [existentes] = await pool.query(
    `
    SELECT id_encuentro
    FROM encuentros
    WHERE id_torneo = ?
      AND activo = 1
    LIMIT 1
  `,
    [id_torneo],
  );

  if (existentes.length > 0) {
    throw new Error("Este torneo ya tiene encuentros generados");
  }

  // OBTENER EQUIPOS INSCRITOS

  const [equiposRows] = await pool.query(
    `
    SELECT id_equipo
    FROM inscripcionesequipos
    WHERE id_torneo = ?
      AND activo = 1
  `,
    [id_torneo],
  );

  const equipos = equiposRows.map((e) => e.id_equipo);

  if (equipos.length < 2) {
    throw new Error("El torneo debe tener al menos 2 equipos inscritos");
  }

  const tipo_torneo = torneoRows[0].tipo_torneo;

  // =====================================================
  // LIGA
  // =====================================================

  if (tipo_torneo === "Liga") {
    const jornadas = generarJornadasLiga(equipos);

    let fechaBase = new Date();

    let totalJornadas = jornadas.length;

    for (const jornada of jornadas) {
      for (const partido of jornada) {
        const fecha = new Date();

        fecha.setDate(fecha.getDate() + partido.jornada);

        const fechaSQL = fecha.toISOString().split("T")[0];

        await pool.query(
          `
      INSERT INTO encuentros
      (
        id_torneo,
        id_equipo_local,
        id_equipo_visitante,
        jornada,
        lugar,
        fecha,
        hora,
        estado
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
          [
            id_torneo,
            partido.local,
            partido.visitante,
            partido.jornada,
            "Por definir",
            fechaSQL,
            "12:00:00",
            "Pendiente",
          ],
        );
      }
    }

    return {
      message: "Fixture Liga generado correctamente",
    };
  }

  // =====================================================
  // GRUPOS
  // =====================================================

  if (tipo_torneo === "Grupos") {
    const grupos = [];
    const cantidadGrupos = 2;

    for (let i = 0; i < cantidadGrupos; i++) {
      grupos.push([]);
    }

    equipos.forEach((equipo, index) => {
      grupos[index % cantidadGrupos].push(equipo);
    });

    let numeroJornada = 1;

    for (const grupo of grupos) {
      const jornadasGrupo = generarJornadasLiga(grupo);

      const totalJornadasGrupo = jornadasGrupo.length;

      for (const jornada of jornadasGrupo) {
        for (const partido of jornada) {
          // =====================
          // PARTIDO DE IDA
          // =====================
          const fechaIda = new Date();

          fechaIda.setDate(fechaIda.getDate() + numeroJornada);

          const fechaIdaSQL = fechaIda.toISOString().split("T")[0];

          await pool.query(
            `
          INSERT INTO encuentros
          (
            id_torneo,
            id_equipo_local,
            id_equipo_visitante,
            jornada,
            lugar,
            fecha,
            hora,
            estado
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
            [
              id_torneo,
              partido.local,
              partido.visitante,
              numeroJornada,
              "Por definir",
              fechaIdaSQL,
              "12:00:00",
              "Pendiente",
            ],
          );

          // =====================
          // PARTIDO DE VUELTA
          // =====================
          const fechaVuelta = new Date();

          fechaVuelta.setDate(
            fechaVuelta.getDate() + numeroJornada + totalJornadasGrupo,
          );

          const fechaVueltaSQL = fechaVuelta.toISOString().split("T")[0];

          await pool.query(
            `
          INSERT INTO encuentros
          (
            id_torneo,
            id_equipo_local,
            id_equipo_visitante,
            jornada,
            lugar,
            fecha,
            hora,
            estado
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
            [
              id_torneo,
              partido.visitante,
              partido.local,
              numeroJornada + totalJornadasGrupo,
              "Por definir",
              fechaVueltaSQL,
              "12:00:00",
              "Pendiente",
            ],
          );
        }

        numeroJornada++;
      }
    }

    return {
      message: "Fixture grupos (ida y vuelta) generado correctamente",
    };
  }

  // =====================================================
  // ELIMINACIÓN DIRECTA
  // =====================================================

  if (tipo_torneo === "Eliminacion Directa") {
    if (equipos.length % 2 !== 0) {
      throw new Error("La eliminación directa requiere número par de equipos");
    }

    let jornada = 1;

    for (let i = 0; i < equipos.length; i += 2) {
      const local = equipos[i];
      const visitante = equipos[i + 1];

      const fecha = new Date();

      fecha.setDate(fecha.getDate() + jornada);

      const fechaSQL = fecha.toISOString().split("T")[0];

      await pool.query(
        `
        INSERT INTO encuentros
        (
          id_torneo,
          id_equipo_local,
          id_equipo_visitante,
          jornada,
          lugar,
          fecha,
          hora,
          estado
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          id_torneo,
          local,
          visitante,
          jornada,
          "Por definir",
          fechaSQL,
          "12:00:00",
          "Pendiente",
        ],
      );

      jornada++;
    }

    return {
      message: "Fixture eliminación directa generado correctamente",
    };
  }

  throw new Error("Tipo torneo inválido");
};
