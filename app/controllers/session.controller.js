const db = require("../../models");
const Session = db.session;
const findDataByCustomQuery = require("../utils/customQuery.util"); 
const getSchemaRefs = require("./../middleware/checkIfDateIsOlder.middleware");

// Cria e salva um novo documento para a entidade Session
exports.create = (req, res) => {
    // Create a Session
    const session = new Session({
        userUID: req.body.userUID ? req.body.userUID : null,
        Users: req.body.Users ? req.body.Users : null,
        tenantUID: req.body.tenantUID ? req.body.tenantUID : null,
        accessToken: req.body.accessToken ? req.body.accessToken : null,
        initialDate: req.body.initialDate ? req.body.initialDate : null,
        finishSessionDate: req.body.finishSessionDate ? req.body.finishSessionDate : null,
        stayConnected: req.body.stayConnected ? req.body.stayConnected : null,
        accessTokenExpirationDate: req.body.accessTokenExpirationDate ? req.body.accessTokenExpirationDate : null,
        hashValidationLogin: req.body.hashValidationLogin ? req.body.hashValidationLogin : null,
        hashValidationLogout: req.body.hashValidationLogout ? req.body.hashValidationLogout : null,
    });
      
    // Save Session in the database
    session
        .save(session)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Ocorreu um erro de servidor ao tentar salvar Session."
            });
        });
};

// Procura por todas as entidades do tipo Session
exports.findAll = (req, res) => {
    var condition = {};

    let populate = getSchemaRefs(db.session.schema.obj); 
    let query = Session.find(); 
    if (populate.length > 0) { 
        query = query.populate(populate.join(" ")); 
    } 
    query.then(data => { 
        res.send(data); 
    }).catch(err => { 
        res.status(500).send({ 
            message: 
            err.message || "Ocorreu um erro de servidor ao tentar buscar Session." 
        }); 
    }); 
};

// Busca a entidade Session por id
exports.findOne = (req, res) => {
    const id = req.params.id; 

  let populate = getSchemaRefs(db.session.schema.obj); 

  // Se houver referências estrangeiras fazer o populate 
  let query = Session.findOne({ _id: id }); 
  if (populate.length > 0) { 
      query = query.populate(populate.join(" ")); 
  } 

  query.then(data => { 
      if (!data) { 
          res.status(404).send({ message: "Não foi encontrado Session com o id " + id }); 
      } else { 
          res.send(data); 
      } 
  }).catch(err => { 
      res.status(500).send({ message: "Erro ao buscar Session com o id=" + id }); 
  }); 
};

// Altera uma entidade Session
exports.update = (req, res) => {
    const id = req.params.id;

    Session.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade Session com id ${id} não encontrada, por isso não pode ser atualizada!`
          });
        } else res.send({ message: `A entidade Session com id ${id} foi alterada com sucesso.` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao alterar a entidade Session com o id " + id + "."
        });
      });
};

// Remove a entidade Session por id
exports.delete = (req, res) => {

    const id = req.params.id;
    console.log(id);

    Session.findByIdAndDelete(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade Session com id ${id} não encontrada, por isso não pode ser excluida!`
          });
        } else {
          res.send({
            message: `A entidade Session com id ${id} foi excluída com sucesso.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao excluir a entidade Session com o id " + id + "."
        });
      });
};

// Exclui todos os registros da entidade Session
exports.deleteAll = (req, res) => {

    Session.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} ${data.deletedCount > 1 ? '' : 'Session'}  foram excluídas!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao excluir todas as entidades Session."
        });
      });
};

// Procura por entidade Session onde o campo booleano stayConnected seja true
exports.findAllStayConnected = (req, res) => {

    Session.find({ stayConnected: true })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao buscar Session por stayConnected true."
        });
      });
};

exports.findCustom = async (req, res) => {
  const filterValues = req.body.filterValues;
  const filterConditions = req.body.filterValues;

  findDataByCustomQuery(filterValues, filterConditions, Session).then(data => {
    res.status(200).send(data);
  })
  .catch(error => {
    res.status(500).send({
      message:
        error.message || "Algum erro desconhecido ocorreu ao buscar dados pela busca customizável"
    });
  });
};
