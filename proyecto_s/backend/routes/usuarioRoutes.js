import express from "express";
import {
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  createUsuario,
  registrarUsuario,
  enviarCodigoRegistro,
  reenviarCodigoRegistro,
  recuperarPassword,
  verificarCodigoRecuperacion,
  actualizarPassword,
} from "../controllers/usuarioController.js";

import { findUsuarioByEmail } from "../models/usuarioModel.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /api/usuarios/email/{email}:
 *   get:
 *     summary: Validar si un correo electrónico existe
 *     description: Verifica si un correo ya se encuentra registrado.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Correo electrónico del usuario.
 *     responses:
 *       200:
 *         description: Resultado de la validación.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const usuario = await findUsuarioByEmail(email);

    res.json({
      existe: !!usuario,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      existe: false,
      message: "Error verificando email",
    });
  }
});

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un usuario
 *     description: Crea un nuevo usuario.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/", createUsuario);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Devuelve la lista de usuarios registrados.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/", getUsuarios);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Retorna la información de un usuario específico.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/:id", getUsuarioById);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     description: Actualiza la información de un usuario existente.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put("/:id", updateUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario mediante su ID.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete("/:id", deleteUsuario);

/**
 * @swagger
 * /api/usuarios/registrar:
 *   post:
 *     summary: Confirmar registro de usuario
 *     description: Registra definitivamente un usuario utilizando el código enviado al correo.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CodigoRegistro'
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente.
 *       400:
 *         description: Código inválido o expirado.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/registrar", registrarUsuario);

/**
 * @swagger
 * /api/usuarios/enviar-codigo:
 *   post:
 *     summary: Enviar código de verificación
 *     description: Envía un código al correo para completar el registro.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioRegistro'
 *     responses:
 *       200:
 *         description: Código enviado correctamente.
 *       409:
 *         description: El correo ya se encuentra registrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/enviar-codigo", enviarCodigoRegistro);

/**
 * @swagger
 * /api/usuarios/reenviar-codigo:
 *   post:
 *     summary: Reenviar código de verificación
 *     description: Reenvía un nuevo código al correo del usuario.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReenviarCodigo'
 *     responses:
 *       200:
 *         description: Código reenviado correctamente.
 *       400:
 *         description: No existe un registro pendiente.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/reenviar-codigo", reenviarCodigoRegistro);
router.post("/recuperar", recuperarPassword);
router.post("/verificar-recuperacion", verificarCodigoRecuperacion);
router.post("/cambiar-password", actualizarPassword);

export default router;
