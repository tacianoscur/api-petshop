class SemEstoqueDisponivel extends Error {
    constructor(produto) {
        const mensagem = `Não há estoque disponível do produto '${produto}' para esta venda!`;
        super(mensagem);
        this.name = 'SemEstoqueDisponivel';
        this.idErro = 4;
    }
}

module.exports = SemEstoqueDisponivel;