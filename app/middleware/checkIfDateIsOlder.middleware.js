/**
 * Verifica se o item que está sendo alterado é de uma versão mais recente ou está sendo alterado algo que já foi alterado.
 * Quando se é alterado algum registro no banco, é preciso que seja enviado pelo corpo da requisição o campo "updatedAt". 
 * Essa variável informa a data da ultima atualização do registro que foi alterado no backEnd 
 * @param {*} mongooseModel Modelo da Classe no mongoDb
 * @returns 
 */
const checkIfDateIsOlder = (mongooseModel) => async (req, res, next) => {

    //Verifica se tem corpo e id do objeto que será alterado
    if (!req.body || !req.body.id) {
      res.status(400).json({ message: 'Nenhum valor foi recebido' });
      return;
    }
  
    try {
      const documentId = req.body.id;
      //Procura o objeto que será alterado no banco de dados
      const storedDocument = await mongooseModel.findById(documentId);
  
      //Verifica se encontra o item que vai ser alterado no banco de dados
      if (!storedDocument) {
        return res.status(404).json({ message: 'Documento não encontrado' });
      }
  
      //Se item não contem data de atualização, permita a alteração
      if (storedDocument.updatedAt == null) {
        next();
        return;
      }
  
      const storedDateUpdateDate = new Date(storedDocument.updatedAt);
  
      if (!storedDateUpdateDate) {
        next();
        return;
      }
  
      //Se não obtiver dados da data de atualização do item que está sendo alterado pelo usuário, não permitir alteração
      if (!req.body.updatedAt) {
        res.status(400).json({ message: 'Valor recebido não contém informação de quando foi alterado' });
        return;
      }
  
      const updatedItemUpdateDate = new Date(req.body.updatedAt);
  
      if (updatedItemUpdateDate.toISOString() === storedDateUpdateDate.toISOString()) {
        next();
      } else {
        res.status(401).json({ message: 'Não é permitido realizar operação. Valor recebido é mais antigo que o valor atual armazenado' });
      }
  
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error: ' + error });
    }
  }
  
  module.exports = checkIfDateIsOlder;