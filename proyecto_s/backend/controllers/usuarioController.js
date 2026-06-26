import {
  getUsuariosService,
  getUsuarioByIdService,
  updateUsuarioService,
  deleteUsuarioService,
  registrarUsuarioService,
} from "../services/usuarioService.js";

import codigos from "../utils/codigosVerificacion.js";
import { enviarCodigo } from "../utils/email.js";

import { createUsuario as createUsuarioModel, findUsuarioByEmail } from "../models/usuarioModel.js";
//Crear usuario
export const createUsuario = async (req, res) => {
  try {
    await createUsuarioModel(req.body);

    return res.status(201).json({
      success: true,
      message: "Usuario creado correctamente",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//Obtener todas
export const getUsuarios = async (req, res) => {
  try {
    const data = await getUsuariosService();

    return res.json({
      success: true,
      data,
    });
  } catch {
    return res.status(500).json({
      success: false,
    });
  }
};

//Obtener por ID
export const getUsuarioById = async (req, res) => {
  try {
    const data = await getUsuarioByIdService(req.params.id);

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

//Actualizar usuario
export const updateUsuario = async (req, res) => {
  try {
    await updateUsuarioService(req.params.id, req.body);

    return res.json({
      success: true,
      message: "Actualizado",
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//Eliminar
export const deleteUsuario = async (req, res) => {
  try {
    await deleteUsuarioService(req.params.id);

    return res.json({
      success: true,
      message: "Eliminado",
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const registrarUsuario = async (req, res) => {
  try {
    const {
      email, codigo
    } = req.body;

    if (!email || !codigo) {
      return res.status(400).json({
        success: false,
        message: "Email y código son requeridos",
      });
    }

    const registro = codigos.get(email);
    if (!registro) {
      return res.status(400).json({
        success: false,
        message: "No se ha enviado un código a este email",
      });
    }

    if (Date.now() > registro.expira) {
      codigos.delete(email);
      return res.status(400).json({
        success: false,
        message: "El código ha expirado",
      });
    }

    if (registro.codigo !== codigo) {
      return res.status(400).json({
        success: false,
        message: "Código incorrecto",
      });
    }

    await registrarUsuarioService(registro.datosUsuario);

    codigos.delete(email);

    return res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
    });
  
  
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error al registrar el usuario",
    });
  }
};

export const enviarCodigoRegistro = async (req, res) => {
  try {
    
    const datos = req.body;

    const usuarioExistente = await findUsuarioByEmail(datos.email);

    if (usuarioExistente) {
      return res.status(409).json({
        success: false,
        message: "El correo ya se encuentra registrado"
      });
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    codigos.set(datos.email, {
      codigo,
      datosUsuario: datos,
      expira: Date.now() + 10 * 60 * 1000
    });

    await enviarCodigo(datos.email, codigo);

    return res.status(200).json({
      success: true,
      message: "Código enviado correctamente",
    });
  }catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error al enviar el código",
    });
  }
}

export const reenviarCodigoRegistro = async (req, res) => {
  try {

    const { email } = req.body;

    const registro = codigos.get(email);

    if (!registro) {
      return res.status(400).json({
        success: false,
        message: "No existe un registro pendiente"
      });
    }

    const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();

    registro.codigo = nuevoCodigo;
    registro.expira = Date.now() + 10 * 60 * 1000;

    codigos.set(email, registro);

    await enviarCodigo(email, nuevoCodigo);

    return res.json({
      success: true,
      message: "Código reenviado"
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Error al reenviar código"
    });

  }
};