/**
 * Verifica se o item que está sendo alterado é de uma versão mais recente ou está sendo alterado algo que já foi alterado.
 * @param {*} mongooseModel
 * @returns 
 */
const checkIfDateIsOlder = (mongooseModel) => async (req, res, next) => {

    if (!req.body.updatedAt) {
        res.status(400).json({ message: 'Valor recebido não contém informação de quando foi alterado' });
        return;
    }

    const updatedItemUpdateDate = new Date(req.body.updatedAt);

    try {
        const documentId = req.body.id;
        const storedDocument = await mongooseModel.findById(documentId);

        if (!storedDocument) {
            return res.status(404).json({ message: 'Documento não encontrado' });
        }

        const storedDateUpdateDate = new Date(storedDocument.updatedAt);

        if (!storedDateUpdateDate) {
            next();
            return;
        }

        if (updatedItemUpdateDate.toISOString() === storedDateUpdateDate.toISOString()) {
            next();
        } else {
            res.status(400).json({ message: 'Valor recebido é mais antigo que o valor atual armazenado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error: ' });
    }
}

module.exports = checkIfDateIsOlder;
