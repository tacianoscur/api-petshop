const Modelo = require('./ModeloTabelaFornecedor');
const NaoEncontrado = require('../../erros/NaoEncontrado');

module.exports = {
    listar() {
        return Modelo.findAll({ raw: true });
    },

    inserir( fornecedor ) {
        return Modelo.create(fornecedor);
    },

    async consultaId( id ) {
        const result = await Modelo.findOne({
            where: {
                id: id
            }
        });

        if (!result) {
            throw new NaoEncontrado('Fornecedor');
        }

        return result;
    },

    async atualizar(id, dadosUpdate) {
        return Modelo.update(
            dadosUpdate,
            {
                where: { id: id }
            }
        );
    },

    deletar(id) {
        return Modelo.destroy({
            where: {
                id: id
            }
        })
    }
}