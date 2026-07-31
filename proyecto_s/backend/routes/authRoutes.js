import express from "express";

import {
  loginUsuario,
  registrarUsuario,
  enviarCodigoRegistro,
  reenviarCodigoRegistro,
  recuperarPassword,
  verificarCodigoRecuperacion,
  actualizarPassword
} from "../controllers/authController.js";

import { findUsuarioByEmail } from "../models/usuarioModel.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 */

router.post("/login", loginUsuario);


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
