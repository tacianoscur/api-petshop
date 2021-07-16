const TabelaProduto = require('./TabelaProduto');
const CampoInvalido = require('../../../erros/CampoInvalido');
const DadosNaoFornecidos = require('../../../erros/DadosNaoFornecidos');
const SemEstoqueDisponivel = require('../../../erros/SemEstoqueDisponivel');

class Produto {
    constructor({ id, titulo, preco, estoque, fornecedor, dataCriacao, dataAtualizacao, versao }) {
        this.id = id;
        this.titulo = titulo;
        this.preco = preco;
        this.estoque = estoque;
        this.fornecedor = fornecedor;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.versao = versao;
    }

    validar() {
        if (typeof this.titulo !== 'string' || this.titulo.length === 0) {
            throw new CampoInvalido('titulo');
        }

        if (typeof this.preco !== 'number' || this.preco === 0) {
            throw new CampoInvalido('preco');
        }
    }

    async create() {
        this.validar();
        const result = await TabelaProduto.inserir({
            titulo: this.titulo,
            preco: this.preco,
            estoque: this.estoque,
            fornecedor: this.fornecedor,
        });

        this.id = result.id;
        this.dataCriacao = result.dataCriacao;
        this.dataAtualizacao = result.dataAtualizacao;
        this.versao = result.versao;
    }

    async delete() {
        await TabelaProduto.consultaId(this.id, this.fornecedor);
        return TabelaProduto.deletar(this.id, this.fornecedor);
    }

    async getById() {
        const produto = await TabelaProduto.consultaId(this.id, this.fornecedor);
        this.titulo = produto.titulo;
        this.preco = produto.preco;
        this.estoque = produto.estoque;
        this.dataCriacao = produto.dataCriacao;
        this.dataAtualizacao = produto.dataAtualizacao;
        this.versao = produto.versao;
    }

    async update() {
        await TabelaProduto.consultaId(this.id, this.fornecedor);

        const dadosParaAtualizar = {};

        if (typeof this.titulo === 'string' && this.titulo.length > 0) {
            dadosParaAtualizar.titulo = this.titulo;
        }

        if (typeof this.preco === 'number' && this.preco > 0) {
            dadosParaAtualizar.preco = this.preco;
        }

        if (typeof this.estoque === 'number') {
            dadosParaAtualizar.estoque = this.estoque;
        }

        if (Object.keys(dadosParaAtualizar).length === 0) {
            throw new DadosNaoFornecidos();
        }

        return TabelaProduto.atualizar(
            {
                id: this.id,
                fornecedor: this.fornecedor
            },
            dadosParaAtualizar
        );
    }

    diminuirEstoque() {
        if (this.estoque < 0) {
            throw new SemEstoqueDisponivel(this.titulo);
        }

        return TabelaProduto.subtrair(this.id, this.fornecedor, 'estoque', this.estoque);
    }
}

module.exports = Produto;