import {
  getUsuariosService,
  getUsuarioByIdService,
  updateUsuarioService,
  deleteUsuarioService,
} from "../services/usuarioService.js";

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
