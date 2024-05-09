const db = require("../../models");
const FunctionsSystemRoles = db.functionsSystemRoles;
const customQuery = require("./customQuery.util"); 
const getSchemaRefs = require("../utils/getSchemaRefs.utils"); 

validaCamposRequeridosFunctionsSystemRoles = (req) => {
    const camposRequeridosEmpty = new Array();
    if (!req.body.Roles) {
        camposRequeridosEmpty.push("Roles");
    }
    if (!req.body.FunctionsSystem) {
        camposRequeridosEmpty.push("FunctionsSystem");
    }
    if (!req.body.authorized) {
        camposRequeridosEmpty.push("authorized");
    }
    return camposRequeridosEmpty;
}

// Cria e salva um novo documento para a entidade FunctionsSystemRoles
exports.create = (req, res) => {
    // Validate request
    if (!req.body.Roles) {
        res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
        return;
    }

    // Validate required fields
    const camposRequeridosEmpty = validaCamposRequeridosFunctionsSystemRoles(req);
    if (camposRequeridosEmpty.length > 0) {
        res.status(400).send({ message: "Campos requeridos ("+camposRequeridosEmpty.join(",") + ") não podem ser vazios!" });
        return;
    }

    // Create a FunctionsSystemRoles
    const functionsSystemRoles = new FunctionsSystemRoles({
        Roles: req.body.Roles ? req.body.Roles : null,
        FunctionsSystem: req.body.FunctionsSystem ? req.body.FunctionsSystem : null,
        authorized: req.body.authorized ? req.body.authorized : null,
    });

    // Save FunctionsSystemRoles in the database
    functionsSystemRoles
        .save(functionsSystemRoles)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Ocorreu um erro de servidor ao tentar salvar FunctionsSystemRoles."
            });
        });
};

// Procura por todas as entidades do tipo FunctionsSystemRoles
exports.findAll = (req, res) => {
    var condition = {};

    let populate = getSchemaRefs(db.functionsSystemRoles.schema.obj); 
    let query = FunctionsSystemRoles.find(); 
    if (populate.length > 0) { 
        query = query.populate(populate.join(" ")); 
    } 
    query.then(data => { 
        res.send(data); 
    }).catch(err => { 
        res.status(500).send({ 
            message: 
            err.message || "Ocorreu um erro de servidor ao tentar buscar FunctionsSystemRoles." 
        }); 
    }); 
};

// Busca a entidade FunctionsSystemRoles por id
exports.findOne = (req, res) => {
    const id = req.params.id; 

  let populate = getSchemaRefs(db.functionsSystemRoles.schema.obj); 

  // Se houver referências estrangeiras fazer o populate 
  let query = FunctionsSystemRoles.findOne({ _id: id }); 
  if (populate.length > 0) { 
      query = query.populate(populate.join(" ")); 
  } 

  query.then(data => { 
      if (!data) { 
          res.status(404).send({ message: "Não foi encontrado FunctionsSystemRoles com o id " + id }); 
      } else { 
          res.send(data); 
      } 
  }).catch(err => { 
      res.status(500).send({ message: "Erro ao buscar FunctionsSystemRoles com o id=" + id }); 
  }); 
};

// Altera uma entidade FunctionsSystemRoles
exports.update = (req, res) => {

    // Validate required fields
    const camposRequeridosEmpty = validaCamposRequeridosFunctionsSystemRoles(req);
    if (camposRequeridosEmpty.length > 0) {
        res.status(400).send({ message: "Campos requeridos ("+camposRequeridosEmpty.join(",") + ") não podem ser vazios!" });
        return;
    }

    const id = req.params.id;

    FunctionsSystemRoles.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade FunctionsSystemRoles com id ${id} não encontrada, por isso não pode ser atualizada!`
          });
        } else res.send({ message: `A entidade FunctionsSystemRoles com id ${id} foi alterada com sucesso.` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao alterar a entidade FunctionsSystemRoles com o id " + id + "."
        });
      });
};

// Remove a entidade FunctionsSystemRoles por id
exports.delete = (req, res) => {

    const id = req.params.id;

    FunctionsSystemRoles.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade FunctionsSystemRoles com id ${id} não encontrada, por isso não pode ser excluida!`
          });
        } else {
          res.send({
            message: `A entidade FunctionsSystemRoles com id ${id} foi excluída com sucesso.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao excluir a entidade FunctionsSystemRoles com o id " + id + "."
        });
      });
};

// Exclui todos os registros da entidade FunctionsSystemRoles
exports.deleteAll = (req, res) => {

    FunctionsSystemRoles.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} ${data.deletedCount > 1 ? '' : 'FunctionsSystemRoles'}  foram excluídas!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao excluir todas as entidades FunctionsSystemRoles."
        });
      });
};

// Procura por entidade FunctionsSystemRoles onde o campo booleano authorized seja true
exports.findAllAuthorized = (req, res) => {

    FunctionsSystemRoles.find({ authorized: true })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao buscar FunctionsSystemRoles por authorized true."
        });
      });
};

exports.findCustom = (req, res) => { 
  findCustom(req, res, FunctionsSystemRoles); 
};
