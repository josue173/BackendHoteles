"use strict";

const Usuarios = require("../models/usuarios.model");
const Hoteles = require("../models/hoteles.model");
const bcrypt = require("bcrypt-nodejs");

function verUsuarios(req, res) {
  if (req.usuarios.rol === "AdministradorApp") {
    Usuarios.find((err, usuariosEncontrados) => {
      if (err)
        return res
          .status(500)
          .send({ mensaje: "Error interno al buscar usuarios" });
      if (!usuariosEncontrados)
        return res.status(500).send({ mensaje: "No hay usuarios registrados" });
      return res.status(200).send({ usuariosEncontrados });
    });
  } else {
    return res
      .status(500)
      .send({ mensaje: "Funcion exclusiva para administradores de la app" });
  }
}
//FUNCIONA AL 100

function agregarAdminHotel(req, res) {
  let params = req.body;
  let usuariosModel = new Usuarios();
  if (req.usuarios.rol === "AdministradorApp") {
    if (params.usuario && params.contrasena) {
      usuariosModel.usuario = params.usuario;
      usuariosModel.rol = "AministradorHotel";
      Usuarios.find({ usuario: params.usuario }, (err, usuarioEncontrado) => {
        if (err)
          return res
            .status(500)
            .send({ mensaje: "Erro interno al compara usuarios" });
        if (usuarioEncontrado && usuarioEncontrado.length >= 1) {
          return res
            .status(500)
            .send({ mensaje: "El administrador ya existe" });
        } else {
          bcrypt.hash(params.contrasena, null, null, (err, encriptada) => {
            usuariosModel.contrasena = encriptada;
            usuariosModel.save((err, adminRegistrado) => {
              if (adminRegistrado) {
                return res.status(200).send({ adminRegistrado });
              } else {
                return res
                  .status(500)
                  .send({ mensaje: "Error interno al registar" });
              }
            });
          });
        }
      });
    } else {
      return res.status(500).send({ mensaje: "Llene los campos necesarios" });
    }
  } else {
    return res
      .status(500)
      .send({ mensaje: "Funcion exclusiva para administradores de la app" });
  }
}
//FUNCIONA AL 100

function verHotelesAdmin(req, res) {
  if (req.usuarios.rol === "AdministradorApp") {
    Hoteles.find((err, hotelesEncontrados) => {
      if (err)
        return res
          .status(500)
          .send({ mensaje: "Error interno al buscar usuarios" });
      if (hotelesEncontrados) {
        return res.status(200).send({ hotelesEncontrados });
      } else {
        return res.status(500).send({ mensaje: "No hay hoteles disponibles" });
      }
    });
  } else {
    return res
      .status(500)
      .send({ mensaje: "Funcion exclusiva para administradores de la app" });
  }
}

function agregarHotel(req, res) {
  let administradorID = req.params.administradorID;
  let params = req.body;
  let hotelesModel = new Hoteles();
  if (req.usuarios.rol === "AdministradorApp") {
    if (params.nombre && params.direccion && params.descripcion) {
      hotelesModel.nombre = params.nombre;
      hotelesModel.direccion = params.direccion;
      hotelesModel.descripcion = params.descripcion;
      hotelesModel.imagen = params.imagen;
      Usuarios.findById(administradorID, (err, adminEncontrado) => {
        if (err)
          return res
            .status(500)
            .send({ mensaje: "Error interno al comparar administrador" });
        if (!adminEncontrado) {
          return res
            .status(500)
            .send({ mensaje: "El administrador no existe" });
        } else {
          Hoteles.find({ nombre: params.nombre }, (err, hotelEncontrado) => {
            if (err)
              return res
                .status(500)
                .send({ mensaje: "Error interno al comparar hotel" });
            if (hotelEncontrado && hotelEncontrado.length >= 1) {
              return res.status(500).send({ mensaje: "El hotel ya existe" });
            } else {
              Hoteles.find(
                { administradorHotel: adminEncontrado },
                (err, coincidencia) => {
                  if (err)
                    return res.status(500).send({ mensaje: "Error interno" });
                  if (coincidencia && coincidencia.length >= 1) {
                    return res.status(500).send({
                      mensaje:
                        "El administrador ya ha sido asignado a un hotel",
                    });
                  } else {
                    if (adminEncontrado.rol === "AministradorHotel") {
                      hotelesModel.administradorHotel = adminEncontrado._id;
                      hotelesModel.save((err, hotelAgregado) => {
                        if (err)
                          return res.status(500).send({
                            mensaje: "Error interno al agregar hotel",
                          });
                        if (!hotelAgregado)
                          return res.status(500).send({
                            mensaje: "No se ha podido agregar el hotel",
                          });
                        return res.status(200).send({ hotelAgregado });
                      });
                    } else {
                      return res.status(500).send({
                        mensaje:
                          "Solo pueden ser asiganados administradores de hoteles",
                      });
                    }
                  }
                }
              );
              //ACA IBA EL IF DE 'AdministradorHotel'
            }
          });
        }
      });
    } else {
      return res
        .status(500)
        .send({ mensaje: "Llene todos los campos obligatorios" });
    }
  } else {
    return res
      .status(500)
      .send({ mensaje: "Funcion exclusiva para administradores de la app" });
  }
}
//FUNCIONA AL 100

function eliminarUsuario(req, res) {
  let usuarioID = req.params.usuarioID;
  if (req.usuarios.rol === "AdministradorApp") {
    Hoteles.findOne(
      { administradorHotel: usuarioID },
      (err, adminEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error interno" });
        if (adminEncontrado) {
          return res.status(500).send({
            mensaje: "No puede elimniarlo porque este administra un hotel",
          });
        } else {
          Usuarios.findById(usuarioID, (err, usuarioEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error interno" });
            if (usuarioEncontrado.estado === "Hospedado") {
              return res
                .status(500)
                .send({ mensaje: "No puede elminar un usario hospedado" });
            } else {
              Usuarios.findByIdAndDelete(
                usuarioEncontrado,
                (err, usuarioEliminado) => {
                  if (err)
                    return res.status(500).send({ mensaje: "Error interno" });
                  if (usuarioEliminado.estado === "Hospedado") {
                    return res.status(500).send({
                      mensaje: "No puede eliminar a un usuario hospedado",
                    });
                  } else {
                    return res.status(200).send({ usuarioEliminado });
                  }
                }
              );
            }
          });
        }
      }
    );
  } else {
    return res.status(500).send({
      mensaje: "Funcion exclusiva de los administradores de aplicacion",
    });
  }
}

function editarUsuarios(req, res) {
  let usuarioID = req.params.usuarioID;
  let params = req.body;
  delete params.contrasena;
  delete params.rol;
  delete params._id;
  delete params.estado;
  delete params.hotelHospedado;
  if (req.usuarios.rol === "AdministradorApp") {
    Usuarios.findByIdAndUpdate(
      { _id: usuarioID },
      params,
      { new: true },
      (err, usuarioActualizado) => {
        if (err) return res.status(500).send({ mensaje: "Error interno" });
        if (usuarioActualizado) {
          return res.status(200).send({ usuarioActualizado });
        } else {
          return res.status(500).send({ mensaje: "Error al actualizar" });
        }
      }
    );
  }
}

function editarHotel(req, res) {
  if (req.usuarios.rol === "AdministradorApp") {
    let hotelID = req.params.hotelID;
    let params = req.body;
    delete params._id;
    delete params.administradorHotel;
    Hoteles.findByIdAndUpdate(
      { _id: hotelID },
      params,
      { new: true },
      (err, hotelActualizado) => {
        if (err) return res.status(500).send({ mensaje: "Error interno" });
        if (hotelActualizado) {
          return res.status(200).send({ hotelActualizado });
        } else {
          return res.status(500).send({ mensaje: "Error al actualizar" });
        }
      }
    );
  } else {
    return res
      .status(500)
      .send({ mensaje: "Funcion para administradores de App" });
  }
}

function eliminarHotel(req, res) {
  let hotelID = req.params.hotelID;
  if (req.usuarios.rol === "AdministradorApp") {
    Usuarios.find({ hotelHospedado: hotelID }, (err, hotelEncontrado) => {
      if (err) return res.status(500).send({ mensaje: "Error interno" });
      if (hotelEncontrado._id === hotelID) {
        return res.status(500).send({
          mensaje: "No puede eliminar el hotel porque hay clientes hospedados",
        });
      } else {
        Hoteles.findByIdAndDelete({ _id: hotelID }, (err, hotelEliminado) => {
          if (err) return res.status(500).send({ mensaje: "Error interno" });
          if (hotelEliminado) {
            return res.status(200).send({ hotelEliminado });
          } else {
            return res
              .status(500)
              .send({ mensaje: "No se pudo eliminar el hotel" });
          }
        });
      }
    });
  }
}

module.exports = {
  verUsuarios,
  agregarAdminHotel,
  agregarHotel,
  verHotelesAdmin,
  eliminarUsuario,
  editarUsuarios,
  editarHotel,
  eliminarHotel,
};
