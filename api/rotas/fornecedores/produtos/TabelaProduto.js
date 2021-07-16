const NaoEncontrado = require('../../../erros/NaoEncontrado');
const Modelo = require('./ModeloTabelaProduto');
const instance = require('../../../database');

module.exports = {
    listar(idFornecedor) {
        return Modelo.findAll({
            where: {
                fornecedor: idFornecedor
            },
            raw: true
        });
    },

    inserir(dados) {
        return Modelo.create(dados);
    },

    deletar(id, fornecedor) {
        return Modelo.destroy({
            where: {
                id: id,
                fornecedor: fornecedor
            }
        });
    },

    async consultaId(id, fornecedor) {
        const result = await Modelo.findOne({
            where: {
                id: id,
                fornecedor: fornecedor
            },
            raw: true
        });

        if (!result) {
            throw new NaoEncontrado('Produto');
        }

        return result;
    },

    atualizar(dadosDoProduto, dadosParaAtualizar) {
        return Modelo.update(
            dadosParaAtualizar,
            {
                where: dadosDoProduto
            }
        );
    },

    async subtrair(id, fornecedor, campo, total) {
        await instance.transaction(async (transaction) => {
            const produto = await Modelo.findOne({
                where: {
                    id: id,
                    fornecedor: fornecedor
                }
            });

            produto[campo] = total;

            await produto.save();

            return produto;
        });
    }
}