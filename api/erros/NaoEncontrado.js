class NaoEncontrado extends Error {
    constructor(entidade) {
        super(`${entidade} não foi encontrado!`);
        this.name = 'NaoEncontrado';
        this.idErro = 0;
    }
}

module.exports = NaoEncontrado;