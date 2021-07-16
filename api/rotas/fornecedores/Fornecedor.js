const TabelaFornecedor = require('./TabelaFornecedor');
const CampoInvalido = require('../../erros/CampoInvalido');
const DadosNaoFornecidos = require('../../erros/DadosNaoFornecidos');

class Fornecedor {
    constructor({ id, empresa, email, categoria, dataCriacao, dataAtualizacao, versao }) {
        this.id = id;
        this.empresa = empresa;
        this.email = email;
        this.categoria = categoria;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.versao = versao;
    }

    async create() {
        this.validar();
        const result = await TabelaFornecedor.inserir({
            empresa: this.empresa,
            email: this.email,
            categoria: this.categoria
        });

        this.id = result.id;
        this.dataCriacao = result.dataCriacao;
        this.dataAtualizacao = result.dataAtualizacao;
        this.versao = result.versao;
    }

    async getById() {
        const result = await TabelaFornecedor.consultaId(this.id);
        this.empresa = result.empresa;
        this.email = result.email;
        this.categoria = result.categoria;
        this.dataCriacao = result.dataCriacao;
        this.dataAtualizacao = result.dataAtualizacao;
        this.versao = result.versao;
    }

    async update() {
        await TabelaFornecedor.consultaId(this.id);
        const campos = ['empresa', 'email', 'categoria'];
        const dadosUpdate = {}

        campos.forEach(campo => {
            const valor = this[campo];
            if (typeof valor === 'string' && valor.length > 0) {
                dadosUpdate[campo] = valor;
            }
        });

        if (Object.keys(dadosUpdate).length === 0) {
            throw new DadosNaoFornecidos();
        }

        TabelaFornecedor.atualizar(this.id, dadosUpdate);
    }

    delete() {
        return TabelaFornecedor.deletar(this.id);
    }

    validar() {
        const campos = ['empresa', 'email', 'categoria'];

        campos.forEach(campo => {
            const valor = this[campo];

            if (typeof valor !== 'string' || valor.length === 0) {
                throw new CampoInvalido(campo);
            }
        });
    }
}

module.exports = Fornecedor;